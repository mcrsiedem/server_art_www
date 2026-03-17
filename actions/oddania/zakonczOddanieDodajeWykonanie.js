const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql");

const zakonczOddanieDodajeWykonanie = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const ID_SPRAWCY = DecodeToken(token).id;

    const { zamowienie_id, global_id, naklad } = req.body;
    let insertId = 0;
    let brakujacyNaklad = 0;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [row.zamowienie_id]);


        // 1. SprawdzIleBrakuje - sumujemy obecne realizacje
        const sqlCheck = "SELECT SUM(zrealizowano) as realizacje FROM artdruk.oddania_wykonania WHERE oddanie_global_id = ?";
        const [rowsCheck] = await conn.execute(sqlCheck, [global_id]);
        const sumaRealizacji = rowsCheck[0].realizacje || 0;

        brakujacyNaklad = parseInt(naklad) - parseInt(sumaRealizacji);

        // 2. Insert & Historia - tylko jeśli faktycznie coś zostało do oddania
        if (brakujacyNaklad > 0) {
            // Wstawienie wykonania
            const sqlInsert = "INSERT INTO artdruk.oddania_wykonania (zamowienie_id, oddanie_global_id, zrealizowano, dodal, typ) VALUES (?, ?, ?, ?, ?)";
            const [resultInsert] = await conn.execute(sqlInsert, [zamowienie_id, global_id, brakujacyNaklad, ID_SPRAWCY, 1]);
            insertId = resultInsert.insertId;

            // Dodanie do historii
            const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
            await conn.execute(sqlHistory, [ID_SPRAWCY, "Oddanie", `Oddano ${brakujacyNaklad} szt.`, zamowienie_id]);
        }

        // 3. Status - Aktualizacja statusu grupy/zamówienia
        const sqlStatus = "CALL artdruk.aktualizacja_statusu_oddania(?, ?)";
        await conn.execute(sqlStatus, [zamowienie_id, global_id]);

        // 4. OdwiezGrupe - Pobranie danych do frontendu
        const sqlRefresh = "SELECT status, oddano FROM artdruk.view_oddania_grupy WHERE global_id = ?";
        const [rowsRefresh] = await conn.execute(sqlRefresh, [global_id]);
        const daneGrupy = rowsRefresh[0] || { status: null, oddano: 0 };

        await conn.commit();

        res.status(200).json({
            status: "OK",
            insertId: insertId,
            status_grupy: daneGrupy.status,
            brakujacy_naklad: brakujacyNaklad,
            oddano: daneGrupy.oddano
        });

    } catch (error) {
        if (conn) await conn.rollback();
        
        SendMail(error);
        console.error("Błąd w zakonczOddanieDodajeWykonanie:", error);
        res.status(500).json({ status: "Error", message: error.message });

    } finally {

        if (conn) conn.release();
    }
};

module.exports = {
    zakonczOddanieDodajeWykonanie
};