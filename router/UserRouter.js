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
router.post("/signup",
    body("name").notEmpty(),
    body("email").isEmail().notEmpty(),
    body("password","password minimum length must be 6").isLength(6).notEmpty(),
    body("age").isNumeric(),
    body("aadhar").isLength(12),
    userController.signUp);
router.get("/verify-email/:id",userController.verifyEmail);

router.post("/signin",
    body("email").isEmail().notEmpty(),
    userController.signIn);


router.post("/edit-profile",
body("name").notEmpty(),
body("age").notEmpty().isNumeric(),
userController.editProfile);

router.get("/verify-mobile/:mobile/:userId",
userController.verifyMobile);

router.get("/verifymobile/:mobile",userController.confirmMobileVerification);

router.post("/loginwithgoogle",userController.loginWithGoogle);

router.get("/getuser/:id",userController.singleUser);

router.post("/addcomment", userController.addComment);

module.exports = router;