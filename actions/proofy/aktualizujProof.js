const { DecodeToken } = require("../logowanie/DecodeToken");
const { pool } = require("../mysql");

const aktualizujProof = async (req, res) => {
  const data = req.body;
  const token = req.params['token'];

  // Dekodujemy ID sprawcy
  const ID_SPRAWCY = DecodeToken(token).id;

  // Wyciągamy dane z body - jeśli czegoś brakuje, podstawiamy null
  const {
    id = null,
    firma_id = null,
    klient_id = null,
    data_zamowienia = null,
    uwagi = null,
    status = null,
    format = null,
    ilosc = null,
    faktura = null
  } = data;

  try {
    // 1. Wykonujemy Update

    const sqlUpdate = `
      UPDATE artdruk.zamowienia_proofy 
      SET firma_id=?, klient_id=?, data_zamowienia=?, uwagi=?, status=?, format=?, ilosc=?, faktura=? 
      WHERE id = ?
    `;
    const updateValues = [firma_id, klient_id, data_zamowienia, uwagi, status, format, ilosc, faktura, id];
    
    await pool.execute(sqlUpdate, updateValues);

    // 2. Dodajemy wpis do historii
    const sqlHistory = "INSERT INTO artdruk.zamowienia_proof_historia (user_id, uwagi, proof_id) VALUES (?, ?, ?)";
    const historyText = `Klient: ${klient_id} Data: ${data_zamowienia} Format: ${format} Ilość: ${ilosc} Uwagi: ${uwagi} Faktura: ${faktura}`;
    
    await pool.execute(sqlHistory, [ID_SPRAWCY, historyText, id]);

    // Sukces
    res.status(200).json({ status: "ok" });

  } catch (error) {
    console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
    
    // Warto wysłać SendMail(error) jeśli masz to odkomentowane w oryginale
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  aktualizujProof
};