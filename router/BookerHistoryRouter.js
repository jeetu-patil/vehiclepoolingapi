const express=require("express");
const router = express.Router();
const bookHistoryController = require("../controller/BookerHistoryController");


router.get("/viewbookerhistory/:bookerId", bookHistoryController.viewBookerHistory);


module.exports =router;