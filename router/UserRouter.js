const express = require("express");
const router = express.Router();
const jwtAuth=require('../Authentication/Authenticate');
const userController = require("../controller/UserController");
const { body } = require("express-validator");
const multer = require("multer");


var storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });
router.post(
  "/signup",
  body("name").notEmpty(),
  body("email").isEmail().notEmpty(),
  body("password", "password minimum length must be 6").isLength(6).notEmpty(),
  body("age").isNumeric(),
  body("aadhar").isLength(12),
  userController.signUp
);
router.post("/edit-profile",jwtAuth.tokenauthotication,
  upload.single("image"),
  body("name").notEmpty(),
  body("userId").notEmpty(),
  body("miniBio").notEmpty(),
  userController.editProfileNMI
);
router.post("/verify-email", body("id").notEmpty(),userController.verifyEmail);

router.post(
  "/signin",
  body("email").isEmail().notEmpty(),
  userController.signIn
);

var upload = multer({storage : storage});
router.post("/signup",
    body("name").notEmpty(),
    body("email").isEmail().notEmpty(),
    body("password","password minimum length must be 6").isLength(6).notEmpty(),
    body("age").isNumeric(),
    body("aadhar").isLength(12),
    userController.signUp);
    router.post("/edit-profile",upload.single("image"),body("name").notEmpty(),
    body("userId").notEmpty(),
    body("miniBio").notEmpty(),
    userController.editProfileNMI)
router.post("/verify-email",body("id").notEmpty(),userController.verifyEmail);

router.post("/signin",
    body("email").isEmail().notEmpty(),
    userController.signIn);



router.post(
  "/verify-mobile",
  body("mobile").notEmpty(),
  body("userId").notEmpty(),
  userController.verifyMobile
);

router.post(
  "/verifymobile",
  body("mobile").notEmpty(),
  userController.confirmMobileVerification
);

router.post("/loginwithgoogle", userController.loginWithGoogle);

router.post("/getuser", body("id").notEmpty(), userController.singleUser);

router.post("/addcomment",jwtAuth.tokenauthotication,
  body("userId").notEmpty(),
  body("uId").notEmpty(),
  body("feadback").notEmpty(),
  userController.addComment
);

module.exports = router;
