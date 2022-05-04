const Place=require("../model/Place");

exports.addPlace = function(request,response) {
    Place.create({
        place: request.body.place,
        longitude:request.body.longitude,
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