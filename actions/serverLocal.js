const express = require("express");
const http = require("http");
const app = express();
const { port } = require("../config");

const connection = require("../actions/mysql");
const apiRouter = require("../actions/routes");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");
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
let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
  console.log(`User disconnected `, socket.id);
  });
  console.log(new Date().toString()+ ` User Connected: ${socket.id}`);


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
});

module.exports = {
  server,
};
