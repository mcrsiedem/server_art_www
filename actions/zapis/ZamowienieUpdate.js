const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");



const zamowienieUpdate = (req,res) =>{

    let odpowiedz =[]
    let daneZamowienia = req.body[0]
    let produkty = req.body[1]
    let elementy = req.body[2]
    let fragmenty = req.body[3]
    let oprawa = req.body[4]
    let procesyElementow = req.body[5]
    let technologieID = req.body[6]  // id technologii z tego zamówienia
    let historiaZamowienia = req.body[7]
    let pakowanie = req.body[8]


  //  console.log("technologieID: " ,technologieID)
  console.log("historiaZamowienia: " ,historiaZamowienia)

// console.log("Dane zamowienia: ", daneZamowienia.id )
// console.log("SaveAs: ", req.body[0].saveAs)


var sql = "begin";
connection.query(sql, function (err, result) {
if (err) res.status(203).json(err)  });




if( daneZamowienia.update == true){
var sql =   "update  artdruk.zamowienia set isbn='" + daneZamowienia.isbn + "', nr_zamowienia_klienta='" + daneZamowienia.nr_zamowienia_klienta + "',  kod_pracy='" + daneZamowienia.kod_pracy + "', nr_stary='" + daneZamowienia.nr_stary + "', nr=" + daneZamowienia.nr + ",  rok = '" + daneZamowienia.rok + "',firma_id=" + daneZamowienia.firma_id+ ",klient_id='" + daneZamowienia.klient_id + "',tytul='" + daneZamowienia.tytul + "',data_przyjecia=" +ifNoDateSetNull( daneZamowienia.data_przyjecia) + ",data_materialow=" +ifNoDateSetNull(daneZamowienia.data_materialow ) + ",data_spedycji=" + ifNoDateSetNull(daneZamowienia.data_spedycji ) + ",opiekun_id='" + daneZamowienia.opiekun_id + "',stan=" + daneZamowienia.stan + ",status=" + daneZamowienia.status + ",etap=" + daneZamowienia.etap + ",uwagi='" + daneZamowienia.uwagi + "',etap='" + daneZamowienia.etap + "',waluta_id='" + daneZamowienia.waluta_id + "',vat_id='" + daneZamowienia.vat_id + "',przedplata='" + daneZamowienia.przedplata + "',cena='" + daneZamowienia.cena + "',wartosc_zamowienia='" + daneZamowienia.wartosc_zamowienia + "',termin_platnosci='" + daneZamowienia.termin_platnosci + "',fsc='" + daneZamowienia.fsc + "',skonto='" + daneZamowienia.skonto + "',nr_kalkulacji='" + daneZamowienia.nr_kalkulacji + "' where id = '" + daneZamowienia.id + "'"
connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});

if(daneZamowienia.status > 2  ){
  // if(daneZamowienia.status > 2 && daneZamowienia.status < 6 ){
var sql =   "call artdruk.zamowienie_set_alert(" + daneZamowienia.id + ")"
connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
}
if(daneZamowienia.status == 2 ){
  var sql =   "call artdruk.zamowienie_set_null_alert(" + daneZamowienia.id + ")"
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
  }

}

//---------------- produkty
for(let row of produkty.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.zamowienia_produkty set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", nazwa = '" + row.nazwa+ "', opiekun_zamowienia_id = " + row.opiekun_zamowienia_id+ ", uwagi = '" + row.uwagi+ "', stan = " + row.stan+ ", status = " + row.status+ ", etap = " + row.etap+ ", typ = '" + row.typ+ "', ilosc_stron = '" + row.ilosc_stron+ "', format_x = '" + row.format_x+ "', format_y = '" + row.format_y+ "', oprawa = '" + row.oprawa+ "', naklad = '" + row.naklad+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
  }


    for(let row of produkty.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.zamowienia_produkty where global_id=" + row.global_id;
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
        }

  
//---------------- elementy
for(let element of elementy.filter(x => x.update == true && x.insert != true) ){
  var sql =   "update  artdruk.zamowienia_elementy set  id = " + element.id+ ", zamowienie_id = " + element.zamowienie_id+ ", produkt_id = " + element.produkt_id+ ", nazwa = '" + element.nazwa+ "', typ = " + element.typ+ ", ilosc_stron = " + element.ilosc_stron+ ", format_x = '" + element.format_x+ "', format_y = '" + element.format_y+ "', papier_id = " + element.papier_id+ ", papier_postac_id = " + element.papier_postac_id+ ", naklad = " + element.naklad+ ", stan = " + element.stan+ ", status = " + element.status+ ", etap = " + element.etap+ ", info = '" + element.info+ "', uwagi = '" + element.uwagi+ "' where global_id = " + element.global_id + ""
  connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
  }

  for(let row of elementy.filter(x => x.insert == true && x.delete != true) ){
    var sql =   "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,papier_postac_id,naklad,info,uwagi,stan,status,etap,tytul,papier_info,indeks) "+
    "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + ",'" + row.nazwa + "'," + row.typ + ",'" + row.ilosc_stron + "','" + row.kolory + "','" + row.format_x + "','" + row.format_y + "'," + row.papier_id + "," + row.papier_postac_id + "," + row.naklad + ",'" + row.info + "','" + row.uwagi + "'," + row.stan + "," + row.status + "," + row.etap + ",'" + row.tytul + "','" + row.papier_info + "','" + row.indeks + "'); ";
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
    }

            //--
            if(technologieID !=null && technologieID.length > 0  ){
              for ( let tech_id of technologieID){
                    for(let row of elementy.filter(x => x.insert == true && x.delete != true) ){
                      var sql =   "INSERT INTO artdruk.technologie_elementy (id,zamowienie_id,technologia_id,produkt_id,nazwa,typ,ilosc_stron,format_x,format_y,papier_id,papier_postac_id,naklad,uwagi,stan,status,etap,indeks) "+
                      "values (" 
                      + row.id + "," 
                      + row.zamowienie_id + "," 
                      + tech_id.technologia_id + "," 
                      + row.produkt_id + ",'" 
                      + row.nazwa + "'," 
                      + row.typ + "," 
                      + row.ilosc_stron + "," 
                      + row.format_x + "," 
                      + row.format_y + "," 
                      + row.papier_id + "," 
                      + row.papier_postac_id + "," 
                      + row.naklad + ",'" 
                      + row.uwagi + "'," 
                      + row.stan + "," 
                      + row.status + "," 
                      + row.etap + "," 
                      + row.indeks + "); ";
                          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
                          }
              }
            }
            //----

    for(let element of elementy.filter(x => x.delete == true && x.insert != true) ){
        var sql =   "DELETE from artdruk.zamowienia_elementy where global_id=" + element.global_id;
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
        }
//-------------- fragmenty

        for(let row of fragmenty.filter(x => x.update == true && x.insert != true) ){
          var sql =   "update  artdruk.zamowienia_fragmenty set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", oprawa_id = " + row.oprawa_id+ ", naklad = " + row.naklad+ ", ilosc_stron = " + row.ilosc_stron+ ", wersja = '" + row.wersja+ "', info = '" + row.info+ "', typ = '" + row.typ+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
          }
        
          for(let row of fragmenty.filter(x => x.insert == true && x.delete != true) ){
            var sql =   "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) "+
            "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.oprawa_id + ",'" + row.naklad + "','" + row.ilosc_stron + "','" + row.wersja + "','" + row.info + "','" + row.typ + "'," + row.indeks + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
            }
        
            for(let row of fragmenty.filter(x => x.delete == true && x.insert != true) ){
                var sql =   "DELETE from artdruk.zamowienia_fragmenty where global_id=" + row.global_id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
                }

  //-------------- procesy elementów
  for(let row of procesyElementow.filter(x => x.update == true && x.insert != true) ){
    var sql =   "update  artdruk.zamowienia_procesy_elementow set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ",ilosc_uzytkow = " + row.ilosc_uzytkow+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", proces_id = " + row.proces_id+ ", front_ilosc = '" + row.front_ilosc+ "', back_ilosc = '" + row.back_ilosc+ "', front_kolor = '" + row.front_kolor+ "', back_kolor = '" + row.back_kolor+ "', info = '" + row.info+ "', nazwa_id = " + row.nazwa_id+ ",  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
    }
  
  
    for(let row of procesyElementow.filter(x => x.insert == true && x.delete != true) ){
      var sql =   "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,produkt_id,element_id,proces_id,ilosc_uzytkow,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) "+
      "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.proces_id + ",'" + row.ilosc_uzytkow + "','" + row.front_ilosc + "','" + row.back_ilosc + "','" + row.front_kolor + "','" + row.back_kolor + "','" + row.info + "'," + row.nazwa_id + "," + row.indeks + "); ";
      connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
      }
  
      for(let row of procesyElementow.filter(x => x.delete == true && x.insert != true) ){
          var sql =   "DELETE from artdruk.zamowienia_procesy_elementow where global_id=" + row.global_id;
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
          }

     //-------------- oprawa
  for(let row of oprawa.filter(x => x.update == true && x.insert != true) ){
    var sql =   "update  artdruk.zamowienia_oprawa set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", oprawa = " + row.oprawa+ ", naklad = " + row.naklad+ ", bok_oprawy = '" + row.bok_oprawy+ "', data_spedycji = " + ifNoDateSetNull(row.data_spedycji)+ ", uwagi = '" + row.uwagi+ "', wersja = '" + row.wersja+ "', data_czystodrukow = " +ifNoDateSetNull( row.data_czystodrukow)+ ", indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
    connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
    }
  
  
    for(let row of oprawa.filter(x => x.insert == true && x.delete != true) ){
      var sql =   "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) "+
      "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.oprawa + "," + row.naklad + ",'" + row.bok_oprawy + "'," + ifNoDateSetNull(row.data_spedycji) + ",'" + row.uwagi + "','" + row.wersja + "'," + ifNoDateSetNull(row.data_czystodrukow) + "," + row.indeks + "); ";
      connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
      }
  
      for(let row of oprawa.filter(x => x.delete == true && x.insert != true) ){
          var sql =   "DELETE from artdruk.zamowienia_oprawa where global_id=" + row.global_id;
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
          }     

//-------------- historia zamówienia
if(historiaZamowienia !=null){
        for(let row of historiaZamowienia?.filter(x => x.insert == true).sort((a,c)=>a.id-c.id) ){
            var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) "+
            "values (" + row.user_id + ",'" + row.kategoria + "','" + row.event + "'," + row.zamowienie_id + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
            }

}

     //-------------- pakowanie
     for(let row of pakowanie.filter(x => x.update == true) ){
      var sql =   "update  artdruk.zamowienia_pakowanie set  id = '" + row.id+ "', zamowienie_id = " + row.zamowienie_id+ ", naklad = '" + row.naklad+ "', nazwa = '" + row.nazwa+ "', uwagi = '" + row.uwagi+ "', sztuki_w_paczce = '" + row.sztuki_w_paczce + "', rodzaj_pakowania = '" +row.rodzaj_pakowania+ "', indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
      connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
      }
    
    
      // for(let row of oprawa.filter(x => x.insert == true && x.delete != true) ){
      //   var sql =   "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) "+
      //   "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.oprawa + "," + row.naklad + ",'" + row.bok_oprawy + "'," + ifNoDateSetNull(row.data_spedycji) + ",'" + row.uwagi + "','" + row.wersja + "'," + ifNoDateSetNull(row.data_czystodrukow) + "," + row.indeks + "); ";
      //   connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
      //   }
    
      //   for(let row of oprawa.filter(x => x.delete == true && x.insert != true) ){
      //       var sql =   "DELETE from artdruk.zamowienia_oprawa where global_id=" + row.global_id;
      //       connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
      //       } 
    


  connection.query("commit ", function (err, result) {
  });


odpowiedz = [daneZamowienia,produkty,elementy,fragmenty,oprawa,procesyElementow]
res.status(201).json(odpowiedz);

// setTimeout(()=>{
//   res.status(201).json(odpowiedz);
//   console.log("Już")
// }, 3000);


}


module.exports = {
  zamowienieUpdate
    
}
 

