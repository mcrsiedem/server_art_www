const { DecodeToken } = require("../logowanie/DecodeToken");
const { pool } = require("../mysql"); // Importujemy tylko pool

const dodajRealizacjeOprawy = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const { zamowienie_id, id: grupa_id, global_id,brak } = req.body;

    console.log("Brak: "+ brak)
    let ID_SPRAWCY;
    try {
        ID_SPRAWCY = DecodeToken(token).id;
    } catch (err) {
        return res.status(401).json({ status: "Błąd autoryzacji" });
    }

    // Pobieramy połączenie z puli specjalnie dla tej transakcji
    const conn = await pool.getConnection();

    try {
        // ROZPOCZĘCIE TRANSAKCJI
        await conn.beginTransaction();
let insertId
        // 1. Wstawienie wykonania
        if(brak) {
        const sqlInsert = "INSERT INTO artdruk.technologie_wykonania_oprawa (id, technologia_id, zamowienie_id, grupa_id, oprawa_id, naklad, proces_id, procesor_id, dodal,typ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
        const dataInsert = [row.id, row.technologia_id, row.zamowienie_id, row.id, row.oprawa_id, row.naklad, row.proces_id, row.procesor_id, ID_SPRAWCY,1];
        const [resultInsert] = await conn.execute(sqlInsert, dataInsert);
         insertId = resultInsert.insertId;
        }else{
        const sqlInsert = "INSERT INTO artdruk.technologie_wykonania_oprawa (id, technologia_id, zamowienie_id, grupa_id, oprawa_id, naklad, proces_id, procesor_id, dodal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const dataInsert = [row.id, row.technologia_id, row.zamowienie_id, row.id, row.oprawa_id, row.naklad, row.proces_id, row.procesor_id, ID_SPRAWCY];
        const [resultInsert] = await conn.execute(sqlInsert, dataInsert);
         insertId = resultInsert.insertId;
        }


        // 2. Dodanie do historii
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        const dataHistory = [ID_SPRAWCY, "Oprawa", `Oprawiono: ${row.naklad} szt.`, zamowienie_id];
        await conn.execute(sqlHistory, dataHistory);

        // 3. Aktualizacja statusu
        const sqlStatus = "CALL artdruk.aktualizacja_statusu_oprawy_vs_realizacja(?, ?)";
        await conn.execute(sqlStatus, [zamowienie_id, grupa_id]);

        // 4. Pobranie nowego statusu grupy (do odpowiedzi)
        const sqlSelect = "SELECT status, zrealizowano FROM artdruk.view_technologie_grupy_wykonan_oprawa WHERE global_id = ?";
        const [rows] = await conn.execute(sqlSelect, [global_id]);

        // ZATWIERDZENIE ZMIAN
        await conn.commit();

        res.status(200).json({
            status: "OK",
            insertId: insertId,
            status_grupy: rows[0]?.status,
            zrealizowano: rows[0]?.zrealizowano
        });

    } catch (error) {
        // WYCOFANIE ZMIAN w razie jakiegokolwiek błędu
        await conn.rollback();
        
        console.error("Błąd transakcji, wycofano zmiany:", error);
        res.status(500).json({ status: "Error", message: "Operacja nie powiodła się. Dane nie zostały zapisane." });

    } finally {
        // ZWOLNIENIE POŁĄCZENIA z powrotem do puli (kluczowe!)
        conn.release();
    }
};

module.exports = {
    dodajRealizacjeOprawy
};