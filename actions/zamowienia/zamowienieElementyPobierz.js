const {  pool } = require("../mysql");


const  zamowienieElementyPobierz = async (req,res)=>{
        const nr = req.params['nr']
        const rok = req.params['rok']

try {
        const [elementy
        ] = await Promise.all([
            pool.execute("select * from artdruk.view_technologie_elementy where nr = ? and rok=? ORDER BY id ASC", [nr,rok]),
        ]).then(results => results.map(r => r[0]));

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
   