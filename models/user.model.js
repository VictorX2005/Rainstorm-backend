const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    username: String, 
    email: String, 
    password: String, 
    posts: [String], 
    profile_img: String,
    isVerified: Boolean, 
    verificationHash: String
})

var UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;