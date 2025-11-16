const { DecodeToken } = require('../logowanie/DecodeToken');
const { pool } = require("../mysql");

// ładuje ponownie uprawnienia z bazy do serwera

     const getZestawienieUser = async (req,res) =>{
        const OD_KIEDY = req.params['od']
        const DO_KIEDY = req.params['do']
        const KTO = req.params['kto'] 

  //  console.log("OD_KIEDY:"+ OD_KIEDY)
  //  console.log("DO_KIEDY:"+ DO_KIEDY)
  //  console.log("KTO:"+ KTO)

    sql = "SELECT * FROM artdruk.view_realizacje_zestawienie where dodal_id = ? and utworzono > ? and utworzono < ? order by utworzono" ;
              try {
    const [rows] = await pool.execute(sql,[KTO,OD_KIEDY,DO_KIEDY]) 
    results = [rows];
    res.status(200).json(rows);
  } catch (err) {
    console.error("Błąd w Kontrolerze:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }   
     
         }


module.exports = {
  getZestawienieUser
    
}
 

