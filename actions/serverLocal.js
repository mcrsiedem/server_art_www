const express = require("express");
const http = require("http");
const app = express();
const { port } = require("../config");
const jwt = require("jsonwebtoken");

const connection = require("../actions/mysql");
const apiRouter = require("../actions/routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
const { ACCESS_TOKEN } = require("./logowanie/ACCESS_TOKEN");
require("../actions/mysql");

// app.use(bodyParser.json());

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

app.use(
  cors({
    // origin:["https://www.printforce.pl"],
    // credentials: true
    origin: ["http://localhost:3000"],
  })
);

app.use("/api_www", apiRouter);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  

  next();
});

const server = http.createServer(app);
const io = new Server(server, {
  // ostatnio dodane na próbe
  connectionStateRecovery: {},
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // console.log("TOKEN: "+token)

  if (token) {
    try {
      // Weryfikacja tokenu
      const decoded = jwt.verify(token, ACCESS_TOKEN);
      
      // Token poprawny. Dodaj dane użytkownika do obiektu socket
      socket.userData = decoded; 
      next(); // Kontynuuj połączenie
    } catch (err) {
      // Błąd weryfikacji (np. token wygasł lub jest nieprawidłowy)
      console.log('Błąd autoryzacji JWT:', err.message);
      const authError = new Error("Authentication error: Invalid or expired token.");
      authError.data = { type: "INVALID_TOKEN" };
      next(authError); // Odrzuć połączenie z błędem
    }
  } else {
    // Brak tokenu w żądaniu
    console.log('Błąd autoryzacji: Brak tokenu.');
    const authError = new Error("Authentication error: Token missing.");
    authError.data = { type: "TOKEN_MISSING" };
    next(authError); // Odrzuć połączenie
  }
});

let onlineUsers = [];
const addUser = (socket) =>{
    // !onlineUsers.some((user => user.userId === userId)) &&

      onlineUsers.push({
        userId:socket.userData.id,
        socketId: socket.id,
        zalogowany: new Date().toString()
      });

   console.log(onlineUsers)
}
const removeUser = (socket) =>{

onlineUsers = onlineUsers.filter(user => user.socketId != socket.id)
       console.log(onlineUsers)
}
io.on("connection", (socket) => {
  // Tutaj możesz mieć pewność, że użytkownik jest zalogowany
  addUser(socket)
  console.log(`IO. Zalogowany użytkownik ID: ${socket.userData.id}  ${socket.userData.imie} ${socket.userData.nazwisko} Połączony!`);
  
  socket.on("disconnect", () => {
  console.log(`User disconnected `, socket.id);
  removeUser(socket)

  });
  // console.log(new Date().toString()+ ` User Connected: ${socket.id}`);


  socket.on("send_mesage", (data) => {
    console.log(`Wiadomość: ${data.message}`);
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("addNewUser", (userId) => {
    // jeśli istnieje w tablicy user to go nie dodawaj
    // jeśli lewa strona && jest nieprawdziwa to zrób prawą
    !onlineUsers.some((user = user.userId === userId)) &&
      onlineUsers.push({
        userId,
        socketId: socket.id,
      });
  });

    socket.on("ktotam", () => {
    // socket.broadcast.emit("receive_message", onlineUsers);
    socket.emit("onlineUsers", onlineUsers);
  });
});

module.exports = {
  server,
};
