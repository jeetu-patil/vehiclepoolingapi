const express=require("express");
const router = express.Router();
const {body} = require("express-validator");
const publishController = require("../controller/PublishRideController");

const multer=require('multer');

const storage=multer.diskStorage({
    destination:'public/images',
    filename:(request,file,cb)=>{
        cb(null,Date.now()+'_'+file.originalname);
    }
});
const upload=multer({storage:storage});


router.get("/checkuserride/:id",publishController.checkUserRidePublish);
router.post("/firstpublishride",upload.array("image"),publishController.firstPublishRide);
router.post("/publishride",publishController.publishRide);


module.exports =router;