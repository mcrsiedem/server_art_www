const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { pool } = require("../mysql"); // Używamy tylko pool

  // specjalny guzik w zamówieniu do sztucznego ODDANIA pracy dostępny tylko dla mnie w celu porządkowania


const zamowienieOddaj = async (req, res) => {
  const data = req.body;
  const token = req.params['token'];
  
  // Zakładam, że id sprawcy jest potrzebne do logiki, którą dopiszesz, 
  // bo w samym zapytaniu SQL go nie używasz.
  const ID_SPRAWCY = DecodeToken(token).id;
  const id = data.id;

  try {

    // Korzystamy bezpośrednio z pool.query lub pool.execute.
    // Jeśli używasz mysql2/promise, możesz to zapisać tak:
    const sql = "UPDATE artdruk.zamowienia SET etap = 16 WHERE id = ?";
    
    // Wykonanie zapytania bezpośrednio przez pool
    await pool.execute(sql, [id]);

    res.status(200).json({ status: "ok" });
  } catch (error) {
    // Warto wysłać maila, ale też zalogować co dokładnie poszło nie tak
    SendMail(error);
    console.error("Błąd podczas operacji na bazie danych:", error);
    
    // Zwracamy błąd, ale pamiętaj, że wysyłanie pełnego obiektu błędu 
    // do klienta (res.json) może być ryzykowne ze względów bezpieczeństwa.
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  zamowienieOddaj
};

