const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const renterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  username: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
    validate: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
  },
  email: {
    type: String,
    required: true,
    validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  resettoken: {
    type: Object,
    default: null,
  },
  hotels: {
    type: Array,
    default: [],
  },
});

renterSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      username: this.username,
      isRenter: true,
    },
    process.env.JWT_AUTH_PRIVATE_KEY
  );
  return token;
};

renterSchema.methods.generateResetToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      isRenter: true,
    },
    process.env.JWT_CHANGEPASSWORD_PRIVATE_KEY
  );
  return token;
};

const Renter = mongoose.model("renter", renterSchema);

let passwordValidation = [
  Joi.string().min(6).max(256).required(),
  Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({"any.only": "passwords does not match"}),
];

function validateRenter(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    username: Joi.string()
      .min(1)
      .max(30)
      .required()
      .pattern(new RegExp(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/))
      .message({"string.pattern.base": "Invalid username"}),
    email: Joi.string()
      .required()
      .pattern(new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
      .message({"string.pattern.base": "Invalid email address"}),
    password: passwordValidation[0],
    confirmPassword: passwordValidation[1],
  });
  return schema.validate(data);
}

function validateRenterPassword(data) {
  const schema = Joi.object({
    oldpassword: Joi.string(),
    password: passwordValidation[0],
    confirmPassword: passwordValidation[1],
  });

  return schema.validate(data);
}

exports.Renter = Renter;
exports.validateRenter = validateRenter;
exports.validateRenterPassword = validateRenterPassword;