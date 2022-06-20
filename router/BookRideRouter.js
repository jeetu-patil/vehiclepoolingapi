const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const jwtAuth=require("../Authentication/Authenticate");
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",jwtAuth.tokenauthotication,
         body("bookerId").notEmpty(),
          body('rideId').notEmpty(),
          body("seatWant").notEmpty(),
          bookRiderController.bookRide);

router.post("/iscancelled",jwtAuth.tokenauthotication,
 body("Id").notEmpty(),bookRiderController.isCancelled);
router.post("/isaccepted",jwtAuth.tokenauthotication,body("Id"),bookRiderController.isAccepted);
router.post("/getbookrides",jwtAuth.tokenauthotication,body("bookerId").notEmpty(),bookRiderController.getBookRides);

    
module.exports =router;