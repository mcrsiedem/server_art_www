process.on('uncaughtException', (err) => {
    console.error('WYSTĄPIŁ NIEOCZEKIWANY BŁĄD (Uncaught Exception):');
    console.error(err.name, err.message);
    console.error(err.stack);
    
    // Opcjonalnie: wyślij powiadomienie e-mail/Slack do administratora
    
    // WAŻNE: W przypadku uncaughtException aplikacja jest w stanie niestabilnym.
    // Najbezpieczniej jest zakończyć proces i pozwolić 'Forever' lub 'PM2' go zrestartować.
    process.exit(1); 
});

const express = require('express');
const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const jwt = require("jsonwebtoken");
const app = express();
const {port} = require('../config');
const connection = require('../actions/mysql');
const apiRouter = require('../actions/routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const {Server} = require("socket.io");
const { teraz } = require('./czas/teraz');
const { ACCESS_TOKEN } = require('./logowanie/ACCESS_TOKEN');

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



// const io = new Server(serverSSL,{
//   // withCredential: true,
//   cors:{
//      origin:["https://planer.artdruk.eu"]
//      //ss
//   },
// })

const io = new Server(serverSSL, {
  // ostatnio dodane na próbe
  connectionStateRecovery: {},
  cors: {
    origin: ["https://planer.artdruk.eu"],
  },
});
// io.on("connection", (socket)=>{
//   console.log(new Date().toString()+ `User Connected: ${socket.id}`)

//   socket.on("send_mesage", (data) => {
//     console.log(`Wiadomość: ${data.message}`)
//     socket.broadcast.emit("receive_message", data)
//   })




  

// })

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

    // przetestować  


    // if (!socket.userData || !socket.userData.id) {
    //     console.warn(`[SOCKET] Odrzucono dodanie użytkownika (socket ID: ${socket.id}) - brak danych uwierzytelniających.`);
    //     return; 
    // }




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


  try {
    if (socket.userData && socket.userData.id) {
      addUser(socket);
    } else {
      const token = socket.handshake?.auth?.token;
      if (token) {
        try {
          const decoded = jwt.verify(token, ACCESS_TOKEN);
          socket.userData = decoded;
            console.log("Reconnect");
          addUser(socket);
        } catch (err) {
          console.warn("[SOCKET] Nie udało się zweryfikować tokenu przy połączeniu:", err.message);
          socket.emit("auth_error", { message: "Invalid or expired token" });
          socket.disconnect(true);
          return;
        }
      } else {
        console.warn("[SOCKET] Brak tokenu przy połączeniu - użytkownik nie zostanie dodany:", socket.id);
      }
    }
  } catch (err) {
    console.error("[SOCKET] Błąd podczas próby dodania użytkownika:", err);
  }
  // addUser(socket) - zakomentowane 4-02-2026

  // console.log(`IO. Zalogowany użytkownik ID: ${socket.userData.id}  ${socket.userData.imie} ${socket.userData.nazwisko} Połączony!`);
  
  socket.on("disconnect", () => {
  // console.log(`User disconnected `, socket.id);
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

let polaczeni_uzytkownicy = []
 polaczeni_uzytkownicy.push({ilosc_uzytkownikow : sockets.length})
sockets.forEach((socket) => {
  // 'socket.id' to unikalne ID połączenia Socket.IO
 polaczeni_uzytkownicy.push({socketId : socket.id, data_polaczenia: new Date(socket.handshake.issued).toLocaleString('pl-PL') })
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
    socket.emit("wysylamsocket", polaczeni_uzytkownicy);
  });


        socket.on("logout", (data) => {
        // console.log(`Aktywność użytkownika ID: ${data.userId} Status: ${data.status}`);
        deleteUser(data,onlineUsers).then((res)=>{
          onlineUsers=res
          io.emit("onlineUsers", onlineUsers);
        // console.log(onlineUsers);

        })
  });

      // socket.on("userActivity", (data) => {;
      //   updateUsers(data,onlineUsers).then((res)=>{
      //     onlineUsers=res
      //     io.emit("onlineUsers", onlineUsers);
      //   })
      // });

socket.on("userActivity", async (data) => {
    try {
        const res = await updateUsers(data, onlineUsers);
        onlineUsers = res;
        io.emit("onlineUsers", onlineUsers);
    } catch (err) {
        console.error("Błąd podczas aktualizacji użytkownika:", err);
        // Aplikacja nie padnie, po prostu ten jeden event się nie uda
    }
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
    serverSSL
    
}
 