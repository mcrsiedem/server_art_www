const { pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");

const zapiszTechnologieUpdate_oprawa = (oprawa, res) => {

    // 1. UPDATE
    oprawa
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            const sql = `
                UPDATE artdruk.technologie_oprawa SET 
                    id = ?, 
                    zamowienie_id = ?, 
                    produkt_id = ?, 
                    oprawa = ?, 
                    naklad = ?, 
                    bok_oprawy = ?, 
                    data_spedycji = ?, 
                    uwagi = ?, 
                    wersja = ?, 
                    data_czystodrukow = ?, 
                    indeks = ? 
                WHERE global_id = ?`;

            const values = [
                row.id,
                row.zamowienie_id,
                row.produkt_id,
                row.oprawa,
                row.naklad,
                row.bok_oprawy,
                row.data_spedycji,
                row.uwagi,
                row.wersja,
                row.data_czystodrukow,
                row.indeks,
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd UPDATE oprawa:", err);
            });
        });

    // 2. INSERT
    oprawa
        .filter(x => x.insert === true && x.delete !== true)
        .forEach(row => {
            const sql = `
                INSERT INTO artdruk.technologie_oprawa 
                (id, zamowienie_id, produkt_id, oprawa, naklad, bok_oprawy, data_spedycji, uwagi, wersja, data_czystodrukow, indeks) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                row.id,
                row.zamowienie_id,
                row.produkt_id,
                row.oprawa,
                row.naklad,
                row.bok_oprawy,
                ifNoDateSetNull(row.data_spedycji),
                row.uwagi,
                row.wersja,
                ifNoDateSetNull(row.data_czystodrukow),
                row.indeks
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd INSERT oprawa:", err);
            });
        });

    // 3. DELETE
    oprawa
        .filter(x => x.delete === true && x.insert !== true)
        .forEach(row => {
            const sql = "DELETE FROM artdruk.technologie_oprawa WHERE global_id = ?";
            
            pool.query(sql, [row.global_id], (err) => {
                if (err) console.error("Błąd DELETE oprawa:", err);
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_oprawa
};