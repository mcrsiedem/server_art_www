
const mysql = require('mysql2');
const { database } = require('../config');

let connection;

function handleDisconnect() {
    connection = mysql.createConnection(database);

    connection.connect((err) => {
        if (err) {
            console.error('Błąd połączenia (stare connection):', err);
            setTimeout(handleDisconnect, 2000); // Ponów próbę za 2 sekundy
        }
    });

    connection.on('error', (err) => {
        console.error('Błąd bazy danych (stare connection):', err.code);
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED') {
            handleDisconnect(); // Reanimacja połączenia
        } else {
            // Nie rzucamy błędu wyżej, żeby nie zabić procesu (uncaughtException)
            console.error('Inny błąd bazy, ale trzymam proces przy życiu.');
        }
    });
}

handleDisconnect(); // Inicjalizacja starego połączenia

// Pula - to jest Twój docelowy, bezpieczny port
const pool = mysql.createPool({
    ...database,
    waitForConnections: true,
    connectionLimit: 15,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
}).promise();

module.exports = {
    connection, // Stare callbackowe połączenie (z auto-reconnectem)
    pool        // Nowa pula (Promise)
};