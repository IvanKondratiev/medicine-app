const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'data.env') });
const mysql = require('mysql2/promise');
try {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    module.exports = {
        connection_to_db: pool
    };
} catch (error) {
    console.error('Error initializing database connection:', error);
}