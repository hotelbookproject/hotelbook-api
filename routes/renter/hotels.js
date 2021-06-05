const express = require("express");
const router = express.Router();
const app=express()
const auth = require("../../middleware/auth");
const renterMiddleware = require("../../middleware/renter");
const validate = require("../../middleware/validate");
const validateObjectId = require("../../middleware/validateObjectId");
const {validateHotel, Hotel} = require("../../models/hotel");
const findRenter = require("../../utils/findRenter");
const fileUpload = require('express-fileupload');
const createFolder=require("../../utils/createFolder")
const uploadFile=require("../../utils/uploadFiles")
app.use(fileUpload());

router.get("/", [auth, renterMiddleware], async (req, res) => {
  const {hotels} = await findRenter(req.user.username);
  const hotel = await Hotel.find({
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
  createdFolderDetails = await createFolder(req.user.username);
    uploadFile(req, res, createdFolderDetails.foldername, function (data) {
      uploadedFileDetails = data;
      if (uploadedFileDetails["err"])
        return res.status(500).send("Error occured at our end. Try again!");
    });
  // console.log(req.files)
  const hotel = new Hotel(req.body); 
  await hotel.save();
  const renter = await findRenter(req.user.username);
  renter.hotels.push(hotel._id);
  await renter.save();
  res.send(hotel);
});

router.put("/:id", [auth, renterMiddleware, validateObjectId, validate(validateHotel)], async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!hotel) return res.status(404).send("hotel with given id not found");
  res.send(hotel);
});

router.delete("/:id", [auth, renterMiddleware, validateObjectId], async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  if (!hotel) return res.status(404).send("hotel with given id not found");
  res.send(hotel);
});

module.exports = router;
