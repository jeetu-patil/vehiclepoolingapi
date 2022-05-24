const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const jwtAuth=require("../Authentication/Authenticate");
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",body("bookerId").notEmpty(),
          body('rideId').notEmpty(),
          body("seatWant").notEmpty(),jwtAuth.tokenauthotication,
          bookRiderController.bookRide);

router.post("/iscancelled",
 body("Id").notEmpty(),bookRiderController.isCancelled);
router.post("/isaccepted",body("Id"),bookRiderController.isAccepted);
router.post("/getbookrides",body("Id").notEmpty(),bookRiderController.getBookRides);

    
module.exports =router;