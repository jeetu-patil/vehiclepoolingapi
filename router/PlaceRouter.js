const express=require('express');
const router = express.Router();
const {body} = require("express-validator");
const placeController=require("../controller/PlaceController");
const csv = require("csvtojson");
const multer = require("multer");
const Place = require('../model/Place');

var storage = multer.diskStorage(
    {
       destination : 'public/images',
       filename : function (req,file,cb){
           cb(null,Date.now()+"-"+file.originalname);
       }
    }
);
var upload = multer({storage : storage});
router.post("/addplace",placeController.addPlace);
router.get("/getallplace",placeController.getAllPlaces);
router.post("/add-csv",upload.single("file"),(req,res)=>{
    csv().fromFile(req.file.path).then(json=>{
        // console.log(json);
      Place.insertMany(json).then((result) => {
          return res.status(200).json(result);
      }).catch((err) => {
        return res.status(500).json(err);
      });
    }).catch(err=>{
        
    })
});


module.exports =router;



