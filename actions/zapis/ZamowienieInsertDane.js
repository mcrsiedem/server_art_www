const connection = require("../mysql");
const { DecodeToken } = require("../logowanie/DecodeToken");


const zamowienieInsertDane = (req, res) => {
  let promises = [];
  let daneZamowienia = req.body[0];
  const token = req.params['token']

  var sql = "INSERT INTO artdruk.zamowienia (rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,etap,waluta_id,vat_id,przedplata,cena,wartosc_zamowienia,termin_platnosci,fsc,skonto,nr_kalkulacji,nr_stary,kod_pracy,nr_zamowienia_klienta,isbn) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
  let dane = [daneZamowienia.rok, daneZamowienia.firma_id,  daneZamowienia.klient_id, daneZamowienia.tytul, daneZamowienia.data_przyjecia, daneZamowienia.data_materialow,  daneZamowienia.data_spedycji,daneZamowienia.opiekun_id,  DecodeToken(token).id, daneZamowienia.stan,  daneZamowienia.status,  daneZamowienia.uwagi, daneZamowienia.etap, daneZamowienia.waluta_id,daneZamowienia.vat_id, daneZamowienia.przedplata ,daneZamowienia.cena,daneZamowienia.wartosc_zamowienia,daneZamowienia.termin_platnosci,daneZamowienia.fsc,daneZamowienia.skonto,daneZamowienia.nr_kalkulacji,daneZamowienia.nr_stary,daneZamowienia.kod_pracy,daneZamowienia.nr_zamowienia_klienta,daneZamowienia.isbn]
  
  promises.push(
    new Promise((resolve, reject) => {
      connection.execute(sql, dane, (err, results) => {
        if (err) {
          // throw err;
          resolve([{ zapis: false }, err]);
        } else {
          resolve([{ zapis: true }, { zamowienie_id: results.insertId }]);
        }
      });
    })
  );

  Promise.all(promises).then((data) => res.status(201).json(data));
};

module.exports = {
  zamowienieInsertDane,
};
