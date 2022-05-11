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
router.get("/checkuserride/:id",publishController.checkUserRidePublish);

//if it is first ride then he/she fill some detail one time
router.post("/firstpublishride",upload.single("image"),publishController.firstPublishRide);

//here publisher pusblish ride
router.post("/publishride",publishController.publishRide);

//here booker request to the publisher
router.post("/requestforpublisher",publishController.requestForPublisher);

//here we display all available publisher
router.get("/publisherforuser",publishController.allPublishRidesForUser);

//showing request to the publisher
router.get("/showrequesttopublisher/:publisherId",publishController.showRequestToThePublisher);

//if publisher decline request of booker
router.get("/declinerequestofbooker/:bookerId/:publisherId",publishController.declineRequestOfBooker);

//if publisher accept booker request 
router.get("/acceptrequestofbooker/:bookerId/:publisherId",publishController.acceptRequestOfBooker);

//if publisher cancelled ride
router.get("/cancellride",publishController.cancelRide);


//Particular ride request
router.get("/particualride/:id",publishController.getParticualRideRequest);


//all rides for booker according to date
router.post("/ridesforbooker",publishController.getRidesForBooker);

module.exports =router;