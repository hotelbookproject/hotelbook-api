const formidable = require("formidable");
const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const renterMiddleware = require("../../middleware/renter");
const validate = require("../../middleware/validate");
const validateObjectId = require("../../middleware/validateObjectId");
const {validateHotel, Hotel} = require("../../models/hotel");
const findRenter = require("../../utils/findRenter");
const createFolder = require("../../utils/createFolder");
const { retrieveMainPhoto,retrieveOtherPhotos } = require("../../utils/retrieveImages");
const saveImagesandGetPath = require("../../utils/saveImagesandGetPath");

router.get("/", [auth, renterMiddleware], async (req, res) => {
  const {hotels} = await findRenter(req.user.username);
  let hotel = await Hotel.find({
    _id: {
      $in: hotels,
    },
  }).select({_id: 1, hotelName: 1, mainPhoto: 1,city:1});
  hotel=await retrieveMainPhoto(hotel)

  res.send(hotel);
});

router.get("/:id", [auth, renterMiddleware, validateObjectId], async (req, res) => {
  console.log("abc")
  let hotel = [await Hotel.findById(req.params.id)];
  if (!hotel) return res.status(404).send("hotel with given id not found");
  hotel=await retrieveMainPhoto(hotel)
  hotel=await retrieveOtherPhotos(hotel)
  res.send(hotel);
});
 
router.post("/", [auth, renterMiddleware, validate(validateHotel)], async (req, res) => {
  createFolder(req.user.username);
  await saveImagesandGetPath(req)

  const hotel = new Hotel(req.body);
  await hotel.save();
  const renter = await findRenter(req.user.username);
  renter.hotels.push(hotel._id);
  await renter.save();
  res.send(hotel);
});

router.put(
  "/:id",
  [auth, renterMiddleware, validateObjectId, validate(validateHotel)],
  async (req, res) => {
    await saveImagesandGetPath(req)

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!hotel) return res.status(404).send("hotel with given id not found");
    res.send(hotel);
  }
);

router.delete("/:id", [auth, renterMiddleware, validateObjectId], async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) return res.status(404).send("hotel with given id not found");
  res.send(hotel);
});

module.exports = router;
