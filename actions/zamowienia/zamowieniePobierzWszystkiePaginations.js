const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');

const zamowieniePobierzWszystkiePaginations = async (req, res) => {
    const token = req.params['token'];
    const orderby = req.params['orderby'];
    const zestaw = req.params['zestaw'];
    const klient = req.params['klient'];
    const opiekun = req.params['opiekun'];

console.log(` Klient: ${klient}  Opiekun: ${opiekun}`)

    // Parametry paginacji z query stringa (np. ?page=1&size=50)
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 50;
    const offset = (page - 1) * size;

    let biala_lista = ["rok, nr asc", "naklad", "ilosc_stron", "data_przyjecia", "data_spedycji", "oprawa_id"];
    let biala_lista_zestaw = ["Bieżące", "Przed drukiem", "Harmonogram", "Wydrukowane", "Sfalcowane", "Oprawione", "Oddane", "Anulowane", "Wszystkie", "Gotowe do faktury", "Zafakturowane", "Brak faktury"];

    // 1. Weryfikacja tokena (opakowana w Promise dla czytelności)
    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN);
    } catch (err) {
        return res.status(401).json({ error: "Błąd autoryzacji / Token wygasł" });
    }

    const id = decoded.id;
    const zamowienia_wszystkie = dataStore.checkPrivileges(id, "zamowienia_wszystkie");

    // 2. Walidacja parametrów sortowania i zestawu
    if (!biala_lista.includes(orderby) || !biala_lista_zestaw.includes(zestaw)) {
        return res.status(400).json({ error: "Nieprawidłowe parametry zapytania." });
    }

    try {
        // 3. Pobranie danych z LIMIT i OFFSET
        const sql = sqlIn(id, zestaw, orderby, zamowienia_wszystkie, size, offset);
        const [rows] = await pool.execute(sql);

        // 4. Pobranie łącznej liczby rekordów (dla frontendu)
        const sqlCount = sqlIn(id, zestaw, orderby, zamowienia_wszystkie, null, null, true);
        const [countRows] = await pool.execute(sqlCount);
        const totalRecords = countRows[0].total;

        // 5. Zwrócenie wzbogaconego obiektu
        res.status(200).json({
            data: rows,
            pagination: {
                total: totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / size),
                pageSize: size
            }
        });

    } catch (err) {
        console.error("Błąd w Kontrolerze:", err);
        res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
    }
};

// Funkcja generująca SQL
const sqlIn = (id, zestaw, orderby, zamowienia_wszystkie, limit, offset, isCount = false) => {
    let opiekun = zamowienia_wszystkie 
        ? " " 
        : `(opiekun_id = ${id} or asystent1 = ${id} or asystent2 = ${id}) and `;

    let whereClause = "";

    switch (zestaw) {
        case "Bieżące": whereClause = "(etap > 1 and etap < 16 and status != 7)"; break;
        case "Przed drukiem": whereClause = "(etap > 1 and etap < 8 and status != 7)"; break;
        case "Harmonogram": whereClause = "(etap = 1 and status != 7)"; break;
        case "Wydrukowane": whereClause = "(etap = 8 and status != 7)"; break;
        case "Sfalcowane": whereClause = "(etap = 10 and status != 7)"; break;
        case "Oprawione": whereClause = "(etap = 11 and status != 7)"; break;
        case "Oddane": whereClause = "(etap = 16 and status != 7)"; break;
        case "Anulowane": whereClause = "(status = 7)"; break;
        case "Wszystkie": whereClause = "id > 1"; break;
        case "Gotowe do faktury": whereClause = "(koszty_status = 2 and faktury_status < 3 and status != 7)"; break;
        case "Zafakturowane": whereClause = "(faktury_status = 3 and status != 7)"; break;
        case "Brak faktury": whereClause = "((faktury_status < 3 or lista_faktur='') and status != 7)"; break;
        default: whereClause = "(etap > 1 and etap < 16 and status != 7)";
    }

    // Jeśli to tylko licznik, zwracamy prostsze zapytanie
    if (isCount) {
        return `SELECT COUNT(*) as total FROM artdruk.view_zamowienia WHERE ${opiekun} ${whereClause}`;
    }

    // Zapytanie z paginacją
    return `SELECT * FROM artdruk.view_zamowienia 
            WHERE ${opiekun} ${whereClause} 
            ORDER BY ${orderby} 
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
};

module.exports = {
    zamowieniePobierzWszystkiePaginations
};