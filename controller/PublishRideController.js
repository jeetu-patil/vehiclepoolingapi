const PublishRide=require("../model/PublishRide");
const BookerHistory=require("../model/BookerHistory");
const { validationResult } = require("express-validator");
const User=require("../model/User");
const cloudinary=require("cloudinary");
const BookRide=require("../model/BookRide");
const otpGenerator = require('otp-generator');
const fast2sms = require("fast-two-sms");
const Place = require("../model/Place");
const PublisRideHistory=require("../model/PublishRidesHistory");


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
    if(request.file)
    { 
        var result=await cloudinary.v2.uploader.upload(request.file.path);
        vehicleImage=result.url;
    }

    let vechile={
        name: request.body.name,
        number: request.body.number,
        image:vehicleImage,
        wheeler:request.body.wheeler
    }
    User.updateOne({_id:request.body.userId},
        {
            vehicle:vechile,
            
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

    var datum = Date.parse(request.body.rideDate+","+request.body.rideTime+":00");

    PublishRide.create({
        publisherId:request.body.publisherId,
        fromId:request.body.fromId,
        toId:request.body.toId,
        rideDate:datum,
        seatAvailable: request.body.seatAvailable,
        distance: request.body.distance,
        totalAmount: 0,
        amountPerPerson: request.body.amountPerPerson,
        isBooked: false,
        ridePublishDate:date,
        totalSeat: request.body.seatAvailable,
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
    let obj={
        userId: request.body.bookerId,
        bookRideId: request.body.bookRideId
    }
    let result=await PublishRide.findOne({_id: request.body.rideId});
    result.publisherRequest.push(obj);
    console.log(obj)
    await result.save()
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


//here we display all available publisher
exports.allPublishRidesForUser= async (request, response) => {
    await PublishRide.find({isBooked:false,rideDate:{$gt:Date.now()},isCancelled:false})
    .populate("publisherId").populate("fromId").populate("toId")
    .then((result) => {
        return response.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        return response.status(500).json(err);
    });

    let publish=await PublishRide.find();

    for(var i=0;i<publish.length;i++)
    {
        if(publish.rideDate>Date.now())
        {
            await PublishRide.updateOne({publisherId:request.params.publisherId},
                {
                    $set:{
                        isTimeExpired:true,
                        publisherRequest:[]
                    }
                }    
            )
            .then(async result=>{
                await PublisRideHistory.create({
                    publisherId:request.params.publisherId,
                    publishRideId:publish._id,
                    booker:publish.historyOfUser 
                });
            })
            .catch(err=>{
                return response.status(500).json(err);
            });
        }
    }
};


//here get all publish rides of particular user
exports.getPublishRidesOfSingle= async (request, response) => {
    await PublishRide.find({publisherId: request.params.publisherId,isBooked:false,rideDate:{$gt:Date.now()},isCancelled:false})
    .populate("publisherRequest").populate("fromId").populate("toId")
    .then((result) =>{
        return response.status(200).json(result);
    })
    .catch((err) => {
        return response.status(500).json(err);
    });
    
};


//showing request to the publisher
exports.showRequestToThePublisher=(request, response)=> {
    console.log(request.params.rideId);
    console.log(request.params.publisherId);
    PublishRide.findOne({publisherId: request.params.publisherId,_id:request.params.rideId})
    .populate("publisherRequest").populate("fromId").populate("toId")
    .then(result=> {
        return response.status(200).json(result);
    })
    .catch(err=> {
        console.log(err)
        return response.status(500).json(err);
    });
};

//if publisher decline request of booker
exports.declineRequestOfBooker= (request, response) => {
    console.log(request.params.publisherId,request.params.bookerId)
    User.findOne({_id:request.params.bookerId})
    .then(async result=> {
        console.log(result.mobile);
        let otp = otpGenerator.generate({ lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
        var option = {
            authorization: 'HMWLTGXIS7nCxvJh9YN843qkoeE2PfrutlciFUZQm015bgRBzDUY4OltK0NwQnCWMk5ZGiDbIJjpPf2d',
            message:"Your Request For The Ride Is Declined Please Find Other Ride"
            , numbers: [result.mobile]
        }
        await fast2sms.sendMessage(option);

        PublishRide.findOne({publisherId:request.params.publisherId,_id:request.params.rideId})
        .then(answer => {
            console.log(answer.publisherRequest)
            answer.publisherRequest.pull(request.params.bookerId);
            answer.save()
            .then(async result => {
                await BookRide.deleteOne({bookerId:request.params.bookerId,publisherId:request.params.publisherId})
                .then(result => {
                    console.log(result);
                    return response.status(200).json(result);
                })
                .catch(err => {
                    console.log(error);
                    return response.status(500).json(err);
                });   
            })
            .catch(err=>{
                console.log(err);
                return response.status(500).json(err);
            });
        })
        .catch(error => {
            console.log(error);
            return response.status(500).json(error);
        });
    })
    .catch(err=> {
        return response.status(500).json(err);
    });
};

//if publisher accept booker request 
exports.acceptRequestOfBooker=async (request, response) => {
  let publishRider=await PublishRide.findOne({ publisherId: request.params.publisherId,_id:request.params.rideId}).populate("publisherId");
  let booker=await BookRide.findOne({bookerId: request.params.bookerId}).populate("bookerId");
  console.log("SEat Want  : "+booker.seatWant);
  console.log("Available : "+publishRider.seatAvailable);
  if(publishRider.seatAvailable>0)
  {
    PublishRide.updateOne({publisherId: request.params.publisherId,_id:request.params.rideId},
        {
            seatAvailable: publishRider.seatAvailable-booker.seatWant,
        }
    )
    .then( async result =>{
        let otp =otpGenerator.generate(4,{ lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
        var option = {
            authorization: 'HMWLTGXIS7nCxvJh9YN843qkoeE2PfrutlciFUZQm015bgRBzDUY4OltK0NwQnCWMk5ZGiDbIJjpPf2d',
            message:"Your request for the ride is accepted and your OTP for the ride is "+otp+". Show this OTP to your publisher to start the ride. Publisher detail - Name : "+publishRider.name+" , Mobile : "+publishRider.mobile+",Vehcile Number :  "+publishRider.publisherId.vehicle.number
            , numbers: [booker.bookerId.mobile]
        }
        await fast2sms.sendMessage(option);

        let tempOtp={
            bookerId: request.params.bookerId,
            otpNumber:otp
        }

        await PublishRide.updateOne({publisherId: request.params.publisherId},
            {
                otp:tempOtp
            }    
        ).then().catch(err=>{
            console.log(err);
        });

        await BookRide.updateOne({bookerId:request.params.bookerId},
        {
            publisherId: request.params.publisherId,
            totalAmount:booker.seatWant*publishRider.amountPerPerson,
            isAccepted:true
        }).then().catch(err=>{
            console.log(err);
        });

        await publishRider.updateOne({publisherId:request.params.publisherId},
            {
                totalAmount:booker.seatWant*publishRider.amountPerPerson+publishRider.totalamount
        }).then().catch(err=>{
            console.log(err);
        });

        if(publishRider.seatAvailable>0)
        {
            let result=await PublishRide.findOne({publisherId:request.params.publisherId,_id:request.params.rideId});
            result.historyOfUser.push(request.params.bookerId);
            result.save();

            result=await PublishRide.findOne({publisherId:request.params.publisherId,_id:request.params.rideId});
            result.publisherRequest.pull(request.params.bookerId);
            result.save();

            publishRider=await PublishRide.findOne({ publisherId: request.params.publisherId,_id:request.params.rideId}).populate("publisherId");
            if(publishRider.seatAvailable<=0)
            {
                // PublishRide.updateOne({publisherId:request.params.publisherId},
                //     {
                //         $set:{
                //             isBooked:true,
                //             publisherRequest:[]
                //         }
                //     }    
                // )
                // .then(result=>{
                //     return response.status(200).json({msg:"Your ride is confirmed with "+booker.bookerId.name});
                // })
                // .catch(err=>{
                //     return response.status(500).json(err);
                // });

                await PublishRide.updateOne({publisherId:request.params.publisherId},
                    {
                        $set:{
                            isBooked:true,
                            publisherRequest:[]
                        }
                    }    
                )
                .then(async result=>{
                    await PublisRideHistory.create({
                        publisherId:request.params.publisherId,
                        publishRideId:publishRider._id,
                        booker:publishRider.historyOfUser 
                    });
                })
                .catch(err=>{
                    return response.status(500).json(err);
                });
            }
        }   
        return response.status(200).json({msg:"Your ride is confirmed with "+booker.bookerId.name}); 
    })
    .catch(err =>{
        console.log(err);
        return response.status(500).json(err);
    });
  }
};


//showing all accept user by publisher
exports.showAllAcceptRequestByPublisher= (request, response) => {
    PublishRide.findOne({publisherId: request.params.publisherId})
    .populate("otp.bookerId")
    .then(result => {
        console.log(result)
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


//match otp which provide by user to the publisher
exports.matchOtp= async (request, response) => {
    var status=false;
    var publisher=await PublishRide.findOne({publisherId: request.body.publisherId});
    var bookerId;
    var id;
    for(var i=0;i<publisher.otp.length;i++) {
        t=parseInt(request.body.otp);
        if(t==publisher.otp[i].otpNumber)
        {
            status=true;
            bookerId=publisher.otp[i].bookerId;
            id=publisher.otp[i]._id;
            break;
        }
    }

    if(status){
        publisher.otp.pull(id);
        publisher.save()
        .then(async result=>{
            await BookerHistory.findOne({bookerId:bookerId})
            .then(bh =>{
                if(!bh){
                    bh=new BookerHistory();
                    bh.bookerId=bookerId;
                }
                bh.publisherId.push(request.body.publisherId);
                bh.save()
                .then(async result=>{
                    console.log("enter 2")
                    console.log(request.params.publierId);
                    console.log(bookerId);
                    await BookRide.deleteOne({_id:request.body.id});
                }).catch(err=>{
                    console.log(err);
                });
            }).catch((err)=>{

            });

            // await PublisherHistory.findOne({publisherId:request.body.publisherId,_id:request.body.rideId})
            // .then(ph =>{
            //     if(!ph){
            //         ph=new PublisherHistory();
            //         ph.publisherId=request.body.publisherId;  
            //     }
            //     ph.bookerId.push(bookerId);
            //     ph.save().then(result=>{
            //     }).catch(err=>{
            //         console.log(err);
            //     });
            // });

            return response.status(200).json({msg:"Success"});
        })
        .catch(error=>{
            console.log(error);
            return response.status(500).json(error);
        });
    }
};
 


//if publisher cancel ride
exports.cancelRide= async (request, response) => {
    let pr=await PublishRide.findOne({ publisherId: request.params.publisherId,_id: request.params.rideId}).populate("publisherRequest");

    let temp=[];
    let status=false;
    publisherRequest=pr.publisherRequest;
    for(let i=0; i<publisherRequest.length; i++) {
        temp[i]=publisherRequest[i].mobile;
    }

    await PublishRide.updateOne({publisherId:request.params.publisherId,_id:request.params.rideId},
        {
            $set:{
                isCancelled:true,
                publisherRequest:[]
            }
        }    
    )
    .then(()=>{})
    .catch(error=>{
        console.error(error);
    });

    for(var i;i<publisherRequest.length;i++){
        await BookRide.deleteOne({bookerId:publisherRequest[i]._id,publisherId:request.params.publisherId})
        .then(()=>{
            status=true;
        })
        .catch(err=>{
            console.error(err);
        });
    }
    let otp =otpGenerator.generate(4,{ lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
    var option = {
        authorization: 'HMWLTGXIS7nCxvJh9YN843qkoeE2PfrutlciFUZQm015bgRBzDUY4OltK0NwQnCWMk5ZGiDbIJjpPf2d',
        message:"Your Request Cancelled By Publisher , PLease find onother ride .  Sorry for your inconvenience.."
        , numbers: [temp]
    }
    await fast2sms.sendMessage(option);

    if(status)
        return response.status(200).json({msg:"cancel"});
};

//Here we fetch particular ride
exports.getParticualRideRequest= (request, response) => {
    PublishRide.findOne({_id:request.params.id})
    .populate("publisherId").populate("fromId").populate("toId")
    .then(result=>{
        return response.status(200).json(result);
    })
    .catch(err => {
        return response.status(500).json(err);
    });
};


//all rides for booker according to date
exports.getRidesForBooker= (request, response) => {
    totalRides=[];
    PublishRide.find({fromId:request.body.from,toId:request.body.to})
    .populate("publisherId").populate("fromId").populate("toId")
    .then((rides) => {
        if(rides.length>0)
        {
            statusRide=false;
            let d = new Date( rides[0].rideDate );
            date = d.toDateString();

            for(let i = 0; i <rides.length;i++) {
                if(date==new Date(request.body.date).toDateString() && rides[i].seatAvailable>=request.body.seat) {
                    statusRide =true;
                    totalRides[i]=rides[i];
                }
            }

            if(statusRide)
                return response.status(200).json(totalRides);
        }
        return response.status(200).json(totalRides);
    })
    .catch(err => {
        console.log(err);
        return response.status(500).json(err);
    });
};


exports.bookerCancelRide= (request, response)=>{

};
