const formidable = require("formidable");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const sharp = require("sharp");

const auth = require("../../middleware/auth");
const renterMiddleware = require("../../middleware/renter");
const validate = require("../../middleware/validate");
const validateObjectId = require("../../middleware/validateObjectId");
const {validateHotel, Hotel} = require("../../models/hotel");
const findRenter = require("../../utils/findRenter");
const createFolder = require("../../utils/createFolder");

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

router.post("/", [auth, renterMiddleware], async (req, res) => {
  createFolder(req.user.username);

  var formData = new formidable.IncomingForm({
    uploadDir: `public/${req.user.username}/`,
    keepExtensions: true,
  });

  formData.parse(req, async function (err, fields, files) {
    let photos = [];
    for (let [key, value] of Object.entries(files)) {
      let newPath =
        `${__basedir}/public/${req.user.username}/` +
        Date.now() +
        Math.random().toString().slice(2, 14) +
        value.name;
      fs.rename(value.path, newPath, function (errorRename) {
        if(errorRename) console.log(errorRename)
      });

      sharp(newPath)
        .resize(1920, 1080)
        .toBuffer(function(err, buffer) {
          if(err) console.log(err)
          fs.writeFile(newPath, buffer, function(err) {
            if(err) console.log(err)
          });
        })

      if (key === "mainPhoto") {
        fields["mainPhoto"] = newPath;
      } else {
        photos.push(newPath); 
      }
    } 

    fields.photos = photos;
    fields.facilities = fields.facilities.split(",");
    delete fields["photos[length]"];
    delete fields["photos[item]"];

    const booleanKeys = [
      "extraBed",
      "accomodateChildren",
      "allowPets",
      "isPrepaymentRequired",
      "provideDormitoryForDriver",
      "GST",
    ];

    const transform = obj =>
      booleanKeys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: obj[key] === "Yes",
        }),
        obj
      );

    fields = transform(fields);
    console.log(fields);
    req.body = fields;

    validateHotel(fields).catch(e => {
      error = {
        property: e.path,
        msg: e.message,
      };
      return res.status(400).send(error);
    });

    const hotel = new Hotel(fields);
    await hotel.save();
    const renter = await findRenter(req.user.username);
    renter.hotels.push(hotel._id);
    await renter.save();
    res.send(hotel);
  });

  // createdFolderDetails = await createFolder(req.user.username);
  //   uploadFile(req, res, createdFolderDetails.foldername, function (data) {
  //     uploadedFileDetails = data;
  //     if (uploadedFileDetails["err"])
  //       return res.status(500).send("Error occured at our end. Try again!");
  //   });
  // console.log(req.files)
  // const hotel = new Hotel(finalData);
  // await hotel.save();
  // const renter = await findRenter(req.user.username);
  // renter.hotels.push(hotel._id);
  // await renter.save();
  // res.send(hotel);
});

router.put(
  "/:id",
  [auth, renterMiddleware, validateObjectId, validate(validateHotel)],
  async (req, res) => {
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
