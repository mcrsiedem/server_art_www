const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql");

const usunRealizacjeOddania = async (req, res) => {
    const row = req.body; 
    const global_id_oddania = row.global_id_grupy;
    const token = req.params['token'];
    
    const { id: ID_SPRAWCY, realizacje_usun: REALIZACJE_USUN = 0 } = DecodeToken(token);
    const zamowienie_id = req.body.zamowienie_id;

    // Pobieramy połączenie z puli
    const conn = await pool.getConnection();

    try {
        // Start transakcji
        await conn.beginTransaction();
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [row.zamowienie_id]);


        // 1. Delete - Usuwanie realizacji
        // Wykorzystujemy logikę: (dodal=? or 1=?) by sprawdzić uprawnienia lub własność
        const sqlDelete = "DELETE FROM artdruk.oddania_wykonania WHERE global_id = ? AND (dodal = ? OR 1 = ?)";
        await conn.execute(sqlDelete, [req.body.global_id, ID_SPRAWCY, REALIZACJE_USUN]);

        // 2. Historia - Logowanie usunięcia
        const eventMsg = row.typ == 1 
            ? `Usunięto realizację oddania : ${row.zrealizowano} szt.` 
            : `Usunięto brak nakładu : ${row.zrealizowano} szt.`;
        
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        await conn.execute(sqlHistory, [ID_SPRAWCY, "Oddania", eventMsg, zamowienie_id]);

        // 3. Status - Aktualizacja procedurą składowaną
        const sqlStatus = "CALL artdruk.aktualizacja_statusu_oddania(?, ?)";
        await conn.execute(sqlStatus, [zamowienie_id, global_id_oddania]);

        // 4. OdwiezGrupe - Pobranie aktualnego stanu widoku
        const sqlRefresh = "SELECT status, oddano FROM artdruk.view_oddania_grupy WHERE global_id = ?";
        const [rows] = await conn.execute(sqlRefresh, [req.body.oddanie_global_id]);
        
        if (rows.length === 0) {
            throw new Error("Nie znaleziono danych grupy po usunięciu");
        }

        const res4 = rows[0];

        // Zatwierdzenie zmian
        await conn.commit();

        res.status(200).json({
            status: "OK",
            status_grupy: res4.status,
            oddano: res4.oddano
        });

    } catch (error) {
        // Wycofanie zmian w razie jakiegokolwiek błędu
        if (conn) await conn.rollback();

        SendMail(error);
        console.error("Błąd podczas usuwania realizacji:", error);
        
        // Zwracamy błąd 500 zamiast 200, żeby front-end wiedział, że coś poszło nie tak
        res.status(500).json({ status: "Error", message: error.message || error });

    } finally {
        // Obowiązkowe zwolnienie połączenia
        if (conn) conn.release();
    }
};

module.exports = {
    usunRealizacjeOddania
};