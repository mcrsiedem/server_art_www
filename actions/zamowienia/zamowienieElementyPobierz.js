const {  pool } = require("../mysql");


// pobranie kompletnego zamówienia POOL
const  zamowienieElementyPobierz = async (req,res)=>{
        const nr = req.params['nr']
        const rok = req.params['rok']

try {
        // Wykonujemy zapytania RÓWNOLEGLE na trzech wolnych połączeniach z puli
        // const [daneZamowienia,produkty,elementy,fragmenty,oprawa,procesy_elementow,id,historia,pakowanie,koszty_dodatkowe,ksiegowosc,faktury,pliki,procesy_produktow
        const [elementy
        ] = await Promise.all([
            // pool.execute("select * from artdruk.view_zamowienia where id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.zamowienia_produkty where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            pool.execute("select * from artdruk.view_technologie_elementy where nr = ? and rok=? ORDER BY id ASC", [nr,rok]),
            // pool.execute("select * from artdruk.view_zamowienia_fragmenty where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.view_zamowienia_oprawa where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.view_zamowienia_procesy_elementow where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select id as technologia_id from artdruk.technologie where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.view_zamowienia_historia where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.zamowienia_pakowanie where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.zamowienia_koszty_dodatkowe where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.zamowienia_ksiegowosc where zamowienie_id = ?  ", [idZamowienia]),
            // pool.execute("select * from artdruk.view_zamowienia_faktury where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.view_zamowienia_pliki where zamowienie_id = ?  ORDER BY id ASC", [idZamowienia]),
            // pool.execute("select * from artdruk.view_zamowienia_procesy_produktow where zamowienie_id  = ?  ORDER BY id ASC", [idZamowienia]),

        ]).then(results => results.map(r => r[0]));

        // const dane =[daneZamowienia,produkty,elementy,fragmenty,oprawa,procesy_elementow,id,historia,pakowanie,koszty_dodatkowe,ksiegowosc,faktury,pliki,procesy_produktow]
        const dane =[elementy]
        res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd pobierz elementy technologii:", err);
        res.status(500).json({ error: "Błąd serwera." });
    }
    }


module.exports = {
  zamowienieElementyPobierz
    
}
   