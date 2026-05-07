const { pool } = require("../mysql");

const zapiszTechnologieUpdate_arkusze = (arkusze, res) => {

    // 1. UPDATE
    arkusze
        .filter(x => x.update === true && x.insert !== true)
        .forEach(row => {
            console.log("Aktualizacja arkusza, zamowienie id: " + row.zamowienie_id);
            const sql = `
                UPDATE artdruk.technologie_arkusze SET 
                    id = ?, 
                    indeks = ?, 
                    technologia_id = ?, 
                    zamowienie_id = ?, 
                    typ_elementu = ?, 
                    ilosc_stron = ?, 
                    rodzaj_arkusza = ?, 
                    element_id = ?, 
                    nr_arkusza = ?, 
                    ilosc_leg = ?, 
                    papier_id = ?, 
                    papier_postac_id = ?, 
                    arkusz_szerokosc = ?, 
                    arkusz_wysokosc = ?, 
                    naklad = ?, 
                    nadkomplet = ?, 
                    uwagi = ? 
                WHERE global_id = ?`;

            const values = [
                row.id,
                row.indeks,
                row.technologia_id,
                row.zamowienie_id,
                row.typ_elementu,
                row.ilosc_stron,
                row.rodzaj_arkusza,
                row.element_id,
                row.nr_arkusza,
                row.ilosc_leg,
                row.papier_id,
                row.papier_postac_id,
                row.arkusz_szerokosc,
                row.arkusz_wysokosc,
                row.naklad,
                row.nadkomplet,
                row.uwagi,
                row.global_id
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd UPDATE arkusze:", err);
            });
        });

    // 2. INSERT
    arkusze
        .filter(x => x.insert === true && x.delete !== true)
        .forEach(row => {
            const sql = `
                INSERT INTO artdruk.technologie_arkusze 
                (id, indeks, technologia_id, zamowienie_id, typ_elementu, rodzaj_arkusza, nr_arkusza, element_id, ilosc_stron, ilosc_leg, papier_id, papier_postac_id, arkusz_szerokosc, arkusz_wysokosc, naklad, nadkomplet, uwagi) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const values = [
                row.id,
                row.indeks,
                row.technologia_id,
                row.zamowienie_id,
                row.typ_elementu,
                row.rodzaj_arkusza,
                row.nr_arkusza,
                row.element_id,
                row.ilosc_stron,
                row.ilosc_leg,
                row.papier_id,
                row.papier_postac_id,
                row.arkusz_szerokosc,
                row.arkusz_wysokosc,
                row.naklad,
                row.nadkomplet,
                row.uwagi
            ];

            pool.query(sql, values, (err) => {
                if (err) console.error("Błąd INSERT arkusze:", err);
            });
        });

    // 3. DELETE
    arkusze
        .filter(x => x.delete === true && x.insert !== true)
        .forEach(row => {
            const sql = "DELETE FROM artdruk.technologie_arkusze WHERE global_id = ?";
            
            pool.query(sql, [row.global_id], (err) => {
                if (err) console.error("Błąd DELETE arkusze:", err);
            });
        });
};

module.exports = {
    zapiszTechnologieUpdate_arkusze
};