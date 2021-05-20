const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const guestMiddleware = require("../../middleware/guest");
const auth = require("../../middleware/auth");
const {Hotel} = require("../../models/hotel");
const {Room} = require("../../models/room");
const {Booking} = require("../../models/booking");
const {Guest} = require("../../models/guest");
const getDays = require("../../utils/getDays");

router.get("/", async (req, res) => {
  console.log(req.query);
  const {placeForSearch, selectedDayRange} = req.query;
  let allTheDays;
  if (selectedDayRange.from) {
    allTheDays = getDays(selectedDayRange);
  } else {
    const hotels = await Hotel.find({placeForSearch: placeForSearch.toLowerCase()}).select({
      hotelName: 1,
      reviewScore: 1,
      startingRatePerDay: 1,
      mainPhoto: 1,
    });
    return res.send(hotels);
  }

  const hotels = await Hotel.find({placeForSearch: placeForSearch.toLowerCase()}).select({
    hotelRooms: 1,
  });

  const roomIds = _.flattenDeep(_.map(hotels, "hotelRooms"));

  const rooms = await Room.find({_id: {$in: roomIds}, bookingFullDates: {$nin: allTheDays}}).select(
    {hotelId: 1, _id: 0, basePricePerNight: 1}
  );

  let hotelIds = _.uniq(_.map(rooms, "hotelId"));

  const hotelDetails = await Hotel.find({_id: {$in: hotelIds}}).select({
    hotelName: 1,
    reviewScore: 1,
    startingRatePerDay: 1,
    mainPhoto: 1,
  });

  for (hotel of hotelDetails) hotel.startingRatePerDay *= allTheDays.length;

  res.send(hotelDetails);
});

//? API get request roomData for getting rooms
// {
//   "placeForSearch": "hampi",
//   "selectedDate":{"date":{"from":{
//   "day":19,
//   "month":5,
//   "year":2021
// },
// "to":{
//   "day":21,
//   "month":5,
//   "year":2021
// }}}
// }

router.post("/", [auth, guestMiddleware], async (req, res) => {
  const {roomDetails, selectedDayRange} = req.body;
  for (room of roomDetails) {
    if (!mongoose.Types.ObjectId.isValid(room.roomId)) return res.status(404).send("Invalid Id");
  }

  const allTheDays = getDays(selectedDayRange);
  const roomsDetails = {};
  let totalPrice = 0;

  for (room of roomDetails) {
    let roomDB = await Room.findById(room.roomId);

    roomsDetails[room.roomId] = {
      numberOfRoomsBooked: room.noOfRooms,
      pricePerRoom: roomDB.basePricePerNight,
    };

    totalPrice += roomDB.basePricePerNight * room.noOfRooms;

    for (date of allTheDays) {
      if (!roomDB?.numberOfBookingsByDate) roomDB.numberOfBookingsByDate = {};
      if (date in roomDB?.numberOfBookingsByDate) {
        roomDB.numberOfBookingsByDate[date] += room.noOfRooms;
        if (roomDB?.numberOfBookingsByDate[date] == roomDB?.numberOfRoomsOfThisType)
          roomDB?.bookingFullDates.push(date);
        if (roomDB?.numberOfBookingsByDate[date] > roomDB?.numberOfRoomsOfThisType)
          return res.status(400).send("Someone already booked, please refresh your page.");
      } else {
        roomDB.numberOfBookingsByDate[date] = room.noOfRooms;
        if (roomDB?.numberOfBookingsByDate[date] == roomDB?.numberOfRoomsOfThisType)
          roomDB?.bookingFullDates.push(date);
        if (roomDB?.numberOfBookingsByDate[date] > roomDB?.numberOfRoomsOfThisType)
          return res.status(400).send("Someone already booked, please refresh your page.");
      }
    }

    roomDB.markModified("numberOfBookingsByDate", "bookingFullDates");
    await roomDB.save();
    console.log(roomDB);
  }

  const roomData = {};
  roomData["guestId"] = req.user._id;
  roomData["startingDayOfStay"] = allTheDays[0];
  roomData["endingDayOfStay"] = allTheDays[allTheDays.length - 1];
  roomData["roomDetails"] = roomsDetails;
  roomData["totalPrice"] = totalPrice;

  const booking = new Booking(roomData);
  await booking.save();

  await Guest.findByIdAndUpdate(req.user._id, {$push: {bookedHotelDetails: booking._id}});
  res.send("Successfully booked");
});

//? API post request request roomData for booking rooms
// {
//   "roomDetails":[{"roomId": "60995ece56a3f64368509ce9",
//         "noOfRooms":3
//       },
//       {
//         "roomId":"60995ee156a3f64368509cea",
//         "noOfRooms":2
//       }],
//   "selectedDate":{"date":{"from":{
//   "day":19,
//   "month":5,
//   "year":2021
// },
// "to":{
//   "day":29,
//   "month":5,
//   "year":2021
// }}}
// }

module.exports = router;
