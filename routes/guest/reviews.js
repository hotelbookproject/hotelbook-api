const express = require("express");
const router = express.Router();
const guestMiddleware = require("../../middleware/guest");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");
const { Hotel } = require("../../models/hotel");
//? to get user id, use req.user._id

//? /:id we get is hotel id
router.get("/:id", async (req, res) => {
    //? to get all reviews related to particular hotels
    const hotel = await Hotel.findById(req.params.id);
    const review = hotel.reviews

    if (!review) res.send("no review yet");
    res.send(review)

})

router.post("/:id", [auth, guestMiddleware], async (req, res) => {
    //? store review to database, allow reviewer to write review after he completes his stay.
    const hotel = await Hotels.findById(req.params.id);
    if (!hotel) res.status(404).send("no hotel ");
    const review = {
        reviews: req.body.review
    };
    reviews.push(review);
    res.send(review);

})

router.put("/:id", [auth, guestMiddleware], async (req, res) => {
    //? to edit review written by the user
    const hotel = hotels.findById(req.params.id);
    if (!review) res.status(404).send("no review yet ");



})

router.delete("/:id", [auth, guestMiddleware], async (req, res) => {
   
    const userId = req.user.id
    //?delete review written by user(review writer can only delete)
    
    const hotel = hotels.findById(req.params.id);
    if (!hotel) res.status(404).send("no hotel ");
    const review = {
        review: hotel.reviews
    } 
})

module.exports = router;