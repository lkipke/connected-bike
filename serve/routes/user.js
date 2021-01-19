const express = require('express');
const router = express.Router();

router.get('/', async function (req, res, next) {
    if (req.user) {
        return res.status(200).json(req.user);
    }
    return res.status(401);
});

module.exports = router;
