const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql"); // Używamy tylko poola

const dodajRealizacjeProcesu = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const ID_SPRAWCY = DecodeToken(token).id;
    const wizytowka = `User: ${ID_SPRAWCY} Wykonanie global_id: ${row.global_id} Procesor: ${row.procesor_id}`;

    // Pobieramy połączenie z puli do obsługi transakcji
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // BLOKADA: Inne sesje próbujące edytować to wykonanie poczekają tutaj
        await conn.execute("SELECT global_id FROM artdruk.technologie_wykonania WHERE global_id = ? FOR UPDATE", [row.global_id]);

        // 1. Insert realizacji
        const sqlInsert = "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id, zrealizowano, procesor_id, dodal, typ) values (?,?,?,?,?);";
        const [insertResult] = await conn.execute(sqlInsert, [row.global_id, row.zrealizowano, row.procesor_id, ID_SPRAWCY, 1]);
        const insertId = insertResult.insertId;

        // 2. Historia
        const sqlHistory = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) values (?,?,?,?);";
        await conn.execute(sqlHistory, [ID_SPRAWCY, row.nazwa, `Zrealizowano: ${row.zrealizowano} ark. grupa id: ${row.id}`, row.zamowienie_id]);

        // 3. Status (Procedura)
        await conn.execute("call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?)", [row.global_id]);

        // 4. Odśwież Wykonanie
        const sqlWykonanie = "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=?";
        const [resWykonanie] = await conn.execute(sqlWykonanie, [row.global_id]);
        const statusWykonania = resWykonanie[0]?.status || 0;
        const doWykonania = resWykonanie[0]?.do_wykonania || 0;

        // 5. Odśwież Grupę
        const sqlGrupa = "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=?";
        const [resGrupa] = await conn.execute(sqlGrupa, [row.technologia_id, row.grupa_id]);
        const statusGrupy = resGrupa[0]?.status || 0;

        // 6. Aktualizacja Następnej Grupy (Procedura)
        await conn.execute("call artdruk.aktualizacja_statusow_grup(?)", [row.technologia_id]);

        // Jeśli wszystko OK, zatwierdzamy
        await conn.commit();

        res.status(200).json({
            status: "OK",
            insertId,
            status_wykonania: statusWykonania,
            do_wykonania: doWykonania,
            status_grupy: statusGrupy
        });

    } catch (error) {
        // W razie błędu wycofujemy wszystkie zmiany w bazie
        await conn.rollback();

        const errorMsg = `${wizytowka} | Błąd: ${error.message || error}`;
        SendMail(errorMsg);
        console.error("Błąd transakcji:", error);

        res.status(200).json({ status: errorMsg });
    } finally {
        // Zawsze zwalniamy połączenie do puli!
        conn.release();
    }
};

module.exports = {
    dodajRealizacjeProcesu
};