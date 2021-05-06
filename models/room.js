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
        return v && !Object.is(Number(v), NaN);
      },
      message: "This is not a valid number",
    },
  },
  kindOfBed: {
    type: String,
    required: true,
    enum: [],
  },
  numberOfBeds: {
    type: String,
    validate: {
      validator: function (v) {
        return v && !Object.is(Number(v), NaN);
      },
      message: "This is not a valid number",
    },
    required: true,
  },
  basePricePerNight: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v && !Object.is(Number(v), NaN);
      },
      message: "This is not a valid number",
    },
  },
  amenities: {
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
    numberOfRoomsOfThisType: Joi.number()
      .min(1)
      .required(),
      kindOfBed: Joi.string()
      .required(),
      numberOfBeds:Joi.string()
      .required(),
      basePricePerNight:Joi.number()
      .required(),
      amenities:Joi.string()
      .required(),
      bookingFullDates:Joi.date().iso().required(),
      roomsBookedDates:Joi.date().iso().required()
  });
  return schema.validate(data);
}

exports.Room = Room;
exports.validateRoom = validateRoom;