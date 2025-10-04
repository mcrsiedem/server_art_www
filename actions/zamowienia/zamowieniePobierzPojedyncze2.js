const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");

// nowy zapis zamówienia - dane i parametry w jednym
const zamowieniePobierzPojedyncze =(req,res)=>{
       let dane=[];
        const idZamowienia = req.params['idZamowienia']

        let data =[idZamowienia]

        var sql  = "select * from artdruk.view_zamowienia where id = '" + idZamowienia + "' ORDER BY id ASC";
       
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
        // res.status(200).json(dane);
    
        });

        var sql = "select * from artdruk.zamowienia_produkty where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
        
        } );

        var sql = "select * from artdruk.zamowienia_elementy where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
   
        } );

        var sql = "select * from artdruk.view_zamowienia_fragmenty where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
     
        } );

        var sql = "select * from artdruk.view_zamowienia_oprawa where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)

        } );

        
        var sql = "select * from artdruk.view_zamowienia_procesy_elementow where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
        } );

        var sql = "select id as technologia_id from artdruk.technologie where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
        } );

        var sql = "select * from artdruk.view_zamowienia_historia where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        dane.push(doc)
        } );
        var sql = "select * from artdruk.zamowienia_pakowanie where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
        } );


        var sql = "select * from artdruk.zamowienia_koszty_dodatkowe where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)

        } );

             var sql = "select * from artdruk.zamowienia_ksiegowosc where zamowienie_id = " + idZamowienia ;
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)

        } );

                var sql = "select * from artdruk.view_zamowienia_faktury where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)

        } );

                        var sql = "select * from artdruk.view_zamowienia_pliki where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)

        } );

        // var sql = "select * from artdruk.koszty_dodatkowe where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        // connection.query(sql, function (err, doc) {
        // if (err) throw err;
        // dane.push(doc)
        // } );

        var sql = "commit";
        connection.query(sql, function (err, result) {
            if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
        // console.log("get OK");
        res.status(200).json(dane);
        });

    }


module.exports = {
  zamowieniePobierzPojedyncze
    
}
 