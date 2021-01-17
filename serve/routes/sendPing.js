const express = require('express');
const { Pool } = require('pg');
const format = require('pg-format');

const router = express.Router();

let pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
});

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
        await pool.query(
            format(
                'INSERT INTO %I' +
                    ' (time, session_id, heart_rate, kmph, rpm, watts) VALUES %L',
                process.env.DB_PINGS_TABLE,
                mapped
            )
        );
    } catch (e) {
        console.error('Failure', mapped, e);
    }
}

router.post('/', function (req, res, next) {
    writeToDatabase(req.body);
    res.sendStatus(200);
});

module.exports = router;
