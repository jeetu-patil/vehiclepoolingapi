const User = require("../model/User");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const cloudinary=require("cloudinary");
const config = require('config');
const otpGenerator = require('otp-generator');
const fast2sms = require("fast-two-sms");
const Vonage = require('@vonage/server-sdk');
let jwt = require("jsonwebtoken");
var key = "password";
var algo = "aes256";

const vonage = new Vonage({
  apiKey: "484720a0",
  apiSecret: "Sl8CTRxULvNNSRjN"
})


cloudinary.config({ 
    cloud_name: 'dfhuhxrw3', 
    api_key: '212453663814245', 
    api_secret: 'zzSd8ptSYG-MS7hRnE-Ab46Bmts' 
  });


exports.signUp = (request, response) => {

    if(request.body.user)
        return response.status(500).json({msg:"error"});

    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(500).json({ errors: errors.array() });

    var cipher = crypto.createCipher(algo, key);
    var encrypted =
        cipher.update(request.body.password, "utf8", "hex") + cipher.final("hex");

    const user = new User({
        name: request.body.name,
        email: request.body.email,
        password: encrypted,
        age: request.body.age,
        gender: request.body.gender,
        aadharCard: request.body.aadhar,
    });
    user.save()
        .then((result) => {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "vastram823@gmail.com",
                    pass: "fcv@1234",
                },
            });
            var message = {
                from: "vastram823@gmail.com",
                to: request.body.email,
                subject: "Confirm your account on Chalo saath chale",
                html:
                    '<p>Thanks for signing up with Book-Your-Meal! You must follow this link within 30 days of registration to activate your account:</p><a href= "http://localhost:3000/user/verify-email/' +
                    result._id +
                    '">click here to verify your account</a><p>Have fun, and dont hesitate to contact us with your feedback</p><br><p> The Book-Us-Meal Team</p><a href="https://book-your-meal.herokuapp.com/">book-your-meal.herokuapp.com/</a>'
            };

            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("SUCCESS===================================\n" + info);
                }
            });
            return response.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({ message: "Something went Wrong" });
        });
};

exports.verifyEmail = (request, response) => {
    User.updateOne(
        { _id: request.params.id },
        {
            $set: { isEmailVerified: true }
        }
    ).then((result) => {
            if (result.modifiedCount) {
                return response.render("confirm.ejs");
            }
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json(err);
        });
};

exports.verifyMobile =async (request,response)=>{
    let otp = otpGenerator.generate(4, { lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
    // var option = {
    //     authorization: 'HMWLTGXIS7nCxvJh9YN843qkoeE2PfrutlciFUZQm015bgRBzDUY4OltK0NwQnCWMk5ZGiDbIJjpPf2d',
    //     message: otp + " is your OTP to verify your phone number."
    //     , numbers: [request.params.mobile]
    // }
    const from = "RideSharely"
    const to = "91"+request.params.mobile
    const text = 'Your OTP is '+otp+" . PLease use this OTP to verify your mobile . Thankyou"
   await vonage.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    })
    // await fast2sms.sendMessage(option);
    User.updateOne({_id:request.params.userId},
        {
            mobile:request.params.mobile
        }    
    )
    .then(async result => {
        let a=await User.findOne({_id:request.params.userId});
        console.log(otp)
        return response.status(200).json({otp : otp,user:a});
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
    });
}

exports.loginWithGoogle= (request, response) => {
    User.findOne({email: request.body.email})
    .then(result=>{
        let payload = { subject: result._id };
        let token = jwt.sign(payload, "aabbccdd");
        return response.status(200).json({status: "Login Success",result: result,token: token});
    })
    .catch((err) => {
        return response.status(500).json(err);
    });
};


exports.signIn = (request, response) => {

    if(request.body.password && request.body.email)
        return response.status(500).json({msg:"error"});

    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array()});
    User.findOne({ email: request.body.email })
        .then((result) => {
            var decipher = crypto.createDecipher(algo, key);
            var decrypted =
                decipher.update(result.password, "hex", "utf8") +
                decipher.final("utf8");
                console.log(decrypted);
            if (result.isEmailVerified == true && result.isMobileVerified == true) {
                if (decrypted == request.body.password) {
                    let payload = { subject: result._id };
                    let token = jwt.sign(payload, "aabbccdd");
                    return response.status(200)
                        .json({
                            status: "Login Success",
                            result: result,
                            token: token
                        });
                }
                else
                    return response.status(401).json({ message: "Invalid Password" });
            }
            else
                return response.status(401).json({ message: "Please verify your accout first then login" });
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json(err);
        });
};

exports.editProfile = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())  
      return response.status(400).json({ errors: errors.array() });
    User.updateOne(
      { _id: request.body.userId },
      {
        $set: {
          name: request.body.name,
          age : request.body.age,
          gender : request.body.gender
        }
      }
    )
      .then((result) => {
        if (result.modifiedCount) {
          User.findOne({ _id: request.body.userId })
            .then((result) => {
              return response.status(202).json(result);
            })
            .catch((err) => {
              return response.status(500).json(err);
            });
        }
      })
      .catch((err) => {
        return response.status(500).json(err);
      });
};
  

exports.confirmMobileVerification= (request, response) => {
    User.updateOne({mobile: request.params.mobile},
        {
            isMobileVerified:true
        }    
    )
    .then(result=>{
        return response.status(200).json(result);
    })
    .catch((err) => {
        return response.status(500).json(err);
    });
};

exports.singleUser = (request, response) => {
    User.findOne({_id: request.params.id}).populate("comments.userId")
    .then((user) => {
        return response.status(200).json(user);
    })
    .catch((err) => {
        console.log(err);
        return response.status(500).json(err);
    });
};

exports.addComment=async (request, response) => {
    let comment={
        userId: request.body.userId,
        feedback: request.body.feedback,
    };
    let user=await User.findOne({_id: request.body.uId});  
    user.comments.push(comment);
    user.save()
    .then(result => {
        return response.status(200).json(result);
    })
    .catch(err =>{
        return response.status(500).json(err);
    });
};
exports.editProfileNMI = async (request, response) => {
    console.log(request.body.name);
    console.log(request.file);
    const errors = validationResult(request);
    if (!errors.isEmpty())  
      return response.status(400).json({ errors: errors.array() });
      let image="";
    if(request.file)
    { 
        var result=await cloudinary.v2.uploader.upload(request.file.path);
        image=result.url;
        console.log(image);
    }
    User.updateOne(
      { _id: request.body.userId },
      {
        $set: {
          name: request.body.name,
          miniBio : request.body.miniBio,
          image : image
        }
      })
      .then((result) => {
        if (result) {
            console.log(result);
            return response.status(200).json(result);
        }
        
        })
          
            .catch((err) => {
              return response.status(500).json(err);
            });
        }
    