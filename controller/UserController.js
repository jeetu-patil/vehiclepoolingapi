const User = require("../model/User");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const config = require('config');
let jwt = require("jsonwebtoken");
const exp = require("constants");
var key = "password";
var algo = "aes256";

exports.signUp = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty())
        return response.status(400).json({ errors: errors.array() });

    var cipher = crypto.createCipher(algo, key);
    var encrypted =
        cipher.update(request.body.password, "utf8", "hex") + cipher.final("hex");

    const user = new User({
        name: request.body.name,
        email: request.body.email,
        password: encrypted,
        mobile: request.body.mobile,
        age: request.body.age,
        gender: request.body.gender,
        aadharCard: "http://localhost:3000/images/" + request.file.filename,
    });
    user
        .save()
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
                    '<p>Thanks for signing up with Book-Your-Meal! You must follow this link within 30 days of registration to activate your account:</p><a href= "http://localhost:3000/user/verify-account/' +
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

            console.log(result);
            return response.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json({ message: "Something went Wrong" });
        });
};

exports.verify = (request, response) => {
    User.updateOne(
        { _id: request.params.id },
        {
            $set: { isEmailVerified: true }
        }
    )
        .then((result) => {
            if (result.modifiedCount) {
                return response.status(202).json({ message: "Your Account is verified . Now you can login" });
            }
        })
        .catch((err) => {
            console.log(err);
            return response.status(500).json(err);
        });
};


exports.signIn = (request, response) => {
    // const errors = validationResult(request);
    // if (!errors.isEmpty())
    //     return response.status(400).json({ errors: errors.array() });
    User.findOne({ email: request.body.email })
        .then((result) => {
            var decipher = crypto.createDecipher(algo, key);
            var decrypted =
                decipher.update(result.password, "hex", "utf8") +
                decipher.final("utf8");
            if (result.isEmailVerified == true) {
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
                    return response.status(202).json({ message: "Invalid Password" });
            }
            else
                return response.status(500).json({ message: "Please verify your accout first then login" });
        })
        .catch((err) => {
            console.log(err);
            return response.status(401).json(err);
        });
};

exports.viewProfile = (request,response)=>{
    User.findOne({_id : request.params.id}).then((result) => {
        return response.status(201).json(result);
    }).catch((err) => {
        return response.status(500).json(err);
    });
}

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
  
  




