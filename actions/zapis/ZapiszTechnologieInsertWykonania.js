const { pool } = require("../mysql");

/**
 * Pomocnicza funkcja czyszcząca stringi z nadmiarowych cudzysłowów
 * i zamieniająca puste wartości na NULL dla bazy danych.
 */
const czystaData = (dataStr) => {
  if (!dataStr) return null;
  
  if (typeof dataStr === 'string') {
    // Usuwamy ewentualne podwójne lub pojedyncze cudzysłowy ze środka stringa
    const oczyszczona = dataStr.replace(/['"]/g, '').trim();
    
    if (oczyszczona === '' || oczyszczona.toLowerCase() === 'null') {
      return null;
    }
    return oczyszczona;
  }
  
  return dataStr;
};

const zapiszTechnologieInsertWykonania = async (req, res) => {
  let wykonania = req.body[0];

  // Szybkie wyjście, jeśli tablica jest pusta
  if (!wykonania || wykonania.length === 0) {
    return res.status(201).json([{ zapis: true }]);
  }

  let promises = [];

  for (let wykonanie of wykonania) {
    let lega = wykonanie.lega_id || 0;

    // Bezpieczny SQL z placeholderami "?"
    let sql = `
      INSERT INTO artdruk.technologie_wykonania(
        id, indeks, technologia_id, zamowienie_id, nazwa_wykonania, grupa_id, 
        element_id, arkusz_id, lega_id, typ_elementu, nazwa, naklad, przeloty, 
        poczatek, czas, koniec, narzad, predkosc, mnoznik, proces_id, 
        procesor_id, status, stan, uwagi
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    // Mapowanie wartości (dokładna kolejność jak w INSERT INTO)
    let values = [
      wykonanie.id,
      wykonanie.indeks,
      wykonanie.technologia_id,
      wykonanie.zamowienie_id,
      wykonanie.nazwa_wykonania,
      wykonanie.grupa_id,
      wykonanie.element_id,
      wykonanie.arkusz_id,
      lega,
      wykonanie.typ_elementu,
      wykonanie.nazwa,
      wykonanie.naklad,
      wykonanie.przeloty,
      czystaData(wykonanie.poczatek), // oczyszczona data początku
      wykonanie.czas,
      czystaData(wykonanie.koniec),   // oczyszczona data końca
      wykonanie.narzad,
      wykonanie.predkosc,
      wykonanie.mnoznik,
      wykonanie.proces_id,
      wykonanie.procesor_id,
      wykonanie.status,
      wykonanie.stan,
      wykonanie.uwagi
    ];

    // Wpychamy asynchroniczne zapytanie do tablicy obietnic
    promises.push(
      (async () => {
        try {
          await pool.query(sql, values);
          return { zapis: true };
        } catch (err) {
          console.error("Błąd zapisu pojedynczego wykonania:", err.message);
          return { zapis: false, error: err.message };
        }
      })()
    );
  }

  // Czekamy na wykonanie wszystkich zapytań z pętli
  try {
    const data = await Promise.all(promises);
    return res.status(201).json(data);
  } catch (err) {
    console.error("Błąd krytyczny Wykonania Promise.all:", err);
    return res.status(500).json({ error: "Błąd serwera", details: err.message });
  }
};

module.exports = {
  zapiszTechnologieInsertWykonania
};