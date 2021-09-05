const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// import users 
var userModel = require("./models/user.model");

// routers configuration
var usersRouter = require("./routes/users");

app = express();
app.use(express.json())

// mongodb configuration -> database uri is located in .env file
const uri = process.env.URI;
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// mongodb connection
mongoose.connect(uri);



mongoose.connection.on("connected", ()=> {
    console.log("Connected to MongoDB using MongooseJS");
});


app.set('view engine', 'ejs');
app.use("/", require("./routes/hello"))

// users 
app.use("/users", usersRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, function (req, res) {
    console.log(`Listening on Port: ${PORT}`);
})