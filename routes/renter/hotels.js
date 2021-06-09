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
const convertBase64toImage = require("../../utils/convertBase64toImage");

router.get("/", [auth, renterMiddleware], async (req, res) => {
  const {hotels} = await findRenter(req.user.username);
  let hotel = await Hotel.find({
    _id: {
      $in: hotels,
    },
  }).select({_id: 1, hotelName: 1, mainPhoto: 1});

  res.send(hotel);
});

router.get("/:id", [auth, renterMiddleware, validateObjectId], async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).send("hotel with given id not found");
  res.send(hotel);
});

router.post("/", [auth, renterMiddleware, validate(validateHotel)], async (req, res) => {
  createFolder(req.user.username);

  req.body.mainPhoto = await convertBase64toImage(req.user.username, req.body.mainPhoto);

  let photos = [];
  if (req.body.photos.length > 0)
    for (let image of req.body.photos)
      photos.push(await convertBase64toImage(req.user.username, image));
  req.body.photos = photos;

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
    req.body.mainPhoto = await convertBase64toImage(req.user.username, req.body.mainPhoto);

    let photos = [];
    if (req.body.photos.length > 0)
      for (let image of req.body.photos)
        photos.push(await convertBase64toImage(req.user.username, image));
    req.body.photos = photos = [...req.body.photos, ...photos];

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
