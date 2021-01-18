const express = require('express');
const { Pool } = require('pg');
const format = require('pg-format');
const crypto = require('crypto');

const router = express.Router();

let generateSessionToken = () => {
		return crypto.randomBytes(30).toString('hex');
}

router.get('/', function (req, res, next) {
		let token = generateSessionToken();
    res.cookie('AuthToken', token, {
	    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
			httpOnly: true,
			signed: true
		});

    res.sendStatus(200);
});

module.exports = router;
