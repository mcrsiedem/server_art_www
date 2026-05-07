const { pool } = require("../mysql");

const zapiszTechnologieUpdate_fragmenty = (fragmentyTechEdit, res) => {



    // 1. UPDATE
    fragmentyTechEdit
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            const sql = `
                UPDATE artdruk.technologie_fragmenty SET 
                    id = ?, 
                    typ = ?, 
                    stan = ?, 
                    status = ?, 
                    etap = ?, 
                    arkusz_szerokosc = ?, 
                    arkusz_wysokosc = ? 
                WHERE global_id = ?`;

            const values = [
                row.id, 
                row.typ, 
                row.stan, 
                row.etap, // status
                row.etap, 
                row.arkusz_szerokosc, 
                row.arkusz_wysokosc, 
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd UPDATE fragmenty:", err);
            });
        });

    // 2. INSERT
    fragmentyTechEdit
        .filter(x => x.insert === true && x.delete !== true)
        .forEach(row => {
            const sql = `
                INSERT INTO artdruk.technologie_fragmenty 
                (id, indeks, technologia_id, zamowienie_id, produkt_id, element_id, oprawa_id, typ, ilosc_stron, wersja, naklad, info) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                row.id, 
                row.indeks, 
                row.technologia_id, 
                row.zamowienie_id, 
                row.produkt_id, 
                row.element_id, 
                row.oprawa_id, 
                row.typ, 
                row.ilosc_stron, 
                row.wersja, 
                row.naklad, 
                row.info
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd INSERT fragmenty:", err);
            });
        });

    // 3. DELETE
    fragmentyTechEdit
        .filter(x => x.delete === true && x.insert !== true)
        .forEach(row => {
            const sql = "DELETE FROM artdruk.technologie_fragmenty WHERE global_id = ?";
            
            pool.query(sql, [row.global_id], (err) => {
                if (err) console.error("Błąd DELETE fragmenty:", err);
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_fragmenty
};