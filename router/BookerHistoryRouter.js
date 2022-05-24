const express=require("express");
const router = express.Router();
const {body}=require('express-validator');
const bookHistoryController = require("../controller/BookerHistoryController");
const jwtAuth=require("../Authentication/Authenticate");
router.post("/viewbookerhistory",
   body("bookerId").notEmpty(),
   bookHistoryController.viewBookerHistory);


module.exports =router;