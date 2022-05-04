const express=require('express');
const router=express.Router();
const adminController=require("../controller/AdminController");



router.get("/signin", adminController.signin);



module.exports =router;





