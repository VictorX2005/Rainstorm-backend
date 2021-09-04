const express = require('express');
app = express();

require('dotenv').config();
app.set('view engine', 'ejs');
app.use("/", require("./routes/hello"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, function (req, res) {
    console.log(`Listening on Port: ${PORT}`);
})