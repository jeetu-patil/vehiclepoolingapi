const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookRideSchema=mongoose.Schema({
    bookerId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    publisherId:{
        type:Schema.Types.ObjectId,
        ref:"publishride"
    },
    seatWant:{type:Number,default:1},
    isCancelled:{type:Boolean,default:false},
    bookDate:{type:Date,default:Date.now},
    rating:{type:Number,default:0},
    feedback:{type:String,default:""},
    isAccepted:{type:Boolean,default:false},
}); 

module.exports = mongoose.model("bookride",bookRideSchema);