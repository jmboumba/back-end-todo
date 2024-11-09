require('dotenv').config();
const mysql = require('mysql2');


const db = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

module.exports = db;
