const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql");

const dodajRealizacjeProcesuBrak = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const wykonanie_global_id = row.global_id;
    const ID_SPRAWCY = DecodeToken(token).id;
    let insertId = null;

    // Pobieramy połączenie z puli
    const conn = await pool.getConnection();

    try {
        // Start transakcji
        await conn.beginTransaction();


        // BLOKADA: Inne sesje próbujące edytować to wykonanie poczekają tutaj
        // await conn.execute("SELECT global_id FROM artdruk.technologie_wykonania WHERE global_id = ? FOR UPDATE", [row.global_id]);
        // await conn.execute("SELECT id FROM artdruk.technologie WHERE id = ? FOR UPDATE", [row.technologia_id]);
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [row.zamowienie_id]);


        // 1. Sprawdź ile brakuje
        const sqlCheck = "SELECT sum(zrealizowano) as realizacje from artdruk.view_technologie_realizacje where wykonanie_global_id=?";
        const [rowsCheck] = await conn.execute(sqlCheck, [wykonanie_global_id]);
        const SUMA_REALIZACJI = rowsCheck[0]?.realizacje || 0;

        // Logika obliczeń
        const BRAKUJACE_PRZELOTY = parseInt(row.przeloty) - parseInt(SUMA_REALIZACJI);

        if (BRAKUJACE_PRZELOTY > 0) {
            // 2. Insert realizacji (tylko jeśli brakuje)
            const sqlInsert = "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id, zrealizowano, procesor_id, dodal, typ) values (?,?,?,?,?);";
            const [resInsert] = await conn.execute(sqlInsert, [row.global_id, BRAKUJACE_PRZELOTY, row.procesor_id, ID_SPRAWCY, 2]);
            insertId = resInsert.insertId;

            // 3. Historia
            const sqlHist = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) values (?,?,?,?);";
            await conn.execute(sqlHist, [ID_SPRAWCY, row.nazwa, `Dodano brak: ${BRAKUJACE_PRZELOTY} ark. grupa id: ${row.id}`, row.zamowienie_id]);
        }

        // 4. Status (zawsze aktualizujemy status po próbie dodania braków)
        await conn.execute("call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?)", [row.global_id]);

        // 5. Odśwież Wykonanie
        const sqlWykonanie = "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=?";
        const [rowsWyk] = await conn.execute(sqlWykonanie, [row.global_id]);
        const resWyk = {
            status: rowsWyk[0]?.status || 0,
            do_wykonania: rowsWyk[0]?.do_wykonania || 0
        };

        // 6. Odśwież Grupę
        const sqlGrupa = "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=?";
        const [rowsGr] = await conn.execute(sqlGrupa, [row.technologia_id, row.grupa_id]);
        const statusGrupy = rowsGr[0]?.status || 0;

        // Zatwierdzenie zmian
        await conn.commit();

        res.status(200).json({
            status: "OK",
            insertId: insertId,
            status_wykonania: resWyk.status,
            do_wykonania: resWyk.do_wykonania,
            status_grupy: statusGrupy,
            brakujace_przeloty: BRAKUJACE_PRZELOTY > 0 ? BRAKUJACE_PRZELOTY : 0
        });

    } catch (error) {
        // Wycofanie zmian w razie jakiegokolwiek błędu
        await conn.rollback();

        SendMail(error);
        console.error("Błąd w dodajRealizacjeProcesuBrak:", error);
        
        // Zwracamy błąd jako status (zgodnie z Twoim oryginałem)
        res.status(200).json({ status: error.message || error });
    } finally {
        // Zawsze zwalniamy połączenie

        conn.release();
    }
};

module.exports = {
    dodajRealizacjeProcesuBrak
};