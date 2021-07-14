const mongoose = require("mongoose");
const Yup = require("yup");

const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  numberOfRoomsOfThisType: {
    type: Number,
    required: true,
    min: 1,
    max: 9999,
  },
  kindOfBed: {
    type: String,
    required: true,
    enum: ["Single bed", "Double bed", "Large bed", "Extra large bed"],
  },
  numberOfBeds: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  basePricePerNight: {
    type: Number,
    required: true,
    min: 0,
    max: 2500000,
  },
  numberOfGuestsInaRoom: {
    type: Number,
    min: 1,
    max: 50,
  },
  facilities: {
    type: Array,
    required:true
  },
  bookingFullDates: {
    type: Array,
    default: [],
  },
  numberOfBookingsByDate: {
    type: Object,
    default: null,
  },
  mainPhoto: {
    type: String,
    required: true,
  },
  photos: {
    type: Array,
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Room = mongoose.model("room", roomSchema);

function validateRoom(data) {
  const schema = Yup.object().shape({
    roomType: Yup.string().min(1).max(50).required(),
    numberOfRoomsOfThisType: Yup.number().min(1).max(9999).required(),
    kindOfBed: Yup.string()
      .required()
      .oneOf(["Single bed", "Double bed", "Large bed", "Extra large bed"]),
    numberOfBeds: Yup.number().min(1).max(10).required(),
    basePricePerNight: Yup.number().min(10).max(2500000).required(),
    numberOfGuestsInaRoom: Yup.number().min(1).max(50),
    facilities: Yup.array().required(),
    mainPhoto: Yup.mixed().required(),
    photos: Yup.array().nullable(),
  });
  return schema.validate(data);
}

exports.Room = Room; 
exports.validateRoom = validateRoom; 
 
//? API post request data
// {
//   "roomType":"luxury",
//   "numberOfRoomsOfThisType":4,
//   "kindOfBed":"Single bed",
//   "numberOfBeds":6,
//   "basePricePerNight":10000,
//   "numberOfGuestsInaRoom":10,
//   "facilities":["acc","tv"]
// }
