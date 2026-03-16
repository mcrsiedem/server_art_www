const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql");

const zakonczArkusz = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const wykonanie_global_id = row.global_id;
    const ID_SPRAWCY = DecodeToken(token).id;

    let id = null;
    let idRozjazdu = null;
    let brakujace_przeloty_wynik = 0;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // 1. Insert podstawowej realizacji
        const sqlInsert = "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id, zrealizowano, procesor_id, dodal, typ) values (?,?,?,?,?);";
        const [resInsert] = await conn.execute(sqlInsert, [row.global_id, row.zrealizowano, row.procesor_id, ID_SPRAWCY, 1]);
        id = resInsert.insertId;

        // 2. Sprawdź ile brakuje (po dodaniu powyższej realizacji)
        const sqlCheck = "SELECT sum(zrealizowano) as realizacje from artdruk.view_technologie_realizacje where wykonanie_global_id=?";
        const [rowsCheck] = await conn.execute(sqlCheck, [wykonanie_global_id]);
        const SUMA_REALIZACJI = rowsCheck[0]?.realizacje || 0;

        // 3. Logika "Rozjazdu"
        const BRAKUJACE_PRZELOTY = parseInt(row.przeloty) - parseInt(SUMA_REALIZACJI);
        
        if (BRAKUJACE_PRZELOTY > 0) {
            const sqlInsertRozjazd = "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id, zrealizowano, procesor_id, dodal, typ) values (?,?,?,?,?);";
            const [resRozjazd] = await conn.execute(sqlInsertRozjazd, [row.global_id, BRAKUJACE_PRZELOTY, row.procesor_id, ID_SPRAWCY, 3]);
            idRozjazdu = resRozjazd.insertId;
            brakujace_przeloty_wynik = BRAKUJACE_PRZELOTY;
        }

        // 4. Historia
        const sqlHist = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) values (?,?,?,?);";
        await conn.execute(sqlHist, [ID_SPRAWCY, row.nazwa, `Zrealizowano: ${row.zrealizowano} ark. grupa id: ${row.id}`, row.zamowienie_id]);

        // 5. Procedury statusowe
        await conn.execute("call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?)", [row.global_id]);
        await conn.execute("call artdruk.aktualizacja_statusow_grup(?)", [row.technologia_id]);

        // 6. Pobranie danych zwrotnych
        const sqlWykonanie = "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=?";
        const [resWyk] = await conn.execute(sqlWykonanie, [row.global_id]);
        
        const sqlGrupa = "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=?";
        const [resGr] = await conn.execute(sqlGrupa, [row.technologia_id, row.grupa_id]);

        // Zatwierdzenie wszystkiego
        await conn.commit();

        res.status(200).json({
            status: "OK",
            insertId: id,
            status_wykonania: resWyk[0]?.status || 0,
            do_wykonania: resWyk[0]?.do_wykonania || 0,
            status_grupy: resGr[0]?.status || 0,
            idRozjazdu: idRozjazdu,
            brakujace_przeloty: brakujace_przeloty_wynik
        });

    } catch (error) {
        await conn.rollback();
        
        SendMail(error);
        console.error("Błąd podczas kończenia arkusza:", error);
        
        res.status(200).json({ status: error.message || error });
    } finally {

        conn.release();
    }
};

module.exports = {
    zakonczArkusz
};