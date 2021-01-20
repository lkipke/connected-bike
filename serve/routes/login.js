const express = require('express');
const crypto = require('crypto');
const { getHashedPassword } = require('../util/auth');
const { updateAuthToken, getUserFromUsernamePassword } = require('../queries');

const router = express.Router();

let generateSessionToken = () => {
    return crypto.randomBytes(30).toString('hex');
};

router.post('/', async function (req, res, next) {
    // parse login and password from headers
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [username, password] = Buffer.from(b64auth, 'base64')
        .toString()
        .split(':');

    if (!username || !password) {
        return res.status(403);
    }

    let user = null;
    try {
        let hashedPassword = getHashedPassword(password);
        let result = await getUserFromUsernamePassword(
            username,
            hashedPassword
        );
        user = result.rows[0];
        if (!user) {
            return res.status(404);
        }
    } catch (e) {
        console.error(e);
        return res.status(500);
    }

    let token = generateSessionToken();
    updateAuthToken(username, token);
    res.cookie('AuthToken', token, {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        httpOnly: true,
        signed: true,
    });
    res.status(200).json(user);
});

module.exports = router;
