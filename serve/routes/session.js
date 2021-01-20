const express = require('express');
const { startSession, endSession } = require('../queries');

const router = express.Router();

router.post('/start', function (req, res, next) {
    if (!req.body.sessionId || !req.user.user_id) {
        return res.sendStatus(403);
    }

    startSession(
        req.user.user_id,
        req.body.sessionId,
        req.body.time || Date.now()
    ).catch(() => {});
    res.sendStatus(200);
});

router.post('/end', function (req, res, next) {
    if (!req.body.sessionId || !req.user.user_id) {
        return res.sendStatus(403);
    }

    endSession(
        req.user.user_id,
        req.body.sessionId,
        req.body.time || Date.now()
    ).catch(() => {});
    res.sendStatus(200);
});

module.exports = router;
