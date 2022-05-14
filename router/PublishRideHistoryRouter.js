const express=require('express');
const router = express.Router();
const publishRideController = require("../controller/PublishRideHistoryController");

router.get("/viewpublisherhistory/:publisherId", publishRideController.viewPublisherHistory);


module.exports =router;