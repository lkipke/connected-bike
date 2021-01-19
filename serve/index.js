const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const sendPing = require('./routes/sendPing');
const login = require('./routes/login');
const user = require('./routes/user');
const { requiresAuth } = require('./util/auth');

// first, load up our environment
const dotenvResult = dotenv.config({
    path: path.join(__dirname, '.env'),
});

if (dotenvResult.error) {
    throw dotenvResult.error;
}

const app = express();
const port = 9000;

// middleware
app.use();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(requiresAuth());

// register routes
app.use('/api/sendPing', sendPing);
app.use('/api/login', login);
app.use('/api/user', user);

// static react app
app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.listen(port);
