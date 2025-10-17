const connection = require("../mysql");

let myLoadedData = []; // Tutaj będą twoje dane z bazy
let users = []; // Tutaj będą twoje dane z bazy

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



   const  loadPrivileges = ()=>{
     
        var sql  = "select * from artdruk.users";
        connection.query(sql, function (err, result) {
        if (err) console.log(err);

        users = [...result]

       
    });
    }


function getMyData() {
  return myLoadedData[0]; // Funkcja do pobierania danych
}

function getUsers() {
  return users; // Funkcja do pobierania danych
}


function checkPrivileges(id,uprawnienie) {

  if( users.find(x => x.id == id)[uprawnienie]==1){
  return true
  }else return false
  
}





module.exports = {
  loadMyDataFromDatabase,
  getMyData,
  loadPrivileges,
  getUsers,
  checkPrivileges,
  
};