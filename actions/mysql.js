
const mysql = require('mysql2');
const {database} = require('../config');
const connection = mysql.createConnection(database);
module.exports = connection;
