const express = require('express');
const { startSession, endSession } = require('../queries');

const router = express.Router();

router.post('/start', async function (req, res, next) {
    if (!req.body.sessionId || !req.user.user_id) {
        return res.sendStatus(403);
    }

    try {
        let results = await startSession(
            req.user.user_id,
            req.body.sessionId,
            req.body.time || Date.now()
        );
        res.statusCode(200).send(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.post('/end', async function (req, res, next) {
    if (!req.body.sessionId || !req.user.user_id) {
        return res.sendStatus(403);
    }

    try {
        let results = await endSession(
            req.user.user_id,
            req.body.sessionId,
            req.body.time || Date.now()
        );
        res.statusCode(200).send(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;
