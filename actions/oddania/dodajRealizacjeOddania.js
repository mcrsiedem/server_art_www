const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql"); // Używamy tylko pool

const dodajRealizacjeOddania = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const ID_SPRAWCY = DecodeToken(token).id;

    const { zamowienie_id, global_id, zrealizowano, typ } = req.body;

    // Pobieramy połączenie z puli
    const conn = await pool.getConnection();

    try {
        // Rozpoczęcie transakcji
        await conn.beginTransaction();
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [row.zamowienie_id]);

        

        // 1. Wstawienie wykonania (Insert)
        const sqlInsert = "INSERT INTO artdruk.oddania_wykonania (zamowienie_id, oddanie_global_id, zrealizowano, dodal, typ) VALUES (?, ?, ?, ?, ?)";
        const [resultInsert] = await conn.execute(sqlInsert, [zamowienie_id, global_id, zrealizowano, ID_SPRAWCY, typ]);
        const insertId = resultInsert.insertId;


        // 2. Dodanie do historii (Historia)
        let eventMsg = typ == 1 ? `Oddano: ${zrealizowano} szt.` : `Brak nakładu: ${zrealizowano} szt.`;
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        await conn.execute(sqlHistory, [ID_SPRAWCY, "Oddania", eventMsg, zamowienie_id]);


        // 3. Aktualizacja statusu (Status - Stored Procedure)
        const sqlStatus = "CALL artdruk.aktualizacja_statusu_oddania(?, ?)";
        await conn.execute(sqlStatus, [zamowienie_id, global_id]);


        // 4. Pobranie odświeżonych danych grupy (OdwiezGrupe)
        const sqlRefresh = "SELECT status, oddano FROM artdruk.view_oddania_grupy WHERE global_id = ?";
        const [rowsRefresh] = await conn.execute(sqlRefresh, [global_id]);

        
        const res4 = rowsRefresh[0] || { status: null, oddano: 0 };

        // Jeśli wszystko poszło OK, zatwierdzamy zmiany
        await conn.commit();

        res.status(200).json({
            status: "OK",
            insertId: insertId,
            status_grupy: res4.status,
            oddano: res4.oddano
        });

    } catch (error) {
        // W razie błędu wycofujemy wszystkie zmiany w transakcji
        await conn.rollback();

        SendMail(error);
        console.error("Błąd transakcji:", error);
        res.status(500).json({ status: "Error", message: error.message });

    } finally {


        // Zawsze zwalniamy połączenie z powrotem do puli
        conn.release();
    }
};

module.exports = {
    dodajRealizacjeOddania
};