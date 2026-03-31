const {  pool } = require("../mysql");


const  zamowienieElementyPobierz = async (req,res)=>{
        const nr = req.params['nr']
        const rok = req.params['rok']

try {
        const [elementy, nazwa
        ] = await Promise.all([
            pool.execute("select * from artdruk.view_technologie_elementy where nr = ? and rok=? ORDER BY id ASC", [nr,rok]),
            pool.execute("select firma_nazwa, tytul from artdruk.view_zamowienia where nr = ? and rok=? ORDER BY id ASC", [nr,rok]),
        ]).then(results => results.map(r => r[0]));

        const dane =[elementy,nazwa]
        res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd pobierz elementy technologii:", err);
        res.status(500).json({ error: "Błąd serwera." });
    }
    }


module.exports = {
  zamowienieElementyPobierz
    
}
   

    //  const sql1 = "SELECT * FROM artdruk.view_technologie_grupy_wykonan WHERE status < 4 AND typ_grupy < 3 ORDER BY poczatek";
    //     const sql2 = "SELECT * FROM artdruk.view_technologie_grupy_wykonan_oprawa WHERE status < 4 AND typ_grupy < 3 ORDER BY poczatek";

    //     // Odpalamy oba zapytania RÓWNOLEGLE (szybciej niż jedno po drugim)
    //     const [result1, result2] = await Promise.all([
    //         conn.query(sql1),
    //         conn.query(sql2)
    //     ]);