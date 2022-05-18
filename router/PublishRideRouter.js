const express=require("express");
const router = express.Router();
const {body} = require("express-validator");
const publishController = require("../controller/PublishRideController");

const multer=require('multer');

const storage=multer.diskStorage({
    destination:'public/images',
    filename:(request,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
});
const upload=multer({storage:storage});

//check it is first ride or not
router.post("/checkuserride",publishController.checkUserRidePublish);

//if it is first ride then he/she fill some detail one time
router.post("/firstpublishride",upload.single("image"),publishController.firstPublishRide);

//here publisher pusblish ride
router.post("/publishride",publishController.publishRide);

//here booker request to the publisher
router.post("/requestforpublisher",publishController.requestForPublisher);

//here we display all available publisher
router.get("/publisherforuser",publishController.allPublishRidesForUser);

//showing request to the publisher
router.post("/showrequesttopublisher",publishController.showRequestToThePublisher);

//if publisher decline request of booker
router.get("/declinerequestofbooker/:bookerId/:publisherId/:rideId",publishController.declineRequestOfBooker);

//if publisher accept booker request 
router.get("/acceptrequestofbooker/:bookerId/:publisherId/:rideId/:bookRideId",publishController.acceptRequestOfBooker);

//if publisher cancelled ride
router.get("/cancellride/:publisherId/:rideId",publishController.cancelRide);



//Particular ride request
router.post("/particualride",publishController.getParticualRideRequest);


//all rides for booker according to date
router.post("/ridesforbooker",publishController.getRidesForBooker);



//showing all accept user by publisher
router.get("/showallacceptrequestbypublisher/:publisherId/:rideId",publishController.showAllAcceptRequestByPublisher);



//match otp which provide by booker to the publisher
router.post("/matchotp",publishController.matchOtp);


//here get all publish rides of particular user
router.post("/getPublishRidesOfSingle",publishController.getPublishRidesOfSingle);


//if booker cancel ride
router.get("/cancelridebybooker/:bookerId/:rideId/:publisherId/:bookRideId",publishController.cancelRideByBooker);


module.exports =router;