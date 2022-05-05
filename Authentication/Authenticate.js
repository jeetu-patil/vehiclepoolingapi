
const jwt = require('jsonwebtoken');
exports.tokenauthotication = (req, res, next) => {
    
    try {
        if(!req.headers.authorization)
            return res.status(401).send("Undifind Sign In")
            else
        if(req.headers.authorization == null)
            return res.status(401).send(" NULL Sign In");

         token = req.headers.authorization;

         payload = jwt.verify(token,"ramaramaramasiyaramasiyaramaramaramaramaramramramramram");
        console.log("in payLoad "+payload);
        next();
    }
    catch(err) {
        console.log(" IN Catch block"+err);
        return res.status(401).send("Sign In");
    }
}