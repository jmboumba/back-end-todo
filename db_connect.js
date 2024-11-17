require('dotenv').config();
const mysql = require('mysql2');
let db;

function connectToDatabase(){
    const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQL_DATABASE}`;
    db = mysql.createConnection(urlDB);

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL database:', err);
            setTimeout(connectToDatabase, 5000);
        }
        console.log('Connected to MySQL database.');
    });

    db.on('error', (err) => {
        console.error('MySQL connection error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connectToDatabase(); // Reconnect on lost connection
        } else {
            throw err;
        }
    });
}


connectToDatabase();

module.exports = db;
