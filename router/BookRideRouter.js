const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const jwtAuth=require("../Authentication/Authenticate");
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",jwtAuth.tokenauthotication,bookRiderController.bookRide);
router.get("/iscancelled/:Id",bookRiderController.isCancelled)
router.get("/isaccepted/:Id",bookRiderController.isAccepted);
router.post("/getbookrides",bookRiderController.getBookRides);


module.exports =router;