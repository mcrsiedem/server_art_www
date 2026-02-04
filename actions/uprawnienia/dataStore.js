const { connection, pool } = require("../mysql");

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



   const  loadPrivileges2 = ()=>{
     
        var sql  = "select * from artdruk.users";
        connection.query(sql, function (err, result) {
        if (err) console.log(err);

        if (result && Array.isArray(result)) {
        users = [...result];
    }

       
    });
    }

       const  loadPrivileges = async ()=>{
     
    try {
    const [rows] = await pool.execute("select * from artdruk.users",[]) 
    users = [...rows];

  } catch (err) {
    console.error("Błąd w Kontrolerze:", err);

  }   

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