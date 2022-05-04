const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookRideSchema=mongoose.Schema({
    passangerId:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    publisherId:{
        type:Schema.Types.ObjectId,
        ref:"publishride"
    },
    isCancelled:{type:Boolean,default:false},
    bookDate:{type:Date,default:Date.now},
    otp:{type:Number,default:0},
    rating:{type:Number,default:0},
    feedback:{type:String,default:""},
    isAccepted:{type:Boolean,default:false},
},{ timestamps: true }); 

module.exports = mongoose.model("bookride",bookRideSchema);