const { pool } = require("../mysql");

const zapiszTechnologieInsertGrupyZamowienia = async (req, res) => {
  let grypy = req.body[0];

  // Jeśli tablica jest pusta, od razu zwracamy status sukcesu
  if (!grypy || grypy.length === 0) {
    return res.status(201).json([{ zapis: true }]);
  }

  // Tutaj będziemy zbierać wyniki dla każdej grupy
  let wyniki = [];

  // Używamy klasycznej pętli for...of, która respektuje 'await' i wykonuje się po kolei
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
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );
    `;

    let values = [
      procId, procId,                       // Podzapytania dla kolumny 'poczatek'
      grupa.id, 
      grupa.indeks, 
      grupa.technologia_id, 
      grupa.zamowienie_id, 
      grupa.mnoznik, 
      grupa.czas, 
      procId, czas, czas, procId,           // Podzapytania dla kolumny 'koniec'
      grupa.ilosc_narzadow, 
      grupa.narzad, 
      grupa.naklad, 
      grupa.nazwa, 
      grupa.predkosc, 
      grupa.proces_id, 
      procId, 
      grupa.element_id, 
      grupa.przeloty, 
      grupa.status,                         // status
      2,                           // stan
      2,                                    // typ_grupy (wędruje jako sztywny parametr przez ?)
      grupa.uwagi                           // uwagi
    ];

    try {
      // Czekamy, aż to konkretne zapytanie się wykona, zanim pętla przejdzie do następnego obiektu
      await pool.query(sql, values);
      wyniki.push({ zapis: true });
    } catch (err) {
      console.error(`Błąd zapisu grupy o ID ${grupa.id}:`, err.message);
      
      // Jeśli jedna grupa się wyłoży, dodajemy info o błędzie, ale pętla leci dalej dla reszty grup
      wyniki.push({ zapis: false, error: err.message });
    }
  }

  // Po przejściu całej pętli zwracamy tablicę z wynikami
  return res.status(201).json(wyniki);
};

module.exports = {
  zapiszTechnologieInsertGrupyZamowienia
};