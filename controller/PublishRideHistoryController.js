const PublishRide= require("../model/PublishRide");

exports.viewPublisherHistory= (request, response) => {
    temp=[];
    k=0;
    PublishRide.find({_id:request.params.rideId})
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
    let temp=[];
    let i=0;
    let result=await PublishRide.find({publisherId: request.params.publisherId,isBooked:true}).sort({date: 'desc'})
    .populate("publisherRequest").populate("fromId").populate("toId");
    
    let result1=await PublishRide.find({publisherId: request.params.publisherId,isTimeExpired:true}).sort({date: 'desc'})
    .populate("publisherRequest").populate("fromId").populate("toId");

    console.log(result1)
    console.log(result)

    for(i=0; i<result.length; i++){
        temp[i]=result[i];
    }
    for( var k=0; k<result1.length; k++,i++){
        temp[i]=result1[k];
    }

    return response.status(200).json(temp);
};
