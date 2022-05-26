const express=require('express');
const router=express.Router();
const adminController=require("../controller/AdminController");
const jwtAuth=require('../Authentication/Authenticate');
const {body} = require("express-validator");

router.post("/signin", 
body("email").isEmail().notEmpty(),
body("password","password minimum length must be 6").isLength(6).notEmpty(),
adminController.signin);

router.get("/published-rides",jwtAuth.tokenauthotication,adminController.allPublishRidesForUser);

router.get("/booked-rides",jwtAuth.tokenauthotication,adminController.bookRides);

router.get("/user-list",jwtAuth.tokenauthotication,adminController.userList);

// router.get("/publisher-cancelled-rides",adminController.publisherCancelledRides);

module.exports =router;





