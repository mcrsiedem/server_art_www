const { pool } = require("../mysql");

const getGrupyForProcesor = async (req, res) => {
  // #GRUPY_01
  // ProcesyView - używane w momencie zmiany procesora
  const procesor_id = req.params["procesor_id"];
  var sql =
    "select * from artdruk.view_technologie_grupy_wykonan where poczatek >  (select min(poczatek) - interval 1 day from artdruk.view_technologie_grupy_wykonan where status <4 and procesor_id = ?)  and procesor_id = ? ORDER BY poczatek";


      var sql2 =
    "SELECT * FROM artdruk.view_technologie_wykonania where procesor_id = ? and status <4";

  try {
    const [rows] = await pool.execute(sql, [procesor_id, procesor_id]);
    const [wykonania] = await pool.execute(sql2, [procesor_id]);
    res.status(200).json([rows,wykonania]);
  } catch (err) {
    console.error("Błąd w Kontrolerze:", err);
    res.status(500).json({ error: "Błąd serwera." });
  }
};

module.exports = {
  getGrupyForProcesor,
};
