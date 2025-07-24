const dataStore = require('./dataStore');

// ładuje ponownie uprawnienia z bazy do serwera

     const uprawnienia = (req,res) =>{

            console.log("Uprawnienia załadowane!")
            dataStore.loadPrivileges()
            res.status(200).json("OK");
     
         }


module.exports = {
  uprawnienia
    
}
 

