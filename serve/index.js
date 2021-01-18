const { Pool } = require('./utils/Pool');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const sendPing = require('./routes/sendPing');
const login = require('./routes/login');

const app = express();
const port = 9000;

// middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(function async (req, res, next) {
		try {
			let results = await Pool.query();
		}

	  if (err.name === 'UnauthorizedError') {
	  	res.status(401).send('invalid token...');
		}
}).unless(path: ["/"]);

// register routes
app.use('/api/sendPing', sendPing);
app.use('/api/login', login);

// static react app
app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);
