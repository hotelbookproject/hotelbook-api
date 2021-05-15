const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
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

  let operation
  if(hotel.startingRatePerDay<req.body.basePricePerNight)
    operation={$push: {hotelRooms: room._id}}
  else
    operation={$push: {hotelRooms: room},startingRatePerDay:req.body.basePricePerNight}  

  await Hotel.findByIdAndUpdate(room.hotelId, operation);
  res.send(room);
});

router.put("/:id",[auth, renter,validateObjectId, validate(validateRoom)], async (req, res)=>{
  const {hotelId}=req.body
  const room=await Room.findByIdAndUpdate(req.params.id, req.body,{new:true});
  if(!room) return res.status(404).send("room with given Id not found")

  const hotel = await Hotel.findById(hotelId);

  const rooms = await Room.find({
    _id: {
      $in: hotel.hotelRooms,
    }
  }).select({hotelId:1,_id:0,basePricePerNight:1});

  const startingRatePerDay = _.min(_.flattenDeep(_.map(rooms,"basePricePerNight")))
  if(hotel.startingRatePerDay>startingRatePerDay)
    await Hotel.findByIdAndUpdate(hotelId,{startingRatePerDay})
  res.send(room)
})

router.delete("/:id",[auth,renter, validateObjectId],async (req, res)=>{
  const room= await Room.findByIdAndDelete(req.params.id)
  if(!room) return res.status(404).send("Room with given Id not found")
  res.send(room)
})

module.exports = router;
