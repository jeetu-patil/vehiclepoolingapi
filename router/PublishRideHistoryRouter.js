const express=require('express');
const { body } = require('express-validator');
const router = express.Router();
const publishRideController = require("../controller/PublishRideHistoryController");     

router.post("/viewpublisherhistory",body("rideId").notEmpty(),publishRideController.viewPublisherHistory);
router.post("/publishhistiry",body("publisherId").notEmpty(), publishRideController.publishHistory);

module.exports =router;