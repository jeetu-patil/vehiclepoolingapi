const express=require('express');
const router=express.Router();
const adminController=require("../controller/AdminController");
const {body} = require("express-validator");

router.post("/signin", 
body("email").isEmail().notEmpty(),
body("password","password minimum length must be 6").isLength(6).notEmpty(),
adminController.signin);

router.get("/published-rides",adminController.publishedRides);

router.get("/booked-rides",adminController.bookRides);

module.exports =router;





