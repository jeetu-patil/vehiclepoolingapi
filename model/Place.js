const mongoose=require('mongoose');

const placeSchema=mongoose.Schema({
    place:String,
    longitude:String,
    latitude:String,
    description:String
});

module.exports=mongoose.model("place",placeSchema);