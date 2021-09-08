const express = require('express');
const mongoose = require('mongoose');
router = express.Router();
const UserModel = require("../models/user.model");
users = require("../controllers/users");
var nodemailer = require("nodemailer");


// BCRYPT setup
const bcrypt = require('bcrypt');
const saltRounds = 10;

// FUNCTIONS

// sending email with nodemail
var transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: "devderekhsieh@gmail.com", 
        pass: process.env.EMAILPASS
    }
})

function sendVerificationEmail(recipient, verificationHash) {
    
    var mailOptions = {
        from: "devderekhsieh@gmail.com", 
        to: recipient,
        subject: "Verify Your Account by clicking the link below",
        html: '<p>Click <a href="http://localhost:3000/api/users/verify/' + verificationHash + '">here</a> to verify your account.</p>'
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err)
        } else {
            console.log("email sent: " + info.response);
        }
    })


}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

router.get('/', function(req,res) {
    UserModel.find({}, function(err, users) {
        if(err) {
            console.log(err);
        } else {
            res.send(users);
        }
    })
});

router.get("/:email", function(req,res) {
    UserModel.find({email: req.params.email}, function(err, users) {
        res.send(users);
    })
})

router.get("/verify/:verificationHash", function(req, res) {
    UserModel.findOneAndUpdate({verificationHash: req.params.verificationHash}, {isVerified: true}, (err, data) => {
        if(err) {
            console.log(err);
        } else {
            console.log(data);
            res.send("Successfully verified your account!");
        }
    })
}) 

router.post('/', function(req,res) {
    // check if user exists 

    UserModel.find({username: req.body.username}, function(err, users) {
        if(users[0]) {
            console.log(users);
            res.send("Username already exists. Please pick a unique username");
            
        } else {
            UserModel.find({email: req.body.email}, function(err, users) {
                if(users[0]) {
                    res.send("There is already a user with that email address. Please sign in instead.");
                } else {
                    // sign up user logic 

                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            if(err) {
                                console.log(err)
                            } else {
                                var email = validateEmail(req.body.email);
                                var verificationHash = makeid(12);
                                const newUser = new UserModel({
                                    username: req.body.username.toLowerCase(),
                                    email: email,
                                    password: hash,
                                    isVerified: false, 
                                    verificationHash: verificationHash
                                })
                                newUser.save();
                                res.json(newUser);
                                sendVerificationEmail(newUser.email, verificationHash);
                            }
                        })
                    })
                }
            }) 
        }
    })

   



})

// authentication 

/// TODO: implement warning messages: "password incorrect", "cant find user linked to this email"
router.post('/:email/:password', function(req,res) {
    UserModel.find({email: req.params['email']}, function(err, user) {

        // check if user in array exists;
        if(user[0]) {
            
            const hash = user[0].password;

            bcrypt.compare(req.params.password, hash, function(err, result) {
                if(err) {
                    console.log(err)
                } else {
                    if(result) {
                        // correct
                        res.send("Success! Logging you in...");
                    } else {
                        // wrong password
                        res.send("Password was incorrect, please try again.");
                    }
                }
                
            });
        } else {
            res.send("There is no user with that email. Please sign up.");
        }
    }) 
})

router.get("/:email/:password", function (req, res) {
    res.send(req.params.username);
})



module.exports = router;