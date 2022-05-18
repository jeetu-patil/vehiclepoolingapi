const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const jwtAuth=require("../Authentication/Authenticate");
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",jwtAuth.tokenauthotication,bookRiderController.bookRide);
router.get("/iscancelled/:Id",jwtAuth.tokenauthotication,bookRiderController.isCancelled)
router.get("/isaccepted/:Id",jwtAuth.tokenauthotication,bookRiderController.isAccepted);
router.get("/getbookrides/:bookerId",bookRiderController.getBookRides);


module.exports =router;