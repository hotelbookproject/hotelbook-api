const express = require("express");
const router = express.Router();
const guestMiddleware = require("../../middleware/guest");
//? to get user id, use req.user._id

//? /:id we get is hotel id
router.get("/:id", async (req, res)=>{
    //? to get all reviews related to particular hotels
})

router.post("/:id",[auth, guestMiddleware], async (req, res)=>{
    //? store review to database, allow reviewer to write review after he completes his stay.
})

router.put("/:id",[auth,guestMiddleware], async (req, res)=>{
    //? to edit review written by the user
})

router.delete("/:id",[auth,guestMiddleware],async (req, res)=>{
    //?delete review written by user(review writer can only delete)
})

module.exports = router;