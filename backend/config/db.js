const { Pool } = require('pg');
require('dotenv').config();

//connets backend to the neon database 
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Neon connections
    }
});

module.exports = pool;