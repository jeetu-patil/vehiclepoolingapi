const express=require('express');
const router = express.Router();
const publishRideController = require("../controller/PublishRideHistoryController");

router.get("/viewpublisherhistory/:rideId", publishRideController.viewPublisherHistory);
router.get("/publishhistiry/:publisherId", publishRideController.publishHistory);
router.post("/publishercancelhistory",publishRideController.publisherCancelHistory);

module.exports =router;