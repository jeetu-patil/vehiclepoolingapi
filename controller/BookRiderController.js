const BookRide= require("../model/BookRide");
const { validationResult } = require("express-validator");
const { request } = require("express");
exports.bookRide= (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
        BookRide.create({
            passangerId:request.body.passangerId,
            publisherId:request.body.publisherId,
        }).then(result=>{
            console.log(result);
            return response.status(200).json(result);
        }).catch(err=>{
            console.log(err)
            return response.status(500).json(err);
        })
    
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
    console.log(request.params)
    BookRide.updateOne(
        {passangerId:request.params.Id},{
        set$:
            {
            isAccepted:true
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
