const { pool } = require("../mysql");

const zapiszTechnologieUpdate_legi_fragmenty = (legiFragmentyEdit) => {

    // 1. UPDATE
    legiFragmentyEdit
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            const sql = `
                UPDATE artdruk.technologie_legi_fragmenty SET 
                    id = ?, 
                    indeks = ?, 
                    technologia_id = ?, 
                    element_id = ?, 
                    arkusz_id = ?, 
                    lega_id = ?, 
                    oprawa_id = ?, 
                    naklad = ?, 
                    typ = ?, 
                    nr_legi = ?, 
                    wersja = ? 
                WHERE global_id = ?`;

            const values = [
                row.id, 
                row.indeks, 
                row.technologia_id, 
                row.element_id, 
                row.arkusz_id, 
                row.lega_id, 
                row.oprawa_id, 
                row.naklad, 
                row.typ, 
                row.nr_legi, 
                row.wersja, 
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd UPDATE legi_fragmenty:", err);
            });
        });

    // 2. INSERT
    legiFragmentyEdit
        .filter(x => x.insert === true && x.delete !== true)
        .forEach(row => {
            const sql = `
                INSERT INTO artdruk.technologie_legi_fragmenty 
                (id, indeks, technologia_id, element_id, arkusz_id, lega_id, nr_legi, naklad, oprawa_id, typ, wersja) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                row.id, 
                row.indeks, 
                row.technologia_id, 
                row.element_id, 
                row.arkusz_id, 
                row.lega_id, 
                row.nr_legi, 
                row.naklad, 
                row.oprawa_id, 
                row.typ, 
                row.wersja
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd INSERT legi_fragmenty:", err);
            });
        });

    // 3. DELETE
    legiFragmentyEdit
        .filter(x => x.delete === true && x.insert !== true)
        .forEach(row => {
            const sql = "DELETE FROM artdruk.technologie_legi_fragmenty WHERE global_id = ?";
            
            pool.query(sql, [row.global_id], (err) => {
                if (err) console.error("Błąd DELETE legi_fragmenty:", err);
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_legi_fragmenty
};