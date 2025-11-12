const { DecodeToken } = require('../logowanie/DecodeToken');
const dataStore = require('./dataStore');

// ładuje ponownie uprawnienia z bazy do serwera

     const uprawnienia = (req,res) =>{


            console.log("Uprawnienia załadowane!")
            dataStore.loadPrivileges()

            // do testowania
            // const token = req.params['token']
            // console.log("insert token:"+ DecodeToken(token).id)

            res.status(200).json("OK");
     
         }


module.exports = {
  uprawnienia
    
}
 

