const crypto = require('crypto');
const { getUserFromAuthToken } = require('../queries');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
};

function requiresAuth() {
    return async (req, res, next) => {
        if (!req.path.includes('/api/')) {
            return next();
        }

        let { AuthToken } = req.signedCookies;
        let user = null;
        try {
            let result = await getUserFromAuthToken(AuthToken);
            user = result.rows[0];
            if (!user) {
                res.sendStatus(401);
                return;
            }
        } catch (e) {
            res.sendStatus(500);
            return;
        }

        req.user = user;
        next();
    };
}

module.exports = { requiresAuth, getHashedPassword };
