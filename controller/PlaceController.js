const Place=require("../model/Place");
const { validationResult } = require("express-validator");
exports.addPlace = function(request,response) {
    const errors = validationResult(request);
    if (!errors.isEmpty())
      return response.status(400).json({ errors: errors.array() });
    Place.create({
        place: request.body.place,
        longitude: request.body.longitude,
        latitude:request.body.latitude,
        description:request.body.description
    })
    .then(result=>{
        return response.status(200).json(result);
    })
    .catch(err=>{
        return response.status(500).json(err);
    });
};

exports.getAllPlaces= (request, response) => {
    Place.find()
    .then(result=>{
        return response.status(200).json(result);
    })
    .catch(err=>{
        return response.status(500).json(err);
    });
};