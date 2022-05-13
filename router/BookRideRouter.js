const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",bookRiderController.bookRide);
router.get("/iscancelled/:Id",bookRiderController.isCancelled)
router.get("/isaccepted/:Id",bookRiderController.isAccepted);
router.get("/getbookrides/:bookerId",bookRiderController.getBookRides);


module.exports =router;