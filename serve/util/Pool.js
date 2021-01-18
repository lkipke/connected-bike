const dotenv = require('dotenv');
const { Pool } = require('pg');

// first, load up our environment
const result = dotenv.config({
    path: path.join(__dirname, '..', '.env'),
});
if (result.error) {
    throw result.error;
}

let pool = new Pool({
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USER,
		password: process.env.DB_PWD,
		database: process.env.DB_NAME,
});

module.exports = { Pool };
