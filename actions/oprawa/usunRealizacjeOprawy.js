const { DecodeToken } = require("../logowanie/DecodeToken");
const { pool } = require("../mysql"); // Zakładamy, że mysql.js eksportuje pool z obsługą promise

const usunRealizacjeOprawy = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    
    // Dekodowanie tokena
    const decoded = DecodeToken(token);
    const ID_SPRAWCY = decoded.id;
    const REALIZACJE_USUN = decoded.realizacje_usun || 0;

    const { zamowienie_id, id_grupy, global_id_grupy, global_id: global_id_wykonania_oprawy, naklad } = req.body;

    // Pobieramy połączenie z puli
    const conn = await pool.getConnection();

    try {
        // 1. Rozpoczęcie transakcji
        await conn.beginTransaction();
        // await conn.execute("SELECT id FROM artdruk.technologie WHERE id = ? FOR UPDATE", [row.technologia_id]);
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [row.zamowienie_id]);



        // 2. Usunięcie realizacji
        const sqlDelete = "DELETE FROM artdruk.technologie_wykonania_oprawa WHERE global_id=? AND (dodal=? OR 1=?)";
        await conn.execute(sqlDelete, [global_id_wykonania_oprawy, ID_SPRAWCY, REALIZACJE_USUN]);

        // 3. Dodanie do historii
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        const historyMsg = `Usunięto realizację oprawy : ${naklad} szt.`;
        await conn.execute(sqlHistory, [ID_SPRAWCY, "Oprawa", historyMsg, zamowienie_id]);

        // 4. Aktualizacja statusu (Procedura)
        const sqlStatus = "CALL artdruk.aktualizacja_statusu_oprawy_vs_realizacja(?, ?)";
        await conn.execute(sqlStatus, [zamowienie_id, id_grupy]);

        // 5. Pobranie nowego statusu grupy
        const sqlRefresh = "SELECT status, zrealizowano FROM artdruk.view_technologie_grupy_wykonan_oprawa WHERE global_id=?";
        const [rows] = await conn.execute(sqlRefresh, [global_id_grupy]);
        
        if (rows.length === 0) {
            throw new Error("Nie odnaleziono grupy po aktualizacji.");
        }

        const res4 = rows[0];

        // 6. Zatwierdzenie transakcji
        await conn.commit();

        res.status(200).json({
            status: "OK",
            status_grupy: res4.status,
            zrealizowano: res4.zrealizowano
        });

    } catch (error) {
        // W razie błędu wycofujemy wszystkie zmiany
        await conn.rollback();
        
        console.error("Błąd transakcji:", error);
        res.status(500).json({ status: "Error", message: error.message });
    } finally {
        // Bardzo ważne: zwolnienie połączenia z powrotem do puli
        conn.release();
    }
};

module.exports = { usunRealizacjeOprawy };