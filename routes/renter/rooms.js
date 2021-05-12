const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const auth = require("../../middleware/auth");
const renter = require("../../middleware/renter");
const validate = require("../../middleware/validate");
const validateObjectId = require("../../middleware/validateObjectId");
const {validateRoom, Room} = require("../../models/room");
const {Hotel} = require("../../models/hotel");

router.get("/", [auth, renter], async (req, res) => {
  if(!mongoose.Types.ObjectId.isValid(req.query.hotelId))
    return res.status(404).send("Invalid Id")

  const {hotelRooms} = await Hotel.findById(req.query.hotelId);
  const rooms = await Room.find({
    _id: {
      $in: hotelRooms,
    },
  }).select({
    _id: 1,
    roomType: 1,
    basePricePerNight: 1,
    numberOfGuestsInaRoom: 1,
  })

  res.send(rooms)
});

router.get("/:id",[auth,renter,validateObjectId],async (req, res)=>{
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).send("room with given id not found");
  res.send(room);
})

router.post("/", [auth, renter, validate(validateRoom)], async (req, res) => {
  const hotel = await Hotel.findById(req.body.hotelId);
  if (!hotel) return res.status(404).send("hotel with id not found");
  const room = new Room(req.body);
  await room.save();
  await Hotel.findByIdAndUpdate(room.hotelId, {
    $push: {hotelRooms: room._id},
  });
  res.send(room);
});

router.put("/:id",[auth, renter,validateObjectId, validate(validateRoom)], async (req, res)=>{
  const room=await Room.findByIdAndUpdate(req.params.id, req.body,{new:true});
  if(!room) return res.status(404).send("room with given Id not found")
  res.send(room)
})

router.delete("/:id",[auth,renter, validateObjectId],async (req, res)=>{
  const room= await Room.findByIdAndDelete(req.params.id)
  if(!room) return res.status(404).send("Room with given Id not found")
  res.send(room)
})

module.exports = router;
