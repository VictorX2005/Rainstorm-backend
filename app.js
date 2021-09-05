const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
app = express();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, function (req, res) {
    console.log(`Listening on Port: ${PORT}`);
})