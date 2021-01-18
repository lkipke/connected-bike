const format = require('pg-format');
const { getPool } = require('./util/pool');

async function insertPing(variables) {
    let query = format(
        'INSERT INTO pings' +
            ' (time, session_id, heart_rate, kmph, rpm, watts) VALUES %L',
        process.env.DB_PINGS_TABLE,
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
        'SELECT username, first_name, last_name, user_id FROM users WHERE username = $1 AND password = $2',
        [username, password]
    );
}

async function getUserFromAuthToken(authToken) {
    let pool = getPool();
    return await pool.query(
        'SELECT username, first_name, last_name, user_id FROM users WHERE auth_token = $1',
        [authToken]
    );
}

module.exports = {
    insertPing,
    updateAuthToken,
    getUserFromUsernamePassword,
    getUserFromAuthToken,
};
