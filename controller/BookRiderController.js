const BookRide= require("../model/BookRide");
const PublishRide = require("../model/PublishRide");
const { validationResult, body } = require("express-validator");
exports.bookRide=async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

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
        seatWant: request.body.seatWant,
        
    })
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return res.status(500).json(err);
    });
};
exports.isCancelled=(request,response)=>{
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    console.log(request.Id)
    BookRide.updateOne(
        {passangerId:request.body.Id},{
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
    const errors = validationResult(request);
    if (!errors.isEmpty())
        console.log("Err")
        console.log(errors);
        return response.status(400).json({ errors1: errors.array() });
         
        console.log(request.body);
         console.log(request.body.Id);
         return response.status(200).json({godFather:"Prabhu Ram"});
    
}

exports. getBookRides=(request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
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
