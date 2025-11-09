
const mysql = require('mysql2');
const {database} = require('../config');
const connection = mysql.createConnection(database);
const pool = mysql.createPool({
    ...database,
    waitForConnections: true, // Czekaj na wolne połączenie, jeśli pula jest zajęta
    connectionLimit: 10,     // Ustal rozsądny limit np. 10-20
    queueLimit: 0,            // Brak limitu w kolejce oczekujących żądań
    // Nowe, kluczowe parametry:
    // Czas bezczynności (w milisekundach) po którym połączenie jest zamykane.
    // Ustawienie na 60 sekund (60000ms) to dobry punkt wyjścia.
    idleTimeout: 60000, 
    
    // Połączenie zostanie przerwane (zakończone), jeśli baza nie odpowie
    // w ciągu tego czasu (w milisekundach).
    connectTimeout: 10000
}).promise(); // **Kluczowe: użycie wersji z Promise**

module.exports = {
    connection: connection, // Stara nazwa dla kompatybilności
    pool: pool                     // Nowa pula
}
