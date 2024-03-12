const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const {port} = require('./config');
const connection = require('./actions/mysql');
const apiRouter = require('./actions/routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Server} = require("socket.io")

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

  
    res.setHeader('Access-Control-Allow-Origin', 'https://www.printforce.pl');

    next();
});




// server
// app.listen(port, function(){
//   console.log('Waiting... http://localhost:'+ port);
// });


//Instalowanie ssl na froncie oraz na node
// yotube pyrek sll cerbot letsencrypt - wygenerować certyfikat wg insrtukcji ( odnawia sie automatycznie co 90 dni)

//na node zainstalować opensll a potem podmienić klucze na te powyzej - klucze musza być takie same na forncie i na node

// privkey.pem  - klucz prywatny - latwo poznac po naglowku w pliku
//cert.pem - certyfikat


//--------------------------

// const server = https.createServer({
// key: fs.readFileSync(path.join(__dirname,'cert','privkey.pem')),
// cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
// },app)




 const server = http.createServer(app)

const io = new Server(server,{
   
  // withCredential: true,
  cors:{
    
    // origin:["https://www.printforce.pl"]
     origin:["http://localhost:3000"]
  },
})

io.on("connection", (socket)=>{
  console.log(`User Connected: ${socket.id}`)
  socket.on("send_mesage", (data) => {
    console.log(`Wiadomość: ${data.message}`)
    socket.broadcast.emit("receive_message", data)
  })
})
server.listen(port,()=>{ 
  console.log("SERVER IS RUNNING")
})

// server.listen(3443, ()=> console.log('Secure server on port 3443_')) 