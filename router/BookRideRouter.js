const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",bookRiderController.bookRide);



module.exports =router;