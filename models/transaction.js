const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  hotelId: {
    type: ObjectId,
    required: true,
  },
  guestId: {
    type: ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min:0
  },
  isTransactionCompleted: {
    type: Boolean,
    default:false
  },
  isCanceled: {
    type: Boolean,
    default: false,
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
