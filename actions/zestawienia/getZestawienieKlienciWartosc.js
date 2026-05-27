const { DecodeToken } = require('../logowanie/DecodeToken');
const { pool } = require("../mysql");

const getZestawienieKlienciWartosc = async (req, res) => {
    const OD_KIEDY = req.params['od'];
    const DO_KIEDY = req.params['do'];

    const sql = `
SELECT
    t1.klient_id,
    t1.firma_nazwa,
    
    -- Poprawne sumy procesów (nie są dublowane)
    SUM(CASE WHEN t1.proces_nazwa_id = 1 THEN t1.przeloty ELSE 0 END) AS druk_przeloty,
    SUM(CASE WHEN t1.proces_nazwa_id = 3 THEN t1.przeloty ELSE 0 END) AS falc_przeloty,
    SUM(CASE WHEN t1.proces_nazwa_id = 2 THEN t1.przeloty ELSE 0 END) AS uszlachetnienie_przeloty,
    
    -- Użycie MAX() rozwiązuje problem z regułą ONLY_FULL_GROUP_BY
    IFNULL(MAX(waluty.suma_waluta_1), 0) AS suma_waluta_1,
    IFNULL(MAX(waluty.suma_waluta_2), 0) AS suma_waluta_2,
    IFNULL(MAX(waluty.suma_waluta_3), 0) AS suma_waluta_3

FROM
    artdruk.view_technologie_wykonania_zestawienie AS t1

-- Podzapytanie, które sumuje unikalne zamówienia w danym zakresie dat dla każdego klienta
LEFT JOIN (
    SELECT 
        z.klient_id,
        SUM(CASE WHEN z.waluta_id = 1 THEN z.wartosc_zamowienia ELSE 0 END) AS suma_waluta_1,
        SUM(CASE WHEN z.waluta_id = 2 THEN z.wartosc_zamowienia ELSE 0 END) AS suma_waluta_2,
        SUM(CASE WHEN z.waluta_id = 3 THEN z.wartosc_zamowienia ELSE 0 END) AS suma_waluta_3
    FROM 
        artdruk.zamowienia AS z
    WHERE 
        z.id IN (
            SELECT DISTINCT zamowienie_id 
            FROM artdruk.view_technologie_wykonania_zestawienie
            WHERE STR_TO_DATE(data_spedycji, '%Y-%m-%d') >= ?
              AND STR_TO_DATE(data_spedycji, '%Y-%m-%d') < (? + interval 1 day)
        )
    GROUP BY 
        z.klient_id
) AS waluty ON t1.klient_id = waluty.klient_id

WHERE
    STR_TO_DATE(t1.data_spedycji, '%Y-%m-%d') >= ?
    AND STR_TO_DATE(t1.data_spedycji, '%Y-%m-%d') < (? + interval 1 day)
GROUP BY
    t1.klient_id,
    t1.firma_nazwa
ORDER BY
    druk_przeloty DESC;
    `;

    try {
        const [rows] = await pool.execute(sql, [OD_KIEDY, DO_KIEDY, OD_KIEDY, DO_KIEDY]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Błąd w Kontrolerze:", err);
        res.status(500).json({ error: "Błąd serwera." });
    }
};

module.exports = {
    getZestawienieKlienciWartosc
};