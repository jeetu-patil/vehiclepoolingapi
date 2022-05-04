const mongoose = require('mongoose');
const { stdin } = require('nodemon/lib/config/defaults');
const publishRideSchema = new mongoose.Schema({
    publisherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    fromId:{ 
         type: mongoose.Schema.Types.ObjectId,
         ref:"place"
    },
    toId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"place"
    },
    rideDate:{
     type:Date,

    },
    rideTime: {
        type:Date,
        trim:true
    },
    seatAvailable: {
        type:Number,
        trim:true
    },
    distance:{
         type:Number,
         trim:true
    },
    totalAmount:{
        type:Number,
        trim:true
    },
    amountPerPerson: {
        type:Number,
        trim:true
    },
    isBooked:{
        type:Boolean
    },
    isTimeExpired:{
        type:Boolean
    },
    isCancelled:{
        type:Boolean
    },
    ridePublishDate:{
        type:Date
    },
    feedback:{
        type:String,
        trim:true
    },
    rating:{
        type:Number,
        trim:true
    },
    otp:{
        type:Number
    },
    isRideStarted:{
        type:Boolean
    },
    request:[
         { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
       } 
    ],
    msgForBooker:{type:String}
},{ timestamps: true })

module.exports = mongoose.model("publishride",publishRideSchema);