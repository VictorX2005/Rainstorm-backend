const mongoose = require("mongoose")

var userSchema = mongoose.Schema({
    username: String, 
    email: String, 
    password: String
})

var UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;