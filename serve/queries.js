const { Pool } = require('pg');
const format = require('pg-format');

let pool;
function getPool() {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PWD,
            database: process.env.DB_NAME,
        });
    }

    return pool;
}

async function insertPing(variables) {
    let query = format(
        'INSERT INTO pings' +
            ' (time, session_id, heart_rate, kmph, rpm, watts) VALUES %L',
        variables
    );
    let pool = getPool();
    await pool.query(query);
}

async function updateAuthToken(username, authToken) {
    let pool = getPool();
    await pool.query('UPDATE users SET auth_token = $1 WHERE username = $2', [
        authToken,
        username,
    ]);
}

async function getUserFromUsernamePassword(username, password) {
    let pool = getPool();
    return await pool.query(
        'SELECT username, first_name, last_name, user_id, last_session_id FROM users WHERE username = $1 AND password = $2',
        [username, password]
    );
}

async function getUserFromAuthToken(authToken) {
    let pool = getPool();
    return await pool.query(
        'SELECT username, first_name, last_name, user_id, last_session_id FROM users WHERE auth_token = $1',
        [authToken]
    );
}

async function startSession(userId, sessionId, time) {
    let pool = getPool();
    let results = await Promise.all([
        pool.query('UPDATE users SET last_session_id = $1 WHERE user_id = $2', [
            sessionId,
            userId,
        ]),
        pool.query(
            'INSERT INTO sessions (user_id, session_id, start_utc) VALUES ($1, $2, $3) RETURNING *',
            [userId, sessionId, time]
        ),
    ]);

    return results[1].rows[0];
}

async function endSession(userId, sessionId, time) {
    let pool = getPool();
    let results = await Promise.all([
        pool.query('UPDATE users SET last_session_id = $1 WHERE user_id = $2', [
            sessionId,
            userId,
        ]),
        pool.query(
            'UPDATE sessions SET end_utc = $1 WHERE session_id = $2 RETURNING *',
            [time, sessionId]
        ),
    ]);

    return results[1].rows[0];
}

async function getSession(sessionId) {
    let pool = getPool();
    let results = await pool.query('SELECT * FROM sessions WHERE session_id = $1', [sessionId]);
    return results.rows[0];
}

module.exports = {
    insertPing,
    updateAuthToken,
    getUserFromUsernamePassword,
    getUserFromAuthToken,
    startSession,
    endSession,
		getSession
};
