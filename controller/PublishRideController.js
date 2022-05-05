const PublishRide=require("../model/PublishRide");
const User=require("../model/User");
const cloudinary=require("cloudinary");
const bookRide=require("../model/BookRide");

cloudinary.config({ 
    cloud_name: 'dfhuhxrw3', 
    api_key: '212453663814245', 
    api_secret: 'zzSd8ptSYG-MS7hRnE-Ab46Bmts' 
  });


exports.checkUserRidePublish= (request, response) => {
    User.findOne({_id:request.params.id})
    .then(result=>{
        if(result.publishRideCount>0)
            return response.status(200).json({result:result,count:1});
        return response.status(200).json({result:result,count:0});
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


exports.firstPublishRide= async (request, response) => {
    let vehicleImage="";
    let licenseImage="";
    if(request.files)
    { 
        var result=await cloudinary.v2.uploader.upload(request.files[0].path);
        vehicleImage=result.url;
        result=await cloudinary.v2.uploader.upload(request.files[1].path);
        licenseImage=result.url;
    }

    let vechile={
        name: request.body.name,
        image:vehicleImage,
        wheeler:request.body.wheeler
    }
    User.updateOne({_id:request.body.userId},
        {
            $set:
            {
                drivingLicense:licenseImage,
                vehicle:vechile,
            }
        }    
    )
    .then((result) => {
        return response.status(200).json(result);
    })
    .catch(err => {
        console.error(err)
        return response.status(500).json(err);
    });
};

exports.publishRide= (request, response) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours();//.getMinutes().getSeconds();
    //var time=today.toLocaleTimeString();
    // console.log(date);
    // console.log(request.body);
    // console.log(time)
    PublishRide.create({
        publisherId:request.body.publisherId,
        fromId:request.body.fromId,
        toId:request.body.toId,
        rideDate: request.body.rideDate,
        rideTime: time,
        seatAvailable: request.body.seatAvailable,
        distance: request.body.distance,
        totalAmount: request.body.totalAmount,
        amountPerPerson: request.body.amountPerPerson,
        isBooked: false,
        ridePublishDate:date,
        msgForBooker: request.body.msgForBooker
    })
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


exports.requestForPublisher= async (request, response) => {
    let result=await PublishRide.findOne({publisherId: request.body.publisherId});
    result.request.push(request.body.bookerId);
    result.save()
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};

exports.allPublishRidesForUser= (request, response) => {
    PublishRide.find({isBooked:false})
    .then((result) => {
        return response.status(200).json(result);
    })
    .cache(error => {
        return response.status(500).json(err);
    });
};
