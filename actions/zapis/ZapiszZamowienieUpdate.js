const connection = require("../mysql");


const zapiszZamowienieUpdate = (req,res) =>{

    let odpowiedz =[]
    let daneZamowienia = req.body[0]
    let produkty = req.body[1]
    let elementy = req.body[2]
    let fragmenty = req.body[3]
    let oprawa = req.body[4]
    let procesyElementow = req.body[5]

   

// console.log("Dane zamowienia: ", daneZamowienia.id )
// console.log("SaveAs: ", req.body[0].saveAs)


var sql = "begin";
connection.query(sql, function (err, result) {
if (err) throw err;  });


// if( daneZamowienia.update == true){
// var sql =   "update  artdruk.zamowienia set  nr = " + daneZamowienia.nr+ ", rok = " + daneZamowienia.rok+ ", firma_id = " + daneZamowienia.firma_id+ ", where id = '" + daneZamowienia.id + "'"
// connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
// }


// if( daneZamowienia.update == true){
//   var sql =   "update  artdruk.zamowienia set  nr = " + daneZamowienia.nr+ ", rok = " + daneZamowienia.rok+ ", firma_id = " + daneZamowienia.firma_id+ ", where id = '" + daneZamowienia.id + "'"
//   connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//   }
  
//---------------- elementy
for(let element of elementy.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.zamowienia_elementy set  id = " + element.id+ ", zamowienie_id = " + element.zamowienie_id+ ", produkt_id = " + element.produkt_id+ ", nazwa = '" + element.nazwa+ "', typ = " + element.typ+ ", ilosc_stron = '" + element.ilosc_stron+ "', format_x = '" + element.format_x+ "', format_y = " + element.format_y+ ", papier_id = " + element.papier_id+ ", naklad = " + element.naklad+ ", info = '" + element.info+ "', uwagi = '" + element.uwagi+ "' where global_id = " + element.global_id + ""
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
  }

  for(let row of elementy.filter(x => x.insert == true && x.delete != true) ){
    var sql =   "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,naklad,info,uwagi,stan,status,tytul,papier_info,indeks) "+
    "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + ",'" + row.nazwa + "'," + row.typ + ",'" + row.ilosc_stron + "','" + row.kolory + "'," + row.format_x + "," + row.format_y + "," + row.papier_id + "," + row.naklad + ",'" + row.info + "','" + row.uwagi + "','" + row.stan + "','" + row.status + "','" + row.tytul + "','" + row.papier_info + "','" + row.indeks + "'); ";
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
    }

    for(let element of elementy.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.zamowienia_elementy where global_id=" + element.global_id;
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
        }
//-------------- fragmenty

        for(let row of fragmenty.filter(x => x.update == true && x.insert != true) ){
          var sql =   "update  artdruk.zamowienia_fragmenty set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", oprawa_id = " + row.oprawa_id+ ", naklad = '" + row.naklad+ "', ilosc_stron = '" + row.ilosc_stron+ "', wersja = '" + row.wersja+ "', info = '" + row.info+ "', typ = '" + row.typ+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
          }
        
          for(let row of fragmenty.filter(x => x.insert == true && x.delete != true) ){
            var sql =   "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) "+
            "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.oprawa_id + ",'" + row.naklad + "','" + row.ilosc_stron + "','" + row.wersja + "','" + row.info + "','" + row.typ + "'," + row.indeks + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
            }
        
            for(let row of fragmenty.filter(x => x.delete == true && x.insert != true) ){
                var sql =   "DELETE from artdruk.zamowienia_fragmenty where global_id=" + row.global_id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
                }

  //-------------- procesy elementów
  for(let row of procesyElementow.filter(x => x.update == true && x.insert != true) ){
    var sql =   "update  artdruk.zamowienia_procesy_elementow set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", proces_id = " + row.proces_id+ ", front_ilosc = '" + row.front_ilosc+ "', back_ilosc = '" + row.back_ilosc+ "', front_kolor = '" + row.front_kolor+ "', back_kolor = '" + row.back_kolor+ "', info = '" + row.info+ "', nazwa_id = " + row.nazwa_id+ ",  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
    }
  
  
    for(let row of procesyElementow.filter(x => x.insert == true && x.delete != true) ){
      var sql =   "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) "+
      "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.proces_id + ",'" + row.front_ilosc + "','" + row.back_ilosc + "','" + row.front_kolor + "','" + row.back_kolor + "','" + row.info + "'," + row.nazwa_id + "," + row.indeks + "); ";
      connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
      }
  
      for(let row of procesyElementow.filter(x => x.delete == true && x.insert != true) ){
          var sql =   "DELETE from artdruk.zamowienia_procesy_elementow where global_id=" + row.global_id;
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
          }
        




  connection.query("commit ", function (err, result) {
  });


odpowiedz = [daneZamowienia,produkty,elementy,fragmenty,oprawa,procesyElementow]
res.status(201).json(odpowiedz);

//     var sql =   "INSERT INTO artdruk.zamowienia (nr,rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,rodzaj,waluta_id,vat_id,przedplata,cena,termin_platnosci,fsc) "+
//     "values ('" + daneZamowienia.nr + "','" + daneZamowienia.rok + "','" + daneZamowienia.firma_id+ "','" + daneZamowienia.klient_id + "','" + daneZamowienia.tytul + "','" + daneZamowienia.data_przyjecia + "','" + daneZamowienia.data_materialow + "','" + daneZamowienia.data_spedycji + "','" + daneZamowienia.opiekun_id + "','" + daneZamowienia.user + "','" + daneZamowienia.stan + "','" + daneZamowienia.status + "','" + daneZamowienia.uwagi + "','" + daneZamowienia.rodzaj + "','" + daneZamowienia.waluta_id + "','" + daneZamowienia.vat_id + "','" + daneZamowienia.przedplata + "','" + daneZamowienia.cena + "','" + daneZamowienia.termin_platnosci + "','" + daneZamowienia.fsc + "'); ";
//     connection.query(sql, function (err, result) {




//             console.log("2")
// for (let produkt of produkty) {
//     var sql =
//       "INSERT INTO artdruk.zamowienia_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) " +
//       "values ('" +
//       produkt.id +  "','" +
//       produkt.zamowienie_id +        "','" +
//       produkt.nazwa +        "','" +
//       produkt.wersja +        "','" +
//       produkt.opiekun_zamowienia_id +        "','" +
//       produkt.uwagi +        "','" +
//       produkt.stan +        "','" +
//       produkt.status +        "','" +
//       produkt.typ +        "','" +
//       produkt.ilosc_stron +        "','" +
//       produkt.format_x +        "','" +
//       produkt.format_y +        "','" +
//       produkt.oprawa +        "','" +
//       produkt.naklad +        "','" +
//       produkt.indeks +        "'); ";
//     connection.query(sql, function (err, result) {
//         if (err){

//             connection.query("rollback ", function (err, result) {   });
        
//                 throw err;
//               } 
//     });
//   }

//   console.log("3")
//   for (let element of elementy) {
//     var sql =
//       "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,gramatura_id,naklad,info,uwagi,stan,status,tytul,papier_info,indeks) " +
//       "values ('" +
//       element.id +  "','" +
//       element.zamowienie_id +        "','" +
//       element.produkt_id +        "','" +
//       element.nazwa +        "','" +
//       element.typ +        "','" +
//       element.ilosc_stron +        "','" +
//       element.kolory +        "','" +
//       element.format_x +        "','" +
//       element.format_y +        "','" +
//       element.papier_id +        "','" +
//       element.gramatura_id +        "','" +
//       element.naklad +        "','" +
//       element.info +        "','" +
//       element.uwagi +        "','" +
//       element.stan +        "','" +
//       element.status +        "','" +
//       element.tytul +        "','" +
//       element.papier_info +        "','" +
//       element.indeks +        "'); ";
//     connection.query(sql, function (err, result) {
//         if (err){

//             connection.query("rollback ", function (err, result) {   });
        
//                 throw err;
//               } 
//     });
//   }

//   console.log("4")
//   for (let fragment of fragmenty) {
//     var sql =
//       "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) " +
//       "values ('" +
//       fragment.id +  "','" +
//       fragment.zamowienie_id +        "','" +
//       fragment.produkt_id +        "','" +
//       fragment.element_id +        "','" +
//       fragment.oprawa_id +        "','" +
//       fragment.naklad +        "','" +
//       fragment.ilosc_stron +        "','" +
//       fragment.wersja +        "','" +
//       fragment.info +        "','" +
//       fragment.typ +        "','" +
//       fragment.indeks +        "'); ";
//     connection.query(sql, function (err, result) {
//         if (err){

//             connection.query("rollback ", function (err, result) {   });
        
//                 throw err;
//               } 
//     });
//   }

//   console.log("5")
//   for (let opr of oprawa) {
//     var sql =
//       "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) " +
//       "values ('" +
//       opr.id +  "','" +
//       opr.zamowienie_id +        "','" +
//       opr.produkt_id +        "','" +
//       opr.oprawa +        "','" +
//       opr.naklad +        "','" +
//       opr.bok_oprawy +        "','" +
//       opr.data_spedycji +        "','" +
//       opr.uwagi +        "','" +
//       opr.wersja +        "','" +
//       opr.data_czystodrukow +        "','" +
//       opr.indeks +        "'); ";
//     connection.query(sql, function (err, result) {
//       if (err){

//     connection.query("rollback ", function (err, result) {   });

//         throw err;
//       } 


//     });
//   }


//   console.log("6")
//   for (let procesy of procesyElementow) {
//     var sql =
//       "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) " +
//       "values ('" +
//       procesy.id +  "','" +
//       procesy.zamowienie_id +        "','" +
//       procesy.produkt_id +        "','" +
//       procesy.element_id +        "','" +
//       procesy.proces_id +        "','" +
//       procesy.front_ilosc +        "','" +
//       procesy.back_ilosc +        "','" +
//       procesy.front_kolor +        "','" +
//       procesy.back_kolor +        "','" +
//       procesy.info +        "','" +
//       procesy.nazwa_id +        "','" +
//       procesy.indeks +        "'); ";
//     connection.query(sql, function (err, result) {
//       if (err){

//     connection.query("rollback ", function (err, result) {   });

//         throw err;
//       } 

//       connection.query("commit ", function (err, result) {
       
//     });

//     });
//   }



// odpowiedz = [daneZamowienia,produkty,elementy,fragmenty,oprawa,procesyElementow]
// res.status(201).json(odpowiedz);

// }

// );

}

module.exports = {
  zapiszZamowienieUpdate
    
}
 