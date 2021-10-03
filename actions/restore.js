const connection = require("../db/mysql");


class RestoreActions {


    getRestore(req,res){
        var sql = "SELECT id,DATE_FORMAT(`Utworzono`, '%Y-%m-%d %H:%i:%s') AS `utworzono`, aktualny, opis FROM backup ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}

    //---------
    deleteBackup(req,res){
        const id = req.body.id;
        const data = req.body.data;

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });
    
        var sql= "DELETE FROM backup WHERE ID ='" +id+ "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;

        });
    
        var sql= "DROP TABLE `produkty_"+data+"`";
                connection.query(sql, function (err, result) {
                if (err) throw err;
        });

        var sql= "DROP TABLE `zlecenia_"+data+"`";
                connection.query(sql, function (err, result) {
                if (err) throw err;
        });


            var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Zlecenie skasowane! ");
            res.status(201).json(result);

        });
    }
    //---------
    restoreBackup(req,res){
        const id = req.body.id;
        const data = req.body.data;

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql= "delete from produkty";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql= "INSERT INTO produkty SELECT * FROM `produkty_"+data+"`;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql= "delete from zlecenia;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql= "INSERT INTO zlecenia SELECT * FROM `zlecenia_"+data+"`;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql= "update backup set Aktualny = null";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql= "update backup set Aktualny = 'X'  where id='" + id + "'";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  
        


        var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Zlecenie skasowane! ");
            res.status(201).json(result);
                                                        });

    }

    //---------
    createBackup(req,res){
        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });

        var sql = "SELECT DATE_FORMAT(now() , '%Y-%m-%d %H:%i:%s') AS `teraz` ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;

        //doc[0].teraz
        console.log("zlecenia_"+doc[0].teraz);
        var sql= "CREATE TABLE `zlecenia_"+doc[0].teraz+"` (\n" +
        "  `ID` int NOT NULL,\n" +
        "  `Utworzono` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
        "  `Zmodyfikowano` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
        "  `Kolejnosc` int DEFAULT NULL,\n" +
        "  `NrZlecenia` int DEFAULT NULL,\n" +
        "  `RokZlecenia` int DEFAULT NULL,\n" +
        "  `Klient` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Praca` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Naklad` int DEFAULT NULL,\n" +
        "  `FormatPapieru` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Oprawa` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `OprawaCzas` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `OprawaPredkosc` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Folia` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Spedycja` date DEFAULT NULL,\n" +
        "  `Arkusze` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Legi` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `LegiRodzaj` int DEFAULT NULL,\n" +
        "  `Przeloty` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Status` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Uwagi` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `FalcPredkosc` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `FalcCzas` int DEFAULT NULL,\n" +
        "  `KolejnoscOprawa` int DEFAULT NULL,\n" +
        "  `Srodek` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Okladka` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  PRIMARY KEY (`ID`)\n" +
        ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  
     
        
        var sql= "CREATE TABLE `produkty_"+doc[0].teraz+"` (\n" +
        "  `ID` int NOT NULL,\n" +
        "  `ID_zlecenia` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Utworzono` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
        "  `Zmodyfikowano` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
        "  `Kolejnosc` int DEFAULT NULL,\n" +
        "  `Typ` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Nazwa` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Maszyna` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `PoczatekDruku` datetime DEFAULT NULL,\n" +
        "  `PredkoscDruku` int DEFAULT NULL,\n" +
        "  `Narzad` int DEFAULT NULL,\n" +
        "  `CzasDruku` int DEFAULT NULL,\n" +
        "  `KoniecDruku` datetime DEFAULT NULL,\n" +
        "  `NrZlecenia` int DEFAULT NULL,\n" +
        "  `RokZlecenia` int DEFAULT NULL,\n" +
        "  `Klient` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Praca` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Naklad` int DEFAULT NULL,\n" +
        "  `FormatPapieru` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Oprawa` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `OprawaCzas` int DEFAULT NULL,\n" +
        "  `OprawaPredkosc` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Folia` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Spedycja` date DEFAULT NULL,\n" +
        "  `Arkusze` int DEFAULT NULL,\n" +
        "  `Legi` int DEFAULT NULL,\n" +
        "  `LegiRodzaj` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
        "  `Przeloty` int DEFAULT NULL,\n" +
        "  `Status` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `Uwagi` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `SM_ok` int DEFAULT NULL,\n" +
        "  `SM_dmg` int DEFAULT NULL,\n" +
        "  `XL_ok` int DEFAULT NULL,\n" +
        "  `XL_dmg` int DEFAULT NULL,\n" +
        "  `FalcPredkosc` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
        "  `FalcCzas` int DEFAULT NULL,\n" +
        "  `DataCTP` datetime DEFAULT NULL, \n" +

        "  PRIMARY KEY (`ID`)\n" +
        ") ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  


        var sql= "update backup set Aktualny = null  ";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  

        var sql= "INSERT INTO backup (Utworzono,Aktualny) values ('"+doc[0].teraz+"','X') ;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  

        var sql= "INSERT INTO `produkty_" + doc[0].teraz + "` SELECT * FROM produkty;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  

        var sql = "INSERT INTO `zlecenia_" + doc[0].teraz  + "` SELECT * FROM zlecenia;";
        connection.query(sql, function (err, result) {
        if (err) throw err;                          });  





                                                     });


        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        res.status(201).json(result);
                                                    });

    }
    //---------
    updateRestore(req,res){
        const id = req.body.id;
        const value = req.body.value;
        var sql = "update backup set Opis = '" + value + "' where id='" + id + "'";
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}
    //---------

}

module.exports = new RestoreActions();