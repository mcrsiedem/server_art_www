const {  pool } = require("../mysql");

const { DecodeToken } = require("../logowanie/DecodeToken");
const { nazwaElementu } = require("../nazwy/nazwaElementu");
const { nazwaEtapPlikow } = require("../nazwy/nazwaEtapPlikow");
const { SendMail } = require("../mail/SendMail");


const updatePlikiEtapGrupyWykonan = async (req, res) => {
    // 1. Deklaracja zmiennych i pobranie tokenu
    const zamowienie_id = req.body.zamowienie_id;
    const element_id = req.body.element_id;
    const etap = req.body.etap;
    const global_id_grupa_row = req.body.global_id_grupa_row;
    const stary_etap = req.body.stary_etap;

    const token = req.params['token'];
    let ID_SPRAWCY = DecodeToken(token).id;
    
    // Zmienna na połączenie, które pobierzemy z puli
    let connection;

    try {
        // 2. Pobranie połączenia z puli
        connection = await pool.getConnection();

        // 3. Rozpoczęcie transakcji
        await connection.beginTransaction();
        
        // 4. Wykonanie operacji w ramach transakcji (save, save2)

        // Operacja 1: Wstawienie do historii (save)
        let data1 = [
            ID_SPRAWCY,
            "Pliki",
            nazwaElementu(element_id) + ". Zmiana statusu z " + nazwaEtapPlikow(stary_etap) + " na " + nazwaEtapPlikow(etap),
            zamowienie_id
        ];
        var sql1 = "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?);";
        await connection.execute(sql1, data1);
        // Po udanym wykonaniu, kontynuujemy

        // Operacja 2: Wywołanie procedury składowanej (save2)
        // Uwaga: Użycie connection.query dla CALL i pool.execute dla INSERT/UPDATE/SELECT jest ok, ale 
        // dla czystości kodu i bezpieczeństwa, można użyć connection.execute z placeholderami
        // jeśli procedura składowana nie akceptuje, poniższe użycie connection.query jest poprawne.
        var sql2 = "call artdruk.update_pliki_etap_grupy_wykonan (?, ?, ?, ?)";
        await connection.execute(sql2, [zamowienie_id, element_id, global_id_grupa_row, etap]);
        // Po udanym wykonaniu, kontynuujemy
        
        var sql3 = "select etap from artdruk.view_zamowienia_pliki where zamowienie_id = ?";
        const [rows] = await connection.execute(sql3, [zamowienie_id]);
        
        let min_etap;
        if (rows && rows.length > 0) {
            // Obliczanie minimalnego etapu z wyników
            min_etap = Math.min(...rows.map((f) => f.etap));
        } else {
            // Jeśli nie ma plików, ustal minimalny etap na jakąś domyślną wartość lub obsłuż błąd
            // Zakładamy, że zawsze są pliki w widoku dla danego zamowienia_id, jeśli nie, to może być błąd logiki.
            // Dla uproszczenia: jeśli nie ma wierszy, bierzemy aktualnie ustawiony 'etap' lub inną logiczną wartość.
            min_etap = etap; // Przykład: Jeśli widok jest pusty, używamy aktualnie ustawionego etapu.
        }

        // Operacja 4: Aktualizacja etapu zamówienia (save4)
        var sql4 = "update artdruk.zamowienia set etap = ? where id = ?";
        await connection.execute(sql4, [min_etap, zamowienie_id]);

        // 6. Zatwierdzenie transakcji
        await connection.commit();

        // 7. Zwrócenie odpowiedzi
        res.status(200).json('OK');

    } catch (error) {
        // 8. Wycofanie transakcji w przypadku błędu
        if (connection) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                // Logowanie błędu wycofania transakcji
                console.error("Błąd podczas rollbacku transakcji:", rollbackError);
            }
        }
        
        // 9. Obsługa błędu (wysłanie maila i zwrócenie odpowiedzi)
        console.error("Błąd podczas aktualizacji etapu plików:", error);
        SendMail(error);
        // Zwracamy status błędu HTTP i komunikat
        res.status(500).json('ERROR'); 

    } finally {
        // 10. Zwolnienie połączenia z powrotem do puli
        if (connection) {
            connection.release();
        }
    }
}


module.exports = {
    updatePlikiEtapGrupyWykonan
    
}
 