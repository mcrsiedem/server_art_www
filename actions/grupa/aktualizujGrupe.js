const { pool } = require("../mysql");

/**
 * Aktualizuje grupę wykonan oraz powiązane wykonania w ramach jednej transakcji.
 * Wykorzystuje async/await dla zapewnienia sekwencyjności i poprawnej obsługi błędów.
 */
const aktualizujGrupe = async (req, res) => {
  const data = req.body;
  const conn = await pool.getConnection(); // Pobranie połączenia z puli

  try {
    await conn.beginTransaction(); // Rozpoczęcie transakcji

    const info = data[0]; // Informacje o zmianie czasu
    const rowGrupa = data[1]; // Dane grupy
    const wykonania = data[2] || []; // Lista wykonan

    const {
      global_id: rowGrupa_global_id,
      predkosc: rowGrupa_predkosc,
      narzad: rowGrupa_narzad,
      przeloty: rowGrupa_przeloty,
      ilosc_narzadow: rowGrupa_ilosc_narzadow,
      naklad: rowGrupa_naklad_raw
    } = rowGrupa;

    const rowGrupa_naklad = parseInt(rowGrupa_naklad_raw);

    // 1. Aktualizacja czasu trwania grupy (jeśli dotyczy)
    if (info != null) {
      const [koniec, kierunek, roznica_czasu] = info;
      const sqlCzas = "SELECT artdruk.zmien_czas_trwania_grupy_minuty(?, ?, ?) AS result";
      await conn.execute(sqlCzas, [rowGrupa_global_id, kierunek, roznica_czasu]);
    }

    // 2. Aktualizacja samej grupy
    const sqlUpdateGrupa = `
      UPDATE artdruk.technologie_grupy_wykonan 
      SET predkosc = ?, narzad = ?, przeloty = ?, ilosc_narzadow = ?, naklad = ? 
      WHERE global_id = ?
    `;
    const daneGrupa = [
      rowGrupa_predkosc, 
      rowGrupa_narzad, 
      rowGrupa_przeloty, 
      rowGrupa_ilosc_narzadow, 
      rowGrupa_naklad, 
      rowGrupa_global_id
    ];
    await conn.execute(sqlUpdateGrupa, daneGrupa);

    // 3. Obsługa wykonania (tylko jeśli info != null, zgodnie z Twoją logiką)
    if (info != null) {
      
      // UPDATE - wykonania istniejące
      const toUpdate = wykonania.filter(x => x.update === true && x.insert !== true);
      for (const row of toUpdate) {
        const sqlUpdateWyk = `
          UPDATE artdruk.technologie_wykonania 
          SET indeks=?, nazwa_wykonania=?, nazwa=?, naklad=?, przeloty=?, czas=?, narzad=?, predkosc=? 
          WHERE global_id=?
        `;
        const paramsUpdate = [
          row.indeks, row.nazwa_wykonania, row.nazwa, row.naklad, 
          row.przeloty, row.czas, row.narzad, row.predkosc, row.global_id
        ];
        await conn.execute(sqlUpdateWyk, paramsUpdate);
      }

      // INSERT - nowe wykonania
      const toInsert = wykonania.filter(x => x.insert === true && x.delete !== true);
      for (const row of toInsert) {
        const sqlInsertWyk = `
          INSERT INTO artdruk.technologie_wykonania (
            id, indeks, technologia_id, zamowienie_id, nazwa_wykonania, grupa_id, 
            element_id, arkusz_id, lega_id, typ_elementu, nazwa, naklad, przeloty, 
            poczatek, czas, koniec, narzad, predkosc, mnoznik, proces_id, 
            procesor_id, status, stan, uwagi
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;
        const paramsInsert = [
          row.id, row.indeks, row.technologia_id, row.zamowienie_id, row.nazwa_wykonania,
          row.grupa_id, row.element_id, row.arkusz_id, row.lega_id || 0, row.typ_elementu,
          row.nazwa, row.naklad, row.przeloty, row.poczatek, row.czas, row.koniec,
          row.narzad, row.predkosc, row.mnoznik, row.proces_id, row.procesor_id,
          row.status, row.stan, row.uwagi
        ];
        await conn.execute(sqlInsertWyk, paramsInsert);
      }

      // DELETE - usuwanie wykonan
      const toDelete = wykonania.filter(x => x.delete === true && x.insert !== true);
      for (const row of toDelete) {
        const sqlDeleteWyk = "DELETE FROM artdruk.technologie_wykonania WHERE global_id = ?";
        await conn.execute(sqlDeleteWyk, [row.global_id]);
      }
    }

    await conn.commit(); // Zatwierdzenie wszystkich zmian
    res.status(200).json("OK");

  } catch (error) {
    await conn.rollback(); // W razie błędu cofnij zmiany
    console.error("Błąd podczas aktualizacji grupy:", error);
    res.status(500).json({ error: "Błąd bazy danych", details: error.message });
  } finally {
    console.log("aktualizuj grupe to tu")
    conn.release(); // Zwolnienie połączenia z powrotem do puli
  }
};

module.exports = {
  aktualizujGrupe
};