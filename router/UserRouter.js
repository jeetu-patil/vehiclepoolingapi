const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const {body} = require("express-validator");
const multer = require("multer");

var storage = multer.diskStorage(
    {
       destination : 'public/images',
       filename : function (req,file,cb){
           cb(null,Date.now()+"-"+file.originalname);
       }
    }
);
var upload = multer({storage : storage});
router.post("/signup",userController.signUp);
    // body("name").notEmpty(),
    // body("email").isEmail().notEmpty(),
    // body("password","password minimum length must be 6").isLength(6).notEmpty(),
    // body("mobile").isMobilePhone().notEmpty(),
    // body("age").isNumeric(),
    // body("gender")
    // )
router.get("/verify-account/:id",userController.verify);

router.post("/signin",userController.signIn);

router.get("/view-profile/:id",userController.viewProfile);

router.post("/edit-profile",userController.editProfile);

module.exports = router;