const { pool } = require("../mysql");

const zapiszTechnologieInsertGrupyZamowienia = async (req, res) => { // Dodaliśmy async tutaj
  let grypy = req.body[0];

  if (!grypy || grypy.length === 0) {
    return res.status(201).json([{ zapis: true }]);
  }

  let promises = [];

  for (let grupa of grypy) {
    let czas = grupa.czas;
    let procId = grupa.procesor_id;

    let sql = `
      INSERT INTO artdruk.technologie_grupy_wykonan(
        poczatek, id, indeks, technologia_id, zamowienie_id, mnoznik, czas, koniec, 
        ilosc_narzadow, narzad, naklad, nazwa, predkosc, proces_id, procesor_id, 
        element_id, przeloty, status, stan, typ_grupy, uwagi
      ) 
      VALUES (
        (SELECT CASE WHEN (SELECT m_koniec FROM (SELECT MAX(koniec) AS m_koniec FROM artdruk.technologie_grupy_wykonan WHERE procesor_id = ? AND typ_grupy < 3) AS t1) IS NULL THEN NOW() ELSE (SELECT m_koniec FROM (SELECT MAX(koniec) AS m_koniec FROM artdruk.technologie_grupy_wykonan WHERE procesor_id = ? AND typ_grupy < 3) AS t2) END),
        ?, ?, ?, ?, ?, ?, 
        (SELECT CASE WHEN (SELECT m_koniec FROM (SELECT MAX(koniec) AS m_koniec FROM artdruk.technologie_grupy_wykonan WHERE procesor_id = ? AND typ_grupy < 3) AS t3) IS NULL THEN NOW() + INTERVAL ? MINUTE ELSE (SELECT m_koniec + INTERVAL ? MINUTE FROM (SELECT MAX(koniec) AS m_koniec FROM artdruk.technologie_grupy_wykonan WHERE procesor_id = ? AND typ_grupy < 3) AS t4) END),
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, ?
      );
    `;

    let values = [
      procId, procId,
      grupa.id, grupa.indeks, grupa.technologia_id, grupa.zamowienie_id, grupa.mnoznik, grupa.czas, 
      procId, czas, czas, procId,
      grupa.ilosc_narzadow, grupa.narzad, grupa.naklad, grupa.nazwa, grupa.predkosc, grupa.proces_id, procId, grupa.element_id, grupa.przeloty, grupa.status, grupa.stan, grupa.uwagi
    ];

    // Używamy nowoczesnego async/await wewnątrz tablicy obietnic zamiast "new Promise" i callbacków
    promises.push(
      (async () => {
        try {
          // pool.query() bez callbacku zwraca Promise w mysql2/promise
          await pool.query(sql, values);
          return { zapis: true };
        } catch (err) {
          console.error("Błąd zapisu pojedynczej grupy w bazie:", err.message);
          return { zapis: false, error: err.message };
        }
      })() // Natychmiastowe wywołanie funkcji (IIFE)
    );
  }

  try {
    const data = await Promise.all(promises);
    return res.status(201).json(data);
  } catch (err) {
    console.error("Błąd krytyczny Promise.all:", err);
    return res.status(500).json({ error: "Błąd serwera", details: err.message });
  }
};

module.exports = {
  zapiszTechnologieInsertGrupyZamowienia
};