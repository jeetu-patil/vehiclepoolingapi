const PulishRideHistory=require("../model/PublishRidesHistory");
const PublishRide= require("../model/PublishRide");

exports.viewPublisherHistory= (request, response) => {
    temp=[];
    PulishRideHistory.find({publisherId:request.params.publisherId})
    .populate("booker")
    .then(async result=>{
        for(var i=0; i<result.length; i++){
            temp[i]=result[i].booker;
        }
        return response.status(200).json(temp);
    })
    .catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    });
};