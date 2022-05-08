const Admin=require("../model/Admin");
const PublishRide = require("../model/PublishRide");
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

exports.publishedRides= (request,response)=>{
    PublishRide.find().then((result) => {
        return response.status(200).json(result);
    }).catch((err) => {
        return response.status(500).json(err);
    });
}

exports.bookRides= (request,response)=>{
    BookRide.find().then((result) => {
        return response.status(200).json(result);
    }).catch((err) => {
        return response.status(500).json(err);
    });
}