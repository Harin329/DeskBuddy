import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.DB_HOST);
console.log('ok')
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = con;