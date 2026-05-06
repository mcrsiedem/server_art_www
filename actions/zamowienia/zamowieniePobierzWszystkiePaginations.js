const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');

const zamowieniePobierzWszystkiePaginations = async (req, res) => {
    const token = req.params['token'];
    const orderby = req.params['orderby'];
    const zestaw = req.params['zestaw'];
    const klient_id = req.params['klient'];
    const opiekun_id_param = req.params['opiekun'];



    const page = parseInt(req.params['page']) || 1;
    const size = parseInt(req.params['size']) || 50;
    const offset = (page - 1) * size;

    let biala_lista = ["rok, nr asc", "naklad", "ilosc_stron", "data_przyjecia", "data_spedycji", "oprawa_id"];
    let biala_lista_zestaw = ["Bieżące", "Przed drukiem", "Harmonogram", "Wydrukowane", "Sfalcowane", "Oprawione", "Oddane", "Anulowane", "Wszystkie", "Gotowe do faktury", "Zafakturowane", "Brak faktury"];

    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN);
    } catch (err) {
        return res.status(401).json({ error: "Błąd autoryzacji / Token wygasł" });
    }

    const id = decoded.id; 
    const zamowienia_wszystkie = dataStore.checkPrivileges(id, "zamowienia_wszystkie");

    if (!biala_lista.includes(orderby) || !biala_lista_zestaw.includes(zestaw)) {
        return res.status(400).json({ error: "Nieprawidłowe parametry zapytania." });
    }

    try {
        // SQL dla danych
        const sql = sqlIn(id, zestaw, orderby, zamowienia_wszystkie, size, offset, false, klient_id, opiekun_id_param);
        const [rows] = await pool.execute(sql);

        // SQL dla licznika (musi mieć identyczne filtry WHERE, aby paginacja się zgadzała)
        const sqlCount = sqlIn(id, zestaw, orderby, zamowienia_wszystkie, null, null, true, klient_id, opiekun_id_param);
        const [countRows] = await pool.execute(sqlCount);
        const totalRecords = countRows[0].total;

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
        console.error("Błąd serwera:", err);
        res.status(500).json({ error: "Błąd serwera podczas pobierania danych." });
    }
};

const sqlIn = (id, zestaw, orderby, zamowienia_wszystkie, limit, offset, isCount = false, klient_id, opiekun_id_param) => {
    
    let filterParts = [];

    if (zamowienia_wszystkie) {
        // SCENARIUSZ: Admin / Uprawnienia pełne
        // 1. Filtrowanie po Kliencie (jeśli wybrano)
        if (klient_id && klient_id !== "0" && klient_id !== "Wszystkie") {
            filterParts.push(`klient_id = ${parseInt(klient_id)}`);
        }
        // 2. Filtrowanie po Opiekunie (jeśli wybrano konkretnego w selectcie)
        if (opiekun_id_param && opiekun_id_param !== "0" && opiekun_id_param !== "Wszystkie") {
            filterParts.push(`(opiekun_id = ${parseInt(opiekun_id_param)} OR asystent1 = ${parseInt(opiekun_id_param)} OR asystent2 = ${parseInt(opiekun_id_param)})`);
        }
    } else {
    // SCENARIUSZ: Brak uprawnień (Zwykły użytkownik)
        
        // 1. Wymuszamy tylko rekordy zalogowanego użytkownika (Twoja obecna logika)
        filterParts.push(`(opiekun_id = ${parseInt(id)} OR asystent1 = ${parseInt(id)} OR asystent2 = ${parseInt(id)})`);

        // 2. DODANE: Filtrowanie po Kliencie (w obrębie zamówień użytkownika)
        if (klient_id && klient_id !== "0" && klient_id !== "Wszystkie") {
            filterParts.push(`klient_id = ${parseInt(klient_id)}`);
        }
    }

    // 3. Filtrowanie po Zestawie (Etapie)
    let setClause = "";
    switch (zestaw) {
        case "Bieżące": setClause = "(etap > 1 AND etap < 16 AND status != 7)"; break;
        case "Przed drukiem": setClause = "(etap > 1 AND etap < 8 AND status != 7)"; break;
        case "Harmonogram": setClause = "(etap = 1 AND status != 7)"; break;
        case "Wydrukowane": setClause = "(etap = 8 AND status != 7)"; break;
        case "Sfalcowane": setClause = "(etap = 10 AND status != 7)"; break;
        case "Oprawione": setClause = "(etap = 11 AND status != 7)"; break;
        case "Oddane": setClause = "(etap = 16 AND status != 7)"; break;
        case "Anulowane": setClause = "(status = 7)"; break;
        case "Wszystkie": setClause = "(id > 1)"; break;
        case "Gotowe do faktury": setClause = "(koszty_status = 2 AND faktury_status < 3 AND status != 7)"; break;
        case "Zafakturowane": setClause = "(faktury_status = 3 AND status != 7)"; break;
        case "Brak faktury": setClause = "((faktury_status < 3 OR lista_faktur = '') AND status != 7)"; break;
        default: setClause = "(etap > 1 AND etap < 16 AND status != 7)";
    }
    filterParts.push(setClause);

    // Łączymy wszystkie warunki w jeden ciąg WHERE part1 AND part2 AND part3
    const finalWhere = filterParts.length > 0 ? filterParts.join(" AND ") : "1=1";

    if (isCount) {
        return `SELECT COUNT(*) as total FROM artdruk.view_zamowienia WHERE ${finalWhere}`;
    }

    return `SELECT * FROM artdruk.view_zamowienia 
            WHERE ${finalWhere} 
            ORDER BY ${orderby} 
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
};

module.exports = { zamowieniePobierzWszystkiePaginations };