const connection = require("../db/mysql");


class ProduktyActions {

    updateProdukty(req,res){
        const id = req.body.id;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
        var sql = "update produkty set " + kolumna + " = '" + value + "' where id="+id;
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}

}

module.exports = new ProduktyActions();