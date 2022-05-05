const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    mobile : {
        type : Number,
        unique : true
    },
    age : {
        type : Number,
        required : true,
    },
    gender : {
        type : String,
        required : true
    },
    aadharCard : {
        type : String,
        required : true
    },
    isBlock : {
        type : Boolean,
        default : false
    },
    isMobileVerified : {
        type : Boolean,
        default : false,
        required : true
    },
    isEmailVerified : {
        type : Boolean,
        default : false,
        required : true
    },
    image : {
        type : String,
        default : ""
    },
    miniBio : {
        type : String,
        default : "Hi , I am available"
    },
    publishRideCount : {
        type : Number,
        default : 0
    },
    drivingLicense : {
        type : String,
        default : ""
    },
    vehicle : {
        name : {
            type : String,
            default : ""
        },
        image : {
            type : String,
            default : ""
        },
        wheeler : {
            type : Number,
            default : 0
        },
    },
    date:{
        type:Date,
        default:Date.now
    }
},{ timestamps: true });
module.exports = mongoose.model("user",userSchema);