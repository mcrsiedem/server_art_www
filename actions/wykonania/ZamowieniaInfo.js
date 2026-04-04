const { pool } = require("../mysql");

const ZamowieniaInfo = async (req, res) => {
  const zamowienia = req.body; // Zakładamy, że to tablica obiektów z .id
  
  // Jeśli tablica jest pusta, od razu zwracamy zera
  if (!zamowienia || zamowienia.length === 0) {
    return res.status(200).json({
      przeloty_druk: 0, przeloty_falc: 0, 
      przeloty_druk_zakonczone: 0, przeloty_falc_zakonczone: 0,
      naklad: 0, naklad_zeszyt: 0, naklad_klejona: 0
    });
  }

  // Wyciągamy same ID do tablicy, aby użyć operatora IN w SQL (dużo szybciej niż pętla!)
  const ids = zamowienia.map(z => z.id);

  try {
    // 1. Sumujemy przeloty z view_technologie_wykonania
    const sqlPrzeloty = `
      SELECT 
        SUM(CASE WHEN proces_nazwa_id = 1 THEN przeloty ELSE 0 END) as druk,
        SUM(CASE WHEN proces_nazwa_id = 3 THEN przeloty ELSE 0 END) as falc,
        SUM(CASE WHEN proces_nazwa_id = 1 AND status = 4 THEN przeloty ELSE 0 END) as druk_zak,
        SUM(CASE WHEN proces_nazwa_id = 3 AND status = 4 THEN przeloty ELSE 0 END) as falc_zak
      FROM artdruk.view_technologie_wykonania 
      WHERE zamowienie_id IN (?)
    `;

    // 2. Sumujemy nakłady z zamowienia_produkty
    const sqlNaklady = `
      SELECT 
        SUM(naklad) as naklad,
        SUM(CASE WHEN oprawa BETWEEN 54 AND 59 THEN naklad ELSE 0 END) as naklad_zeszyt,
        SUM(CASE WHEN oprawa BETWEEN 50 AND 52 THEN naklad ELSE 0 END) as naklad_klejona
      FROM artdruk.zamowienia_produkty 
      WHERE zamowienie_id IN (?)
    `;

    // Wykonujemy oba zapytania równolegle dla maksymalnej szybkości
    const [resPrzeloty] = await pool.query(sqlPrzeloty, [ids]);
    const [resNaklady] = await pool.query(sqlNaklady, [ids]);

    const p = resPrzeloty[0];
    const n = resNaklady[0];

    res.status(200).json({
      przeloty_druk: Number(p.druk || 0),
      przeloty_falc: Number(p.falc || 0),
      przeloty_druk_zakonczone: Number(p.druk_zak || 0),
      przeloty_falc_zakonczone: Number(p.falc_zak || 0),
      naklad: Number(n.naklad || 0),
      naklad_zeszyt: Number(n.naklad_zeszyt || 0),
      naklad_klejona: Number(n.naklad_klejona || 0)
    });

  } catch (error) {
    console.error("Błąd w ZamowieniaInfo:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = { ZamowieniaInfo };