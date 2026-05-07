const { pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");

const zapiszTechnologieUpdate_dane = (daneTechEdit, res) => {

    console.log("zapisz dane tu")
    
    if (daneTechEdit.update === true) {
        console.log(daneTechEdit.alert);

        // Używamy znaku zapytania (?) jako placeholderów dla bezpieczeństwa
        const sql = `
            UPDATE artdruk.technologie 
            SET 
                nr = ?, 
                rok = ?, 
                tytul = ?, 
                firma_id = ?, 
                klient_id = ?, 
                zamowienie_id = ?, 
                uwagi = ?, 
                autor_id = ?, 
                data_przyjecia = ?, 
                data_spedycji = ?, 
                data_materialow = ?, 
                stan = ?, 
                status = ?, 
                etap = ? 
            WHERE id = ?`;

        // Tablica z wartościami w dokładnie tej samej kolejności co znaki zapytania w SQL
        const values = [
            daneTechEdit.nr,
            daneTechEdit.rok,
            daneTechEdit.tytul,
            daneTechEdit.firma_id,
            daneTechEdit.klient_id,
            daneTechEdit.zamowienie_id,
            daneTechEdit.uwagi,
            daneTechEdit.autor_id,
             daneTechEdit.data_przyjecia,
             daneTechEdit.data_spedycji,
             daneTechEdit.data_materialow,
            daneTechEdit.stan,
            daneTechEdit.status,
            daneTechEdit.etap,
            daneTechEdit.id
        ];

        // Wykonanie zapytania przez pulę
        pool.query(sql, values, (err, result) => {
            if (err) {
                console.error("Błąd podczas aktualizacji technologii:", err);
                // Jeśli masz dostęp do res, warto wysłać status błędu
                // if (res) res.status(500).send("Błąd bazy danych");
                return;
            }
            console.log("Zaktualizowano rekordów:", result.affectedRows);
        });
    }
};

module.exports = {
    zapiszTechnologieUpdate_dane
};