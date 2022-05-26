const express=require('express');
const { body } = require('express-validator');
const router = express.Router();
const jwtAuth=require('../Authentication/Authenticate')
const publishRideController = require("../controller/PublishRideHistoryController");     

router.post("/viewpublisherhistory",jwtAuth.tokenauthotication,body("rideId").notEmpty(),publishRideController.viewPublisherHistory);
router.post("/publishhistiry",jwtAuth.tokenauthotication,body("userId").notEmpty(), publishRideController.publishHistory);

module.exports =router;