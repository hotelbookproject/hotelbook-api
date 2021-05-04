const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  hotelDetails: {
    hotelName: {
      type: String,
      required: true,
      min: 1,
      max: 50,
    },
    starRating: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
    },
    contactName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return v && !Object.is(Number(v), NaN);
        },
        message: "This is not a valid mobile number",
      },
      required: true,
      min: 10,
      max: 10,
    },
    address: {
      type: String,
      required: true,
      min: 8,
      max: 255,
    },
    city: {
      type: String,
      required: true,
      min: 1,
      max: 50,
    },
    postalCode: {
      type: String,
      validate: {
        validator: function (v) {
          return v && !Object.is(Number(v), NaN);
        },
        message: "This is not a valid postal code",
      },
      required: true,
      min: 4,
      max: 6,
    },
    parking: {
      type: String,
      required: true,
      enum: ["no", "yes", "yes, paid"],
    },
    breakfast: {
      type: String,
      required: true,
      min: 2,
      max: 10,
    },
    facilities: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "must require at least one facility",
      },
      enum: [],
    },
    extraBed: {
      type: String,
      required: true,
      enum: ["no", "yes", "yes, paid"],
    },
    mainPhoto: {
      type: URL,
      required: true,
    },
    freeCancellationAvailable: {
      type: Boolean,
      required: true,
    },
    ifNotCancelledBeforeDate: {
      type: String,
      required: true,
      enum: [],
    },
    checkIn: {
      type: String,
      required: true,
    },
    checkOut: {
      type: String,
      required: true,
    },
    accomodateChildren: {
      type: String,
      required: true,
    },
    allowPets: {
      type: Boolean,
      required: true,
    },
    reviewScore: {
      type: Float,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    incomeInMonth: {
      type: Object,
      default: null,
    },
    reviews: {
      type: Array,
      default: [],
    },
    hotelRooms: {
      type: Array,
      default: [],
    },
  },
});

const Hotel = mongoose.model("hotel", hotelSchema);

function validateHotel(data) {
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

exports.Hotel = Hotel;
exports.validateHotel = validateHotel;
