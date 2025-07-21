
const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const ZapiszTechnologieUpdate_restore=(req,res) =>{

    const zamowienie_id = req.params['zamowienie_id']
    // usuwa niepotrzebne wpisy po nieudanym zapisie technologii





 var sql = " SELECT global_id FROM artdruk.technologie_grupy_wykonan where zamowienie_id="+ zamowienie_id
 connection.query(sql, function (err, result) {

for(let re of result){
 console.log("global_id grupy: "+ re.global_id)
            var sql = " select artdruk.delete_grupa_wykonan(" + re.global_id + ")"
                connection.query(sql, function (err, result) {
                if (err) throw err
                });

    }
 if (err) throw err
 });


 var sql = " SELECT global_id FROM artdruk.technologie_grupy_wykonan_oprawa where zamowienie_id="+ zamowienie_id
 connection.query(sql, function (err, result) {

for(let re of result){
 console.log("global_id grupy oprawa: "+ re.global_id)
            var sql = " select artdruk.delete_grupa_wykonan_oprawa(" + re.global_id + ")"
                connection.query(sql, function (err, result) {
                if (err) throw err
                });

    }
 if (err) throw err
 });




        var sql =   "call artdruk.delete_technologia_from_zamowienie_id(" + zamowienie_id + ")"
connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }
});


    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) throw err
        res.status(200).json("OK")  

 })



}

module.exports = {
    ZapiszTechnologieUpdate_restore
    
}
 