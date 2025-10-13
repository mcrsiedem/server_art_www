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
const { teraz } = require("./czas/teraz");
const { DecodeToken } = require("./logowanie/DecodeToken");
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

let socketOut;
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
     !onlineUsers.some((user => user.socketId === socket.id)) &&

      onlineUsers.push({
        userId:socket.userData.id,
        imie:socket.userData.imie,
        nazwisko:socket.userData.nazwisko,
        socketId: socket.id,
        zalogowany: teraz(),
        ostatnia_aktywnosc: teraz(),
        status: "Aktywny"
      });

  //  console.log(onlineUsers)
  io.emit("onlineUsers", onlineUsers);
}
const removeUser = (socket) =>{

onlineUsers = onlineUsers.filter(user => user.socketId != socket.id)
      //  console.log(onlineUsers)
}
io.on("connection", (socket) => {
  // Tutaj możesz mieć pewność, że użytkownik jest zalogowany
  addUser(socket)
  // console.log(`IO. Zalogowany użytkownik ID: ${socket.userData.id}  ${socket.userData.imie} ${socket.userData.nazwisko} Połączony!`);
  
  socket.on("disconnect", () => {
  console.log(`User disconnected `, socket.id);
  removeUser(socket)
io.emit("onlineUsers", onlineUsers);
  });
  // console.log(new Date().toString()+ ` User Connected: ${socket.id}`);


  socket.on("send_mesage", (data) => {
    console.log(`Wiadomość: ${data.message}`);
    socket.broadcast.emit("receive_message", data);
  });

      socket.on("realizacja", () => {
   // po dodaniu realizacji odświeża się dashboard
    io.emit("pobierz_podglad_realizacji");
  });
  socket.on("addNewUser", (data) => {
    // jeśli istnieje w tablicy user to go nie dodawaj
    // jeśli lewa strona && jest nieprawdziwa to zrób prawą
    addNewUser(data,onlineUsers).then((res)=>{
      onlineUsers=res
      io.emit("onlineUsers", onlineUsers);
  });});

    socket.on("ktotam",async () => {
    const sockets = await io.fetchSockets();

console.log(`Liczba połączonych użytkowników: ${sockets.length}`);

sockets.forEach((socket) => {
  // 'socket.id' to unikalne ID połączenia Socket.IO
  console.log(socket.id); 
});

// 2. Sprawdzenie użytkowników połączonych do konkretnego 'pokoju'
// const roomName = 'nazwa_pokoju';
// const roomSockets = await io.in(roomName).fetchSockets();

// console.log(`Liczba połączonych w pokoju ${roomName}: ${roomSockets.length}`);
// roomSockets.forEach((socket) => {
//   console.log(socket.id); 
// });
    // socket.emit("onlineUsers", onlineUsers);
    socket.emit("wysylamsocket", {ilosc_polaczonych:`Liczba połączonych użytkowników: ${sockets.length}` });
  });



      socket.on("logout", (data) => {
        // console.log(`Aktywność użytkownika ID: ${data.userId} Status: ${data.status}`);
        deleteUser(data,onlineUsers).then((res)=>{
          onlineUsers=res
          io.emit("onlineUsers", onlineUsers);
        // console.log(onlineUsers);

        })
  });

      socket.on("userActivity", (data) => {
        // console.log(`Aktywność użytkownika ID: ${data.userId} Status: ${data.status}`);
        updateUsers(data,onlineUsers).then((res)=>{
          onlineUsers=res
          io.emit("onlineUsers", onlineUsers);
        // console.log(onlineUsers);

        })
  });


});


const updateUsers = (data,onlineUsers) =>{
  return new Promise(async(resolve,reject)=>{

onlineUsers = onlineUsers.map(user=>{
  if(user.userId==data.userId){
    return {
      ...user,
      status:data.status,
      ostatnia_aktywnosc:teraz()
    }
  }else{
    return user
  }

  })


  resolve(onlineUsers)
  })}


const deleteUser = (data,onlineUsers) =>{
  return new Promise(async(resolve,reject)=>{


    console.log("data: ",data)
    console.log(onlineUsers)
onlineUsers = onlineUsers.filter(user=>user.socketId!=data.socketId)


  resolve(onlineUsers)
  })}

const addNewUser = (data,onlineUsers) =>{
  return new Promise(async(resolve,reject)=>{
    !onlineUsers.some((user => user.userId == data.userId)) &&
      onlineUsers.push({
        userId:DecodeToken(data.token).id,
        imie:DecodeToken(data.token).imie,
        nazwisko:DecodeToken(data.token).nazwisko,
        socketId: data.socketId,
        zalogowany: teraz(),
        ostatnia_aktywnosc: teraz(),
        status: "Aktywny"
      });


  resolve(onlineUsers)
  })}


module.exports = {
  server,io
};
