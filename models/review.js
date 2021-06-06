const mongoose = require("mongoose");
const Joi = require("joi");

const reviewSchema = new mongoose.Schema({
    reviewsId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    reviews: {
        type: String,
        required: true
    }
});

const Review = mongoose.model("review", reviewSchema);

function validateReview(data) {
    const schema = Joi.object({
        review: Joi.string().min(2).max(50).required()
    });
    return schema.validate(data);
}

exports.Review = Review;
exports.validateReview = validateReview;