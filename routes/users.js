const express = require('express');
const mongoose = require('mongoose');
router = express.Router();
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

// authentication 

router.post('/:email/:password', function(req,res) {
    UserModel.find({email: req.params['email']}, function(err, user) {
        if(user != undefined ) {
            console.log(req.params.password)
            
            const hash = user[0].password;

            bcrypt.compare(req.params.password, hash, function(err, result) {
                if(err) {
                    console.log(err)
                } else {
                    res.send(result);
                }
                
            });
        }
    }) 
})

router.get("/:email/:password", function (req, res) {
    res.send(req.params.username);
})

module.exports = router;