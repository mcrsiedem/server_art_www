const connection = require("../mysql");
const dataStore = require('./dataStore');




     const       uprawnienia = (req,res) =>{
    

             const procesor_id = req.params['procesor_id']
            const token = req.params['token']

             console.log(dataStore.getUsers())


                res.status(200).json("OK");
     
         }


module.exports = {
  uprawnienia
    
}
 

