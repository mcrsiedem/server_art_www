const {  pool } = require("../mysql");

const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');


// nowy zapis zamówienia - dane i parametry w jednym
const klienciPobierzWszystkich = async (req, res) => {
    const token = req.params['token'];
    let conn;

    try {
        // 1. Weryfikacja tokena (promisyfikujemy, żeby użyć await)
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, ACCESS_TOKEN, (err, data) => {
                if (err) reject(err);
                else resolve(data);
            });
        });

        const id = decoded.id;
        const klienci_wszyscy = dataStore.checkPrivileges(id, "klienci_wszyscy");

        conn = await pool.getConnection();
        let sql;
        let params = [];

        // 2. Budowanie zapytania zależnie od uprawnień
        if (klienci_wszyscy) {
            sql = "SELECT * FROM artdruk.view_klienci ORDER BY firma ASC";
        } else {
            // Używamy parametrów ?, aby uniknąć SQL Injection i błędów typu
            sql = `SELECT * FROM artdruk.view_klienci 
                   WHERE (opiekun_id = ? OR asystent1 = ? OR asystent2 = ?) 
                   ORDER BY firma ASC`;
            params = [id, id, id];
        }


        const [rows] = await conn.execute(sql, params);

        return res.status(200).json(rows);

    } catch (err) {
        console.error("Błąd w klienciPobierzWszystkich:", err);
        // Jeśli błąd pochodzi z JWT (np. nieważny token)
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Błąd autoryzacji" });
        }
        return res.status(500).json({ error: "Błąd serwera" });
    } finally {
        if (conn) conn.release();
    }
};


module.exports = {
  klienciPobierzWszystkich
    
}
 