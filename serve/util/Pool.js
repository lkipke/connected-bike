const { Pool } = require('pg');

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

module.exports = { getPool };
