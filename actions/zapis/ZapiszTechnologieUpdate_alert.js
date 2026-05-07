const { pool } = require("../mysql");

const zapiszTechnologieUpdate_alert = (daneTechEdit, res) => {

    if (daneTechEdit.alert) {
        
        // 1. Wywołanie procedury resetującej alert
        const sqlCall = "CALL artdruk.zamowienie_set_null_alert(?)";
        
        pool.query(sqlCall, [daneTechEdit.zamowienie_id], (err) => {
            if (err) {
                console.error("Błąd CALL zamowienie_set_null_alert:", err);
            }
        });

        // 2. Aktualizacja statusu zamówienia
        const sqlUpdate = "UPDATE artdruk.zamowienia SET status = 2 WHERE id = ?";
        
        pool.query(sqlUpdate, [daneTechEdit.zamowienie_id], (err) => {
            if (err) {
                console.error("Błąd UPDATE status zamówienia:", err);
            }
        });
    }
};

module.exports = {
    zapiszTechnologieUpdate_alert
};