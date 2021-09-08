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

function sendVerificationEmail(recipient) {
    var mailOptions = {
        from: "devderekhsieh@gmail.com", 
        to: recipient,
        subject: "Verify Your Account by clicking the link below",
        text: "google.com"
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err)
        } else {
            console.log("email sent: " + info.response);
        }
    })
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
                                const newUser = new UserModel({
                                    username: req.body.username,
                                    email: req.body.email,
                                    password: hash
                                })
                                newUser.save();
                                res.json(newUser);
                                sendVerificationEmail(newUser.email);
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