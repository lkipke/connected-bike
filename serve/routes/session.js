const express = require('express');
const { getSession, startSession, endSession } = require('../queries');

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
        res.status(200).send(results);
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
        res.status(200).send(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

router.get('/:sessionId', async function (req, res, next) {
		if (!req.params.sessionId) {
        return res.sendStatus(403);
		}

    try {
        let results = await getSession(req.params.sessionId);
				console.log("SENDING", results, req.params);
        res.status(200).send(results);
    } catch (e) {
        console.error(e);
        res.sendStatus(500);
    }
});

module.exports = router;
