const BookerHistory=require("../model/BookerHistory");
const PublishRide = require("../model/PublishRide");
const User=require("../model/User");
const {validationResult}= require("express-validator");

exports.viewBookerHistory= (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    temp=[];
    BookerHistory.find({bookerId:request.body.bookerId,isAccepted:true})
    .populate("bookerId")
    .then(async result=>{
        for(var i=0; i<result.length; i++){
            let ans=await PublishRide.findOne({ publisherId: result[i].publisherId}).populate("fromId").populate("toId").populate("publisherId");
            temp[i]=ans;
        }
        return response.status(200).json(temp);
    })
    .catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    });
};

