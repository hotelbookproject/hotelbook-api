const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const renter = require("../../middleware/renter");
const validate = require("../../middleware/validate");
const validateObjectId = require("../../middleware/validateObjectId");
const {validateHotel, Hotel} = require("../../models/hotel");
const findRenter = require("../../utils/findRenter");

router.get("/", [auth, renter], async (req, res) => {
  const {hotels} = await findRenter(req.user.username);
  const hotel = await Hotel.find({
    _id: {
      $in: hotels,
    },
  }).select({_id: 1, hotelName: 1, mainPhoto: 1});
  res.send(hotel);
});

router.get("/:id", [auth, renter, validateObjectId], async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).send("hotel with given id not found");
  res.send(hotel);
});

router.post("/", [auth, renter, validate(validateHotel)], async (req, res) => {
  req.body.placeForSearch.toLowerCase()
  const hotel = new Hotel(req.body);
  await hotel.save();
  const renter = await findRenter(req.user.username);
  renter.hotels.push(hotel._id);
  await renter.save();
  res.send(hotel);
});

router.put("/:id",[auth, renter, validateObjectId, validate(validateHotel)],async (req, res) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!hotel) return res.status(404).send("hotel with given id not found");
    res.send(hotel);
  }
);

router.delete("/:id", [auth, renter, validateObjectId], async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) return res.status(404).send("hotel with given id not found");
  res.send(hotel);
});

module.exports = router;
