// const {res,req}=require('express');
const jwt = require('jsonwebtoken');
exports.tokenauthotication = (req, res, next) => {
    // console.log("this is error in req on token"+req.headers.authorization);
    try {
        if(!req.headers.authorization)
            return res.status(401).send("Undifind Sign In")
            else
        if(req.headers.authorization == null)
            return res.status(401).send(" NULL Sign In");

         token = req.headers.authorization;

         payload = jwt.verify(token,"ramramramsiyaramsiyaramramramramramramramramram");
        console.log("in payLoad "+payload);
        next();
    }
    catch(err) {
        console.log(" IN Catch block"+err);
        return res.status(401).send("Sign In");
    }
}