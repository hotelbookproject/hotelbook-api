const mongoose = require("mongoose");

const bookingSchema= new mongoose.Schema({
    hotelId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    guestId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    roomDetails:{
        type:Object,
        required:true
        // roomId:{
        //     "no of rooms":1,
        //     "prices per room":1000
        // }
    },
    totalPrice:{
        type:Number,
        min:10,
        max:1000000000,
        required:true
    },
})

const Booking =mongoose.model("booking",bookingSchema)

exports.Booking=Booking