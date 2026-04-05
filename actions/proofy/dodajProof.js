const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql"); // używamy pool

const dodajProof = async (req, res) => {
  const token = req.params["token"];
  const decoded = DecodeToken(token);
  const ID_SPRAWCY = decoded.id;

  console.log(`dodaj proofa`);

  try {
    const sql = "INSERT INTO artdruk.zamowienia_proofy (utworzyl_user_id) VALUES (?)";
    
    // pool.execute zwraca tablicę [rows, fields], używamy destrukturyzacji
    const [result] = await pool.execute(sql, [ID_SPRAWCY]);

    console.log("Nowy ID:", result.insertId);
    
    res.status(200).json({ 
      status: "ok", 
      id: result.insertId 
    });

  } catch (error) {
    // Warto wysłać maila z informacją o błędzie
    SendMail(error);
    console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
    
    // Zwracamy status 500 przy błędzie (zamiast 200), żeby frontend wiedział, że coś poszło nie tak
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  dodajProof
};