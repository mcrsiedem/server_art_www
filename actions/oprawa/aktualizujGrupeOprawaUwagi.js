const { DecodeToken } = require("../logowanie/DecodeToken");
const { pool } = require("../mysql");

const aktualizujGrupeOprawaUwagi = async (req, res) => {
    // Destrukturyzacja danych wejściowych z tablicy
    const [text, global_id, zamowienie_id] = req.body;
    const token = req.params['token'];
    const ID_SPRAWCY = DecodeToken(token).id;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [zamowienie_id]);


        // 1. Update - Aktualizacja uwag w konkretnej tabeli oprawy
        const sqlUpdate = "UPDATE artdruk.technologie_grupy_wykonan_oprawa SET uwagi = ? WHERE global_id = ?";
        await conn.execute(sqlUpdate, [text, global_id]);

        // 2. Historia - Logowanie zmiany
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        const eventMsg = `Uwagi do oprawy : ${text}`;
        await conn.execute(sqlHistory, [ID_SPRAWCY, "Oprawa", eventMsg, zamowienie_id]);

        await conn.commit();

        res.status(200).json("OK");

    } catch (error) {
        // Jeśli coś pójdzie nie tak, wycofujemy zmiany
        if (conn) await conn.rollback();

        console.error("Wystąpił błąd podczas operacji na bazie danych (Oprawa):", error);
        
        // Zwracamy status 500, żeby frontend wiedział o błędzie
        res.status(500).json({ status: "Error", message: error.message || error });

    } finally {
        // Zwalniamy połączenie do puli

        console.log("oprawa uwagi")
        if (conn) conn.release();
    }
};

module.exports = {
    aktualizujGrupeOprawaUwagi
};