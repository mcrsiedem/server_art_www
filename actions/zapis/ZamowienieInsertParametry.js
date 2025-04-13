const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");


const zamowienieInsertParametry = (req,res) =>{

  let promises = [];
  let produkty = req.body[0]
  let elementy = req.body[1]
  let fragmenty = req.body[2]
  let oprawa = req.body[3]
  let procesyElementow = req.body[4]
  let pakowanie = req.body[5]



  for (let produkt of produkty) {
    var sql =
      "INSERT INTO artdruk.zamowienia_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,etap,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) " +
      "values ('" +
      produkt.id +  "','" +
      produkt.zamowienie_id +        "','" +
      produkt.nazwa +        "','" +
      produkt.wersja +        "','" +
      produkt.opiekun_zamowienia_id +        "','" +
      produkt.uwagi +        "'," +
      produkt.stan +        "," +
      produkt.status +        "," +
      produkt.etap +        ",'" +
      produkt.typ +        "','" +
      produkt.ilosc_stron +        "','" +
      produkt.format_x +        "','" +
      produkt.format_y +        "','" +
      produkt.oprawa +        "','" +
      produkt.naklad +        "','" +
      produkt.indeks +        "'); ";

    promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
          resolve([{zapis: false},err]);               
      } else {
          // resolve([results,"ok arkusz"])
          resolve([{zapis: true}])
      }
  });
  })) 

}


for (let element of elementy) {
  var sql =
    "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,papier_postac_id,naklad,info,uwagi,stan,status,etap,tytul,papier_info,indeks) " +
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
    element.papier_postac_id +        "','" +
    element.naklad +        "','" +
    element.info +        "','" +
    element.uwagi +        "'," +
    element.stan +        "," +
    element.status +        "," +
    element.etap +        ",'" +
    element.tytul +        "','" +
    element.papier_info +        "','" +
    element.indeks +        "'); ";

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        // resolve([results,"ok arkusz"])
        resolve([{zapis: true}])
    }
});
})) 

}


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

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        // resolve([results,"ok arkusz"])
        resolve([{zapis: true}])
    }
});
})) 
}



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

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        // resolve([results,"ok arkusz"])
        resolve([{zapis: true}])
    }
});
})) 
}

for (let procesy of procesyElementow) {
  var sql =
    "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,ilosc_uzytkow,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) " +
    "values ('" +
    procesy.id +  "','" +
    procesy.zamowienie_id +        "','" +
    procesy.ilosc_uzytkow +        "','" +
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

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        // resolve([results,"ok arkusz"])
        resolve([{zapis: true}])
    }
});
})) 
}

for (let pakunek of pakowanie) {
  var sql =   "INSERT INTO artdruk.zamowienia_pakowanie(id,zamowienie_id,produkt_id,nazwa,naklad,uwagi,sztuki_w_paczce,rodzaj_pakowania,indeks) "+
  "values ('" + pakunek.id+ "','" + pakunek.zamowienie_id+ "','" + pakunek.produkt_id + "','" + pakunek.nazwa + "','" + pakunek.naklad + "','" + pakunek.uwagi + "','" + pakunek.sztuki_w_paczce + "','" + pakunek.rodzaj_pakowania + "','" +pakunek.indeks + "'); ";

  promises.push(     new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        // resolve([results,"ok arkusz"])
        resolve([{zapis: true}])
    }
});
})) 
}


  Promise.all(promises).then((data) => res.status(201).json(data));

}

module.exports = {
  zamowienieInsertParametry
    
}
 