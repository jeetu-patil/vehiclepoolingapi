const PublishRide= require("../model/PublishRide");
const {validationResult}=require("express-validator");

exports.viewPublisherHistory= (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    temp=[];
    k=0;
    PublishRide.find({_id:request.body.rideId})
    .populate("historyOfUser")
    .then(async result=>{
        for(var i=0; i<result.length; i++)
            temp[i]=result[i].historyOfUser;
        return response.status(200).json(temp);
    })
    .catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    });
};


exports.publishHistory= async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    let temp=[];
    let i=0;    
    let result=await PublishRide.find({publisherId: request.body.userId,isBooked:true}).sort({date: 'desc'})
    .populate("publisherRequest").populate("fromId").populate("toId");
    
    let result1=await PublishRide.find({publisherId: request.body.userId,isTimeExpired:true}).sort({date: 'desc'})
    .populate("publisherRequest").populate("fromId").populate("toId");
    for(i=0; i<result.length; i++){
        temp[i]=result[i];
    }
    for( var k=0; k<result1.length; k++,i++){
        temp[i]=result1[k];
    }

    return response.status(200).json(temp);
};
