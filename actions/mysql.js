
const mysql = require('mysql2');
const {database} = require('../config');
const connection = mysql.createConnection(database);
// const pool = mysql.createPool(database);
module.exports = connection;
