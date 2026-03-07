const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");
const { getShortYear } = require("../czas/getShortYear");

// nowy zapis zamówienia - dane i parametry w jednym
const zamowienieInsert = async (req,res) =>{
  const token = req.params['token']

  let zamowienie_id
  let promises = [];

  let produkty = req.body[0]
  let elementy = req.body[1]
  let fragmenty = req.body[2]
  let oprawa = req.body[3]
  let procesyElementow = req.body[4]
  let pakowanie = req.body[5]
  let kosztyDodatkoweZamowienia = req.body[6]
  let ksiegowosc = req.body[7]
  let faktury = req.body[8]
  let daneZamowienia = req.body[9]
  let procesyProduktow = req.body[10]

  

   daneZamowienia = {...daneZamowienia, utworzyl_user_id:  DecodeToken(token).id}
   ksiegowosc = {...ksiegowosc, koszty_wartosc:"",faktury_wartosc:"",faktury_status:1,koszty_status:1}

          if(daneZamowienia.etap<3){
            if(daneZamowienia.stan==1){
              daneZamowienia = {...daneZamowienia, nr:"", rok: getShortYear(),stan:1,status:1}
            }
            if(daneZamowienia.stan==2 ||daneZamowienia.stan==3){
              daneZamowienia = {...daneZamowienia, nr:"", rok: getShortYear(),stan:2,status:1}
            }
            
           
            }
            if(daneZamowienia.etap>2){
              daneZamowienia = {...daneZamowienia, nr:"", rok: getShortYear(),stan:1,status:1, etap:2}
              }

await save({daneZamowienia}).then(res=>{

       zamowienie_id = res

              produkty = produkty.map((obj) => {return{...obj, zamowienie_id} })
              elementy = elementy.map((obj) => {return{...obj, zamowienie_id} })
              fragmenty = fragmenty.map((obj) => {return{...obj, zamowienie_id} })
              oprawa = oprawa.map((obj) => {return{...obj, zamowienie_id} })
              procesyElementow = procesyElementow.map((obj) => {return{...obj, zamowienie_id} })
              procesyProduktow = procesyProduktow.map((obj) => {return{...obj, zamowienie_id} })
              pakowanie = pakowanie.map((obj) => {return{...obj, zamowienie_id} })
              kosztyDodatkoweZamowienia = kosztyDodatkoweZamowienia.map((obj) => {return{...obj, zamowienie_id} })
              ksiegowosc = {...ksiegowosc, zamowienie_id} 
              faktury = faktury.map((obj) => {return{...obj, zamowienie_id} })

   
            // return "OK"
}).catch((er) => {
  // błąd w zapisie daneZamowienie powoduje przekazanie error

  return "error"
}).then(x =>{


if(x!="error"){
//jeśli nie ma error to zapisuj dalej, a jeśli będzie to zwróć następny error


  for (let produkt of produkty) {
    var sql =  "INSERT INTO artdruk.zamowienia_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,etap,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); "; //teraz tu kasowanie
  let dane = [produkt.id,produkt.zamowienie_id,produkt.nazwa,produkt.wersja,produkt.opiekun_zamowienia_id,produkt.uwagi,produkt.stan,produkt.status,produkt.etap,produkt.typ,produkt.ilosc_stron,produkt.format_x,produkt.format_y,produkt.oprawa,produkt.naklad,produkt.indeks]

    promises.push(     new Promise((resolve, reject) => {
      connection.execute(sql, dane,(err, results) => {
      if (err) {
          resolve([{zapis: false},{ zamowienie_id:zamowienie_id}]);               
      } else {
          // zamowienie_id to z linii 41
          resolve([{ zapis: true }, { zamowienie_id:zamowienie_id}]);

      }
  });
  })) 

}


for (let element of elementy.filter(x =>  x.delete != true)) {
  var sql =  "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,papier_postac_id,naklad,info,uwagi,stan,status,etap,tytul,papier_info,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); "; // tu kasowanie
  let dane = [element.id,element.zamowienie_id,element.produkt_id,element.nazwa,element.typ,element.ilosc_stron,element.kolory,element.format_x,element.format_y,element.papier_id,element.papier_postac_id,element.naklad,element.info,element.uwagi,element.stan,element.status,element.etap,element.tytul,element.papier_info,element.indeks]

  promises.push(     new Promise((resolve, reject) => {
    connection.execute(sql,dane, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        resolve([{zapis: true}])
    }
});
})) 

}


for (let fragment of fragmenty.filter(x =>  x.delete != true)) {
  var sql =
    "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) values (?,?,?,?,?,?,?,?,?,?,?); ";
  let dane = [fragment.id,fragment.zamowienie_id,fragment.produkt_id,fragment.element_id,fragment.oprawa_id,fragment.naklad,fragment.ilosc_stron,fragment.wersja,fragment.info,fragment.typ,fragment.indeks]

  promises.push(     new Promise((resolve, reject) => {
    connection.execute(sql, dane,(err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        resolve([{zapis: true}])
    }
});
})) 
}




for (let opr of oprawa.filter(x =>  x.delete != true)) {
  var sql =  "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) values (?,?,?,?,?,?,?,?,?,?,?); ";
  let dane = [opr.id ,opr.zamowienie_id,opr.produkt_id,opr.oprawa,opr.naklad,opr.bok_oprawy,ifNoDateSetNull_exec(opr.data_spedycji),opr.uwagi,opr.wersja,ifNoDateSetNull_exec(opr.data_czystodrukow),opr.indeks]

  promises.push(     new Promise((resolve, reject) => {
    connection.execute(sql,dane, (err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        resolve([{zapis: true}])
    }
});
})) 
}

for (let procesy of procesyElementow.filter(x =>  x.delete != true)) {
  var sql =    "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,ilosc_uzytkow,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?); ";
  let dane = [procesy.id ,procesy.zamowienie_id,procesy.ilosc_uzytkow,procesy.produkt_id,procesy.element_id ,procesy.proces_id,procesy.front_ilosc,procesy.back_ilosc,procesy.front_kolor,procesy.back_kolor,procesy.info,procesy.nazwa_id,procesy.indeks]

  promises.push(     new Promise((resolve, reject) => {
    connection.execute(sql, dane,(err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        resolve([{zapis: true}])
    }
});
})) 
}


for (let row of procesyProduktow.filter(x =>  x.delete != true)) {
  let dane=[row.id,row.indeks, DecodeToken(token).id,row.zamowienie_id,row.oprawa_id,row.proces_id,row.nazwa_id,row.naklad,row.ilosc_uzytkow,row.info]
      var sql =   "INSERT INTO artdruk.zamowienia_procesy_produktow (id,indeks,utworzyl,zamowienie_id,oprawa_id,proces_id,nazwa_id,naklad,ilosc_uzytkow,info) values (?,?,?,?,?,?,?,?,?,?); ";
 

  promises.push(     new Promise((resolve, reject) => {
    connection.execute(sql, dane,(err, results) => {
    if (err) {
        resolve([{zapis: false},err]);               
    } else {
        resolve([{zapis: true}])
    }
});
})) 
}

for (let pakunek of pakowanie) {
  var sql =   "INSERT INTO artdruk.zamowienia_pakowanie(id,zamowienie_id,produkt_id,nazwa,naklad,uwagi,sztuki_w_paczce,rodzaj_pakowania,indeks) values (?,?,?,?,?,?,?,?,?); ";
  let dane = [pakunek.id,pakunek.zamowienie_id,pakunek.produkt_id,pakunek.nazwa,pakunek.naklad,pakunek.uwagi,pakunek.sztuki_w_paczce,pakunek.rodzaj_pakowania,pakunek.indeks]

  promises.push(
    new Promise((resolve, reject) => {
      connection.execute(sql, dane, (err, results) => {
        if (err) {
          resolve([{ zapis: false }, err]);
        } else {
          resolve([{ zapis: true }]);
        }
      });
    })
  ); 
}

// pliki tworzone z elementów,bo plik do każdego elementu
for (let element of elementy.filter(x =>  x.delete != true)) {
  var sql =    "INSERT INTO artdruk.zamowienia_pliki (id,zamowienie_id,produkt_id,element_id,uwagi,stan,status,etap,indeks) values (?,?,?,?,?,?,?,?,?); ";
  let dane = [
    element.id,
    element.zamowienie_id,
    element.produkt_id,
    element.id,
    element.uwagi,
    element.stan,
    element.status,
    2,
    element.indeks,
  ];

  promises.push(
    new Promise((resolve, reject) => {
      connection.execute(sql, dane, (err, results) => {
        if (err) {
          // console.log(err)
          resolve([{ zapis: false }, err]);
        } else {
          resolve([{ zapis: true }]);
        }
      });
    })
  ); 

}


  var sql = "INSERT INTO artdruk.zamowienia_ksiegowosc (zamowienie_id,koszty_status,koszty_wartosc,faktury_status,faktury_wartosc,faktury_naklad,info) values (?,?,?,?,?,?,?); ";
  let dane = [ksiegowosc.zamowienie_id,ksiegowosc.koszty_status ,ksiegowosc.koszty_wartosc,ksiegowosc.faktury_status,ksiegowosc.faktury_wartosc,ksiegowosc.faktury_naklad,ksiegowosc.info]

  promises.push(
    new Promise((resolve, reject) => {
      connection.execute(sql, dane,(err, results) => {
        if (err) {
          // console.log(err);
          resolve([{ zapis: false }, err]);

        } else {
          resolve([{ zapis: true }, { zamowienie_id: results.insertId }]);
        }
      });
    })
  );



    var sql = "INSERT INTO artdruk.oddania_grupy (zamowienie_id,id,status,typ) values (?,?,?,?); ";
  let daneOddane = [zamowienie_id,1,1,1]

  promises.push(
    new Promise((resolve, reject) => {
      connection.execute(sql, daneOddane,(err, results) => {
        if (err) {
          // console.log(err);
          resolve([{ zapis: false }, err]);

        } else {
          resolve([{ zapis: true }]);
        }
      });
    })
  );

  Promise.all(promises)
  .then((data) =>{
 const   zamowienie_id = data[0][1].zamowienie_id || 0; 

 if(isSavedCorrect(data).status) {
      console.log("zapis ok")      
    }else{
    console.log("błąd zapisu")   
    connection.query("call artdruk.delete_zamowienie("+ zamowienie_id +")", function (err, result) { });
          }
    return data
  })
  .then((data) => res.status(201).json(data));
}else return   "error"

}

)
.then((x) => {

  if(x=="error") {  res.status(201).json("error");}
});

}

const save = ({daneZamowienia}) =>{
  return new Promise((resolve,reject)=>{

  var sql = "INSERT INTO artdruk.zamowienia (rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,etap,waluta_id,vat_id,przedplata,cena,cena_z_kosztami,wartosc_zamowienia,wartosc_koncowa,termin_platnosci,fsc,skonto,nr_kalkulacji,nr_stary,kod_pracy,nr_zamowienia_klienta,isbn) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
  let dane = [daneZamowienia.rok, daneZamowienia.firma_id,  daneZamowienia.klient_id, daneZamowienia.tytul, ifNoDateSetNull_exec(daneZamowienia.data_przyjecia), ifNoDateSetNull_exec(daneZamowienia.data_materialow),  ifNoDateSetNull_exec(daneZamowienia.data_spedycji),daneZamowienia.opiekun_id,  daneZamowienia.utworzyl_user_id, daneZamowienia.stan,  daneZamowienia.status,  daneZamowienia.uwagi, daneZamowienia.etap, daneZamowienia.waluta_id,daneZamowienia.vat_id, daneZamowienia.przedplata ,daneZamowienia.cena,daneZamowienia.cena_z_kosztami,daneZamowienia.wartosc_zamowienia,daneZamowienia.wartosc_koncowa,daneZamowienia.termin_platnosci,daneZamowienia.fsc,daneZamowienia.skonto,daneZamowienia.nr_kalkulacji,daneZamowienia.nr_stary,daneZamowienia.kod_pracy,daneZamowienia.nr_zamowienia_klienta,daneZamowienia.isbn]
  
  connection.execute(sql, dane, (err, results) => {
    if (err) {
      // console.log(err);
      reject(err)
    } else {
      resolve(results.insertId);
    }
  });
  })
}


const isSavedCorrect = (response) =>{

  // sprawdza wszystkie statusy z opowiedzi
  // jeśli chociaż jednej jest false to cały zapis trzeba anulować 

  // for( let val of response){
    for( let value of response){
      if (value[0].zapis == false) return {status: false, error: value[1] }
    }
  // }

  return {status: true }
  
}


module.exports = {
  zamowienieInsert
    
}
 