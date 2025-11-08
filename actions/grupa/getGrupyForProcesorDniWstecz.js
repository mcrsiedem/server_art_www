const { DecodeToken } = require("../logowanie/DecodeToken");
const { connection, pool } = require("../mysql");

const getGrupyForProcesorDniWstecz = async (req, res) => {

            // #GRUPY_01
            // ProcesyView - używane w momencie zmiany procesora  
              const procesor_id = req.params['procesor_id']
             const dniWstecz = req.params['dniWstecz']
             var sql = "select * from artdruk.view_technologie_grupy_wykonan where poczatek >  ?  and procesor_id = ? ORDER BY poczatek";

            try {
            const [rows] = await pool.execute(sql, [dniWstecz,procesor_id]); 
            res.status(200).json([rows]);
        } catch (err) {
            console.error("Błąd w Kontrolerze:", err);
            res.status(500).json({ error: "Błąd serwera." });
        }


     }


module.exports = {
  getGrupyForProcesorDniWstecz
};


