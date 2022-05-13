const BookRide= require("../model/BookRide");
const PublishRide = require("../model/PublishRide");
const { validationResult } = require("express-validator");
exports.bookRide= (request, response) => {
    BookRide.create({
        bookerId: request.body.bookerId,
        publisherId: request.body.publisherId,
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

exports.getBookRides=(request, response) => {
    temp=[];
    BookRide.find({bookerId:request.params.bookerId,isAccepted:true})
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
