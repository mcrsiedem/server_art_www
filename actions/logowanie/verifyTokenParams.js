const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");
const { pool } = require("../mysql"); // pool zostaje, jeśli używasz go w innych miejscach pliku
const dataStore = require('../uprawnienia/dataStore');

function verifyTokenParams(uprawnienie) {
  return (req, res, next) => {
    const token = req.params.token;

    if (!token) {
      console.log("Brak tokenu");
      return res.status(401).json({ Error: "You are not Authenticated" });
    }

    jwt.verify(token, ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        console.log("Błąd weryfikacji tokenu error: " + err);
        return res.status(403).json({ Error: "Wrong token" });
      }

      if (decoded) {
        // Sprawdzamy uprawnienia w dataStore
        if (dataStore.checkPrivileges(decoded.id, uprawnienie)) {
          // Monitoring usunięty zgodnie z prośbą
          next(); 
        } else {
          console.log(`${uprawnienie} - brak uprawnień: ${decoded.id} ${decoded.imie} ${decoded.nazwisko}`);
          return res.status(403).json({ Error: "Brak uprawnień do tej czynności" });
        }
      }
    });
  };
}

module.exports = {
  verifyTokenParams
};