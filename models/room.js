const mongoose = require("mongoose");
const Joi = require("joi");

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
    validate: {
      validator: function (v) {
        return v && !Object.is(Number(v), NaN)&&v.length<=9999;
      },
      message: "This is not a valid number",
    },
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
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "must require at least one facility",
    },
  },
  bookingFullDates: {
    type: Array,
    default: [],
  },
  numberOfBookingsByDate: {
    type: Object,
    default: null,
  },
  hotelId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  }
});

const Room = mongoose.model("room", roomSchema);

function validateRoom(data) {
  const schema = Joi.object({
    roomType: Joi.string().min(1).max(50).required(),
    numberOfRoomsOfThisType: Joi.number().min(1).max(9999).required(),
    kindOfBed: Joi.string()
      .required()
      .valid("Single bed", "Double bed", "Large bed", "Extra large bed"),
    numberOfBeds: Joi.number().min(1).max(10).required(),
    basePricePerNight: Joi.number().min(10).max(2500000).required(),
    numberOfGuestsInaRoom: Joi.number().min(1).max(50),
    facilities: Joi.array().required(),
    hotelId: Joi.objectId()
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
