const Joi = require("joi");
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
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
          return v && !Object.is(Number(v), NaN)&&v.length===10;
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
    },
    extraBed: {
      type: Boolean,
      required: true,
    },
    extraBedDetails: {
      type: Array,
    },
    mainPhoto: {
      type: String,
      required: true,
    },
    photos: {
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
      default:0
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
    isPrepaymentRequired: {
      type: Boolean,
      required: true,
    },
    provideDormitoryForDriver: {
      type: Boolean,
    },
    GST: {
      type: Boolean,
      required: true,
    },
    tradeName: {
      type: String,
    },
    GSTIN: {
      type: String,
    },
    panCardNumber: {
      type: String,
    },
    state: {
      type: String,
    },
  });

const Hotel = mongoose.model("hotel", hotelSchema);

function validateHotel(data) {
  const schema = Joi.object({
    hotelName: Joi.string().min(1).max(50).required(),
    starRating: Joi.string().valid("1", "2", "3", "4", "5"),
    contactName: Joi.string().required().min(2).max(50),
    phoneNumber: Joi.string()
      .required()
      .length(10)
      .pattern(/^[0-9]+$/)
      .message({
        "string.pattern.base": "Mobile number must include only numbers",
      }),
    address: Joi.string().required().min(8).max(255),
    city: Joi.string().required().min(1).max(50),
    postalCode: Joi.string()
    .required()
    .length(6)
    .pattern(/^[0-9]+$/)
    .message({
      "string.pattern.base": "Postal code must include only numbers",
    }),
    parking: Joi.string().required().valid("No", "Yes, Free", "Yes, Paid"),
    breakfast: Joi.string().required().valid("No", "Yes, Free", "Yes, Paid"),
    facilities: Joi.array().required(),
    extraBed: Joi.boolean().required(),
    extraBedDetails: Joi.array().optional(),
    mainPhoto: Joi.string().required(),
    photos: Joi.array().optional(),
    freeCancellationAvailable: Joi.boolean().required(),
    ifNotCancelledBeforeDate: Joi.string(),
    checkIn: Joi.string().required(),
    checkOut: Joi.string().required(),
    accomodateChildren: Joi.boolean().required(),
    allowPets: Joi.boolean().required(),
    isPrepaymentRequired: Joi.boolean().required(),
    provideDormitoryForDriver: Joi.boolean().required(),
    GST: Joi.boolean(),
    tradeName: Joi.string(),
    GSTIN: Joi.string(),
    panCardNumber: Joi.string(),
    state: Joi.string(),
  });
  return schema.validate(data);
}

exports.Hotel = Hotel;
exports.validateHotel = validateHotel;

//? API post request data
//{
//   "hotelName":"abc",
//   "starRating":"5",
//   "contactName":"dvd",
//   "phoneNumber":"914253080".
//   "address":"rgergerge ergeger egrer",
//   "city":"dv",
//   "postalCode":"458698",
//   "parking":"No",
//   "breakfast":"No",
//   "facilities":["bed"],
//   "extraBed":true,
//   "extraBedDetails":["ac"],
//   "mainPhoto":"http://bed",
//   "photos":["dsd","few"],
//   "freeCancellationAvailable":false,
//   "ifNotCancelledBeforeDate":"scsc",
//   "checkIn":"12:30",
//   "checkOut":"15:4d",
//   "accomodateChildren":true,
//   "allowPets":false,
//   "isPrepaymentRequired":true,
//   "provideDormitoryForDriver":true,
//   "GST":"false",
//   "tradeName":"cece",
//   "GSTIN":"wefwe",
//   "panCardNumber":"wfwef",
//   "state":"karnataka"
// }
