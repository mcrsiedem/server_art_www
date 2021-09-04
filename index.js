const express = require('express');
const app = express();
const {port} = require('./config');
const connection = require('./db/mysql');
const apiRouter = require('./routes/routes');
const bodyParser = require('body-parser');

//database
 require('./db/mysql');

 //parsery
 //Content-type: application/json
 app.use(bodyParser.json());


//routes
 app.use('/api', apiRouter);


// server
app.listen(port, function(){
    console.log('Waiting... http://localhost:'+ port);
});


