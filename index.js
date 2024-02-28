const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
const {port} = require('./config');
const connection = require('./actions/mysql');
const apiRouter = require('./actions/routes');
const bodyParser = require('body-parser');
const cors = require('cors');

//database
 require('./actions/mysql');

 //parsery
 //Content-type: application/json
 app.use(bodyParser.json()); 

//fix cors
app.use(cors(
  {
    // origin:["https://www.printforce.pl"],
    // credentials: true
  }
  
));
// app.use(cors({ origin: true }));

//routes
 app.use('/api_www', apiRouter);

 app.use(function (req, res, next) {

    
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Origin', '*');
    // res.setHeader('Access-Control-Allow-Origin', 'https://www.printforce.pl');
    //https://www.printforce.pl/s

  // Request methods you wish to allow
  //  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  //  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  //  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
    next();
});




// server
// app.listen(port, function(){
//     console.log('Waiting... http://localhost:'+ port);
// });


// key.pem i cert.pem to klucz prywatny i certyfika wygenerowany dla apacha z Lets Encrypt
// const sslServer = https.createServer({
// key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
// cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
// },app)

// sslServer.listen(3443, ()=> console.log('Secure server on port 3443'))


// key.pem i cert.pem to klucz prywatny i certyfika wygenerowany dla apacha z Lets Encrypt
const sslServer = https.createServer({
key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
},app)

sslServer.listen(3443, ()=> console.log('Secure server on port 3443')) 