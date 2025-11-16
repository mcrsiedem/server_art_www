const { DecodeToken } = require('../logowanie/DecodeToken');


// ładuje ponownie uprawnienia z bazy do serwera

     const getZestawienieUser = (req,res) =>{
        const OD_KIEDY = req.params['od']
        const DO_KIEDY = req.params['do']
        const KTO = req.params['kto'] 

   console.log("OD_KIEDY:"+ OD_KIEDY)
   console.log("DO_KIEDY:"+ DO_KIEDY)
   console.log("KTO:"+ KTO)
            //do testowania
            // const token = req.params['token']
            // console.log("insert token:"+ DecodeToken(token).id)

            res.status(200).json("OK");
     
         }


module.exports = {
  getZestawienieUser
    
}
 

