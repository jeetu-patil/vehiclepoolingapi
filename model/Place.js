const mongoose=require('mongoose');

const placeSchema=mongoose.Schema({
    place:String,
    longitude:String,
    latitude:String   
},{timeStamps:true});

module.exports=mongoose.model("place",placeSchema);