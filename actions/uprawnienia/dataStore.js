let myLoadedData = []; // Tutaj będą twoje dane z bazy

async function loadMyDataFromDatabase() {
  // Udajemy, że pobieramy dane z bazy
  return new Promise(resolve => {
    setTimeout(() => {
      myLoadedData = ['jabłka', 'gruszki', 'banany'];
      console.log('Dane załadowane:', myLoadedData);
      resolve();
    }, 1000); // Symulacja pobierania danych
  });
}

function getMyData() {
  return myLoadedData; // Funkcja do pobierania danych
}

module.exports = {
  loadMyDataFromDatabase,
  getMyData
};