
const mysql = require('mysql2');
const {database} = require('../config');

const connection = mysql.createConnection(database);


// const connection = mysql.createConnection({
//   host: "localhost",
//   port:"3307",
//   user:"root",
//   password:"Art123druk_",

// })


connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('MySQL connected...');
    //console.log('MySql connected as id ' + connection.threadId);

    
});

module.exports = connection;



  // var sql = "INSERT INTO ctp21.m (txt) VALUES ('test')";
  // connection.query(sql, function (err, result) {
  //   if (err) throw err;
  //   console.log("1 record inserted");
  // });


// connection.query("SELECT * FROM ctp21.zlecenia where kolejnosc = 27", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//   });
