const express = require("express");
const router = express.Router();
const _ = require("lodash");
const mongoose = require("mongoose");
const guestMiddleware = require("../../middleware/guest");
const auth = require("../../middleware/auth");
const getDays = require("../../utils/getDays");
const {Hotel} = require("../../models/hotel");
const {Room} = require("../../models/room");
const {Booking} = require("../../models/booking");
const {Guest} = require("../../models/guest");
const {retrieveMainPhotobyPath, retrieveOtherPhotos} = require("../../utils/retrieveImages");
const validateObjectId = require("../../middleware/validateObjectId");

router.get("/", [auth, guestMiddleware], async (req, res) => {
  Booking.find({guestId: req.user._id, isStayCompleted: false})
    .lean()
    .then(bookings => {
      _.each(bookings, (booking, index) => {
        Hotel.findById(booking.hotelId).then(async hotel => {
          bookings[index].mainPhoto = await retrieveMainPhotobyPath(hotel.mainPhoto);
          bookings[index].address = hotel.address;
          bookings[index].rating = hotel.reviewScore;
          bookings[index].hotelName = hotel.hotelName;
          totalPrice = 0;
          totalBeds = 0;
          totalGuests = 0;
          totalRooms = 0;

          // let hold=[]
          for (let [key, value] of Object.entries(booking.roomDetails)) {
            // for(let [key1,value1] of Object.entries(value)){
            let objectValues = [];
            for (const [index, [key1, value1]] of Object.entries(Object.entries(value))) {
              objectValues.push(value1);
            }
            // console.log("here")
            totalPrice += objectValues[0] * objectValues[1];
            totalBeds += objectValues[0] * objectValues[2];
            totalGuests += objectValues[0] * objectValues[3];
            totalRooms += objectValues[0];

            // }
          }
          bookings[index].totalPrice = totalPrice;
          bookings[index].totalBeds = totalBeds;
          bookings[index].totalGuests = totalGuests;
          bookings[index].totalRooms = totalRooms;

          bookings[index].startingDayOfStay = new Date(
            bookings[index].startingDayOfStay
          ).toLocaleString("en-us", {day: "numeric", month: "long", year: "numeric"});
          bookings[index].endingDayOfStay = new Date(
            bookings[index].endingDayOfStay
          ).toLocaleString("en-us", {day: "numeric", month: "long", year: "numeric"});
          res.send(bookings);
        });
        //
      });
      // for(booking of bookings) {

      // booking.totalPrice=
      // console.log(hotel)
    });
});

module.exports = router;
