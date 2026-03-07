const { pool } = require("../mysql");

const postVersion = (req, res) => {
  const { newHashFileName } = req.body;
  
  const sql = "INSERT INTO artdruk.version (ver) values (?);";
  const dane = [newHashFileName];

  // Używamy pool.execute zamiast connection.execute
  pool.execute(sql, dane, (err, results) => {
    if (err) {
      // Zwracamy błąd w formacie, który miałeś wcześniej
      return res.status(500).json([
        { zapis: false }, 
        err
      ]);
    }

    // Zwracamy sukces
    res.status(201).json([
      { zapis: true },
      { zamowienie_nr: results.insertId }
    ]);
  });
};

module.exports = {
  postVersion
};