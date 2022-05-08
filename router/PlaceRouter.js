const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const placeController=require("../controller/PlaceController");


router.post("/addplace",placeController.addPlace);
router.get("/getallplace",placeController.getAllPlaces)


module.exports =router;



