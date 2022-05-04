const express=require('express');
const router = express.Router();
const bookRiderController=require('../controller/BookRiderController');


router.post("/book",bookRiderController.bookRide);



module.exports =router;