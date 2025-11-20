const { DecodeToken } = require('../logowanie/DecodeToken');
const { pool } = require("../mysql");

// ładuje ponownie uprawnienia z bazy do serwera

     const getZestawienieKlienci = async (req,res) =>{
        const OD_KIEDY = req.params['od']
        const DO_KIEDY = req.params['do']
        // const GRUPA = req.params['grupa'] 

  //  console.log("OD_KIEDY:"+ OD_KIEDY)
  //  console.log("DO_KIEDY:"+ DO_KIEDY)
  //  console.log("KTO:"+ KTO)

     
    
const sql = `
SELECT
    t1.klient_id,
    t1.firma_nazwa,
    -- Suma zrealizowania dla proces_id = 1
    SUM(CASE
        WHEN t1.proces_nazwa_id = 1 THEN t1.zrealizowano
        ELSE 0
    END) AS druk_przeloty,
    
    -- Suma zrealizowania dla proces_id = 3
    SUM(CASE
        WHEN t1.proces_nazwa_id = 3 THEN t1.zrealizowano
        ELSE 0
    END) AS falc_przeloty,
    
    -- Suma zrealizowania dla proces_id = 2
    SUM(CASE
        WHEN t1.proces_nazwa_id = 2 THEN t1.zrealizowano
        ELSE 0
    END) AS uszlachetnienie_przeloty
    

FROM
    artdruk.view_realizacje_zestawienie AS t1
WHERE
    t1.typ = 1
    -- Możesz dodać filtry zakresu dat lub inne filtry z poprzednich zapytań
    AND STR_TO_DATE(t1.utworzono, '%Y-%m-%d %H:%i') >= ?
    AND STR_TO_DATE(t1.utworzono, '%Y-%m-%d %H:%i') <(? + interval 1 day)
GROUP BY
    t1.klient_id,
    t1.firma_nazwa -- Grupujemy po identyfikatorze i nazwie klienta
ORDER BY
   druk_przeloty DESC;
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
  getZestawienieKlienci
    
}
 

