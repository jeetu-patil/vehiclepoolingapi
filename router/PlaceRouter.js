const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const placeController=require("../controller/PlaceController");


router.post("/addplace",placeController.addPlace);


module.exports =router;



