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
     type:Date,
    },
    seatAvailable: {
        type:Number,
        default:0
    },
    totalSeat: {type:Number,default:0},
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
    otp:[
        {
            bookerId:
            {
                type:Schema.Types.ObjectId,
                ref:"user"
            },
            otpNumber:{type:Number}
        }
    ],
    historyOfUser:[
        {
            bookerId:
            {
                type:Schema.Types.ObjectId,
                ref:"user"
            }
        }
    ],
    isRideStarted:{
        type:Boolean
    },
    isTimeExpired:{type:Boolean,default:false},
    publisherRequest:[
         { 
            type:Schema.Types.ObjectId,
            ref:"user"
       } 
    ],
    msgForBooker:{type:String}
},{timeStamps:true})

module.exports = mongoose.model("publishride",publishRideSchema);