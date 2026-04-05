const { pool } = require("../mysql");

const ZamowieniaInfoGrupy = async (req, res) => {
  const grupy = req.body;
  let suma_przelotow = 0;

  console.log(`info grupy`);

  try {
    // Używamy pętli for...of z await, aby poczekać na każde zapytanie
    for (let grupa of grupy) {
      const sql = "SELECT sum(przeloty) as przeloty FROM artdruk.technologie_grupy_wykonan WHERE global_id = ?";
      
      // Wykonujemy zapytanie przy użyciu pool
      const [rows] = await pool.query(sql, [grupa.global_id]);
      
      const przeloty = parseInt(rows[0].przeloty || 0);
      suma_przelotow += przeloty;
    }

    // Po zakończeniu pętli wysyłamy zsumowany wynik
    res.status(200).json({ suma_przelotow: suma_przelotow });

  } catch (err) {
    console.error("Błąd bazy danych:", err);
    res.status(500).json({ error: "Błąd serwera podczas liczenia przelotów" });
  }
};

module.exports = {
  ZamowieniaInfoGrupy,
};