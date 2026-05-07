const { pool } = require("../mysql");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { nazwaElementu } = require("../nazwy/nazwaElementu");
const { nazwaEtapPlikow } = require("../nazwy/nazwaEtapPlikow");
const { SendMail } = require("../mail/SendMail");

const updatePlikiEtapZamowienia = async (req, res) => {
    // 1. Wyciąganie danych z body i params
    const { zamowienie_id, element_id, etap, stary_etap, global_id_pliki_row } = req.body;
    const token = req.params['token'];
    
    let ID_SPRAWCY = DecodeToken(token).id;
    
    // Tworzymy interfejs obietnic dla puli
    const promisePool = pool.promise();

    try {
        // SAVE 1: Historia zamówienia (używamy execute dla prepared statements)
        const sqlHist = "INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) VALUES (?, ?, ?, ?)";
        const eventOpis = `${nazwaElementu(element_id)}. Zmiana statusu z ${nazwaEtapPlikow(stary_etap)} na ${nazwaEtapPlikow(etap)}`;
        await promisePool.execute(sqlHist, [ID_SPRAWCY, "Pliki", eventOpis, zamowienie_id]);

        // SAVE 2: Procedura aktualizacji etapu plików
        // Używamy parametrów ?, aby uniknąć SQL Injection
        const sqlCall = "CALL artdruk.update_pliki_etap_zamowienia(?, ?, ?, ?)";
        await promisePool.query(sqlCall, [zamowienie_id, element_id, global_id_pliki_row, etap]);

        // SAVE 3: Pobranie wszystkich etapów dla zamówienia, aby wyliczyć minimum
        const sqlSelect = "SELECT etap FROM artdruk.view_zamowienia_pliki WHERE zamowienie_id = ?";
        const [pliki] = await promisePool.query(sqlSelect, [zamowienie_id]);
        
        if (pliki.length === 0) {
            return res.status(200).json({ status: "Brak plików dla zamówienia" });
        }

        // Obliczamy najniższy etap (min)
        const minEtap = Math.min(...pliki.map(f => f.etap));

        // SAVE 4: Aktualizacja głównego etapu zamówienia
        const sqlUpdateZam = "UPDATE artdruk.zamowienia SET etap = ? WHERE id = ?";
        await promisePool.query(sqlUpdateZam, [minEtap, zamowienie_id]);

        // Sukces
        res.status(200).json(minEtap);

    } catch (error) {
        // Obsługa błędów i wysyłka maila
        SendMail(error);
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        
        // Zwracamy status 500 w przypadku błędu (zamiast 200), aby frontend wiedział, że coś poszło nie tak
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    updatePlikiEtapZamowienia
};