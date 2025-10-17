const connection = require("../mysql");

const ZmienEtapWydrukowane = (req, res) => {
  let techologie = req.body;
//   let technologia_id = wykonanieRow.technologia_id;


  for( let technologia of techologie){
//   console.log(technologia.technologia_id)


 var sql = " SELECT status FROM artdruk.view_technologie_grupy_wykonan where global_proces_id > 0 and global_proces_id < 9 and technologia_id="+ technologia.technologia_id 
 connection.query(sql, function (err, result) {

    if(result.every(x=> x.status == 4)){
//druk
            var sql = " update artdruk.zamowienia set etap = 8 where id !=0 and technologia_id ="+technologia.technologia_id 
                connection.query(sql, function (err, result) {
                if (err) console.log(err)
                });
//   console.log("Druk zakonczony")
    }
 if (err) console.log(err)
 });



 var sql = " SELECT status FROM artdruk.view_technologie_grupy_wykonan where global_proces_id > 24 and global_proces_id < 39 and technologia_id="+ technologia.technologia_id 
 connection.query(sql, function (err, result) {

    if(result.every(x=> x.status == 4)){
//falc
            var sql = " update artdruk.zamowienia set etap = 10 where id !=0 and technologia_id ="+technologia.technologia_id 
                connection.query(sql, function (err, result) {
                if (err) console.log(err)
                });
//   console.log("Druk zakonczony")
    }
 if (err) console.log(err)
 });




  }



    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) console.log(err)
        res.status(200).json("OK")  

 })

  
};

module.exports = {
  ZmienEtapWydrukowane,
};
