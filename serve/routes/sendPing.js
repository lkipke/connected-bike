const express = require('express');
const { insertPing } = require('../queries');

const router = express.Router();

async function writeToDatabase(pingData) {
    if (!pingData || !pingData.length) return;

    let mapped = pingData.map((obj) => {
        return [
            obj.time,
            obj.sessionId || '',
            obj.heartRate,
            obj.speed,
            obj.cadence,
            obj.power,
            obj.calories,
        ];
    });

    try {
        await insertPing(mapped);
    } catch (e) {
        console.error('Failure', mapped, e);
    }
}

router.post('/', function (req, res, next) {
    writeToDatabase(req.body);
    res.sendStatus(200);
});

module.exports = router;
