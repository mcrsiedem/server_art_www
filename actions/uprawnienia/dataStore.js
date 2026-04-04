const { pool } = require("../mysql");

let myLoadedData = []; // Tutaj będą twoje dane z bazy
let users = []; // Tutaj będą twoje dane z bazy


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
  
  getMyData,
  loadPrivileges,
  getUsers,
  checkPrivileges,
  
};