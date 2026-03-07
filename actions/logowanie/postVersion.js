const { pool } = require("../mysql");

const postVersion = (req, res) => {
  const { newHashFileName } = req.body;

  const sql = "INSERT INTO artdruk.version (ver) values (?);";
  const dane = [newHashFileName];

  // Wykonujemy zapytanie bezpośrednio na puli
  pool.execute(sql, dane, (err, results) => {
    // 1. Obsługa błędu bazy danych
    if (err) {
      console.error("Błąd SQL:", err); // Warto zajrzeć w konsolę serwera
      return res.status(500).json([
        { zapis: false },
        { error: err.message }
      ]);
    }

    // 2. Obsługa sukcesu
    // To TA linia odpowiada za wysłanie odpowiedzi do przeglądarki/apki
    console.log("Zapisano pomyślnie, ID:", results.insertId);
    
    res.status(201).json([
      { zapis: true },
      { zamowienie_nr: results.insertId }
    ]);
  });
};

module.exports = {
  postVersion
};