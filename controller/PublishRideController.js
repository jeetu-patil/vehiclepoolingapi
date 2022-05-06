const PublishRide=require("../model/PublishRide");
const { validationResult } = require("express-validator");
const User=require("../model/User");
const cloudinary=require("cloudinary");
const bookRide=require("../model/BookRide");
const otpGenerator = require('otp-generator');
const fast2sms = require("fast-two-sms");

cloudinary.config({ 
    cloud_name: 'dfhuhxrw3', 
    api_key: '212453663814245', 
    api_secret: 'zzSd8ptSYG-MS7hRnE-Ab46Bmts' 
  });


//check it is first ride or not
exports.checkUserRidePublish= (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
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

//if it is first ride then he/she fill some detail one time
exports.firstPublishRide= async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
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


//here publisher pusblish ride
exports.publishRide= (request, response) => {
    var data;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours();

    var datum = Date.parse(request.body.rideDate+","+request.body.rideTime);

    PublishRide.create({
        publisherId:request.body.publisherId,
        fromId:request.body.fromId,
        toId:request.body.toId,
        rideDate:datum,
        seatAvailable: request.body.seatAvailable,
        distance: request.body.distance,
        totalAmount: request.body.totalAmount,
        amountPerPerson: request.body.amountPerPerson,
        isBooked: false,
        ridePublishDate:date,
        msgForBooker: request.body.msgForBooker
    })
    .then(result => {
        data=result;
        User.findOne({_id:request.body.publisherId})
        .then(result => {
            User.updateOne({_id:request.body.publisherId},
                {
                    publishRideCount:result.publishRideCount+1
                }    
            )
            .then(result => {
                return response.status(200).json(data);
            })
            .catch(err => {
                return response.status(500).json(err);
            });
        })
        .catch(error=>{
            return response.status(500).json(err);
        });
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


//here booker request to the publisher
exports.requestForPublisher= async (request, response) => {
    let result=await PublishRide.findOne({publisherId: request.body.publisherId});
    result.publisherRequest.push(request.body.bookerId);
    result.save()
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


//here we display all available publisher
exports.allPublishRidesForUser= (request, response) => {
    PublishRide.find({isBooked:false,rideDate:{$gt:Date.now()}})
    .populate("publisherId").populate("fromId").populate("toId")
    .then((result) => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });
};


//showing request to the publisher
exports.showRequestToThePublisher=(request, response)=> {
    PublishRide.findOne({publisherId: request.params.publisherId})
    .populate("publisherRequest")
    .then(result=> {
        return response.status(200).json(result.publisherRequest);
    })
    .catch(err=> {
        return response.status(500).json(err);
    });
};

//if publisher decline request of booker
exports.declineRequestOfBooker= (request, response) => {
    User.findOne({_id:request.params.bookerId})
    .then(result=> {
        let otp = otpGenerator.generate({ lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
        var option = {
            authorization: 'HMWLTGXIS7nCxvJh9YN843qkoeE2PfrutlciFUZQm015bgRBzDUY4OltK0NwQnCWMk5ZGiDbIJjpPf2d',
            message:"Your Request For The Ride Is Declined Please Find Other Ride"
            , numbers: [result.mobile]
        }
        fast2sms.sendMessage(option);

        PublishRide.findOne({publisherId:request.params.publisherId})
        .then(answer => {
            answer.request.pull(request.params.bookerId);
            answer.save()
            .then(result => {
                return response.status(200).json(result);
            })
            .catch(err=>{
                return response.status(500).json(err);
            });
        })
        .catch(error => {
            return response.status(500).json(err);
        });
    })
    .catch(err=> {
        return response.status(500).json(err);
    });
};

//if publisher accept booker request 
exports.acceptRequestOfBooker=async (request, response) => {
  let publishRider=await PublishRide.findOne({ publisherId: request.params.publisherId});
  if(publishRider.seatAvailable>0)
  {
    
  }
  else
  {

  }
};