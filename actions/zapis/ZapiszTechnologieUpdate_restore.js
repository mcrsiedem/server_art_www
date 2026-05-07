const { pool } = require("../mysql");

const ZapiszTechnologieUpdate_restore = (req, res) => {
    const zamowienie_id = req.params['zamowienie_id'];

    // 1. Usuwanie grup wykonań
    const sqlGrupy = "SELECT global_id FROM artdruk.technologie_grupy_wykonan WHERE zamowienie_id = ?";
    
    pool.query(sqlGrupy, [zamowienie_id], (err, result) => {
        if (err) {
            console.error(err);
        } else if (result) {
            result.forEach(re => {
                console.log("global_id grupy: " + re.global_id);
                const sqlDel = "SELECT artdruk.delete_grupa_wykonan(?)";
                pool.query(sqlDel, [re.global_id], (err) => {
                    if (err) console.error("Błąd delete_grupa_wykonan:", err);
                });
            });
        }
    });

    // 2. Usuwanie grup wykonań oprawa
    const sqlOprawa = "SELECT global_id FROM artdruk.technologie_grupy_wykonan_oprawa WHERE zamowienie_id = ?";
    
    pool.query(sqlOprawa, [zamowienie_id], (err, result) => {
        if (err) {
            console.error(err);
        } else if (result) {
            result.forEach(re => {
                console.log("global_id grupy oprawa: " + re.global_id);
                const sqlDelOp = "SELECT artdruk.delete_grupa_wykonan_oprawa(?)";
                pool.query(sqlDelOp, [re.global_id], (err) => {
                    if (err) console.error("Błąd delete_grupa_wykonan_oprawa:", err);
                });
            });
        }
    });

    // 3. Wywołanie procedury usuwającej technologię
    const sqlCall = "CALL artdruk.delete_technologia_from_zamowienie_id(?)";
    
    pool.query(sqlCall, [zamowienie_id], (err) => {
        if (err) {
            console.error("Błąd procedury usuwającej:", err);
            // Wykonujemy odpowiedź nawet przy błędzie, by nie zawiesić frontendu
            return res.status(500).json("Error during restore");
        }

        // 4. Finalizacja
        // W puli nie musisz robić "commit", chyba że zacząłeś transakcję przez pool.getConnection.
        // Wyślemy odpowiedź po zainicjowaniu ostatniego głównego zapytania.
        res.status(200).json("OK");
    });
};

module.exports = {
    ZapiszTechnologieUpdate_restore
};