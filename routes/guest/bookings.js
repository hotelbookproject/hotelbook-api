const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const guest = require("../../middleware/guest");
const auth = require("../../middleware/auth");
const validateObjectId = require("../../middleware/validateObjectId");
const {Hotel} = require("../../models/hotel");
const {Room} = require("../../models/room");
const getDays=require("../../utils/getDays")

router.get("/", async (req, res) => {
  const {placeForSearch, selectedDate} = req.body;
  const allTheDays=getDays(selectedDate)

  const hotels = await Hotel.find({
    placeForSearch: placeForSearch.toLowerCase(),
  }).select({hotelRooms: 1});
  const roomIds = [];
  for (hotel of hotels) for (room of hotel.hotelRooms) roomIds.push(room);

  const rooms = await Room.find({
    _id: {
      $in: roomIds,
    },
    kindOfBed: "Single bed",
  });

  res.send(rooms);
  
});
//? API get request data for getting rooms
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



router.post("/", [auth, guest], async (req, res) => {
  const {roomDetails,selectedDate} = req.body;
  for (room of roomDetails) {
    if (!mongoose.Types.ObjectId.isValid(room.roomId)) return res.status(404).send("Invalid Id");
  }

  const allTheDays= getDays(selectedDate)

  for (room of roomDetails) {
    let roomDB = await Room.findById(room.roomId);
    for (date of allTheDays) {
      if (date in roomDB.noOfBookingsByDate) {
        roomDB.noOfBookingsByDate[date] += room.noOfRooms;
        if(roomDB.noOfBookingsByDate[date]==roomDB.numberOfRoomsOfThisType)
          roomDB.bookingFullDates.push(date)
        if (roomDB.noOfBookingsByDate[date] > roomDB.numberOfRoomsOfThisType)
          return res.status(400).send("Someone already booked, please refresh your page.");
      } else {
        roomDB.noOfBookingsByDate[date] = room.noOfRooms;
        if(roomDB.noOfBookingsByDate[date]==roomDB.numberOfRoomsOfThisType)
          roomDB.bookingFullDates.push(date)
        if (roomDB.noOfBookingsByDate[date] > roomDB.numberOfRoomsOfThisType)
          return res.status(400).send("Someone already booked, please refresh your page.");
      }
    }

    roomDB.markModified("noOfBookingsByDate","bookingFullDates");
    await roomDB.save();
    console.log(roomDB);
  }


});

//? API post request request data for booking rooms
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