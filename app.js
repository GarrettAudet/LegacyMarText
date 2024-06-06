require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use('/client', require("./routes/client-router"));
app.use('/twilio', require("./routes/twilio-router"));

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.listen(port, () => console.log(`Listening on ${port}`));