const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const {port} = require('../config');
const connection = require('../actions/mysql');
const apiRouter = require('../actions/routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Server} = require("socket.io")

require('../actions/mysql');
// app.use(cors());
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(cors(
  {
    origin:["https://planer.artdruk.eu"],
    // credentials: true
  }
  
));

 app.use('/api_www', apiRouter);
 app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'https://planer.artdruk.eu');
    next();
});

//Instalowanie ssl na froncie oraz na node
// yotube pyrek sll cerbot letsencrypt - wygenerować certyfikat wg insrtukcji ( odnawia sie automatycznie co 90 dni)

//na node zainstalować opensll a potem podmienić klucze na te powyzej - klucze musza być takie same na forncie i na node

// privkey.pem  - klucz prywatny - latwo poznac po naglowku w pliku
//cert.pem - certyfikat

///etc/letsencrypt/live/domena
// privkey.pem == key.pem
// cert.pem

//--------------------------

const serverSSL = https.createServer({
key: fs.readFileSync(path.join(__dirname,'cert','privkey.pem')),
// key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
},app)



const io = new Server(serverSSL,{
  // withCredential: true,
  cors:{
     origin:["https://planer.artdruk.eu"]
     //ss
  },
})

io.on("connection", (socket)=>{
  console.log(new Date().toString()+ `User Connected: ${socket.id}`)
  socket.on("send_mesage", (data) => {
    console.log(`Wiadomość: ${data.message}`)
    socket.broadcast.emit("receive_message", data)
  })
})

module.exports = {
    serverSSL
    
}
 