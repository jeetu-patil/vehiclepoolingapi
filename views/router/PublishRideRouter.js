const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const jwtAuth = require("../Authentication/Authenticate");
const publishController = require("../controller/PublishRideController");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "public/images",
  filename: (request, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });

//check it is first ride or not
router.post(
  "/checkuserride",
  jwtAuth.tokenauthotication,
  body("id").notEmpty(),
  publishController.checkUserRidePublish
);

//if it is first ride then he/she fill some detail one time
router.post(
  "/firstpublishride",
  jwtAuth.tokenauthotication,
  upload.single("image"),
  body("name").notEmpty(),
  body("number").notEmpty(),
  body("wheeler").notEmpty(),
  body("userId").notEmpty(),
  publishController.firstPublishRide
);

//here publisher pusblish ride
router.post(
  "/publishride",
  jwtAuth.tokenauthotication,
  body("rideTime").notEmpty(),
  body("rideDate").notEmpty(),
  body("publisherId").notEmpty(),
  body("fromId").notEmpty(),
  body("toId").notEmpty(),
  body("seatAvailable").notEmpty(),
  body("amountPerPerson").notEmpty(),
  publishController.publishRide
);

//here booker request to the publisher
router.post(
  "/requestforpublisher",
  jwtAuth.tokenauthotication,
  body("rideId").notEmpty(),
  body("bookRideId").notEmpty(),
  body("bookerId").notEmpty(),
  publishController.requestForPublisher
);

//here we display all available publisher
router.get("/publisherforuser", publishController.allPublishRidesForUser);

//showing request to the publisher
router.post(
  "/showrequesttopublisher",
  jwtAuth.tokenauthotication,
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.showRequestToThePublisher
);

//if publisher decline request of booker
router.post(
  "/declinerequestofbooker",
  jwtAuth.tokenauthotication,
  body("bookerId").notEmpty(),
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.declineRequestOfBooker
);

//if publisher accept booker request
router.post(
  "/acceptrequestofbooker",
  jwtAuth.tokenauthotication,
  body("bookerId").notEmpty(),
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  body("bookRideId").notEmpty(),
  publishController.acceptRequestOfBooker
);

//if publisher cancelled ride
router.post(
  "/cancellride",
  jwtAuth.tokenauthotication,
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.cancelRide
);

//Particular ride request
router.post(
  "/particualride",
  jwtAuth.tokenauthotication,
  body("id").notEmpty(),
  publishController.getParticualRideRequest
);

//all rides for booker according to date
router.post(
  "/ridesforbooker",
  jwtAuth.tokenauthotication,
  body("from").notEmpty(),
  body("to").notEmpty(),
  publishController.getRidesForBooker
);

//showing all accept user by publisher
router.post(
  "/showallacceptrequestbypublisher",
  jwtAuth.tokenauthotication,
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.showAllAcceptRequestByPublisher
);

//match otp which provide by booker to the publisher
router.post(
  "/matchotp",
  jwtAuth.tokenauthotication,
  body("id").notEmpty(),
  body("rideId").notEmpty(),
  body("otp").notEmpty(),
  body("publisherId").notEmpty(),
  publishController.matchOtp
);

//here get all publish rides of particular user
router.post(
  "/getPublishRidesOfSingle",
  jwtAuth.tokenauthotication,
  body("publisherId").notEmpty(),
  publishController.getPublishRidesOfSingle
);

//if booker cancel ride
router.post(
  "/cancelridebybooker",
  jwtAuth.tokenauthotication,
  body("bookerId").notEmpty(),
  body("rideId").notEmpty(),
  body("publisherId").notEmpty(),
  body("bookRideId").notEmpty(),
  publishController.cancelRideByBooker
);

//if booker not reach then publisher cancel that booker
router.post(
  "/cancelbooker",
  jwtAuth.tokenauthotication,
  body("bookRideId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.cancelBooker    
);

module.exports = router;
     