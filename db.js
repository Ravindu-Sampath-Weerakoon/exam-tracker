const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'exam_tracker',
  port: process.env.DB_PORT || 3306
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('MySQL Connected');
});

module.exports = connection;