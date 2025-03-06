
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_dane=(daneTechEdit) =>{


    console.log("dane: "+daneTechEdit)
    if( daneTechEdit.update == true){
        var sql =   "update  artdruk.technologie set "+  
           "nr='" + daneTechEdit.nr +
           "', rok = '" + daneTechEdit.rok + 
           "', tytul = '" + daneTechEdit.tytul + 
           "',firma_id=" + daneTechEdit.firma_id+ 
           ",klient_id='" + daneTechEdit.klient_id + 
           "',zamowienie_id='" + daneTechEdit.zamowienie_id + 
           "',autor_id='" + daneTechEdit.autor_id + 
           "',data_przyjecia=" + ifNoDateSetNull(daneTechEdit.data_przyjecia) + 
           ",data_spedycji=" + ifNoDateSetNull(daneTechEdit.data_spedycji) + 
           ",data_materialow=" + ifNoDateSetNull(daneTechEdit.data_materialow) + 
           " where id = '" + daneTechEdit.id + "'"
        
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
        }

}

module.exports = {
    zapiszTechnologieUpdate_dane
    
}
 