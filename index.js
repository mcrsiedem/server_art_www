const express = require('express');
const app = express();
const {port} = require('./config');
const connection = require('./db/mysql');
const apiRouter = require('./routes/api');


 require('./db/mysql');
// //routes
 app.use('/', apiRouter);



// server
app.listen(port, function(){
    console.log('Waiting... http://localhost:'+ port);
});


 
// config.js
// eksportuje objekt
// module.exports = {
//    port:  process.env.PORT || 3000
// }

// const config = require('./config');
// console.log(config.port);
// albo
// const {port} = require('./config');
// console.log(port);