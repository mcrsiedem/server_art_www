const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require("../uprawnienia/dataStore");

const zamowienieGlobalSearch = async (req, res) => {
  const token = req.params["token"];
  const dane = req.body;
  // papier_id jest już tutaj wyciągnięte, super!
  const { nr, rok, praca, klient, isbn, kod_pracy, nr_zamowienia_klienta, nr_kalkulacji, papier_id } = dane;

  let decoded;
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN);
  } catch (err) {
    return res.status(401).json({ error: "Błąd autoryzacji / Token wygasł" });
  }

  const id = decoded.id;
  const zamowienia_wszystkie = dataStore.checkPrivileges(id, "zamowienia_wszystkie");

  try {
    // ZMIANA: Dodano papier_id do argumentów wywołania funkcji sqlIn
    const { query, values } = sqlIn(nr, rok, praca, klient, isbn, kod_pracy, nr_zamowienia_klienta, nr_kalkulacji, papier_id, zamowienia_wszystkie, id);
    
    const [rows] = await pool.query(query, values);

    res.status(200).json({
      data: rows,
    });
  } catch (err) {
    console.error("Błąd serwera:", err);
    res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
  }
};

// ZMIANA: Dodano papier_id do listy przyjmowanych argumentów
const sqlIn = (nr, rok, praca, klient, isbn, kod_pracy, nr_zamowienia_klienta, nr_kalkulacji, papier_id, zamowienia_wszystkie, id) => {
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

  if (klient && klient != 0) {
    const parsedKlient = parseInt(klient, 10);
    if (!isNaN(parsedKlient)) {
      filterParts.push("klient_id = ?");
      values.push(parsedKlient);
    }
  }

  if (praca) {
    filterParts.push("tytul LIKE ?");
    values.push(`%${praca}%`); 
  }

  if (isbn) {
    filterParts.push("isbn LIKE ?");
    values.push(`%${isbn}%`); 
  }

  if (kod_pracy) {
    filterParts.push("kod_pracy LIKE ?");
    values.push(`%${kod_pracy}%`); 
  }

  if (nr_zamowienia_klienta) {
    filterParts.push("nr_zamowienia_klienta LIKE ?");
    values.push(`%${nr_zamowienia_klienta}%`); 
  }

  if (nr_kalkulacji) {
    filterParts.push("nr_kalkulacji LIKE ?");
    values.push(`%${nr_kalkulacji}%`); 
  }


  if (papier_id && papier_id != 0) {
    const parsedPapier = parseInt(papier_id, 10);
    if (!isNaN(parsedPapier)) {
      filterParts.push("id IN (SELECT zamowienie_id FROM zamowienia_elementy WHERE papier_id = ?)");
      values.push(parsedPapier);
    }
  }
  // ----------------------------------------------------------------

  if (!zamowienia_wszystkie) {
    const parsedId = parseInt(id, 10);
    if (!isNaN(parsedId)) {
      filterParts.push("(opiekun_id = ? OR asystent1 = ? OR asystent2 = ?)");
      values.push(parsedId, parsedId, parsedId);
    }
  }

  const finalWhere = filterParts.length > 0 ? filterParts.join(" AND ") : " rok = YEAR(CURDATE())";
  
  const query = `SELECT * FROM artdruk.view_zamowienia_2 WHERE ${finalWhere}`;

  console.log("Wygenerowany SQL:", query);
  console.log("Przekazane wartości:", values);

  return { query, values };
};

module.exports = { zamowienieGlobalSearch };