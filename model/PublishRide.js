const mongoose = require('mongoose');
const Schema= mongoose.Schema;
const publishRideSchema = new mongoose.Schema({
    publisherId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },

    fromId:{ 
         type:Schema.Types.ObjectId,
         ref:"place"
    },
    toId:{
        type:Schema.Types.ObjectId,
        ref:"place"
    },
    rideDate:{
     type:String,

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
    publisherRequest:[
         { 
            type:Schema.Types.ObjectId,
            ref:"user"
       } 
    ],
    msgForBooker:{type:String}
})

module.exports = mongoose.model("publishride",publishRideSchema);