const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  name: {
    type: String,
    required: true,
    min: 2,
    max: 50,
  },
  username: {
    type: String,
    required: true,
    min: 1,
    max: 30,
    validate: /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  resettoken: {
    type: Object,
    default: null,
  },
  isAdmin:{
    type: Boolean,
    default: false,
  },
  amountRecievedInMonths:{
    type: Object,
    default: null,
  },
  amountTransferredInMonths:{
    type: Object,
    default: null,
  },
});

const Transaction = mongoose.model("transaction", transactionSchema);

function validateTransaction(data) {
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

exports.Transaction = Transaction;
exports.validateTransaction = validateTransaction;

