

// const { connection, pool } = require("./mysql");
const { pool } = require("./mysql");
const jwt = require("jsonwebtoken");
// const { teraz } = require("./czas/teraz");
// const { dodaj_minuty } = require("./czas/dodaj_minuty");
const { ACCESS_TOKEN } = require("./logowanie/ACCESS_TOKEN");
// const { DecodeToken } = require("./logowanie/DecodeToken");
// const { nazwaEtapPlikow } = require("./nazwy/nazwaEtapPlikow");
// const { nazwaElementu } = require("./nazwy/nazwaElementu");
const { exec } = require('child_process');

class Connections {


async getUser(req, res) {
    const getFormattedTimestamp = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const login = req.params['login'];
    const haslo = req.params['haslo'];
    const hash = req.params['hash'];

    console.log(`${getFormattedTimestamp()} : Logowanie. Login: ${login}`);

    let conn;
    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // 1. Pobieramy wersję - czekamy na wynik (await)
        const [verResult] = await conn.query("SELECT ver, utworzono FROM artdruk.version ORDER BY id DESC LIMIT 1");
        const version = verResult;

        // 2. Szukamy użytkownika
        const sql = "SELECT id, imie, nazwisko, login, haslo, zamowienie_przyjmij, zamowienie_skasuj, zamowienie_odblokuj, zamowienie_zapis, zamowienie_oddaj, klienci_wszyscy, klienci_zapis, klienci_usun, papier_zapis, papier_usun, procesy_edycja, zamowienia_wszystkie, technologie_wszystkie, technologia_zapis, harmonogram_przyjmij, wersja_max, mini_druk, mini_falc, mini_oprawa, mini_uv, mini_inne, manage_druk, manage_falc, manage_oprawa, manage_inne, procesor_domyslny, uprawnienia_ustaw, asystent1, asystent2, realizacje_dodaj, realizacje_usun, gant, zestawienia, procesy_kooperacja FROM artdruk.users WHERE login = ? AND haslo = ?;";

        const [result] = await conn.execute(sql, [login, haslo]);

        if (result.length > 0) {
            const row = result[0];

            // Mapujemy wszystkie Twoje pola do payloadu (zachowując Twoją strukturę)
            const payload = {
                id: row.id,
                imie: row.imie,
                nazwisko: row.nazwisko,
                login: row.login,
                zamowienie_przyjmij: row.zamowienie_przyjmij,
                zamowienie_zapis: row.zamowienie_zapis,
                zamowienie_oddaj: row.zamowienie_oddaj,
                zamowienie_odblokuj: row.zamowienie_odblokuj,
                klienci_wszyscy: row.klienci_wszyscy,
                klienci_zapis: row.klienci_zapis,
                zamowienie_skasuj: row.zamowienie_skasuj,
                klienci_usun: row.klienci_usun,
                papier_zapis: row.papier_zapis,
                papier_usun: row.papier_usun,
                procesy_edycja: row.procesy_edycja,
                zamowienia_wszystkie: row.zamowienia_wszystkie,
                technologie_wszystkie: row.technologie_wszystkie,
                technologia_zapis: row.technologia_zapis,
                harmonogram_przyjmij: row.harmonogram_przyjmij,
                wersja_max: row.wersja_max,
                mini_druk: row.mini_druk,
                mini_falc: row.mini_falc,
                mini_oprawa: row.mini_oprawa,
                mini_uv: row.mini_uv,
                mini_inne: row.mini_inne,
                manage_druk: row.manage_druk,
                manage_falc: row.manage_falc,
                manage_oprawa: row.manage_oprawa,
                manage_inne: row.manage_inne,
                procesor_domyslny: row.procesor_domyslny,
                uprawnienia_ustaw: row.uprawnienia_ustaw,
                asystent1: row.asystent1,
                asystent2: row.asystent2,
                realizacje_dodaj: row.realizacje_dodaj,
                realizacje_usun: row.realizacje_usun,
                gant: row.gant,
                zestawienia: row.zestawienia,
                procesy_kooperacja: row.procesy_kooperacja
            };

            const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: '8h' });

            // 3. Zapis do historii (Sukces)
            const historySql = "INSERT INTO artdruk.historia (user_id, user, kategoria, version) VALUES (?, ?, ?, ?);";
            await conn.query(historySql, [row.id, `${row.imie} ${row.nazwisko}`, "Logowanie", hash]);

            return res.status(200).json([token, version]);

        } else {
            // 4. Zapis do historii (Błąd logowania)
            const failHistorySql = "INSERT INTO artdruk.historia (user_id, user, kategoria, event, version) VALUES (?, ?, ?, ?, ?);";
            await conn.execute(failHistorySql, [0, "", "Logowanie", `${login} ${haslo}`, hash]);

            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }

    } catch (err) {
        console.error("Błąd bazy danych:", err);
        return res.status(500).json({ Status: "Error", Error: "Error in running query" });
    } finally {
        // Bardzo ważne - zwolnienie połączenia do puli!
        if (conn) conn.release();
    }
}


     isLogged(req,res){
        //  przed wywyłaniem tej fukncji sprawdzany jest verifyToken jako middleware w endpoincie
      //   const token = req.params['token']
      
      
       return res.json({Status: "Success"});
      }







    //---
         
    async getPapieryParametry(req, res) {
    let conn;
    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Start transakcji
        await conn.beginTransaction();

        const dane = [];

        // Lista tabel do odpytania (zachowujemy Twoją kolejność)
        // Używamy await przy każdym, żeby mieć pewność, że dane wskakują do tablicy po kolei
        
        const [viewPapiery] = await conn.query("SELECT * FROM artdruk.view_papiery;");
        dane.push(viewPapiery);

        const [papieryNazwy] = await conn.query("SELECT * FROM artdruk.papiery_nazwy;");
        dane.push(papieryNazwy);

        const [papieryGrupa] = await conn.query("SELECT * FROM artdruk.papiery_grupa;");
        dane.push(papieryGrupa);

        const [papieryPostac] = await conn.query("SELECT * FROM artdruk.papiery_postac;");
        dane.push(papieryPostac);

        const [papieryRodzaj] = await conn.query("SELECT * FROM artdruk.papiery_rodzaj;");
        dane.push(papieryRodzaj);

        const [papieryWykonczenia] = await conn.query("SELECT * FROM artdruk.papiery_wykonczenia;");
        dane.push(papieryWykonczenia);

        const [papieryPowleczenie] = await conn.query("SELECT * FROM artdruk.papiery_powleczenie;");
        dane.push(papieryPowleczenie);

        // Jeśli wszystko poszło ok, robimy commit
        await conn.commit();

        // console.log("Pobranie papierów oraz parametrów zakończone sukcesem");
        res.status(200).json(dane);

    } catch (err) {
        // Jeśli jakikolwiek SELECT rzuci błąd, cofamy wszystko
        if (conn) await conn.rollback();
        
        console.error("Błąd w getPapieryParametry:", err);
        res.status(203).json(err);
    } finally {
        // Zawsze zwracamy połączenie do puli!
        if (conn) conn.release();
    }
}




        async getParametryTechnologii(req, res) {
    const idTechnologii = req.params['idTechnologii'];
    let conn;
    try {
        conn = await pool.getConnection();
        
        // Tablica na wyniki
        const dane = [];

        // Definiujemy listę zapytań w kolejności, jakiej potrzebujesz
        const queries = [
            "SELECT * FROM artdruk.view_technologie WHERE id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.technologie_produkty WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_elementy WHERE technologia_id = ? ORDER BY typ ASC",
            "SELECT * FROM artdruk.technologie_fragmenty WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_oprawa WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_procesy_elementow WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.technologie_legi WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.technologie_legi_fragmenty WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.technologie_arkusze WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_grupy_wykonan WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_wykonania WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_grupy_wykonan_oprawa WHERE technologia_id = ? ORDER BY id ASC",
            "SELECT * FROM artdruk.view_technologie_wykonania_oprawa WHERE technologia_id = ? ORDER BY global_id ASC",
            "SELECT * FROM artdruk.view_technologie_realizacje WHERE technologia_id = ? ORDER BY global_id ASC"
        ];

        // Wykonujemy zapytania po kolei
        for (const sql of queries) {
            const [rows] = await conn.execute(sql, [idTechnologii]);
            dane.push(rows);
        }

        // Zwracamy kompletny zestaw danych
        res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd pobierania parametrów technologii:", err);
        res.status(500).json({ error: "Błąd bazy danych", details: err.message });
    } finally {
        if (conn) conn.release();
    }
}



async getGrupyAll(req, res) {
    // używane do sprawdzenia na wersji mini czy w procesorze są jakieś wykonania
    let conn;
    try {
        conn = await pool.getConnection();

        // Przygotowujemy oba zapytania
        const sql1 = "SELECT * FROM artdruk.view_technologie_grupy_wykonan WHERE status < 4 AND typ_grupy < 3 ORDER BY poczatek";
        const sql2 = "SELECT * FROM artdruk.view_technologie_grupy_wykonan_oprawa WHERE status < 4 AND typ_grupy < 3 ORDER BY poczatek";

        // Odpalamy oba zapytania RÓWNOLEGLE (szybciej niż jedno po drugim)
        const [result1, result2] = await Promise.all([
            conn.query(sql1),
            conn.query(sql2)
        ]);

        // Wyciągamy dane z wyników (w mysql2 wyniki są w pierwszym elemencie tablicy)
        const dane = [
            result1[0],
            result2[0]
        ];

        return res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd w getGrupyAll:", err);
        return res.status(500).json({ error: "Błąd bazy danych", details: err.message });
    } finally {
        if (conn) conn.release();
    }
}



        async getPodgladRealizacji(req, res) {
    const dniWstecz = req.params['dniWstecz'];
    console.log("tu socekt")
    let conn;
    try {
        conn = await pool.getConnection();

        // Przygotowujemy zapytania z użyciem "bind parameters" (?) dla bezpieczeństwa
        const sql1 = "SELECT * FROM artdruk.view_podglad_realizacji_dzien WHERE utworzono > ? ORDER BY utworzono";
        const sql2 = "SELECT * FROM artdruk.view_podglad_zamowienia_historia WHERE utworzono > ? AND dzial_id < 5 ORDER BY utworzono";
        const sql3 = "SELECT * FROM artdruk.view_podglad_wykonania_oprawa WHERE utworzono > ? ORDER BY utworzono";

        // Odpalamy wszystkie 3 zapytania równolegle
        // Używamy execute zamiast query dla prepared statements
        const [res1, res2, res3] = await Promise.all([
            conn.execute(sql1, [dniWstecz]),
            conn.execute(sql2, [dniWstecz]),
            conn.execute(sql3, [dniWstecz])
        ]);

        // Budujemy tablicę wynikową (wyciągamy same wiersze z wyników)
        const dane = [
            res1[0], // dane z view_podglad_realizacji_dzien
            res2[0], // dane z view_podglad_zamowienia_historia
            res3[0]  // dane z view_podglad_wykonania_oprawa
        ];

        console.log("Pobrano podgląd realizacji (3 źródła)");
        return res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd w getPodgladRealizacji:", err);
        // Zwracamy status 203 zgodnie z Twoim oryginałem, choć 500 byłoby bardziej standardowe
        return res.status(203).json(err);
    } finally {
        if (conn) conn.release();
    }
} 

        async getWykonania_i_grupy_for_procesor_dni_wstecz_oprawa(req, res) {
            // tylko odświeżanie procesora po zmianie kalendarza OPRAWA
    const procesor_id = req.params['procesor_id'];
    const dniWstecz = req.params['dniWstecz'];
    console.log("tu ok")
    // Pobieramy połączenie z puli
    const conn = await pool.getConnection();

    try {
        // Start transakcji
        await conn.beginTransaction();

        const dane = [];

        // Pierwsze zapytanie - używamy placeholderów (?) dla bezpieczeństwa (SQL Injection)
        const [rows1] = await conn.query(
            "SELECT * FROM artdruk.view_technologie_wykonania WHERE procesor_id = ? ORDER BY id ASC", 
            [procesor_id]
        );
        dane.push(rows1);

        // Drugie zapytanie
        const [rows2] = await conn.query(
            "SELECT * FROM artdruk.view_technologie_grupy_wykonan_oprawa WHERE poczatek > ? AND procesor_id = ? ORDER BY poczatek",
            [dniWstecz, procesor_id]
        );
        dane.push(rows2);

        // Jeśli wszystko ok, zatwierdzamy
        await conn.commit();

        // console.log("Get Grupy i Wykonania dla procesora " + procesor_id);
        res.status(200).json(dane);

    } catch (err) {
        // Jeśli jakikolwiek błąd wystąpi w bloku try, wycofujemy zmiany
        await conn.rollback();
        console.error("Błąd transakcji:", err);
        res.status(203).json({ error: "Database error", details: err.message });

    } finally {
        // Bardzo ważne: zawsze zwalniamy połączenie z powrotem do puli!
        conn.release();
    }
}
    //--------

        async getGrupy_oprawa_for_procesor(req, res) {
    const procesor_id = req.params['procesor_id'];
    let conn;
    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie 1: Pobiera grupy oprawy dla konkretnego procesora z zapasem 1 dnia
        const sql1 = `
            SELECT * FROM artdruk.view_technologie_grupy_wykonan_oprawa 
            WHERE poczatek > (
                SELECT MIN(poczatek) - INTERVAL 1 DAY 
                FROM artdruk.view_technologie_grupy_wykonan_oprawa 
                WHERE status < 4 AND procesor_id = ?
            )  
            AND procesor_id = ? 
            ORDER BY poczatek
        `;

        // Zapytanie 2: Pobiera sformatowaną datę graniczną
        const sql2 = `
            SELECT DATE_FORMAT(MIN(poczatek) - INTERVAL 1 DAY, '%Y-%m-%d') AS dni 
            FROM artdruk.view_technologie_grupy_wykonan_oprawa 
            WHERE status < 4 AND procesor_id = ?
        `;

        // Wykonujemy oba zapytania równolegle dla lepszej wydajności
        const [result1, result2] = await Promise.all([
            conn.execute(sql1, [procesor_id, procesor_id]),
            conn.execute(sql2, [procesor_id])
        ]);

        // Składamy dane do odpowiedzi (wyciągamy wiersze z result[0])
        const dane = [
            result1[0],
            result2[0]
        ];

        return res.status(200).json(dane);

    } catch (err) {
        console.error("Błąd w getGrupy_oprawa_for_procesor:", err);
        // Zachowujemy Twój status 203 dla błędów
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}
    //----




async sprawdzCzyPapierUzyty(req, res) {
    // Sprawdza czy papier był użyty w trzech miejscach i zlicza je. 
    const papier_id = req.params['papier_id'];
    let conn;
console.log("tu papier")
    try {
        conn = await pool.getConnection();

        // Przygotowujemy trzy niezależne zapytania liczące (z użyciem ? dla bezpieczeństwa)
        const sql1 = "SELECT COUNT(*) AS ilosc FROM artdruk.technologie_arkusze WHERE papier_id = ?";
        const sql2 = "SELECT COUNT(*) AS ilosc FROM artdruk.zamowienia_elementy WHERE papier_id = ?";
        const sql3 = "SELECT COUNT(*) AS ilosc FROM artdruk.technologie_elementy WHERE papier_id = ?";

        // Wykonujemy wszystkie naraz
        const [res1, res2, res3] = await Promise.all([
            conn.execute(sql1, [papier_id]),
            conn.execute(sql2, [papier_id]),
            conn.execute(sql3, [papier_id])
        ]);

        // Wyciągamy wartości 'ilosc' i sumujemy je
        // res[0][0] bo: pierwszy [0] to wiersze, drugi [0] to pierwszy wiersz wyniku (count zawsze zwraca jeden)
        const suma = res1[0][0].ilosc + res2[0][0].ilosc + res3[0][0].ilosc;

        console.log(`Sprawdzenie papieru ID: ${papier_id}. Łączna ilość użyć: ${suma}`);
        
        // Zwracamy samą liczbę (tak jak w Twoim oryginale po redukcji)
        return res.status(200).json(suma);

    } catch (err) {
        console.error("Błąd w sprawdzCzyPapierUzyty:", err);
        return res.status(500).json({ error: "Błąd bazy danych" });
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


    // pobie
async getTechnologie(req, res) {
    // Pobierasz idzlecenia, ale w SQL go nie używasz - zostawiam jak w oryginale
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL
        const sql = "SELECT * FROM artdruk.view_technologie WHERE final IS NULL ORDER BY id ASC";

        // Wykonujemy zapytanie (execute jest szybsze i bezpieczniejsze)
        const [rows] = await conn.execute(sql);

        // Zwracamy wynik do klienta
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getTechnologie:", err);
        // Standardowo status 500 przy błędzie bazy
        return res.status(500).json({ error: "Błąd podczas pobierania technologii" });
    } finally {
        // Zwalniamy połączenie z powrotem do puli
        if (conn) conn.release();
    }
}

async getGantGrupy(req, res) {
    // idzlecenia pobrane, ale nieużyte w SQL - zostawiam zgodnie z oryginałem
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL (pobieranie grup do wykresu Ganta)
        const sql = "SELECT * FROM artdruk.view_gant_grupy WHERE status < 4 AND typ_grupy = 2 ORDER BY start ASC";

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy wynik
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getGantGrupy:", err);
        return res.status(500).json({ error: "Błąd podczas pobierania danych Ganta" });
    } finally {
        // Obowiązkowe zwolnienie połączenia
        if (conn) conn.release();
    }
}


async getZamowieniaKalendarz(req, res) {
    // Pobierasz procesor_id, ale obecnie nie jest używany w zapytaniu
    let conn;

    try {
        conn = await pool.getConnection();

        // Zapytanie SQL
        // Jeśli będziesz chciał filtrować po procesor_id, dodaj: AND procesor_id = ?
        const sql = "SELECT * FROM artdruk.view_zamowienia_kalendarz WHERE data_spedycji > '2026-01-01' AND data_spedycji < '2026-01-30' ORDER BY data_spedycji";

        const [rows] = await conn.execute(sql);

        // Zwracamy dane w tablicy (zachowując strukturę [doc] z oryginału)
        return res.status(200).json([rows]);

    } catch (err) {
        console.error("Błąd w getZamowieniaKalendarz:", err);
        // Zwracamy 203 zgodnie z Twoją konwencją dla błędów
        return res.status(203).json(err);
    } finally {
        if (conn) conn.release();
    }
}


async getVersion(req, res) {
    // parametr orderby pobrany z URL, ale nieużyty w zapytaniu SQL
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie o ostatnią wersję
        const sql = "SELECT ver, utworzono FROM artdruk.version ORDER BY id DESC LIMIT 1";

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy wynik (tablica z jednym obiektem wersji)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getVersion:", err);
        return res.status(500).json({ error: "Błąd podczas pobierania wersji" });
    } finally {
        // Zawsze zwalniamy połączenie!
        if (conn) conn.release();
    }
}

async getAllUsers(req, res) {
    // Parametr orderby pobrany, ale nieużyty w zapytaniu
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL (widok użytkowników)
        const sql = "SELECT * FROM artdruk.view_user";

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy listę użytkowników
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getAllUsers:", err);
        // Zwracamy status 500, żeby frontend wiedział, że coś poszło nie tak
        return res.status(500).json({ error: "Błąd podczas pobierania listy użytkowników" });
    } finally {
        // Zwalniamy połączenie do puli - kluczowe dla wydajności!
        if (conn) conn.release();
    }
}

async getZamowieniaPliki(req, res) {
    // Parametr orderby pobrany, ale nieużyty w zapytaniu (zgodnie z oryginałem)
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL do widoku plików zamówień
        const sql = "SELECT * FROM artdruk.view_zamowienia_pliki";

        // Wykonujemy zapytanie (execute jest bezpieczniejszy i szybszy)
        const [rows] = await conn.execute(sql);

        // Zwracamy listę plików
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getZamowieniaPliki:", err);
        // Zwracamy status 500 przy błędzie bazy danych
        return res.status(500).json({ error: "Błąd podczas pobierania listy plików" });
    } finally {
        // Zwalniamy połączenie z powrotem do puli - to zapobiega blokowaniu bazy
        if (conn) conn.release();
    }
}

async getOddaniaWykonania(req, res) {
    const grupa_global_id = req.params['grupa_global_id'];
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL z użyciem ? zamiast doklejania stringa
        const sql = "SELECT * FROM artdruk.view_oddania_wykonania WHERE oddanie_global_id = ?";

        // Wykonujemy zapytanie (parametr przekazujemy w tablicy)
        const [rows] = await conn.execute(sql, [grupa_global_id]);

        // Zwracamy wynik do klienta
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getOddaniaWykonania:", err);
        // Standardowo status 500 przy błędzie bazy
        return res.status(500).json({ error: "Błąd podczas pobierania danych oddania" });
    } finally {
        // Zwalniamy połączenie z powrotem do puli
        if (conn) conn.release();
    }
}

async getZamowieniaProofy(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL do widoku proofów
        const sql = "SELECT * FROM artdruk.view_zamowienia_proofy ORDER BY id ASC";

        // Wykonujemy zapytanie (destrukturyzacja [rows] wyciąga same dane)
        const [rows] = await conn.execute(sql);

        // Zwracamy wynik do klienta
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getZamowieniaProofy:", err);
        // Wysłanie błędu do klienta, zamiast zostawiania "wiszącego" żądania
        return res.status(500).json({ error: "Błąd podczas pobierania danych proofów" });
    } finally {
        // Zwalniamy połączenie z powrotem do puli - bez tego pula szybko się wyczerpie
        if (conn) conn.release();
    }
}

async getOddaniaGrupy(req, res) {
    const widok = req.params['widok'];
    let conn;
    let sql = "";

    // Ustawiamy odpowiednie zapytanie w zależności od widoku
    if (widok == 1) {
        sql = "SELECT * FROM artdruk.view_oddania_grupy WHERE status != 4 AND status_zamowienia < 7 AND etap > 1 ORDER BY data_spedycji";
    } else if (widok == 2) {
        sql = "SELECT * FROM artdruk.view_oddania_grupy WHERE status = 4 AND status_zamowienia < 7 AND etap > 1 ORDER BY data_spedycji";
    } else if (widok == 3) {
        sql = "SELECT * FROM artdruk.view_oddania_grupy ORDER BY data_spedycji";
    } else {
        // Zabezpieczenie na wypadek, gdyby przyszedł inny numer widoku
        return res.status(400).json({ error: "Nieprawidłowy parametr widoku" });
    }

    try {
        conn = await pool.getConnection();

        // Wykonujemy wybrane zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy wynik
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getOddaniaGrupy:", err);
        return res.status(500).json({ error: "Błąd bazy danych przy pobieraniu grup oddań" });
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async getProdukty(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL
        const sql = "SELECT * FROM artdruk.produkty ORDER BY id";

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy listę produktów
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getProdukty:", err);
        // Informujemy klienta o błędzie
        return res.status(500).json({ error: "Błąd podczas pobierania produktów" });
    } finally {
        // Bardzo ważne: zwracamy połączenie do puli
        if (conn) conn.release();
    }
}

async getUsersM(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Zapytanie SQL - pobieramy tylko id, imię, nazwisko i uprawnienie zapisu
        const sql = "SELECT id, Imie, Nazwisko, zamowienie_zapis FROM artdruk.users ORDER BY Imie";

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy listę użytkowników
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w getUsersM:", err);
        // Zwracamy status 500, żeby frontend nie wisiał w nieskończoność
        return res.status(500).json({ error: "Błąd podczas pobierania uproszczonej listy użytkowników" });
    } finally {
        // Bardzo ważne: zwalniamy połączenie z powrotem do puli
        if (conn) conn.release();
    }
}

    // zapis w ModalInsert ( razem z zmaowienie - produkty - elementy - fragmenty itp)
async postProdukty(req, res) {
    // Wyciągamy dane z body
    const { 
        nazwa, wersja, zamowienie_id, typ, uwagi, 
        ilosc_stron, format_x, format_y, oprawa, naklad, indeks 
    } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();

        // SQL z użyciem znaków zapytania - bezpieczny sposób przesyłania danych
        const sql = `
            INSERT INTO artdruk.zamowienia_produkty 
            (nazwa, wersja, zamowienie_id, typ, uwagi, ilosc_stron, format_x, format_y, oprawa, naklad, indeks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        // Przekazujemy wartości w tablicy - mysql2 zajmie się ich bezpiecznym "wyczyszczeniem"
        const [result] = await conn.execute(sql, [
            nazwa, wersja, zamowienie_id, typ, uwagi, 
            ilosc_stron, format_x, format_y, oprawa, naklad, indeks
        ]);

        console.log("Dodano produkt, ID:", result.insertId);
        
        // Zwracamy status 201 (Created) i dane o wstawionym rekordzie
        return res.status(201).json(result);

    } catch (err) {
        console.error("Błąd podczas dodawania produktu:", err);
        return res.status(500).json({ error: "Błąd bazy danych podczas zapisu produktu" });
    } finally {
        if (conn) conn.release();
    }
}

async postKlient(req, res) {
    // Szybkie wyciągnięcie danych z body
    const { 
        firma, 
        firma_nazwa, 
        adres, 
        kod, 
        nip, 
        opiekun_id, 
        utworzyl_user_id 
    } = req.body;
    
    const deleted = 0; // Wartość domyślna

    let conn;

    try {
        conn = await pool.getConnection();

        const sql = `
            INSERT INTO artdruk.klienci 
            (firma, firma_nazwa, adres, kod, nip, opiekun_id, utworzyl_user_id, deleted) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const dane = [firma, firma_nazwa, adres, kod, nip, opiekun_id, utworzyl_user_id, deleted];

        // Wykonujemy zapytanie (execute automatycznie dba o bezpieczeństwo parametrów)
        const [result] = await conn.execute(sql, dane);

        console.log("Dodano klienta, ID:", result.insertId);
        
        // Zwracamy status 201 (Created)
        return res.status(201).json(result);

    } catch (err) {
        console.error("Błąd podczas dodawania klienta:", err);
        return res.status(500).json({ error: "Błąd bazy danych podczas zapisu klienta" });
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async setOrderOpen(req, res) {
    const { id, token, user } = req.body;
    let conn;

    try {
        conn = await pool.getConnection();

        // 1. Sprawdzamy stan otwarcia zamówienia (używamy ? dla bezpieczeństwa)
        const sqlSelect = "SELECT * FROM artdruk.view_zamowienia_stan_otwarcia WHERE id = ? ORDER BY id ASC";
        const [rows] = await conn.execute(sqlSelect, [id]);

        // Sprawdzamy, czy zamówienie w ogóle istnieje
        if (!rows || rows.length === 0) {
            console.log(`Błąd: Nie znaleziono zamówienia o ID: ${id}`);
            return res.status(404).json({ stan: "NOT_FOUND" });
        }

        const order = rows[0];

        // 2. Logika sprawdzania: czy ja już to otworzyłem, czy nikt inny tego nie blokuje (open_stan != 1)
        if (order.open_user_id == user || order.open_stan != 1) {
            
            // 3. Aktualizujemy stan blokady
            const sqlUpdate = `
                UPDATE artdruk.zamowienia 
                SET open_token = ?, open_user = ?, open_data = NOW(), open_stan = 1 
                WHERE id = ?
            `;
            
            await conn.execute(sqlUpdate, [token, user, id]);

            return res.status(200).json({
                stan: "OK",
                user: order.open_user,
                data: order.open_data
            });

        } else {
            // Zamówienie jest już otwarte przez kogoś innego
            return res.status(200).json({
                stan: "error",
                user: order.open_user,
                data: order.open_data
            });
        }

    } catch (err) {
        console.error("Błąd w setOrderOpen:", err);
        return res.status(500).json({ stan: "DB_ERROR", message: err.message });
    } finally {
        // Zawsze zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}

async setOrderClosed(req, res) {
    // Pobieramy ID, z domyślną wartością 1 (zgodnie z Twoim kodem)
    const id = req.body.id || 1;
    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy parametrów ? dla bezpieczeństwa, zamiast doklejania id do stringa
        const sql = `
            UPDATE artdruk.zamowienia 
            SET open_stan = NULL, open_data = NULL, open_user = NULL 
            WHERE id = ?
        `;

        await conn.execute(sql, [id]);

        console.log(`Zamówienie ID: ${id} zostało zamknięte/odblokowane.`);

        return res.status(200).json({
            stan: "closed"
        });

    } catch (err) {
        console.error("Błąd w setOrderClosed:", err);
        return res.status(500).json({ error: "Błąd bazy danych podczas zamykania zamówienia" });
    } finally {
        if (conn) conn.release();
    }
}

async dragDropProcesGrup(req, res) {
    // Pobieramy ID z parametrów URL
    const id_drag_grupa_proces = req.params['id_drag_grupa_proces'];
    const id_drop_grupa_proces = req.params['id_drop_grupa_proces'];
    
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); // Start transakcji

        const sql = "SELECT artdruk.drag(?, ?) AS procesor_id";
        console.log(`Wykonuję Drag&Drop: Drag ID ${id_drag_grupa_proces} na Drop ID ${id_drop_grupa_proces}`);
        const [rows] = await conn.execute(sql, [id_drag_grupa_proces, id_drop_grupa_proces]);
        await conn.commit(); // Zatwierdzenie zmian
        return res.status(200).json(rows);

    } catch (err) {
        if (conn) await conn.rollback(); // Wycofanie w razie błędu
        console.error("Błąd w dragDropProcesGrup:", err);
        return res.status(203).json(err);
    } finally {
        if (conn) conn.release();
    }
}

async dragDropProcesGrupMulti(req, res) {
    const row = req.body;
    const multiSelect = row[0]; // tablica ID elementów przeciąganych
    const id_drop_grupa_proces = row[1]; // ID elementu docelowego

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction(); // Start transakcji

        const promises = multiSelect.map(element => {
            const sql = "SELECT artdruk.drag(?, ?) AS wynik";
            return conn.execute(sql, [element, id_drop_grupa_proces]);
        });

        await Promise.all(promises);

        await conn.commit(); // Zatwierdzenie zmian
        
        return res.status(200).json("OK");

    } catch (err) {
        if (conn) await conn.rollback(); // Wycofanie w razie błędu

        console.error("Błąd w dragDropProcesGrupMulti:", err);
        return res.status(500).json({ error: "Błąd podczas operacji masowego przenoszenia" });
    } finally {
        if (conn) conn.release();
    }
}


async dragDropProcesGrupOprawa(req, res) {
    // Pobieramy parametry z URL
    const id_drag_grupa_proces = req.params['id_drag_grupa_proces'];
    const id_drop_grupa_proces = req.params['id_drop_grupa_proces'];
    
    let conn;

    try {
        conn = await pool.getConnection();

        // Wywołujemy funkcję bazodanową dedykowaną dla oprawy
        const sql = "SELECT artdruk.drag_oprawa(?, ?) AS procesor_id";
        
        console.log(`Drag&Drop Oprawa: Drag ${id_drag_grupa_proces} -> Drop ${id_drop_grupa_proces}`);

        const [rows] = await conn.execute(sql, [id_drag_grupa_proces, id_drop_grupa_proces]);

        // Zwracamy wynik (zawierający procesor_id)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w dragDropProcesGrupOprawa:", err);
        // Zachowujemy Twój status 203 dla błędów w tej sekcji
        return res.status(203).json(err);
    } finally {
        // Zawsze oddajemy połączenie do puli!
        if (conn) conn.release();
    }
}




async zmien_status_przerwy(req, res) {
    // Destrukturyzacja danych z body
    const { 
        status, 
        global_id    } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? dla bezpieczeństwa, zamiast doklejania wartości do stringa
        const sql = "UPDATE artdruk.technologie_grupy_wykonan SET status = ? WHERE global_id = ?";
        
        console.log(`Zmiana statusu przerwy: Global ID ${global_id} -> Status ${status}`);

        const [result] = await conn.execute(sql, [status, global_id]);

        // Zwracamy "OK" zgodnie z Twoim oryginałem
        return res.status(200).json("OK");

    } catch (err) {
        console.error("Błąd w zmien_status_przerwy:", err);
        // W razie błędu wysyłamy status 500 lub 203 w zależności od Twoich preferencji
        return res.status(500).json({ error: "Błąd podczas aktualizacji statusu przerwy" });
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}





async dragDropProcesGrupToProcesor(req, res) {
    // Pobieramy ID z parametrów URL
    const id_drag_grupa_proces = req.params['id_drag_grupa_proces'];
    const id = req.params['id']; // to prawdopodobnie nowe ID procesora (maszyny/osoby)

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy bezpiecznych parametrów zamiast sklejania stringów
        const sql = "SELECT artdruk.zmien_procesor(?, ?) AS procesor_id";
        
        console.log(`Zmiana procesora: Przenoszę grupę ${id_drag_grupa_proces} na procesor ${id}`);

        const [rows] = await conn.execute(sql, [id_drag_grupa_proces, id]);

        // Zwracamy wynik (procesor_id zwrócony przez funkcję SQL)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w dragDropProcesGrupToProcesor:", err);
        // Zgodnie z Twoją konwencją dla błędów w tej sekcji - status 203
        return res.status(203).json(err);
    } finally {
        // Obowiązkowe zwolnienie połączenia
        if (conn) conn.release();
    }
}

async updateWykonaniaOrazGrupa(req, res) {
    // Pobieramy dane z parametrów URL
    const { global_id_grupa_wykonan, kolumna, wartosc } = req.params;
    
    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy bezpiecznych parametrów. 
        // Uwaga: Funkcja SQL przyjmuje te wartości jako argumenty.
        const sql = "SELECT artdruk.update_wykonania_oraz_grupa(?, ?, ?) AS technologia_id";
        
        console.log(`Aktualizacja grupy: ID ${global_id_grupa_wykonan}, Kolumna: ${kolumna}, Wartość: ${wartosc}`);

        const [rows] = await conn.execute(sql, [global_id_grupa_wykonan, kolumna, wartosc]);

        // Zwracamy wynik (technologia_id)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateWykonaniaOrazGrupa:", err);
        // Zachowujemy Twój status 203 dla błędów bazodanowych
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}

async updateWykonania(req, res) {
    // Pobieramy dane z parametrów URL
    const { global_id_wykonania, kolumna, wartosc } = req.params;
    
    let conn;

    try {
        conn = await pool.getConnection();

        // Wywołujemy funkcję bazodanową
        const sql = "SELECT artdruk.update_wykonania(?, ?, ?) AS technologia_id";
        
        console.log(`Aktualizacja wykonania: ID ${global_id_wykonania}, Kolumna: ${kolumna}, Wartość: ${wartosc}`);

        // execute() bezpiecznie obsłuży parametry
        const [rows] = await conn.execute(sql, [global_id_wykonania, kolumna, wartosc]);

        // Zwracamy technologia_id
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateWykonania:", err);
        // Status 203 zgodnie z Twoim systemem obsługi błędów
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}

async updateWydzielWykonanieZgrupy(req, res) {
    // Pobieramy ID z parametrów URL
    const global_id_wykonania = req.params['global_id_wykonania'];
    
    let conn;

    try {
        // Wyciągamy połączenie z puli
        conn = await pool.getConnection();

        // Używamy bezpiecznego parametru ?
        const sql = "SELECT artdruk.wyodrebnij_wykonanie_do_nowej_grupy(?) AS technologia_id";
        
        console.log(`Wyodrębnianie wykonania do nowej grupy. ID: ${global_id_wykonania}`);

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql, [global_id_wykonania]);

        // Zwracamy wynik (technologia_id) do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateWydzielWykonanieZgrupy:", err);
        // Status 203 dla błędów, zgodnie z Twoją strukturą
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie z powrotem do puli
        if (conn) conn.release();
    }
}


async updatePrzeniesWykonanieDoInnejGrupy(req, res) {
 
    const { global_id_wykonania, grupa_id_drop, ostatnie_wykonania } = req.params;
    
    let conn;
    const ostatnieParam = (ostatnie_wykonania === 'true' || ostatnie_wykonania === true) ? 1 : 0;

    try {
        conn = await pool.getConnection();
       
        const sql = "SELECT artdruk.przenies_wykonanie(?, ?, ?) AS technologia_id";
        const [rows] = await conn.execute(sql, [global_id_wykonania, grupa_id_drop, ostatnieParam,]);
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updatePrzeniesWykonanieDoInnejGrupy:", err);
      
        return res.status(203).json(err);
    } finally {
      
        if (conn) conn.release();
    }
}

async updateAddPrzerwa(req, res) {
    // Wyciągamy parametry z URL
    const global_id_grupa = req.params['global_id_grupa'];
    const czas = req.params['czas'];
    
    let conn;

    try {
        conn = await pool.getConnection();

        // SQL z bezpiecznymi placeholderami ?
        const sql = "SELECT artdruk.add_przerwa(?, ?) AS procesor_id";
        
        console.log(`Dodawanie przerwy: Grupa ID ${global_id_grupa}, Czas: ${czas}`);

        // Wykonujemy zapytanie na puli
        const [rows] = await conn.execute(sql, [global_id_grupa, czas]);

        // Zwracamy wynik (id procesora, na którym operujemy)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateAddPrzerwa:", err);
        // Status 203, żeby frontend wiedział, że coś poszło nie tak po stronie bazy
        return res.status(203).json(err);
    } finally {
        // Obowiązkowe zwolnienie połączenia
        if (conn) conn.release();
    }
}



async updateAddPrzerwaOprawa(req, res) {
    // Pobieramy parametry z adresu URL
    const { global_id_grupa, czas } = req.params;
    
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Używamy placeholderów ?, aby zapobiec błędom i atakom SQL Injection
        const sql = "SELECT artdruk.add_przerwa_oprawa(?, ?) AS procesor_id";
        
        console.log(`Dodawanie przerwy (Oprawa): Grupa ID ${global_id_grupa}, Czas: ${czas}`);

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql, [global_id_grupa, czas]);

        // Zwracamy wynik (procesor_id)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateAddPrzerwaOprawa:", err);
        // Zwracamy błąd zgodnie z Twoją konwencją
        return res.status(203).json(err);
    } finally {
        // Zawsze zwracamy połączenie do puli, żeby serwer się nie zapchał
        if (conn) conn.release();
    }
}

async updateAddPrzerwaMagic(req, res) {
    // Pobieramy ID z parametrów URL
    const global_id_grupa = req.params['global_id_grupa'];
    
    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy CALL do wywołania procedury z bezpiecznym parametrem ?
        const sql = "CALL artdruk.add_magic_przerwa(?)";
        
        console.log(`Wywołuję Magic Przerwę dla grupy ID: ${global_id_grupa}`);

        // Wykonujemy zapytanie
        const [result] = await conn.execute(sql, [global_id_grupa]);

        // Zwracamy wynik procedury
        return res.status(200).json(result);

    } catch (err) {
        console.error("Błąd w updateAddPrzerwaMagic:", err);
        // Status 203 dla błędów bazodanowych
        return res.status(203).json(err);
    } finally {
        // Zawsze zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async updateDeletePrzerwa(req, res) {
    // Pobieramy ID z parametrów URL
    const global_id_grupa = req.params['global_id_grupa'];
    
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Używamy bezpiecznego parametru ? zamiast doklejania stringa
        const sql = "SELECT artdruk.delete_przerwa(?) AS procesor_id";
        
        console.log(`Usuwanie przerwy dla grupy ID: ${global_id_grupa}`);

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql, [global_id_grupa]);

        // Zwracamy wynik do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateDeletePrzerwa:", err);
        // Status 203 dla błędów bazodanowych, tak jak w oryginale
        return res.status(203).json(err);
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli
        if (conn) conn.release();
    }
}

async updateDeletePrzerwaOprawa(req, res) {
    // Wyciągamy ID z parametrów URL
    const global_id_grupa = req.params['global_id_grupa'];
    
    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy bezpiecznego ? zamiast łączenia stringów
        const sql = "SELECT artdruk.delete_przerwa_oprawa(?) AS procesor_id";
        
        console.log(`Usuwanie przerwy (Oprawa) dla grupy ID: ${global_id_grupa}`);

        const [rows] = await conn.execute(sql, [global_id_grupa]);

        // Zwracamy wynik
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w updateDeletePrzerwaOprawa:", err);
        // Status 203 zgodnie z Twoją konwencją
        return res.status(203).json(err);
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli
        if (conn) conn.release();
    }
}

async zmienCzasTrwaniaGrupy(req, res) {
    // Pobieramy parametry z URL
    const { drop_grupa_global_id, nowy_koniec } = req.params;
    
    let conn;

    console.log("zmiana czasu tu")

    try {
        conn = await pool.getConnection();

        // Używamy bezpiecznych parametrów ?
        // Nie musisz już ręcznie dodawać apostrofów wokół daty/stringa
        const sql = "SELECT artdruk.zmien_czas_trwania_grupy(?, ?) AS procesor_id";
        
        console.log(`Zmiana czasu: Grupa ID ${drop_grupa_global_id}, Nowy koniec: ${nowy_koniec}`);

        const [rows] = await conn.execute(sql, [drop_grupa_global_id, nowy_koniec]);

        // Zwracamy wynik (procesor_id)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w zmienCzasTrwaniaGrupy:", err);
        // Status 203 dla błędów bazy danych
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie
        if (conn) conn.release();
    }
}


async zmienCzasTrwaniaGrupyOprawa(req, res) {
    // Pobieramy parametry z URL
    const drop_grupa_global_id = req.params['drop_grupa_global_id'];
    const nowy_koniec = req.params['nowy_koniec'];

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? dla bezpieczeństwa, zwłaszcza dla stringa z czasem/datą
        const sql = "SELECT artdruk.zmien_czas_trwania_grupy_oprawa(?, ?) AS procesor_id";
        
        console.log(`Zmiana czasu trwania OPRAWY: Grupa ${drop_grupa_global_id}, Nowy koniec: ${nowy_koniec}`);

        const [rows] = await conn.execute(sql, [drop_grupa_global_id, nowy_koniec]);

        // Zwracamy wynik (procesor_id) do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas zmiany czasu trwania grupy oprawy:", err);
        // Zachowujemy status 203 dla błędów
        return res.status(203).json(err);
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli
        if (conn) conn.release();
    }
}

async zmienCzasTrwaniaGrupyOprawaPrzerwa(req, res) {
    // Pobieramy parametry z URL (req.params)
    const drop_grupa_global_id = req.params['drop_grupa_global_id'];
    const nowy_koniec = req.params['nowy_koniec'];

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? dla bezpieczeństwa, szczególnie przy formacie daty/czasu w 'nowy_koniec'
        const sql = "SELECT artdruk.zmien_czas_trwania_grupy_oprawa_przerwa(?, ?) AS procesor_id";
        
        console.log(`Zmiana czasu przerwy OPRAWA: Grupa ${drop_grupa_global_id}, Koniec: ${nowy_koniec}`);

        const [rows] = await conn.execute(sql, [drop_grupa_global_id, nowy_koniec]);

        // Zwracamy wynik (procesor_id) do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas zmiany czasu trwania przerwy oprawy:", err);
        // Status 203 dla błędów zgodnie z Twoją konwencją
        return res.status(203).json(err);
    } finally {
        // Zawsze zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async zmienCzasTrwaniaGrupyPrzerwa(req, res) {
    // Pobieramy parametry z URL
    const drop_grupa_global_id = req.params['drop_grupa_global_id'];
    const nowy_koniec = req.params['nowy_koniec'];

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? dla bezpieczeństwa, zwłaszcza przy stringu z datą/godziną (nowy_koniec)
        const sql = "SELECT artdruk.zmien_czas_trwania_grupy_przerwa(?, ?) AS procesor_id";
        
        console.log(`Zmiana czasu trwania przerwy: Grupa ${drop_grupa_global_id}, Nowy koniec: ${nowy_koniec}`);

        const [rows] = await conn.execute(sql, [drop_grupa_global_id, nowy_koniec]);

        // Zwracamy wynik (procesor_id)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas zmiany czasu trwania przerwy:", err);
        // Zachowujemy Twój status 203 dla błędów
        return res.status(203).json(err);
    } finally {
        // Zawsze zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async skasujTechnologie(req, res) {
    // Pobieramy parametry z URL (req.params)
    const { id_delete, zamowienie_id, user_id } = req.params;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy bindowania parametrów (?) dla procedury CALL
        const sql = "CALL artdruk.deletedforever_technologia(?, ?, ?)";
        
        console.log(`Wywołuję procedurę kasowania technologii. ID: ${id_delete}, Zamówienie: ${zamowienie_id}, User: ${user_id}`);

        // W przypadku CALL, execute zwraca tablicę, gdzie pierwszy element to wyniki procedury
        const [result] = await conn.execute(sql, [id_delete, zamowienie_id, user_id]);

        // Zwracamy wynik do frontendu
        return res.status(200).json(result);

    } catch (err) {
        console.error("Błąd podczas kasowania technologii (deletedforever_technologia):", err);
        // Zachowujemy status 203 dla błędów zgodnie z Twoim wzorcem
        return res.status(203).json(err);
    } finally {
        // Zawsze oddajemy połączenie do puli, żeby serwer się nie "zapchał"
        if (conn) conn.release();
    }
}




async skasujGrupe(req, res) {
    // Pobieramy ID grupy z parametrów URL
    const global_id_grupa = req.params['global_id_grupa'];

    let conn;

    try {
        conn = await pool.getConnection();

        // Wywołujemy funkcję bazodanową, która usuwa powiązania i zwraca ID procesora
        const sql = "SELECT artdruk.delete_grupa_wykonan(?) AS procesor_id_grupy";
        
        console.log(`Kasowanie ogólnej grupy wykonanań: ${global_id_grupa}`);

        const [rows] = await conn.execute(sql, [global_id_grupa]);

        // Zwracamy wynik (rows to tablica z wynikiem zapytania SELECT)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas kasowania grupy:", err);
        // Zachowujemy status 203 dla błędów zgodnie z Twoim wzorcem
        return res.status(203).json(err);
    } finally {
        // Zawsze zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


backup(req,res){

const scriptPath = './mb.sh';

exec(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Błąd podczas wykonywania skryptu: ${error.message}`);
      // Zwracamy błąd 500, jeśli coś poszło nie tak
      return res.status(500).json({ error: 'Failed to run script', details: stderr });
    }

    if (stderr) {
      console.warn(`Skrypt zwrócił ostrzeżenia: ${stderr}`);
    }

    console.log(`Skrypt zwrócił: ${stdout}`);
    // Zwracamy odpowiedź 200 z wynikiem działania skryptu
    res.status(200).json({ message: 'Script executed successfully', output: stdout });
  });


}

sprawdzPulePolaczen(req,res){

const internalPool = pool.pool;
const allConnections = internalPool._allConnections.length; 
const freeConnections = internalPool._freeConnections.length;
const waitingConnections = internalPool._connectionQueue.length;
// Obliczamy używane połączenia
const usedConnections = allConnections - freeConnections;

    console.log(`--- Status puli ---`);
    console.log(`Wolne połączenia (free): ${freeConnections}`);
    console.log(`Używane połączenia (used): ${usedConnections}`);
    console.log(`Wszystkie połączenia (all): ${allConnections}`);
    console.log(`Oczekujące żądania (waiting): ${waitingConnections}`);
    console.log(`---`);

    let status = {
        free: freeConnections,  
        all: allConnections,
        used: usedConnections,
        waiting: waitingConnections

    }
    res.status(200).json(status);
}



async skasujGrupeOprawa(req, res) {
    // Pobieramy ID grupy z parametrów URL (req.params)
    const global_id_grupa = req.params['global_id_grupa'];

    let conn;

    try {
        conn = await pool.getConnection();

        // Wywołujemy funkcję bazodanową, która zwraca 'procesor_id_grupy'
        const sql = "SELECT artdruk.delete_grupa_wykonan_oprawa(?) AS procesor_id_grupy";
        
        console.log(`Wywołuję procedurę usuwania grupy oprawy: ${global_id_grupa}`);

        const [rows] = await conn.execute(sql, [global_id_grupa]);

        // Zwracamy wynik działania funkcji (procesor_id_grupy)
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas kasowania grupy oprawy:", err);
        // Zwracamy status 203 zgodnie z Twoim oryginalnym kodem w razie błędu
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}

async deleteKlient(req, res) {
    // Pobieramy ID klienta z body
    const id = req.body.id;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? zamiast doklejania stringa
        const sql = "UPDATE artdruk.klienci SET deleted = 1 WHERE id = ?";
        
        console.log(`Oznaczam klienta ID: ${id} jako usuniętego`);

        const [result] = await conn.execute(sql, [id]);

        // Zwracamy wynik (np. info o 1 zmienionym wierszu)
        return res.status(201).json(result);

    } catch (err) {
        console.error("Błąd podczas usuwania klienta:", err);
        // Zwracamy status 500 w razie awarii bazy
        return res.status(500).json({ error: "Nie udało się usunąć klienta", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia
        if (conn) conn.release();
    }
}

async deleteZamowienie(req, res) {
    const rowsToDelete = req.body.row;

    if (!rowsToDelete || !Array.isArray(rowsToDelete) || rowsToDelete.length === 0) {
        return res.status(400).json({ error: "Brak zamówień do usunięcia" });
    }

    let conn;

    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // Definiujemy wszystkie tabele, z których chcemy posprzątać
        // Kolejność ma znaczenie, jeśli masz klucze obce (Foreign Keys)!
        const tabele = [
            "artdruk.zamowienia_produkty",
            "artdruk.zamowienia_elementy",
            "artdruk.zamowienia_fragmenty",
            "artdruk.zamowienia_koszty_dodatkowe",
            "artdruk.zamowienia_oprawa",
            "artdruk.zamowienia_pakowanie",
            "artdruk.zamowienia_procesy_elementow",
            "artdruk.zamowienia_historia",
            "artdruk.zamowienia" // Główne zamówienie na końcu
        ];

        for (let row of rowsToDelete) {
            console.log(`Rozpoczynam usuwanie zamówienia ID: ${row.id}`);

            for (let tabela of tabele) {
                // Dla większości tabel warunkiem jest zamowienie_id, 
                // ale dla głównej tabeli 'zamowienia' warunkiem jest 'id'
                const idColumn = (tabela === "artdruk.zamowienia") ? "id" : "zamowienie_id";
                
                // Dodatkowe zabezpieczenie global_id != 0 lub id != 0 jak w oryginale
                const safetyFilter = (tabela === "artdruk.zamowienia_historia") ? "id != 0" : 
                                     (tabela === "artdruk.zamowienia") ? "id != 0" : "global_id != 0";

                const sql = `DELETE FROM ${tabela} WHERE ${safetyFilter} AND ${idColumn} = ?`;
                
                await conn.execute(sql, [row.id]);
            }
        }

        // --- COMMIT ---
        await conn.commit();

        console.log(`Zlecenia (liczba: ${rowsToDelete.length}) skasowane na zawsze!`);
        return res.status(201).json("OK");

    } catch (err) {
        // --- ROLLBACK ---
        if (conn) await conn.rollback();
        
        console.error("BŁĄD PODCZAS USUWANIA ZAMÓWIENIA:", err);
        return res.status(500).json({ error: "Błąd podczas usuwania danych", details: err });
    } finally {
        if (conn) conn.release();
    }
}

async odblokujZamowienie(req, res) {
    // rowsToDelete to Twoja tablica z wierszami (req.body.row)
    const rowsToDelete = req.body.row;

    // Szybki check, czy mamy co odblokowywać
    if (!rowsToDelete || !Array.isArray(rowsToDelete) || rowsToDelete.length === 0) {
        return res.status(400).json({ error: "Brak zamówień do odblokowania" });
    }

    let conn;

    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // Tworzymy tablicę obietnic dla każdego UPDATE (czyścimy dane blokady)
        const unlockPromises = rowsToDelete.map(row => {
            const sql = `
                UPDATE artdruk.zamowienia 
                SET open_data = NULL, open_user = NULL, open_stan = NULL 
                WHERE id = ?
            `;
            return conn.execute(sql, [row.id]);
        });

        // Czekamy na wykonanie wszystkich operacji
        await Promise.all(unlockPromises);

        // --- COMMIT ---
        await conn.commit();

        console.log(`Zlecenia odblokowane! Liczba: ${rowsToDelete.length}`);
        return res.status(201).json({ status: "success", count: rowsToDelete.length });

    } catch (err) {
        // --- ROLLBACK ---
        if (conn) await conn.rollback();
        
        console.error("Błąd podczas odblokowywania zamówień:", err);
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}




async updatePapiery(req, res) {
    const rows = req.body;
    let conn;

    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // 1. UPDATE - edycja istniejących parametrów
        const updatePromises = rows
            .filter(x => x.update === true && x.insert !== true)
            .map(row => {
                const sql = `
                    UPDATE artdruk.papiery 
                    SET dodal = ?, zmienil = ?, grupa_id = ?, nazwa_id = ?, 
                        gramatura = ?, bulk = ?, info = ?, wykonczenie_id = ?, powleczenie_id = ? 
                    WHERE id = ?
                `;
                const params = [
                    row.dodal, row.dodal, row.grupa_id, row.nazwa_id, 
                    row.gramatura, row.bulk, row.info, row.wykonczenie_id, row.powleczenie_id, row.id
                ];
                return conn.execute(sql, params);
            });

        // 2. INSERT - dodawanie nowych specyfikacji papieru
        const insertPromises = rows
            .filter(x => x.insert === true)
            .map(row => {
                const sql = `
                    INSERT INTO artdruk.papiery 
                    (dodal, zmienil, grupa_id, nazwa_id, gramatura, bulk, info, wykonczenie_id, powleczenie_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const params = [
                    row.dodal, row.zmienil, row.grupa_id, row.nazwa_id, 
                    row.gramatura, row.bulk, row.info, row.wykonczenie_id, row.powleczenie_id
                ];
                return conn.execute(sql, params);
            });

        // 3. DELETE - usuwanie specyfikacji
        const deletePromises = rows
            .filter(x => x.delete === true)
            .map(row => {
                const sql = "DELETE FROM artdruk.papiery WHERE id = ?";
                return conn.execute(sql, [row.id]);
            });

        // Czekamy na wykonanie wszystkich operacji naraz
        await Promise.all([...updatePromises, ...insertPromises, ...deletePromises]);

        // --- COMMIT ---
        await conn.commit();

        console.log("Pomyślnie zsynchronizowano parametry papierów.");
        return res.status(201).json({ message: "Zapisano zmiany w parametrach papieru" });

    } catch (err) {
        // --- ROLLBACK ---
        if (conn) await conn.rollback();
        
        console.error("Błąd podczas aktualizacji parametrów papierów:", err);
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}

async updatePapieryNazwy(req, res) {
    const rows = req.body;
    let conn;

    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // 1. UPDATE - dla rekordów edytowanych (ale nie nowo wstawionych)
        const updatePromises = rows
            .filter(x => x.update === true && x.insert !== true)
            .map(row => {
                const sql = "UPDATE artdruk.papiery_nazwy SET nazwa = ?, grupa_id = ?, powleczenie_id = ? WHERE id = ?";
                return conn.execute(sql, [row.nazwa, row.grupa_id, row.powleczenie_id, row.id]);
            });

        // 2. INSERT - dla całkiem nowych rekordów
        const insertPromises = rows
            .filter(x => x.insert === true)
            .map(row => {
                const sql = "INSERT INTO artdruk.papiery_nazwy (nazwa, grupa_id, powleczenie_id) VALUES (?, ?, ?)";
                return conn.execute(sql, [row.nazwa, row.grupa_id, row.powleczenie_id]);
            });

        // 3. DELETE - dla rekordów do usunięcia
        const deletePromises = rows
            .filter(x => x.delete === true)
            .map(row => {
                const sql = "DELETE FROM artdruk.papiery_nazwy WHERE id = ?";
                return conn.execute(sql, [row.id]);
            });

        // Czekamy aż wszystkie operacje zostaną wysłane
        await Promise.all([...updatePromises, ...insertPromises, ...deletePromises]);

        // --- COMMIT ---
        await conn.commit();

        console.log("Pomyślnie zaktualizowano listę nazw papierów.");
        return res.status(201).json({ message: "Zmiany zapisane pomyślnie" });

    } catch (err) {
        // --- ROLLBACK ---
        if (conn) await conn.rollback();
        
        console.error("Błąd podczas aktualizacji nazw papierów:", err);
        // Zwracamy status 203 zgodnie z Twoją konwencją
        return res.status(203).json(err);
    } finally {
        // Oddajemy połączenie do puli
        if (conn) conn.release();
    }
}


async updatePapieryGrupa(req, res) {
    const rows = req.body;
    let conn;

    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // 1. Przygotowujemy zadania dla UPDATE
        const updatePromises = rows
            .filter(x => x.update === true && x.insert !== true)
            .map(row => {
                const sql = "UPDATE artdruk.papiery_grupa SET grupa = ? WHERE id = ?";
                return conn.execute(sql, [row.grupa, row.id]);
            });

        // 2. Przygotowujemy zadania dla INSERT
        const insertPromises = rows
            .filter(x => x.insert === true)
            .map(row => {
                const sql = "INSERT INTO artdruk.papiery_grupa (grupa) VALUES (?)";
                return conn.execute(sql, [row.grupa]);
            });

        // 3. Przygotowujemy zadania dla DELETE
        const deletePromises = rows
            .filter(x => x.delete === true)
            .map(row => {
                const sql = "DELETE FROM artdruk.papiery_grupa WHERE id = ?";
                return conn.execute(sql, [row.id]);
            });

        // Łączymy wszystkie obietnice w jedną tablicę i czekamy na finał wszystkich operacji
        await Promise.all([...updatePromises, ...insertPromises, ...deletePromises]);

        // --- COMMIT ---
        await conn.commit();

        console.log("Pomyślnie zsynchronizowano grupy papierów.");
        return res.status(201).json({ message: "Zapisano zmiany" });

    } catch (err) {
        // --- ROLLBACK ---
        // Jeśli COKOLWIEK z powyższych zawiedzie, baza wraca do stanu sprzed funkcji
        if (conn) await conn.rollback();
        
        console.error("Błąd podczas aktualizacji grup papierów:", err);
        return res.status(203).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}




async updateKlient(req, res) {
    // Wyciągamy dane z body - czysto i czytelnie
    const { id, firma, firma_nazwa, adres, kod, nip, opiekun_id } = req.body;

    // Przygotowujemy tablicę danych do wstawienia w miejsca znaków zapytania
    const dane = [firma, firma_nazwa, adres, kod, nip, opiekun_id, id];

    let conn;

    try {
        conn = await pool.getConnection();

        const sql = `
            UPDATE artdruk.klienci 
            SET firma = ?, firma_nazwa = ?, adres = ?, kod = ?, nip = ?, opiekun_id = ? 
            WHERE id = ?
        `;
        
        console.log(`Aktualizacja danych klienta: ${firma_nazwa} (ID: ${id})`);

        // Wykonujemy zapytanie korzystając z execute dla maksymalnego bezpieczeństwa
        const [result] = await conn.execute(sql, dane);

        // Zwracamy wynik (np. informację o liczbie zmienionych wierszy)
        return res.status(200).json(result);

    } catch (err) {
        console.error("Błąd podczas aktualizacji klienta:", err);
        // Zwracamy status 500, żeby frontend wiedział, że coś poszło nie tak
        return res.status(500).json({ error: "Nie udało się zaktualizować danych klienta", details: err });
    } finally {
        // Zawsze oddajemy połączenie do puli!
        if (conn) conn.release();
    }
}



async updateHistoria(req, res) {
    // Pobieramy dane z body
    const { kategoria, event, zamowienie_id, user_id } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? dla wszystkich wartości. 
        // Sterownik sam dopilnuje, co jest liczbą, a co stringiem.
        const sql = `
            INSERT INTO artdruk.zamowienia_historia (user_id, kategoria, event, zamowienie_id) 
            VALUES (?, ?, ?, ?)
        `;
        
        console.log(`Logowanie zdarzenia: [${kategoria}] dla zamówienia ID: ${zamowienie_id}`);

        const [result] = await conn.execute(sql, [user_id, kategoria, event, zamowienie_id]);

        // Zwracamy status 200
        return res.status(200).json(result);

    } catch (err) {
        console.error("Błąd podczas zapisu historii:", err);
        // Zwracamy 500 lub inny status błędu, żeby frontend wiedział o problemie
        return res.status(500).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async updateWydaniePapieru_status(req, res) {
    // Wyciągamy dane z body
    const { global_id_grupa, status } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        // SQL z bezpiecznymi parametrami
        const sql = "UPDATE artdruk.technologie_wydanie_papieru SET status = ? WHERE global_id != 0 AND global_id_grupa = ?";
        
        console.log(`Aktualizacja statusu wydania papieru: Grupa ${global_id_grupa} na status ${status}`);

        const [result] = await conn.execute(sql, [status, global_id_grupa]);

        // Zwracamy wynik do frontendu
        return res.status(200).json(result);

    } catch (err) {
        console.error("Błąd w updateWydaniePapieru_status:", err);
        // Status 500 dla błędów serwera/bazy
        return res.status(500).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}

async insertWydaniePapieru_status(req, res) {
    // Pobieramy dane z body
    const { global_id_grupa, status } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy parametrów ? zamiast doklejania stringów
        const sql = "INSERT INTO artdruk.technologie_wydanie_papieru (global_id_grupa, status) VALUES (?, ?)";
        
        console.log(`Zapisuję status wydania papieru: Grupa ${global_id_grupa}, Status ${status}`);

        const [result] = await conn.execute(sql, [global_id_grupa, status]);

        // Zwracamy wynik operacji (np. insertId)
        return res.status(200).json(result);

    } catch (err) {
        console.error("Błąd w insertWydaniePapieru_status:", err);
        // Zwracamy błąd, jeśli coś poszło nie tak
        return res.status(500).json(err);
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli
        if (conn) conn.release();
    }
}


async insertWydaniePapieru_status_multiselect(req, res) {
    const grupyWykonanSelect = req.body;

    let conn;
    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // 1. Przygotowujemy listę zadań dla INSERT-ów
        const insertPromises = grupyWykonanSelect
            .filter(x => x.wydanie_papieru_status == null)
            .map(grupa => {
                const sqlInsert = "INSERT INTO artdruk.technologie_wydanie_papieru (global_id_grupa, status) VALUES (?, 3)";
                return conn.execute(sqlInsert, [grupa.global_id]);
            });

        // 2. Przygotowujemy listę zadań dla UPDATE-ów
        const updatePromises = grupyWykonanSelect
            .filter(x => x.wydanie_papieru_status != null)
            .map(grupa => {
                const sqlUpdate = "UPDATE artdruk.technologie_wydanie_papieru SET status = 3 WHERE global_id != 0 AND global_id_grupa = ?";
                return conn.execute(sqlUpdate, [grupa.global_id]);
            });

        // 3. Czekamy na wykonanie wszystkich zapytań wewnątrz transakcji
        await Promise.all([...insertPromises, ...updatePromises]);

        // --- COMMIT ---
        // Dopiero teraz dane faktycznie zostają zapisane w bazie
        await conn.commit();

        console.log(`Transakcja zakończona sukcesem. Zaktualizowano ${grupyWykonanSelect.length} rekordów.`);
        return res.status(200).json("OK");

    } catch (err) {
        // --- ROLLBACK ---
        // Jeśli którykolwiek element zawiedzie, cofamy WSZYSTKIE zmiany
        if (conn) await conn.rollback();
        
        console.error("Błąd transakcji (Wydanie Papieru):", err);
        // Zwracamy błąd do frontendu, żeby wiedział, że nic się nie zapisało
        return res.status(500).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}





async postKosztyDodatkoweZamowienia(req, res) {
    // Pobieramy dane z body
    const { status, zamowienie_id, zamowienie_prime_id } = req.body;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy parametrów ? zamiast sklejania stringów dla bezpieczeństwa i czystości
        const sql = `
            INSERT INTO artdruk.zamowienia_koszty_dodatkowe (status, zamowienie_id, zamowienie_prime_id) 
            VALUES (?, ?, ?)
        `;
        
        console.log(`Dodaję koszty dodatkowe dla zamówienia: ${zamowienie_id}`);

        const [result] = await conn.execute(sql, [status, zamowienie_id, zamowienie_prime_id]);

        // Zwracamy status 201 zgodnie z Twoim oryginałem
        return res.status(201).json(result);

    } catch (err) {
        console.error("Błąd w postKosztyDodatkoweZamowienia:", err);
        // Jeśli coś pójdzie nie tak, zwracamy 400 tak jak w Twoim kodzie
        return res.status(400).json(err);
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}


async updateSetOrderNotFinal(req, res) {
    // Wyciągamy ID zamówienia z body
    const zamowienie_id = req.body.zamowienie_id;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy ? zamiast doklejania stringa, żeby nikt nie "zamieszał" w ID
        const sql = "UPDATE artdruk.zamowienia SET final = 0 WHERE id = ?";
        
        console.log(`Archiwizuję poprzednią wersję zamówienia ID: ${zamowienie_id}`);

        const [result] = await conn.execute(sql, [zamowienie_id]);

        // Zwracamy status 201 (zgodnie z Twoim oryginałem)
        return res.status(201).json(result);

    } catch (err) {
        console.error("Błąd w updateSetOrderNotFinal:", err);
        // Wysłanie błędu do frontendu
        return res.status(500).json({ error: "Nie udało się zaktualizować statusu wersji zamówienia" });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli
        if (conn) conn.release();
    }
}

async updateSetOrderToDeleted(req, res) {
    const rowsToDelete = req.body.rowsToDelete;

    // Szybka walidacja, żeby nie męczyć bazy pustymi danymi
    if (!rowsToDelete || !Array.isArray(rowsToDelete) || rowsToDelete.length === 0) {
        return res.status(400).json({ error: "Brak zamówień do usunięcia" });
    }

    let conn;

    try {
        conn = await pool.getConnection();

        // --- START TRANSAKCJI ---
        await conn.beginTransaction();

        // Tworzymy tablicę obietnic dla każdego UPDATE
        const updatePromises = rowsToDelete.map(row => {
            const sql = "UPDATE artdruk.zamowienia SET final = 2 WHERE id = ?";
            return conn.execute(sql, [row.id]);
        });

        // Czekamy, aż wszystkie zapytania zostaną wysłane do bazy
        await Promise.all(updatePromises);

        // --- COMMIT ---
        await conn.commit();

        console.log(`Przeniesione do kosza! Liczba zamówień: ${rowsToDelete.length}`);
        return res.status(201).json({ message: "Przeniesiono do kosza", count: rowsToDelete.length });

    } catch (err) {
        // Jeśli cokolwiek pójdzie nie tak (np. błąd połączenia), cofamy zmiany
        if (conn) await conn.rollback();
        
        console.error("Błąd podczas usuwania zamówień:", err);
        return res.status(203).json(err);
    } finally {
        // Oddajemy połączenie do puli
        if (conn) conn.release();
    }
}

//------------------------------------------------



async getNadkomplety(req, res) {
    let conn;

    try {
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.nadkomplety";
        

        // execute() jest optymalne nawet dla prostych selectów
        const [rows] = await conn.execute(sql);

        // Zwracamy listę rekordów do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania nadkompletów:", err);
        // Zwracamy błąd 500, jeśli baza nie odpowiada
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Zawsze oddajemy połączenie do puli!
        if (conn) conn.release();
    }
}

async getListaPapierow(req, res) {
    let conn;

    try {
        conn = await pool.getConnection();

        // Pobieramy dane z widoku artdruk.view_papiery
        const sql = "SELECT * FROM artdruk.view_papiery";
        

        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania listy papierów:", err);
        // Zwracamy status 500 w przypadku awarii bazy
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Zawsze zwalniamy połączenie do puli!
        if (conn) conn.release();
    }
}
async getListaPapierowNazwy(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.papiery_nazwy";
        

        // Wykonujemy zapytanie
        const [rows] = await conn.execute(sql);

        // Zwracamy dane do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania nazw papierów:", err);
        // Zwracamy błąd 500, żeby frontend wiedział, że baza "nie domaga"
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Zawsze zwalniamy połączenie do puli!
        if (conn) conn.release();
    }
}

async getListaPapierowGrupa(req, res) {
    let conn;

    try {
        // Pobieramy aktywne połączenie z puli
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.papiery_grupa";
        

        // Wykonujemy zapytanie (rows to tablica wyników)
        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania grup papierów:", err);
        // Zwracamy status 500 w razie awarii bazy
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli!
        if (conn) conn.release();
    }
}

async getListaPapierowPostac(req, res) {
    let conn;

    try {
        // Pobieramy aktywne połączenie z puli
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.papiery_postac";
        

        // Wykonujemy zapytanie (rows to tablica wyników)
        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania postaci papieru:", err);
        // Zwracamy status 500 w razie awarii bazy
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli!
        if (conn) conn.release();
    }
}
async getListaPapierowRodzaj(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.papiery_rodzaj";
        

        // Wykonujemy zapytanie (rows to tablica wyników)
        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania rodzajów papieru:", err);
        // Zwracamy status 500, żeby frontend nie wisiał w nieskończoność
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli!
        if (conn) conn.release();
    }
}

async getListaPapierowWykonczenia(req, res) {
    let conn;

    try {
        // Pobieramy aktywne połączenie z puli
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.papiery_wykonczenia";
        

        // Wykonujemy zapytanie (rows to tablica wyników)
        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania wykończeń papieru:", err);
        // Zwracamy status 500, aby frontend wiedział o awarii bazy
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli!
        if (conn) conn.release();
    }
}

async getListaPapierowPowleczenie(req, res) {
    let conn;

    try {
        // Wyciągamy połączenie z naszej nowej puli
        conn = await pool.getConnection();

        const sql = "SELECT * FROM artdruk.papiery_powleczenie";
        

        // Wykonujemy zapytanie (rows to tablica z rekordami)
        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania powleczeń papieru:", err);
        // Zwracamy błąd 500, żeby frontend nie wisiał w nieskończoność
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli!
        if (conn) conn.release();
    }
}

async getListaProcesow(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z naszej puli
        conn = await pool.getConnection();

        // Pobieramy dane z widoku procesów
        const sql = "SELECT * FROM artdruk.view_procesy";
        

        const [rows] = await conn.execute(sql);

        // Zwracamy listę rekordów do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania listy procesów:", err);
        // Zwracamy status 500, jeśli widok lub baza mają problem
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Zwalniamy połączenie do puli
        if (conn) conn.release();
    }
}
async getListaProcesowNazwa(req, res) {
    let conn;

    try {
        // Wyciągamy połączenie z puli
        conn = await pool.getConnection();

        // Pobieramy tylko niezbędne kolumny: id i nazwa
        const sql = "SELECT id, nazwa FROM artdruk.procesy_nazwa";
        

        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania nazw procesów:", err);
        // Status 500 informuje frontend, że problem leży po stronie serwera/bazy
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Obowiązkowe zwolnienie połączenia do puli
        if (conn) conn.release();
    }
}

async getProcesyElementow(req, res) {
    let conn;

    try {
        conn = await pool.getConnection();

        // Czytelniejszy zapis SQL z użyciem backtiksów dla długich zapytań
        const sql = `
            SELECT 
                zp.id, 
                zp.zamowienie_id, 
                zp.produkt_id, 
                zp.element_id, 
                zp.proces_id, 
                zp.front, 
                zp.front_info, 
                zp.back, 
                zp.back_info, 
                zp.uwagi, 
                lp.proces, 
                lp.typ, 
                lp.rodzaj 
            FROM artdruk.zamowienia_procesy AS zp
            INNER JOIN artdruk.lista_procesow AS lp ON zp.proces_id = lp.id 
            ORDER BY zp.id ASC
        `;
        

        const [rows] = await conn.execute(sql);

        // Zwracamy wynik do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania procesów elementów:", err);
        // Status 500 informuje o problemie technicznym po stronie bazy
        return res.status(500).json({ error: "Błąd bazy danych przy pobieraniu procesów", details: err });
    } finally {
        // Zawsze zwalniamy połączenie do puli!
        if (conn) conn.release();
    }
}

async getProcesory(req, res) {
    let conn;

    try {
        // Pobieramy połączenie z puli
        conn = await pool.getConnection();

        // Pobieramy wszystkie procesory, zachowując kolejność wg indeksu
        const sql = "SELECT * FROM artdruk.procesory ORDER BY indeks ASC";
        

        const [rows] = await conn.execute(sql);

        // Zwracamy listę do frontendu
        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd podczas pobierania procesorów:", err);
        // Status 500 informuje frontend, że coś "nie pykło" w bazie
        return res.status(500).json({ error: "Błąd bazy danych", details: err });
    } finally {
        // Zawsze oddajemy połączenie do puli!
        if (conn) conn.release();
    }
}




}

module.exports = new Connections();