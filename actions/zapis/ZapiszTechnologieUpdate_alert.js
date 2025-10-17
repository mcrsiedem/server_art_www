
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszTechnologieUpdate_alert=(daneTechEdit,res) =>{


if(daneTechEdit.alert){

        var sql =   "call artdruk.zamowienie_set_null_alert(" + daneTechEdit.zamowienie_id + ")"
connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) console.log(err);       }});

var sql =   "update  artdruk.zamowienia set  status=2 where id = '" + daneTechEdit.zamowienie_id  + "'"
connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) console.log(err);       }});


}

}

module.exports = {
    zapiszTechnologieUpdate_alert
    
}
 