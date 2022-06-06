const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        default:""
    },
    password : {
        type : String,
    },
    mobile : {
        type : Number,
        default:1
    },
    age : {
        type : Number,
        default:0
    },
    gender : {
        type : String,
        default : ""
    },
    aadharCard : {
        type : String,
    },
    isBlock : {
        type : Boolean,
        default : false
    },
    mobileNoR:{
        type : Number,
        default:1
    },
    isMobileVerified : {
        type : Boolean,
        default : false,
        required : true
    },
    isReferenceNo:{
        type:Boolean,
        default:false,
        required:true
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
        number:{type:String,default:""}
    },
    date:{
        type:Date,
        default:Date.now
    },
    comments:[
        {
            userId:
            {
                type:Schema.Types.ObjectId,
                ref:"user"
            },
            feedback:{type:String}
        }
    ]
});
module.exports = mongoose.model("user",userSchema);