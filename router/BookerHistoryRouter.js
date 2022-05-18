const express=require("express");
const router = express.Router();
const bookHistoryController = require("../controller/BookerHistoryController");
const jwtAuth=require("../Authentication/Authenticate");


router.get("/viewbookerhistory/:bookerId",bookHistoryController.viewBookerHistory);


module.exports =router;