const { pool } = require("../mysql");
// pobranie kompletnego zamówienia POOL - SEKWENCYJNIE
const zamowieniePobierzSingleCommit = async (req, res) => {
    const idZamowienia = req.params['idZamowienia'];

    try {
        // 1. Zapytania są teraz wykonywane PO KOLEI, dzięki słowu kluczowemu 'await'
        const [daneZamowienia] = await pool.execute("select * from artdruk.view_zamowienia where id = ? ORDER BY id ASC", [idZamowienia]);
        const [produkty] = await pool.execute("select * from artdruk.zamowienia_produkty where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [elementy] = await pool.execute("select * from artdruk.zamowienia_elementy where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [fragmenty] = await pool.execute("select * from artdruk.view_zamowienia_fragmenty where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [oprawa] = await pool.execute("select * from artdruk.view_zamowienia_oprawa where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [procesy_elementow] = await pool.execute("select * from artdruk.view_zamowienia_procesy_elementow where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [id] = await pool.execute("select id as technologia_id from artdruk.technologie where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [historia] = await pool.execute("select * from artdruk.view_zamowienia_historia where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [pakowanie] = await pool.execute("select * from artdruk.zamowienia_pakowanie where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [koszty_dodatkowe] = await pool.execute("select * from artdruk.zamowienia_koszty_dodatkowe where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [ksiegowosc] = await pool.execute("select * from artdruk.zamowienia_ksiegowosc where zamowienie_id = ? ", [idZamowienia]);
        const [faktury] = await pool.execute("select * from artdruk.view_zamowienia_faktury where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [pliki] = await pool.execute("select * from artdruk.view_zamowienia_pliki where zamowienie_id = ? ORDER BY id ASC", [idZamowienia]);
        const [procesy_produktow] = await pool.execute("select * from artdruk.view_zamowienia_procesy_produktow where id = ? ORDER BY id ASC", [idZamowienia]);

        // 2. Po wykonaniu, łączymy wyniki w jedną tablicę
        const dane = [
            daneZamowienia, produkty, elementy, fragmenty, oprawa,
            procesy_elementow, id, historia, pakowanie, koszty_dodatkowe,
            ksiegowosc, faktury, pliki, procesy_produktow
        ];

        res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd zamowieniePobierzSingleCommit:", err);
        res.status(500).json({ error: "Błąd serwera." });
    }
};

module.exports = {
    zamowieniePobierzSingleCommit
}