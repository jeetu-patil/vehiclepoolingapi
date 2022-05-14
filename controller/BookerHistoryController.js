const BookerHistory=require("../model/BookerHistory");
const PublishRide = require("../model/PublishRide");
const User=require("../model/User");

exports.viewBookerHistory= (request, response) => {
    temp=[];
    BookerHistory.find({bookerId:request.params.bookerId,isAccepted:true})
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

