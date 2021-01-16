const express = require('express');
const path = require('path');
const sendPing = require('./routes/sendPing');
const dotenv = require('dotenv');

const result = dotenv.config({
    path: path.join(__dirname, '.env'),
});

if (result.error) {
    throw result.error;
}

const app = express();
const port = 9000;

app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.json());
app.use('/sendPing', sendPing);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);
