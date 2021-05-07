const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  numberOfRoomsOfThisType: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v && !Object.is(Number(v), NaN)&&v.length<=9999;
      },
      message: "This is not a valid number",
    },
  },
  kindOfBed: {
    type: String,
    required: true,
    enum: ["Single bed","Double bed","Large bed","Extra large bed"],
  },
  numberOfBeds: {
    type: String,
    validate: {
      validator: function (v) {
        return v && !Object.is(Number(v), NaN)&&v.length<=5;
      },
      message: "This is not a valid number",
    },
    required: true,
  },
  basePricePerNight: {
    type: Number,
    required: true,
    min: 0,
    max: 250,
  },
  numberOfGuestsInaRoom:{
    type: Number,
    min:1,
    max:50
  },
  facilities: {
    type: Array,
    required: true,
    enum: [],
  },
  bookingFullDates: {
    type: Array,
    default: [],
  },
  roomsBookedDates: {
    type: [Object],
    default: [],
  },
});

const Room = mongoose.model("room", roomSchema);

function validateRoom(data) {
  const schema = Joi.object({
    roomType: Joi.string().min(1).max(50).required(),
    numberOfRoomsOfThisType: Joi.number().min(1).required(),
    kindOfBed: Joi.string().required(),
    numberOfBeds: Joi.string().required(),
    basePricePerNight: Joi.number().required(),
    facilities: Joi.string().required(),
    bookingFullDates: Joi.date().iso().required(),
    roomsBookedDates: Joi.date().iso().required(),
  });
  return schema.validate(data);
}

exports.Room = Room;
exports.validateRoom = validateRoom;
