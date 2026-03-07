const { pool } = require("../mysql");

const postVersion = (req, res) => {
  let promises = [];
  let body = req.body;

  let newHashFileName = body.newHashFileName;
  let kto = body.kto;

  var sql = "INSERT INTO artdruk.version (ver) values (?); ";
  let dane = [newHashFileName];

  // TUTAJ ZMIANA: pool.execute() w Twoim mysql.js zwraca Promise, 
  // więc używamy .then() zamiast callbacka
  promises.push(
    pool.execute(sql, dane)
      .then(([results]) => {
        // Zwracamy dokładnie to samo, co wcześniej
        return [{ zapis: true }, { zamowienie_nr: results.insertId }];
      })
      .catch((err) => {
        // W razie błędu zwracamy to, co miałeś w resolve błędu
        return [{ zapis: false }, err];
      })
  );

  // Reszta zostaje bez zmian - Promise.all teraz dostanie gotowe dane
  Promise.all(promises).then((data) => res.status(201).json(data));
};

module.exports = {
  postVersion
};