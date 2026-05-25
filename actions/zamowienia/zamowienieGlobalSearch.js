const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require("../uprawnienia/dataStore");

const zamowienieGlobalSearch = async (req, res) => {
  const token = req.params["token"];
  // const pagination = req.params['token'];
  const pagination = req.body;
  const dane = req.body;

  const {
    currentPage,
    pageSize,
    totalPages,
    total,
    kolumna,
    kierunek,
    widok,
    klientId,
    opiekunId,
  } = pagination;
  const { nr, rok, praca, klient } = dane;

  let decoded;
  try {
    decoded = jwt.verify(token, ACCESS_TOKEN);
  } catch (err) {
    return res.status(401).json({ error: "Błąd autoryzacji / Token wygasł" });
  }

  const id = decoded.id;
  const zamowienia_wszystkie = dataStore.checkPrivileges(
    id,
    "zamowienia_wszystkie",
  );

  // if (!biala_lista_kierunek.includes(kierunek) || !biala_lista_kolumna.includes(kolumna) || !biala_lista_widok.includes(widok)) {
  //     return res.status(400).json({ error: "Nieprawidłowe parametry zapytania." });
  // }

  try {
    // SQL dla danych
    const sql = sqlIn(nr, rok, praca, klient);
    const [rows] = await pool.execute(sql);

    res.status(200).json({
      data: rows,
    });
  } catch (err) {
    console.error("Błąd serwera:", err);
    res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
  }
};

const sqlIn = (nr, rok, praca, klient) => {
  let filterParts = [];


      if (nr) {
      const parsedNr = parseInt(nr, 10);
      if (!isNaN(parsedNr)) {
        filterParts.push(`nr = ${parsedNr}`);
      }
    }

    if (rok) {
      const parsedRok = parseInt(rok, 10);
      if (!isNaN(parsedRok)) {
        filterParts.push(`rok = ${parsedRok}`);
      }
    }

    if (klient) {
      const parsedKlinet = parseInt(klient, 10);
      if (!isNaN(parsedKlinet)) {
        filterParts.push(`klient_id = ${parsedKlinet}`);
      }
    }

    if (praca) {
      filterParts.push(`tytul = ${praca}`);
    }

  if (zamowienia_wszystkie) {

  } else {
    // SCENARIUSZ: Brak uprawnień (Zwykły użytkownik)
    // 1. Wymuszamy tylko rekordy zalogowanego użytkownika (Twoja obecna logika)
    filterParts.push(`(opiekun_id = ${parseInt(id)}`);
  }



  // 3. Filtrowanie po Zestawie (Etapie)
  let setClause = "";
  switch (widok) {
    case "Bieżące":
      setClause = "(etap > 1 AND etap < 16 AND status != 7)";
      break;
    case "Przed drukiem":
      setClause = "(etap > 1 AND etap < 8 AND status != 7)";
      break;
    case "Harmonogram":
      setClause = "(etap = 1 AND status != 7)";
      break;
    case "Wydrukowane":
      setClause = "(etap = 8 AND status != 7)";
      break;
    case "Sfalcowane":
      setClause = "(etap = 10 AND status != 7)";
      break;
    case "Oprawione":
      setClause = "(etap = 11 AND status != 7)";
      break;
    case "Oddane":
      setClause = "(etap = 16 AND status != 7)";
      break;
    case "Anulowane":
      setClause = "(status = 7)";
      break;
    case "Wszystkie":
      setClause = "(id > 1)";
      break;
    case "Gotowe do faktury":
      setClause = "(koszty_status = 2 AND faktury_status < 3 AND status != 7)";
      break;
    case "Zafakturowane":
      setClause = "(faktury_status = 3 AND status != 7)";
      break;
    case "Brak faktury":
      setClause = "((faktury_status < 3 OR lista_faktur = '') AND status != 7)";
      break;
    default:
      setClause = "(etap > 1 AND etap < 16 AND status != 7)";
  }
  filterParts.push(setClause);

  // Łączymy wszystkie warunki w jeden ciąg WHERE part1 AND part2 AND part3
  const finalWhere = filterParts.length > 0 ? filterParts.join(" AND ") : "1=1";

  if (isCount) {
    return `SELECT COUNT(*) as total FROM artdruk.view_zamowienia_2 WHERE ${finalWhere}`;
  }

  return `SELECT * FROM artdruk.view_zamowienia_2 
            WHERE ${finalWhere} 
            ORDER BY ${kolumna} ${kierunek}  
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
};

module.exports = { zamowienieGlobalSearch };
