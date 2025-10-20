const dotenv = require('dotenv');
const pkg = require('pg');

dotenv.config()

const {Pool} = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {rejectUnauthorized: false} : false
})

module.exports = pool;