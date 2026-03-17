const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql");

const usunRealizacjeProcesu = async (req, res) => {
    const row = req.body;
    const token = req.params['token'];
    const decoded = DecodeToken(token);
    const ID_SPRAWCY = decoded.id;
    const REALIZACJE_USUN = decoded.realizacje_usun || 0;

    const conn = await pool.getConnection();

    // jeśli użytkownik nie ma uprawnienia reazacje_usun to może skasować tylko to co sam dodał

    try {
        await conn.beginTransaction();

        // BLOKADA: Inne sesje próbujące edytować to wykonanie poczekają tutaj
        // await conn.execute("SELECT global_id FROM artdruk.technologie_wykonania WHERE global_id = ? FOR UPDATE", [row.global_id]);
        // await conn.execute("SELECT id FROM artdruk.technologie WHERE id = ? FOR UPDATE", [row.technologia_id]);
        await conn.execute("SELECT id FROM artdruk.zamowienia WHERE id = ? FOR UPDATE", [row.zamowienie_id]);


        // 1. Usunięcie realizacji z kontrolą uprawnień
        // (Używamy affectedRows, aby sprawdzić czy delete faktycznie się udał)
        const sqlDelete = "DELETE FROM artdruk.technologie_realizacje WHERE global_id=? AND (dodal=? OR 1=?);";
        const [deleteResult] = await conn.execute(sqlDelete, [row.global_id, ID_SPRAWCY, REALIZACJE_USUN]);

        if (deleteResult.affectedRows === 0) {
            // Rzucamy błąd, aby przerwać transakcję i przejść do bloku catch
            throw new Error("Brak uprawnień do skasowania realizacji lub realizacja nie istnieje");
        }

        // 2. Historia - mapowanie typu na tekst
        let eventText = "";
        switch (row.typ) {
            case 1: eventText = `Skasowano realizację: ${row.zrealizowano} ark.`; break;
            case 2: eventText = `Skasowano brak: ${row.zrealizowano} ark.`; break;
            case 3: eventText = `Skasowano rozjazd: ${row.zrealizowano} ark.`; break;
            default: eventText = `Skasowano wpis: ${row.zrealizowano} ark.`;
        }
        
        const fullEventMsg = `${eventText} grupa id: ${row.id_grupy}`;
        const sqlHist = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?,?,?,?);";
        await conn.execute(sqlHist, [ID_SPRAWCY, row.nazwa, fullEventMsg, row.zamowienie_id]);

        // 3. Statusy (Procedura)
        await conn.execute("CALL artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?)", [row.global_id_wykonania]);

        // 4. Pobranie danych do odświeżenia UI
        const sqlWyk = "SELECT status, do_wykonania FROM artdruk.technologie_wykonania WHERE global_id=?";
        const [resWyk] = await conn.execute(sqlWyk, [row.global_id_wykonania]);

        const sqlGr = "SELECT status FROM artdruk.view_technologie_grupy_wykonan WHERE technologia_id=? AND id=?";
        const [resGr] = await conn.execute(sqlGr, [row.technologia_id, row.id_grupy]);

        // Zatwierdzamy zmiany tylko jeśli wszystko powyżej przeszło pomyślnie
        await conn.commit();

        res.status(200).json({
            status: "OK",
            status_wykonania: resWyk[0]?.status || 0,
            do_wykonania: resWyk[0]?.do_wykonania || 0,
            status_grupy: resGr[0]?.status || 0
        });

    } catch (error) {
        // Jeśli wystąpił jakikolwiek błąd (w tym brak uprawnień), wycofujemy DELETE
        await conn.rollback();

        const errorMsg = error.message || error;
        // Wysyłamy maila tylko w przypadku błędów technicznych (opcjonalne)
        if (!errorMsg.includes("Brak uprawnień")) {
            SendMail(errorMsg);
        }
        
        console.error("Wystąpił błąd podczas usuwania:", errorMsg);
        res.status(200).json({ status: errorMsg });
    } finally {
        // Zwolnienie połączenia do puli


        conn.release();
    }
};

module.exports = {
    usunRealizacjeProcesu
};