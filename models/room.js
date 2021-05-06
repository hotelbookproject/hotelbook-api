const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    required: true,
    min: 1,
    max: 50,
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
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string()
      .min(1)
      .max(30)
      .required()
      .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/)),
    email: Joi.string()
      .required()
      .pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)),
    password: passwordValidation[0],
    confirmpassword: passwordValidation[1],
  });
  return schema.validate(data);
}

exports.Room = Room;
exports.validateRoom = validateRoom;