const { pool } = require("../mysql");

const usunTechnologie = async (req, res) => {
    // Pobieramy parametry z URL (req.params)
    const { id_delete, zamowienie_id, user_id } = req.params;

    let conn;

    try {
        conn = await pool.getConnection();

        // Używamy bindowania parametrów (?) dla procedury CALL
        const sql = "CALL artdruk.deletedforever_technologia(?, ?, ?)";
        
        console.log(`Kasowania technologii. ID: ${id_delete}, Zamówienie: ${zamowienie_id}, User: ${user_id}`);

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
};

module.exports = {
  usunTechnologie
    
}



 