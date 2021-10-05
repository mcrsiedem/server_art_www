const express = require('express');
const app = express();
const {port} = require('./config');
const connection = require('./db/mysql');
const apiRouter = require('./routes/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

//database
 require('./db/mysql');

 //parsery
 //Content-type: application/json
 app.use(bodyParser.json());

//fix cors
//app.use(cors());
app.use(cors({ origin: true }));

//routes
 app.use('/api', apiRouter);

 app.use(function (req, res, next) {

    
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});




// server
app.listen(port, function(){
    console.log('Waiting... http://localhost:'+ port);
});


