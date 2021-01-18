const express = require('express');
const format = require('pg-format');
const { Pool } = require('../utils/Pool');

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
        ];
    });

    try {
        let query = format(
            'INSERT INTO %I' +
                ' (time, session_id, heart_rate, kmph, rpm, watts) VALUES %L',
            process.env.DB_PINGS_TABLE,
            mapped
        );
        await Pool.query(query);
	console.log("success!")
    } catch (e) {
        console.error('Failure', mapped, e);
    }
}

router.post('/', function (req, res, next) {
    writeToDatabase(req.body);
    res.sendStatus(200);
});

module.exports = router;
