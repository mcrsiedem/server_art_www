const connection = require("../db/mysql");


class CTPActions {

getCTP(req,res){
    var sql = "SELECT id,utworzono, kolejnosc,praca,  status , uwagi FROM ctp ORDER BY Utworzono ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

postCTP(req,res){
    const title = req.body.title;
    const body = req.body.body;
    var sql = "INSERT INTO ctp  (Kolejnosc,Praca,Status) SELECT MAX(Kolejnosc)+1,'Nowa praca','Pliki' FROM ctp ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" 1 record inserted "+result.insertId);
    res.status(201).json(result);
});}

deleteCTP(req,res){
    const id = req.body.id;
    const kolejnosc = req.body.kolejnosc;

    var sql = "DELETE FROM  ctp where id="+id;
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record delete ");
      //  res.status(204).json(result);
    });

  
    var sql = "update ctp set  Kolejnosc=Kolejnosc -1  WHERE Kolejnosc > '"+kolejnosc+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            res.status(201).json(result);
    });
}

updateCTP(req,res){
    const id = req.body.id;
    const kolumna = req.body.kolumna;
    const value = req.body.value;
    var sql = "update ctp set " + kolumna + " = '" + value + "' where id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
});}




}

module.exports = new CTPActions();