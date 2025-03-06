const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { zapiszTechnologieUpdate_dane } = require("./ZapiszTechnologieUpdate_dane");
const { zapiszTechnologieUpdate_produkty } = require("./ZapiszTechnologieUpdate_produkty");
const { zapiszTechnologieUpdate_elementy } = require("./ZapiszTechnologieUpdate_elementy");
const zapiszTechnologieUpdate = (req,res) =>{

  let daneTechEdit = req.body[0]
  let produktyTechEdit = req.body[1]
  let elementyTechEdit = req.body[2]
  let fragmentyTechEdit = req.body[3]
  let oprawaTechEdit = req.body[4]
  let legiEdit = req.body[5]
  let legiFragmentyEdit = req.body[6]
  let arkuszeEdit = req.body[7]
  let grupaWykonanEdit = req.body[8]
  let wykonaniaEdit = req.body[9]
  let procesyElementowTechEdit = req.body[10]
  let odpowiedz= []

   

// console.log("Dane zamowienia: ", daneZamowienia.id )
// console.log("SaveAs: ", req.body[0].saveAs)


var sql = "begin";
connection.query(sql, function (err, result) {
if (err) throw err;  });


zapiszTechnologieUpdate_dane(daneTechEdit)
zapiszTechnologieUpdate_produkty(produktyTechEdit)
zapiszTechnologieUpdate_elementy(elementyTechEdit)

  
// //---------------- elementy
// for(let element of elementy.filter(x => x.update == true && x.insert != true) ){
//   var sql =   "update  artdruk.zamowienia_elementy set  id = " + element.id+ ", zamowienie_id = " + element.zamowienie_id+ ", produkt_id = " + element.produkt_id+ ", nazwa = '" + element.nazwa+ "', typ = " + element.typ+ ", ilosc_stron = '" + element.ilosc_stron+ "', format_x = '" + element.format_x+ "', format_y = " + element.format_y+ ", papier_id = " + element.papier_id+ ", naklad = " + element.naklad+ ", info = '" + element.info+ "', uwagi = '" + element.uwagi+ "' where global_id = " + element.global_id + ""
//   connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//   }

//   for(let row of elementy.filter(x => x.insert == true && x.delete != true) ){
//     var sql =   "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,naklad,info,uwagi,stan,status,tytul,papier_info,indeks) "+
//     "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + ",'" + row.nazwa + "'," + row.typ + ",'" + row.ilosc_stron + "','" + row.kolory + "'," + row.format_x + "," + row.format_y + "," + row.papier_id + "," + row.naklad + ",'" + row.info + "','" + row.uwagi + "','" + row.stan + "','" + row.status + "','" + row.tytul + "','" + row.papier_info + "','" + row.indeks + "'); ";
//     connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//     }

//     for(let element of elementy.filter(x => x.delete == true && x.insert != true) ){
//         var sql =   "DELETE from artdruk.zamowienia_elementy where global_id=" + element.global_id;
//         connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//         }
// //-------------- fragmenty

//         for(let row of fragmenty.filter(x => x.update == true && x.insert != true) ){
//           var sql =   "update  artdruk.zamowienia_fragmenty set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", oprawa_id = " + row.oprawa_id+ ", naklad = '" + row.naklad+ "', ilosc_stron = '" + row.ilosc_stron+ "', wersja = '" + row.wersja+ "', info = '" + row.info+ "', typ = '" + row.typ+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
//           connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//           }
        
//           for(let row of fragmenty.filter(x => x.insert == true && x.delete != true) ){
//             var sql =   "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) "+
//             "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.oprawa_id + ",'" + row.naklad + "','" + row.ilosc_stron + "','" + row.wersja + "','" + row.info + "','" + row.typ + "'," + row.indeks + "); ";
//             connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//             }
        
//             for(let row of fragmenty.filter(x => x.delete == true && x.insert != true) ){
//                 var sql =   "DELETE from artdruk.zamowienia_fragmenty where global_id=" + row.global_id;
//                 connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//                 }

//   //-------------- procesy elementów
//   for(let row of procesyElementow.filter(x => x.update == true && x.insert != true) ){
//     var sql =   "update  artdruk.zamowienia_procesy_elementow set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", proces_id = " + row.proces_id+ ", front_ilosc = '" + row.front_ilosc+ "', back_ilosc = '" + row.back_ilosc+ "', front_kolor = '" + row.front_kolor+ "', back_kolor = '" + row.back_kolor+ "', info = '" + row.info+ "', nazwa_id = " + row.nazwa_id+ ",  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
//     connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//     }
  
  
//     for(let row of procesyElementow.filter(x => x.insert == true && x.delete != true) ){
//       var sql =   "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) "+
//       "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.proces_id + ",'" + row.front_ilosc + "','" + row.back_ilosc + "','" + row.front_kolor + "','" + row.back_kolor + "','" + row.info + "'," + row.nazwa_id + "," + row.indeks + "); ";
//       connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//       }
  
//       for(let row of procesyElementow.filter(x => x.delete == true && x.insert != true) ){
//           var sql =   "DELETE from artdruk.zamowienia_procesy_elementow where global_id=" + row.global_id;
//           connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//           }

//      //-------------- oprawa
//   for(let row of oprawa.filter(x => x.update == true && x.insert != true) ){
//     var sql =   "update  artdruk.zamowienia_oprawa set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", oprawa = " + row.oprawa+ ", naklad = " + row.naklad+ ", bok_oprawy = '" + row.bok_oprawy+ "', data_spedycji = '" + row.data_spedycji+ "', uwagi = '" + row.uwagi+ "', wersja = '" + row.wersja+ "', data_czystodrukow = '" + row.data_czystodrukow+ "', indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
//     connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//     }
  
  
//     for(let row of oprawa.filter(x => x.insert == true && x.delete != true) ){
//       var sql =   "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) "+
//       "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.oprawa + "," + row.naklad + ",'" + row.bok_oprawy + "','" + row.data_spedycji + "','" + row.uwagi + "','" + row.wersja + "','" + row.data_czystodrukow + "'," + row.indeks + "); ";
//       connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//       }
  
//       for(let row of oprawa.filter(x => x.delete == true && x.insert != true) ){
//           var sql =   "DELETE from artdruk.zamowienia_oprawa where global_id=" + row.global_id;
//           connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err;         }});
//           }     




  connection.query("commit ", function (err, result) {
  });


odpowiedz = [daneTechEdit]
res.status(201).json(odpowiedz);



}

module.exports = {
  zapiszTechnologieUpdate
    
}
 