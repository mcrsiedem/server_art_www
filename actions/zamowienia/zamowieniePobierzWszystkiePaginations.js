const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');

const zamowieniePobierzWszystkiePaginations = async (req, res) => {
    const token = req.params['token'];
    // const pagination = req.params['token'];
    const pagination = req.body;
    
    const {currentPage,pageSize,totalPages,total,kolumna,kierunek,widok,klientId,opiekunId} = pagination;
    console.log(pagination)

    let biala_lista_kierunek = [ "asc", "desc"];
    let biala_lista_kolumna = ["nr", "rok", "technologia", "firma_nazwa", "tytul", "kod_pracy", "nr_zamowienia_klienta", "naklad", "oprawa", "ilosc_stron", "cena", "waluta_id", "wartosc_zamowienia", "data_materialow", "data_przyjecia", "data_spedycji", "utworzono", "nr_kalkulacji", "format_x", "opiekun", "firma", "status_nazwa", "stan", "etap", "lista_faktur", "koszty_status", "faktury_status"];
    let biala_lista_widok = ["Bieżące", "Przed drukiem", "Harmonogram", "Wydrukowane", "Sfalcowane", "Oprawione", "Oddane", "Anulowane", "Wszystkie", "Gotowe do faktury", "Zafakturowane", "Brak faktury"];

    const page = currentPage || 1;
    const size = pageSize|| 50;
    const offset = (page - 1) * size;

        console.log(`kierunek:  ${kierunek}`)

    let decoded;
    try {
        decoded = jwt.verify(token, ACCESS_TOKEN);
    } catch (err) {
        return res.status(401).json({ error: "Błąd autoryzacji / Token wygasł" });
    }

    const id = decoded.id; 
    const zamowienia_wszystkie = dataStore.checkPrivileges(id, "zamowienia_wszystkie");

    if (!biala_lista_kierunek.includes(kierunek) || !biala_lista_kolumna.includes(kolumna) || !biala_lista_widok.includes(widok)) {
        return res.status(400).json({ error: "Nieprawidłowe parametry zapytania." });
    }
    

    try {
        // SQL dla danych
        const sql = sqlIn(id, widok, kolumna,kierunek, zamowienia_wszystkie, size, offset, false, klientId, opiekunId);
        const [rows] = await pool.execute(sql);

        // SQL dla licznika (musi mieć identyczne filtry WHERE, aby paginacja się zgadzała)
        const sqlCount = sqlIn(id, widok, kolumna, kierunek,zamowienia_wszystkie, null, null, true, klientId, opiekunId);
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

const sqlIn = (id, widok, kolumna, kierunek, zamowienia_wszystkie, limit, offset, isCount = false, klientId, opiekunId) => {
    
    let filterParts = [];

    if (zamowienia_wszystkie) {
        // SCENARIUSZ: Admin / Uprawnienia pełne
        // 1. Filtrowanie po Kliencie (jeśli wybrano)
        if (klientId && klientId !== "0" && klientId !== "Wszystkie") {
            filterParts.push(`klient_id = ${parseInt(klientId)}`);
        }
        // 2. Filtrowanie po Opiekunie (jeśli wybrano konkretnego w selectcie)
        if (opiekunId && opiekunId !== "0" && opiekunId !== "Wszystkie") {
            filterParts.push(`(opiekun_id = ${parseInt(opiekunId)} OR asystent1 = ${parseInt(opiekunId)} OR asystent2 = ${parseInt(opiekunId)})`);
        }
    } else {
    // SCENARIUSZ: Brak uprawnień (Zwykły użytkownik)
        
        // 1. Wymuszamy tylko rekordy zalogowanego użytkownika (Twoja obecna logika)
        filterParts.push(`(opiekun_id = ${parseInt(id)} OR asystent1 = ${parseInt(id)} OR asystent2 = ${parseInt(id)})`);

        // 2. DODANE: Filtrowanie po Kliencie (w obrębie zamówień użytkownika)
        if (klientId && klientId !== "0" && klientId !== "Wszystkie") {
            filterParts.push(`klient_id = ${parseInt(klientId)}`);
        }
    }

    // 3. Filtrowanie po Zestawie (Etapie)
    let setClause = "";
    switch (widok) {
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
            ORDER BY ${kolumna} ${kierunek}  
            LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
};

module.exports = { zamowieniePobierzWszystkiePaginations };