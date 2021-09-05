const express = require('express');

router = express.Router();
const mongoose = require('mongoose');
const UserModel = require("../models/user.model");
users = require("../controllers/users");


// BCRYPT setup
const bcrypt = require('bcrypt');
const saltRounds = 10;






router.get('/', function(req,res) {
    UserModel.find({}, function(err, users) {
        if(err) {
            console.log(err);
        } else {
            res.send(users);
        }
    })
    //   const newUser = new UserModel({
    //       username: "devderekhsieh",
    //       email: "derekyhsieh@gmail.com",
    //       password: "foo11bar"
    //   });

    //   newUser.save();

    //   res.json(newUser);

});

router.post('/', function(req,res) {
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
            }
        })
    })
})

module.exports = router;