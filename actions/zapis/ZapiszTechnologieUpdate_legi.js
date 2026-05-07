const { pool } = require("../mysql");

const zapiszTechnologieUpdate_legi = (legi, res) => {

    // 1. UPDATE
    legi
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            const sql = `
                UPDATE artdruk.technologie_legi SET 
                    id = ?, 
                    indeks = ?, 
                    technologia_id = ?, 
                    zamowienie_id = ?, 
                    typ_elementu = ?, 
                    ilosc_stron = ?, 
                    rodzaj_legi = ?, 
                    element_id = ?, 
                    arkusz_id = ?, 
                    naklad = ?, 
                    nr_legi = ?, 
                    uwagi = ? 
                WHERE global_id = ?`;

            const values = [
                row.id,
                row.indeks,
                row.technologia_id,
                row.zamowienie_id,
                row.typ_elementu,
                row.ilosc_stron,
                row.rodzaj_legi,
                row.element_id,
                row.arkusz_id,
                row.naklad,
                row.nr_legi,
                row.uwagi,
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd UPDATE legi:", err);
            });
        });

    // 2. INSERT
    legi
        .filter(x => x.insert === true && x.delete !== true)
        .forEach(row => {
            const sql = `
                INSERT INTO artdruk.technologie_legi 
                (id, indeks, technologia_id, zamowienie_id, typ_elementu, rodzaj_legi, element_id, arkusz_id, ilosc_stron, naklad, nr_legi, uwagi) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                row.id,
                row.indeks,
                row.technologia_id,
                row.zamowienie_id,
                row.typ_elementu,
                row.rodzaj_legi,
                row.element_id,
                row.arkusz_id,
                row.ilosc_stron,
                row.naklad,
                row.nr_legi,
                row.uwagi
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd INSERT legi:", err);
            });
        });

    // 3. DELETE
    legi
        .filter(x => x.delete === true && x.insert !== true)
        .forEach(row => {
            const sql = "DELETE FROM artdruk.technologie_legi WHERE global_id = ?";
            
            pool.query(sql, [row.global_id], (err) => {
                if (err) console.error("Błąd DELETE legi:", err);
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_legi
};