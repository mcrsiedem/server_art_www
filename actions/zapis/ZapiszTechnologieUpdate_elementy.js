const { pool } = require("../mysql");

const zapiszTechnologieUpdate_elementy = (elementyTechEdit, res) => {

  
  // 1. UPDATE istniejących elementów
  elementyTechEdit
    .filter(x => x.update === true && x.insert !== true)
    .forEach(row => {
      const sql = `
        UPDATE artdruk.technologie_elementy SET 
          id = ?, zamowienie_id = ?, produkt_id = ?, nazwa = ?, typ = ?, 
          ilosc_stron = ?, format_x = ?, format_y = ?, papier_id = ?, 
          papier_postac_id = ?, naklad = ?, uwagi = ?, ilosc_leg = ?, 
          lega = ?, stan = ?, status = ?, etap = ?, 
          arkusz_szerokosc = ?, arkusz_wysokosc = ? 
        WHERE global_id = ?`;

      const values = [
        row.id, row.zamowienie_id, row.produkt_id, row.nazwa, row.typ,
        row.ilosc_stron, row.format_x, row.format_y, row.papier_id,
        row.papier_postac_id, row.naklad, row.uwagi, row.ilosc_leg,
        row.lega, row.stan, row.etap, row.etap, // stan, status, etap
        row.arkusz_szerokosc, row.arkusz_wysokosc, row.global_id
      ];

      pool.query(sql, values, (err) => {
        if (err) console.error("Błąd UPDATE:", err);
      });
    });

  // 2. INSERT nowych elementów
  elementyTechEdit
    .filter(x => x.insert === true && x.delete !== true)
    .forEach(row => {
      const sql = `
        INSERT INTO artdruk.technologie_elementy 
        (id, zamowienie_id, technologia_id, produkt_id, nazwa, typ, ilosc_stron, 
        format_x, format_y, papier_id, papier_postac_id, ilosc_leg, lega, 
        arkusz_szerokosc, arkusz_wysokosc, naklad, uwagi, stan, status, etap, indeks) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        row.id, row.zamowienie_id, row.technologia_id, row.produkt_id, row.nazwa,
        row.typ, row.ilosc_stron, row.format_x, row.format_y, row.papier_id,
        row.papier_postac_id, row.ilosc_leg, row.lega, row.arkusz_szerokosc,
        row.arkusz_wysokosc, row.naklad, row.uwagi, row.stan, row.status,
        row.etap, row.indeks
      ];

      pool.query(sql, values, (err) => {
        if (err) console.error("Błąd INSERT:", err);
      });
    });

  // 3. DELETE usuniętych elementów
  elementyTechEdit
    .filter(x => x.delete === true && x.insert !== true)
    .forEach(row => {
      const sql = "DELETE FROM artdruk.technologie_elementy WHERE global_id = ?";
      
      pool.query(sql, [row.global_id], (err) => {
        if (err) console.error("Błąd DELETE:", err);
      });
    });
};

module.exports = {
  zapiszTechnologieUpdate_elementy
};