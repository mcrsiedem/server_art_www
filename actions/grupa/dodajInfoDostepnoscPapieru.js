const { DecodeToken } = require("../logowanie/DecodeToken");
const { pool } = require("../mysql"); // Zostawiamy tylko pool

const dodajInfoDostepnoscPapieru = async (req, res) => {
  const data = req.body;
  const { papier_info, zamowienie_id, technologia_id, element_id } = data;
  const token = req.params['token'];

  // Dekodujemy ID sprawcy
  const ID_SPRAWCY = DecodeToken(token).id;

  try {

    // 1. Wykonujemy Update
    const sqlUpdate = `
      UPDATE artdruk.technologie_elementy 
      SET papier_info = ? 
      WHERE technologia_id = ? AND id = ? AND global_id > 0
    `;
    await pool.execute(sqlUpdate, [papier_info, technologia_id, element_id]);

    // 2. Dodajemy wpis do historii
    const sqlHistory = `
      INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) 
      VALUES (?, ?, ?, ?)
    `;
    const historyData = [ID_SPRAWCY, "Papier info ", papier_info, zamowienie_id];
    await pool.execute(sqlHistory, historyData);

    // Sukces
    res.status(200).json({ status: "OK" });

  } catch (error) {
    // catch przechwyci błąd z dowolnego await powyżej
    console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
    
    // Zmieniono status na 500, żeby front-end wiedział, że coś poszło nie tak
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  dodajInfoDostepnoscPapieru
};