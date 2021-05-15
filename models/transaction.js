const mongoose = require("mongoose");
const Joi = require("joi");

const transactionSchema = new mongoose.Schema({
  hotelId: {
    type: ObjectId,
    required: true,
  },
  guestId: {
    type: ObjectId,
    required: true,
  },
  roomId:{
    type:ObjectId,
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

function validateTransaction(data){

  const schema = Joi.object({
    hotelId:Joi.ObjectId().required,
    guestId:Joi.ObjectId().required,
    roomId:Joi.ObjectId().required,
    amount:Joi.Number().required,
    isTransactionCompleted:Boolean().required,
    isCanceled:Boolean().required
  })
  return schema.validate(data)
}
const Transaction = mongoose.model("transaction", transactionSchema);

exports.Transaction = Transaction;
exports.validateTransaction= validateTransaction;
