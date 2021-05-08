const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  hotelDetails: {
    hotelName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    starRating: {
      type: String,
      enum: ["1", "2", "3", "4", "5"],
    },
    contactName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
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
    },
    address: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 255,
    },
    city: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    postalCode: {
      type: String,
      validate: {
        validator: function (v) {
          return v && !Object.is(Number(v), NaN)&&v.length===6;
        },
        message: "This is not a valid postal code",
      },
      required: true,
    },
    parking: {
      type: String,
      required: true,
      enum: ["No", "Yes, Free", "Yes, paid"],
    },
    breakfast: {
      type: String,
      required: true,
      enum:["No", "Yes, Free", "Yes, Paid"]
    },
    facilities: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "must require at least one facility",
      },
      enum: [],//todo
    },
    extraBed: {
      type: String,
      required: true,
      enum: ["No", "Yes"],
    },
    extraBedDetails:{
      type:Array,
      
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
