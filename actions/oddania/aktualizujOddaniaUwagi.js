const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql");

const aktualizujOddaniaUwagi = async (req, res) => {
    // Rozpakowujemy dane z tablicy przesłanej w body
    const [text, global_id, zamowienie_id] = req.body;
    const token = req.params['token'];
    const ID_SPRAWCY = DecodeToken(token).id;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1. Update - Aktualizacja uwag w grupie
        const sqlUpdate = "UPDATE artdruk.oddania_grupy SET uwagi = ? WHERE global_id = ?";
        await conn.execute(sqlUpdate, [text, global_id]);

        // 2. Historia - Logowanie zmiany uwag
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        const eventMsg = `Uwagi do oddania : ${text}`;
        await conn.execute(sqlHistory, [ID_SPRAWCY, "Oddania", eventMsg, zamowienie_id]);

        await conn.commit();

        // Zwracamy czyste "OK" lub obiekt, zależnie od tego co przyjmuje Twój frontend
        res.status(200).json("OK");

    } catch (error) {
        if (conn) await conn.rollback();

        SendMail(error);
        console.error("Błąd podczas aktualizacji uwag:", error);
        
        // Zmiana na status 500 dla wyraźnej informacji o błędzie
        res.status(500).json({ status: "Error", message: error.message });

    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    aktualizujOddaniaUwagi
};