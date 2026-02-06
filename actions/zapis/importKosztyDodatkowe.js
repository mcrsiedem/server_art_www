const { DecodeToken } = require('../logowanie/DecodeToken');
const { pool } = require("../mysql");

// ładuje ponownie uprawnienia z bazy do serwera

     const importKosztyDodatkowe = async (req,res) =>{
        const NR = req.params['nr'] || 90
        const ROK = req.params['rok'] || 2026
        // const GRUPA = req.params['grupa'] 

  //  console.log("OD_KIEDY:"+ OD_KIEDY)
  //  console.log("DO_KIEDY:"+ DO_KIEDY)
  //  console.log("KTO:"+ KTO)

     
    
const sql = `
        SELECT
            zkd.id,
            zkd.indeks,
            zkd.nazwa
        FROM
            artdruk.zamowienia_koszty_dodatkowe AS zkd
            INNER JOIN 
        artdruk.zamowienia AS z ON zkd.zamowienie_id = z.id
        WHERE
            z.nr = ?
            AND z.rok = ?
        order by indeks asc
         
    `;

    try {
    const [rows] = await pool.execute(sql,[NR,ROK]) 
    results = [rows];
    res.status(200).json(rows);
  } catch (err) {
    console.error("Błąd w Kontrolerze:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }   
     
         }


module.exports = {
  importKosztyDodatkowe
    
}
 

