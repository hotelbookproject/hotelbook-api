const Joi = require("joi");
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
          return v && !Object.is(Number(v), NaN) && v.length === 6;
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
      enum: ["No", "Yes, Free", "Yes, Paid"],
    },
    facilities: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "must require at least one facility",
      },
      enum: [], //todo
    },
    extraBed: {
      type: String,
      required: true,
      enum: ["No", "Yes"],
    },
    extraBedDetails: {
      type: Array,
    },
    mainPhoto: {
      type: URL,
      required: true,
    },
    photos:{
      type: Array,
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
      type: Number,
      required: true,
    },
    isVerified: {
      type: Number,
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
    provideDormitoryForDriver:{
      type:Boolean
    },
    GST:{
      type:Boolean,
      required: true,
    },
    tradeName:{
      type:String,
    },
    GSTIN:{
      type:String
    },
    panCardNumber:{
      type:String
    },
    state:{
      type:String
    }
  },
});

const Hotel = mongoose.model("hotel", hotelSchema);

function validateHotel(data) {
  const schema = Joi.object({
    hotelName: Joi.string().min(1).max(50).required(),
    starRating: Joi.string()
      .min(1)
      .max(30)
      .required()
      .valid("1", "2", "3", "4", "5"),
    contactName: Joi.string().required().min(2).max(50),
    phoneNumber: Joi.number().required().min(10).max(10),
    address: Joi.string().required().min(8).max(255),
    city: Joi.string().required().min(1).max(50),
    postalCode: Joi.number().required().min(6).max(6),
    parking: Joi.string().required().valid("No", "Yes, Free", "Yes, Paid"),
    breakfast: Joi.string().required().valid("No", "Yes, Free", "Yes, Paid"),
    facilities: Joi.array().required(),
    extraBed: Joi.boolean().required(),
    extraBedDetails: Joi.array().optional(),
    mainPhoto: Joi.url().required(),
    photos: Joi.array().optional(),
    freeCancellationAvailable: Joi.boolean().required(),
    ifNotCancelledBeforeDate: Joi.string(),
    checkIn: Joi.string().required(),
    checkOut: Joi.string().required(),
    accomodateChildren: Joi.boolean().required(),
    allowPets: Joi.boolean().required(),
  });
  return schema.validate(data);
}

exports.Hotel = Hotel;
exports.validateHotel = validateHotel;
