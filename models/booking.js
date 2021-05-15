const mongoose = require("mongoose");

const bookingSchema= new mongoose.Schema({
    guestId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    startingDayOfStay:{
        type:String,
        required:true,
        minlength:8,
        maxlength:10
    },
    endingDayOfStay:{
        type:String,
        required:true,
        minlength:8,
        maxlength:10
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