const BookRide= require("../model/BookRide");
const PublishRide = require("../model/PublishRide");
const { validationResult } = require("express-validator");
exports.bookRide=async (request, response) => {

    let ride=await BookRide.find({rideId:request.body.rideId}).populate("rideId");
    let publishRide=await PublishRide.findOne({_id:request.body.rideId});

    for(var i=0;i<ride.length;i++){
        if((ride[i].rideId.fromId.toString()==publishRide.fromId.toString())&&(ride[i].rideId.toId.toString()==publishRide.toId.toString())&&(ride[i].rideId.rideDate==publishRide.rideDate&&ride[i].bookerId==request.body.bookerId)){
            return response.status(200).json({msg:"already available"});
        }
    }

    BookRide.create({
        bookerId: request.body.bookerId,
        rideId: request.body.rideId,
        seatWant: request.body.seat,
    })
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return res.status(500).json(err);
    });
};
exports.isCancelled=(request,response)=>{
    console.log(request.params)
    BookRide.updateOne(
        {passangerId:request.params.Id},{
        set$:
            {
            isCancelled:true
           }
        }
    ).then(result=>{
        console.log(result[0]);
        return response.status(200).json(result);
    })
    .catch(err=>{
       console.log(err);
       return response.status(500).json(err);
    })
}
exports.isAccepted=(request,response)=>{
    
}

exports. getBookRides=(request, response) => {
    temp=[];
    r=[];
    BookRide.find({bookerId:request.body.bookerId,isAccepted:true}).sort({date:"desc"})
    .populate("bookerId")
    .then(async result=>{
        for(var i=0; i<result.length; i++){
            let ans=await PublishRide.findOne({ _id: result[i].rideId}).populate("fromId").populate("toId").populate("publisherId");
            r[i]=result[i]._id;
            temp[i]=ans;
        }
        return response.status(200).json({temp:temp,result:r});
    })
    .catch(err=>{
        console.log(err);
        return response.status(500).json(err);
    });
};
