const { pool } = require("../mysql");

const zapiszTechnologieUpdate_produkty = (produktyTechEdit, res) => {

    // UPDATE istniejących produktów
    produktyTechEdit
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            const sql = `
                UPDATE artdruk.technologie_produkty SET 
                    id = ?, 
                    zamowienie_id = ?, 
                    nazwa = ?, 
                    uwagi = ?, 
                    stan = ?, 
                    status = ?, 
                    etap = ?, 
                    typ = ?, 
                    ilosc_stron = ?, 
                    format_x = ?, 
                    format_y = ?, 
                    oprawa = ?, 
                    naklad = ?, 
                    indeks = ? 
                WHERE global_id = ?`;

            const values = [
                row.id,
                row.zamowienie_id,
                row.nazwa,
                row.uwagi,
                row.stan,
                row.status,
                row.etap,
                row.typ,
                row.ilosc_stron,
                row.format_x,
                row.format_y,
                row.oprawa,
                row.naklad,
                row.indeks,
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) {
                    console.error("Błąd UPDATE produkty:", err);
                }
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_produkty
};