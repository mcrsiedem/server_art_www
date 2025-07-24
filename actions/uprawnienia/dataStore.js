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
        if (err) throw err;
        users = []
       users.push(result[0])
       
    });
    }


function getMyData() {
  return myLoadedData[0]; // Funkcja do pobierania danych
}

function getUsers() {
  return users; // Funkcja do pobierania danych
}


function checkPrivileges(decoded,uprawnienie) {

  
  // console.log("dane: "+ findValueByKey(decoded,uprawnienie) )
if(findValueByKey(decoded,uprawnienie) == 1){
  return true
}

return false
  
}


function findValueByKey(obj, keyName) {
  if (typeof obj !== 'object' || obj === null) {
    console.warn("The first argument must be an object.");
    return undefined;
  }


  return obj[keyName];
  // return obj.keyName;
}


module.exports = {
  loadMyDataFromDatabase,
  getMyData,
  loadPrivileges,
  getUsers,
  checkPrivileges
};