const Admin=require("../model/Admin");
const PublishRide = require("../model/PublishRide");
const User = require("../model/User");
const BookRide = require("../model/BookRide");
const { validationResult } = require("express-validator");

exports.signin=(request,response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
    Admin.findOne({email:request.body.email,password:request.body.password})
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};

exports.userList = (request,response)=>{
   User.find().then((result) => {
       return response.status(200).json(result);
   }).catch((err) => {
       return response.status(500).json(err);
   });
}

exports.allPublishRidesForUser= (request, response) => {
    PublishRide.find()
    .populate("publisherId").populate("fromId").populate("toId")
    .then((result) => {
        return response.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        return response.status(500).json(err);
    });
};

exports.bookRides= (request,response)=>{
    BookRide.find()
    .populate("publisherId").populate("bookerId")
    .then((result) => {
        return response.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        return response.status(500).json(err);
    });     
}

// exports.publisherCancelledRides = (request,response)=>{
//      PublishRide.find({isCancelled:true}).then((result) => {
         
//      }).catch((err) => {
         
//      });
// }