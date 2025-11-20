const { DecodeToken } = require('../logowanie/DecodeToken');
const { pool } = require("../mysql");

// ładuje ponownie uprawnienia z bazy do serwera

     const getZestawienieProcesory = async (req,res) =>{
        const OD_KIEDY = req.params['od']
        const DO_KIEDY = req.params['do']
        // const GRUPA = req.params['grupa'] 

  //  console.log("OD_KIEDY:"+ OD_KIEDY)
  //  console.log("DO_KIEDY:"+ DO_KIEDY)
  //  console.log("KTO:"+ KTO)

     
    
const sql = `
SELECT
            t1.procesor_id,
            SUM(t1.zrealizowano) AS SumaZrealizowano,
            COUNT(*) AS LiczbaWpisow
        FROM
            view_technologie_realizacje AS t1
        WHERE
            t1.typ = 1 
            AND t1.utworzono >= ?
            AND t1.utworzono <(? + interval 1 day)
        GROUP BY
            t1.procesor_id
        ORDER BY
            LiczbaWpisow DESC;
    `;

    try {
    const [rows] = await pool.execute(sql,[OD_KIEDY,DO_KIEDY]) 
    results = [rows];
    res.status(200).json(rows);
  } catch (err) {
    console.error("Błąd w Kontrolerze:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }   
     
         }


module.exports = {
  getZestawienieProcesory
    
}
 

