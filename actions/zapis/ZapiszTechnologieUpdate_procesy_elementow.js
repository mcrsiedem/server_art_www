const { pool } = require("../mysql");

const zapiszTechnologieUpdate_procesy_elementow = (procesyElementow) => {

    // 1. UPDATE
    procesyElementow
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            const sql = `
                UPDATE artdruk.technologie_procesy_elementow SET 
                    id = ?, 
                    zamowienie_id = ?, 
                    technologia_id = ?, 
                    produkt_id = ?, 
                    element_id = ?, 
                    proces_id = ?, 
                    ilosc_uzytkow = ?, 
                    front_ilosc = ?, 
                    back_ilosc = ?, 
                    front_kolor = ?, 
                    back_kolor = ?, 
                    info = ?, 
                    nazwa_id = ?, 
                    indeks = ? 
                WHERE global_id = ?`;

            const values = [
                row.id,
                row.zamowienie_id,
                row.technologia_id,
                row.produkt_id,
                row.element_id,
                row.proces_id,
                row.ilosc_uzytkow,
                row.front_ilosc,
                row.back_ilosc,
                row.front_kolor,
                row.back_kolor,
                row.info,
                row.nazwa_id,
                row.indeks,
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd UPDATE procesy_elementow:", err);
            });
        });

    // 2. INSERT
    procesyElementow
        .filter(x => x.insert === true && x.delete !== true)
        .forEach(row => {
            const sql = `
                INSERT INTO artdruk.technologie_procesy_elementow 
                (id, indeks, technologia_id, zamowienie_id, produkt_id, element_id, ilosc_uzytkow, front_ilosc, front_kolor, back_ilosc, back_kolor, info, nazwa_id, proces_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                row.id,
                row.indeks,
                row.technologia_id,
                row.zamowienie_id,
                row.produkt_id,
                row.element_id,
                row.ilosc_uzytkow,
                row.front_ilosc,
                row.front_kolor,
                row.back_ilosc,
                row.back_kolor,
                row.info,
                row.nazwa_id,
                row.proces_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd INSERT procesy_elementow:", err);
            });
        });

    // 3. DELETE
    procesyElementow
        .filter(x => x.delete === true && x.insert !== true)
        .forEach(row => {
            const sql = "DELETE FROM artdruk.technologie_procesy_elementow WHERE global_id = ?";
            
            pool.query(sql, [row.global_id], (err) => {
                if (err) console.error("Błąd DELETE procesy_elementow:", err);
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_procesy_elementow
};