const express = require('express');
const app = express();
const {port} = require('./config');

//routes
const apiRouter = require('./routes/api');

app.use('/', apiRouter);


// server
app.listen(port, function(){
    console.log('serwers słucha... http://localhost:'+ port);
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