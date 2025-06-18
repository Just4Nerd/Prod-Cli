const mysql = require('mysql2');
require('dotenv').config();
console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PORT, process.env.DB_PASSWORD, process.env.DB_NAME)
// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 10
});

module.exports = pool;