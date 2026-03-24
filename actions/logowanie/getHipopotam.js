const { pool } = require("../mysql");

const getHipopotam = (req, res) => {

  const io = req.io;
  io.emit("hipopotam", {
    tresc: "OK"
    
  });

 res.status(201).json("ok");
};

module.exports = {
  getHipopotam
};