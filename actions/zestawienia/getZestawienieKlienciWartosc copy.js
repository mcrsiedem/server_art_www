const { DecodeToken } = require('../logowanie/DecodeToken');
const { pool } = require("../mysql");

     const getZestawienieKlienciWartosc = async (req,res) =>{
        const OD_KIEDY = req.params['od']
        const DO_KIEDY = req.params['do']
 
    
const sql = `
SELECT
    t1.klient_id,
    t1.firma_nazwa,
    -- Suma zrealizowania dla proces_id = 1
    SUM(CASE
        WHEN t1.proces_nazwa_id = 1 THEN t1.przeloty
        ELSE 0
    END) AS druk_przeloty,
    
    -- Suma zrealizowania dla proces_id = 3
    SUM(CASE
        WHEN t1.proces_nazwa_id = 3 THEN t1.przeloty
        ELSE 0
    END) AS falc_przeloty,
    
    -- Suma zrealizowania dla proces_id = 2
    SUM(CASE
        WHEN t1.proces_nazwa_id = 2 THEN t1.przeloty
        ELSE 0
    END) AS uszlachetnienie_przeloty
    

FROM
    artdruk.view_technologie_wykonania_zestawienie AS t1
WHERE
   
    -- Możesz dodać filtry zakresu dat lub inne filtry z poprzednich zapytań
     STR_TO_DATE(t1.data_spedycji, '%Y-%m-%d') >= ?
    AND STR_TO_DATE(t1.data_spedycji, '%Y-%m-%d') <(? + interval 1 day)
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
  getZestawienieKlienciWartosc
    
}
 

