const express=require('express');
const router = express.Router();
const placeController=require("../controller/PlaceController");


router.post("/addplace",placeController.addPlace);


module.exports =router;



