const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require("../uprawnienia/dataStore");

const zamowienieGlobalSearch = async (req, res) => {
  const token = req.params["token"];
  const dane = req.body;
  const { nr, rok, praca, klient } = dane;

  let decoded;
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN);
  } catch (err) {
    return res.status(401).json({ error: "Błąd autoryzacji / Token wygasł" });
  }

  const id = decoded.id;
  const zamowienia_wszystkie = dataStore.checkPrivileges(id, "zamowienia_wszystkie");

  try {
    const { query, values } = sqlIn(nr, rok, praca, klient, zamowienia_wszystkie, id);
    
    // ZMIANA: Używamy .query zamiast .execute - jest odporniejsze na dynamiczne zapytania
    const [rows] = await pool.query(query, values);

    res.status(200).json({
      data: rows,
    });
  } catch (err) {
    console.error("Błąd serwera:", err);
    res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
  }
};

const sqlIn = (nr, rok, praca, klient, zamowienia_wszystkie, id) => {
  let filterParts = [];
  let values = [];

  if (nr) {
    const parsedNr = parseInt(nr, 10);
    if (!isNaN(parsedNr)) {
      filterParts.push("nr = ?");
      values.push(parsedNr);
    }
  }

  if (rok) {
    const parsedRok = parseInt(rok, 10);
    if (!isNaN(parsedRok)) {
      filterParts.push("rok = ?");
      values.push(parsedRok);
    }
  }

  if (klient && klient !=0) {
    const parsedKlient = parseInt(klient, 10);
    if (!isNaN(parsedKlient)) {
      filterParts.push("klient_id = ?");
      values.push(parsedKlient);
    }
  }

  // Najbardziej podatne miejsce na SQL Injection - teraz w 100% bezpieczne
  if (praca) {
    filterParts.push("tytul LIKE ?");
    values.push(`%${praca}%`); 
  }

  if (!zamowienia_wszystkie) {
    const parsedId = parseInt(id, 10);
    if (!isNaN(parsedId)) {
      filterParts.push("(opiekun_id = ? OR asystent1 = ? OR asystent2 = ?)");
      // Popychamy ID dokładnie 3 razy, bo mamy 3 znaki zapytania w tym jednym stringu
      values.push(parsedId, parsedId, parsedId);
    }
  }

  const finalWhere = filterParts.length > 0 ? filterParts.join(" AND ") : "1=1";
  const query = `SELECT * FROM artdruk.view_zamowienia_2 WHERE ${finalWhere}`;

  // Logi w konsoli - bardzo ważne do debugowania!
  console.log("Wygenerowany SQL:", query);
  console.log("Przekazane wartości:", values);

  return { query, values };
};

module.exports = { zamowienieGlobalSearch };