const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zapiszZamowienie = (req,res) =>{

    let odpowiedz =[]
    let daneZamowienia = req.body[0]
    let produkty = req.body[1]
    let elementy = req.body[2]
    let fragmenty = req.body[3]
    let oprawa = req.body[4]
    let procesyElementow = req.body[5]

   

// console.log("Dane zamowienia: ", daneZamowienia.id )
console.log("SaveAs: ", req.body[0].saveAs)


var sql = "begin";
connection.query(sql, function (err, result) {
if (err) throw err;  });






    var sql =   "INSERT INTO artdruk.zamowienia (nr,rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,etap,waluta_id,vat_id,przedplata,cena,termin_platnosci,fsc) "+
    "values ('" + daneZamowienia.nr + "','" + daneZamowienia.rok + "','" + daneZamowienia.firma_id+ "','" + daneZamowienia.klient_id + "','" + daneZamowienia.tytul + "'," + ifNoDateSetNull(daneZamowienia.data_przyjecia) + "," +ifNoDateSetNull(daneZamowienia.data_materialow)  + "," + ifNoDateSetNull(daneZamowienia.data_spedycji) + ",'" + daneZamowienia.opiekun_id + "','" + daneZamowienia.user + "','" + daneZamowienia.stan + "','" + daneZamowienia.status + "','" + daneZamowienia.uwagi + "','" + daneZamowienia.etap + "','" + daneZamowienia.waluta_id + "','" + daneZamowienia.vat_id + "','" + daneZamowienia.przedplata + "','" + daneZamowienia.cena + "','" + daneZamowienia.termin_platnosci + "','" + daneZamowienia.fsc + "'); ";
    connection.query(sql, function (err, result) {



            console.log("1")

            daneZamowienia.id = result.insertId;
            produkty = produkty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            elementy = elementy.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            fragmenty = fragmenty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            oprawa = oprawa.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            procesyElementow = procesyElementow.map((obj) => {return{...obj, zamowienie_id:result.insertId} })

            // odpowiedz = [result,daneZamowienia,produkty,elementy,fragmenty,oprawa,pakowanie,procesyElementow]


            console.log("2")
for (let produkt of produkty) {
    var sql =
      "INSERT INTO artdruk.zamowienia_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) " +
      "values ('" +
      produkt.id +  "','" +
      produkt.zamowienie_id +        "','" +
      produkt.nazwa +        "','" +
      produkt.wersja +        "','" +
      produkt.opiekun_zamowienia_id +        "','" +
      produkt.uwagi +        "','" +
      produkt.stan +        "','" +
      produkt.status +        "','" +
      produkt.typ +        "','" +
      produkt.ilosc_stron +        "','" +
      produkt.format_x +        "','" +
      produkt.format_y +        "','" +
      produkt.oprawa +        "','" +
      produkt.naklad +        "','" +
      produkt.indeks +        "'); ";
    connection.query(sql, function (err, result) {
        if (err){

            connection.query("rollback ", function (err, result) {   });
        
                throw err;
              } 
    });
  }

  console.log("3")
  for (let element of elementy) {
    var sql =
      "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,gramatura_id,naklad,info,uwagi,stan,status,tytul,papier_info,indeks) " +
      "values ('" +
      element.id +  "','" +
      element.zamowienie_id +        "','" +
      element.produkt_id +        "','" +
      element.nazwa +        "','" +
      element.typ +        "','" +
      element.ilosc_stron +        "','" +
      element.kolory +        "','" +
      element.format_x +        "','" +
      element.format_y +        "','" +
      element.papier_id +        "','" +
      element.gramatura_id +        "','" +
      element.naklad +        "','" +
      element.info +        "','" +
      element.uwagi +        "','" +
      element.stan +        "','" +
      element.status +        "','" +
      element.tytul +        "','" +
      element.papier_info +        "','" +
      element.indeks +        "'); ";
    connection.query(sql, function (err, result) {
        if (err){

            connection.query("rollback ", function (err, result) {   });
        
                throw err;
              } 
    });
  }

  console.log("4")
  for (let fragment of fragmenty) {
    var sql =
      "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) " +
      "values ('" +
      fragment.id +  "','" +
      fragment.zamowienie_id +        "','" +
      fragment.produkt_id +        "','" +
      fragment.element_id +        "','" +
      fragment.oprawa_id +        "','" +
      fragment.naklad +        "','" +
      fragment.ilosc_stron +        "','" +
      fragment.wersja +        "','" +
      fragment.info +        "','" +
      fragment.typ +        "','" +
      fragment.indeks +        "'); ";
    connection.query(sql, function (err, result) {
        if (err){

            connection.query("rollback ", function (err, result) {   });
        
                throw err;
              } 
    });
  }

  console.log("5")
  for (let opr of oprawa) {
    var sql =
      "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) " +
      "values ('" +
      opr.id +  "','" +
      opr.zamowienie_id +        "','" +
      opr.produkt_id +        "','" +
      opr.oprawa +        "','" +
      opr.naklad +        "','" +
      opr.bok_oprawy +        "'," +
      ifNoDateSetNull(opr.data_spedycji) +        ",'" +
      opr.uwagi +        "','" +
      opr.wersja +        "'," +
      ifNoDateSetNull(opr.data_czystodrukow) +        ",'" +
      opr.indeks +        "'); ";
    connection.query(sql, function (err, result) {
      if (err){

    connection.query("rollback ", function (err, result) {   });

        throw err;
      } 


    });
  }


  console.log("6")
  for (let procesy of procesyElementow) {
    var sql =
      "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) " +
      "values ('" +
      procesy.id +  "','" +
      procesy.zamowienie_id +        "','" +
      procesy.produkt_id +        "','" +
      procesy.element_id +        "','" +
      procesy.proces_id +        "','" +
      procesy.front_ilosc +        "','" +
      procesy.back_ilosc +        "','" +
      procesy.front_kolor +        "','" +
      procesy.back_kolor +        "','" +
      procesy.info +        "','" +
      procesy.nazwa_id +        "','" +
      procesy.indeks +        "'); ";
    connection.query(sql, function (err, result) {
      if (err){

    connection.query("rollback ", function (err, result) {   });

        throw err;
      } 



    });
  }

      connection.query("commit ", function (err, result) {
       
    });

odpowiedz = [daneZamowienia,produkty,elementy,fragmenty,oprawa,procesyElementow]
res.status(201).json(odpowiedz);

});

}

module.exports = {
    zapiszZamowienie
    
}
 