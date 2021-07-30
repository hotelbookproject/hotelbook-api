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
const {retrieveMainPhoto, retrieveOtherPhotos} = require("../../utils/retrieveImages");
const validateObjectId = require("../../middleware/validateObjectId");

router.get("/", async (req, res) => {
  const {roomIds} = req.query;
  let rooms = [await Room.find().where("_id").in(roomIds)];
  let finalRoomsData = [];
  for (let room of rooms) {
    finalRoomsData.push(await retrieveMainPhoto(room));
  }

  res.send(_.flattenDeep(finalRoomsData));
});

router.get("/:id", async (req, res) => {
  console.log("here")
  let room = [await Room.findById(req.params.id).select({photos:1,facilities:1,mainPhoto:1})];
  console.log(room)
  if (!room[0]) return res.status(404).send("room with given id not found");
  room = await retrieveMainPhoto(room);
  room = await retrieveOtherPhotos(room);
  res.send(room);
});

module.exports = router;
