const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
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
  body("id").notEmpty(),
  publishController.checkUserRidePublish
);

//if it is first ride then he/she fill some detail one time
router.post("/firstpublishride",upload.single("image"),
            body("name").notEmpty(),
            body("number").notEmpty(),
            body("wheeler").notEmpty(),
            body("userId").notEmpty(),
        publishController.firstPublishRide);

//here publisher pusblish ride
router.post(
  "/publishride",
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
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.showRequestToThePublisher
);

//if publisher decline request of booker
router.post(
  "/declinerequestofbooker",
  body("bookerId").notEmpty(),
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.declineRequestOfBooker
);

//if publisher accept booker request
router.post(
  "/acceptrequestofbooker",
  body("bookerId").notEmpty(),
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  body("bookRideId").notEmpty(),
  publishController.acceptRequestOfBooker
);

//if publisher cancelled ride
router.post(
  "/cancellride",
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.cancelRide
);

//Particular ride request
router.post(
  "/particualride",
  body("id").notEmpty(),
  publishController.getParticualRideRequest
);

//all rides for booker according to date
router.post(
  "/ridesforbooker",
  body("from").notEmpty(),
  body("to").notEmpty(),
  publishController.getRidesForBooker
);

//showing all accept user by publisher
router.post(
  "/showallacceptrequestbypublisher",
  body("publisherId").notEmpty(),
  body("rideId").notEmpty(),
  publishController.showAllAcceptRequestByPublisher
);

//match otp which provide by booker to the publisher
router.post(
  "/matchotp",
  body("id").notEmpty(),
  body("rideId").notEmpty(),
  body("otp").notEmpty(),
  body("publisherId").notEmpty(),
  publishController.matchOtp
);

//here get all publish rides of particular user
router.post(
  "/getPublishRidesOfSingle",
  body("publisherId").notEmpty(),
  publishController.getPublishRidesOfSingle
);

//if booker cancel ride
router.post(
  "/cancelridebybooker",
  body("bookerId").notEmpty(),
  body("rideId").notEmpty(),
  body("publisherId").notEmpty(),
  body("bookRideId").notEmpty(),
  publishController.cancelRideByBooker
);

module.exports = router;
