const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");



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
    let kosztyDodatkoweZamowienia = req.body[9]
    let ksiegowosc = req.body[10]
    let faktury = req.body[11]


  //  console.log("technologieID: " ,technologieID)
  // console.log("historiaZamowienia: " ,historiaZamowienia)

// console.log("Dane zamowienia: ", daneZamowienia.id )
// console.log("SaveAs: ", req.body[0].saveAs)





if( daneZamowienia.update == true){

let dane = [ daneZamowienia.isbn,daneZamowienia.nr_zamowienia_klienta,daneZamowienia.kod_pracy,daneZamowienia.nr_stary,daneZamowienia.nr,daneZamowienia.rok,daneZamowienia.firma_id,daneZamowienia.klient_id,daneZamowienia.tytul,ifNoDateSetNull_exec(daneZamowienia.data_przyjecia),ifNoDateSetNull_exec(daneZamowienia.data_materialow),ifNoDateSetNull_exec(daneZamowienia.data_spedycji),daneZamowienia.opiekun_id,daneZamowienia.stan,daneZamowienia.status,daneZamowienia.etap,daneZamowienia.uwagi,daneZamowienia.etap,daneZamowienia.waluta_id,daneZamowienia.vat_id,daneZamowienia.przedplata,daneZamowienia.cena,daneZamowienia.wartosc_zamowienia,daneZamowienia.termin_platnosci,daneZamowienia.fsc,daneZamowienia.skonto,daneZamowienia.nr_kalkulacji,daneZamowienia.id]

var sql =   "update  artdruk.zamowienia set isbn=?, nr_zamowienia_klienta=?,  kod_pracy=?, nr_stary=?, nr=?,  rok =?,firma_id=?,klient_id=?,tytul=?,data_przyjecia=?,data_materialow=?,data_spedycji=?,opiekun_id=?,stan=?,status=?,etap=?,uwagi=?,etap=?,waluta_id=?,vat_id=?,przedplata=?,cena=?,wartosc_zamowienia=?,termin_platnosci=?,fsc=?,skonto=?,nr_kalkulacji=? where id =?"
connection.execute(sql, dane,function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});

if(daneZamowienia.status > 2  ){
  let dane = [daneZamowienia.id]
var sql =   "call artdruk.zamowienie_set_alert(?)"
connection.execute(sql,dane, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
}
if(daneZamowienia.status == 2 ){
  let dane = [daneZamowienia.id]
  var sql =   "call artdruk.zamowienie_set_null_alert(?)"
  connection.execute(sql, dane,function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
  }

}


if( ksiegowosc.update == true){
  let dane = [ksiegowosc.koszty_status,ksiegowosc.koszty_wartosc,ksiegowosc.faktury_status,ksiegowosc.faktury_wartosc,ksiegowosc.faktury_naklad,ksiegowosc.info,ksiegowosc.global_id]

var sql =   "update  artdruk.zamowienia_ksiegowosc set koszty_status=?, koszty_wartosc=?,  faktury_status=?, faktury_wartosc=?, faktury_naklad=?,  info =? where global_id = ?"
connection.execute(sql, dane,function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});


}





//---------------- produkty
 

for(let row of produkty.filter(x => x.update == true && x.insert != true) ){
  let dane =   [row.id,row.zamowienie_id,row.nazwa,row.opiekun_zamowienia_id,row.uwagi,row.stan,row.status,row.etap,row.typ,row.ilosc_stron,row.format_x,row.format_y,row.oprawa,row.naklad,row.indeks,row.global_id]
  
  var sql =   "update  artdruk.zamowienia_produkty set  id =?, zamowienie_id =?, nazwa =?, opiekun_zamowienia_id =?, uwagi =?, stan =?, status =?, etap =?, typ =?, ilosc_stron =?, format_x =?, format_y =?, oprawa =?, naklad =?,  indeks =? where global_id =?"
  connection.execute(sql,dane, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
  }


    // for(let row of produkty.filter(x => x.delete == true && x.insert != true) ){
    //     let dane = [row.global_id]
    //     var sql =   "DELETE from artdruk.zamowienia_produkty where global_id=?";
    //     connection.execute(sql, dane,function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
    //     }

  
//---------------- elementy
for(let element of elementy.filter(x => x.update == true && x.insert != true) ){

  let dane =   [element.id,element.zamowienie_id,element.produkt_id,element.nazwa,element.typ,element.ilosc_stron,element.format_x,element.format_y,element.papier_id,element.papier_postac_id,element.naklad,element.stan,element.status,element.etap,element.info,element.uwagi,element.global_id]

  var sql =   "update  artdruk.zamowienia_elementy set  id =?, zamowienie_id =?, produkt_id =?, nazwa =?, typ =?, ilosc_stron =?, format_x =?, format_y =?, papier_id =?, papier_postac_id =?, naklad =?, stan =?, status =?, etap =?, info =?, uwagi =? where global_id =?"
  // var sql =   "update  artdruk.zamowienia_elementy set  id = " + element.id+ ", zamowienie_id = " + element.zamowienie_id+ ", produkt_id = " + element.produkt_id+ ", nazwa = '" + element.nazwa+ "', typ = " + element.typ+ ", ilosc_stron = " + element.ilosc_stron+ ", format_x = '" + element.format_x+ "', format_y = '" + element.format_y+ "', papier_id = " + element.papier_id+ ", papier_postac_id = " + element.papier_postac_id+ ", naklad = " + element.naklad+ ", stan = " + element.stan+ ", status = " + element.status+ ", etap = " + element.etap+ ", info = '" + element.info+ "', uwagi = '" + element.uwagi+ "' where global_id = " + element.global_id + ""
  connection.execute(sql, dane, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
  }

  for(let row of elementy.filter(x => x.insert == true && x.delete != true) ){
    let dane =[row.id,row.zamowienie_id,row.produkt_id,row.nazwa,row.typ,row.ilosc_stron,row.kolory,row.format_x,row.format_y,row.papier_id,row.papier_postac_id,row.naklad,row.info,row.uwagi,row.stan,row.status,row.etap ,row.tytul,row.papier_info,row.indeks]

    var sql =   "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,papier_postac_id,naklad,info,uwagi,stan,status,etap,tytul,papier_info,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
    connection.execute(sql,dane, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
    }

            //--
            if(technologieID !=null && technologieID.length > 0  ){
              for ( let tech_id of technologieID){
                    for(let row of elementy.filter(x => x.insert == true && x.delete != true) ){
                      let dane=[row.id,row.zamowienie_id,tech_id.technologia_id,row.produkt_id,row.nazwa,row.typ,row.ilosc_stron,row.format_x,row.format_y,row.papier_id,row.papier_postac_id,row.naklad,row.uwagi,row.stan,row.status,row.etap,row.indeks]
                      var sql =   "INSERT INTO artdruk.technologie_elementy (id,zamowienie_id,technologia_id,produkt_id,nazwa,typ,ilosc_stron,format_x,format_y,papier_id,papier_postac_id,naklad,uwagi,stan,status,etap,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
                          connection.execute(sql, dane, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
                          }
              }
            }
            //----

    for(let element of elementy.filter(x => x.delete == true && x.insert != true) ){
      dane=[element.global_id]
        var sql =   "DELETE from artdruk.zamowienia_elementy where global_id=?";
        connection.execute(sql, dane,function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
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
   //-------------- koszty dodatkowe
      //    id: 1,
      // indeks:1,
      // zamowienie_id: daneZamowienia.id,
      // nazwa:"",
      // ilosc: "1",
      // cena: "0",
      // suma: "0",
      // info:"",
      // status:1,
      // stan:1,
      // insert: true,
      // dodal: DecodeToken(sessionStorage.getItem("token")).id,

        for(let row of kosztyDodatkoweZamowienia.filter(x => x.update == true && x.insert != true) ){
          var sql =   "update  artdruk.zamowienia_koszty_dodatkowe set  id = " + row.id+ ", nazwa = '" + row.nazwa+ "', ilosc = '" + row.ilosc+ "', cena = '" + row.cena+ "', suma = '" + row.suma+ "', info = '" + row.info+ "', status = " + row.status+ ", stan = " + row.stan+ ", dodal = " + row.dodal+ ", zmienil = '" + row.zmienil+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
          }
        
          for(let row of kosztyDodatkoweZamowienia.filter(x => x.insert == true && x.delete != true) ){
            var sql =   "INSERT INTO artdruk.zamowienia_koszty_dodatkowe (id,zamowienie_id,indeks,nazwa,ilosc,cena,suma,info,status,stan,dodal) "+
            "values (" + row.id + "," + row.zamowienie_id + "," + row.indeks + ",'" + row.nazwa + "','" + row.ilosc + "','" + row.cena + "','" + row.suma + "','" + row.info + "'," + row.status + "," + row.stan + "," + row.dodal + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
            }
        
            for(let row of kosztyDodatkoweZamowienia.filter(x => x.delete == true && x.insert != true) ){
                var sql =   "DELETE from artdruk.zamowienia_koszty_dodatkowe where global_id=" + row.global_id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
                } 





                        for(let row of faktury.filter(x => x.update == true && x.insert != true) ){
          var sql =   "update  artdruk.zamowienia_faktury set  id = " + row.id+ ", nazwa = '" + row.nazwa+ "', wz = '" + row.wz+ "', ilosc = '" + row.ilosc+ "', cena = '" + row.cena+ "', suma = '" + row.suma+ "', info = '" + row.info+ "', status = " + row.status+ ", stan = " + row.stan+ ", dodal = " + row.dodal+ ", zmienil = '" + row.zmienil+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
          connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
          }
        
          for(let row of faktury.filter(x => x.insert == true && x.delete != true) ){
            var sql =   "INSERT INTO artdruk.zamowienia_faktury (id,zamowienie_id,indeks,nazwa,wz,ilosc,cena,suma,info,status,stan,dodal) "+
            "values (" + row.id + "," + row.zamowienie_id + "," + row.indeks + ",'" + row.nazwa + "','" + row.wz + "','" + row.ilosc + "','" + row.cena + "','" + row.suma + "','" + row.info + "'," + row.status + "," + row.stan + "," + row.dodal + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
            }
        
            for(let row of faktury.filter(x => x.delete == true && x.insert != true) ){
                var sql =   "DELETE from artdruk.zamowienia_faktury where global_id=" + row.global_id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   if (err) throw err;       }});
                } 
    
    




odpowiedz = [daneZamowienia,produkty,elementy,fragmenty,oprawa,procesyElementow]
res.status(201).json(odpowiedz);

}


module.exports = {
  zamowienieUpdate
    
}
 

