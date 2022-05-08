const express=require("express");
const router = express.Router();
const publisherHistoryController = require("../controller/publisherHistoryController");


router.get("/viewpublisherhistory/:publisherId", publisherHistoryController.viewPublisherHistory);

module.exports =router;