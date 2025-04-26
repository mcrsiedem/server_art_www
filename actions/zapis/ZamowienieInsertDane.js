const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");

const zamowienieInsertDane = (req, res) => {
  let promises = [];
  let daneZamowienia = req.body[0];
  // daneZamowienia.id = result.insertId;
  // produkty = produkty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // elementy = elementy.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // fragmenty = fragmenty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // oprawa = oprawa.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // procesyElementow = procesyElementow.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // skonto: daneZamowienia.skonto,
  //     nr_kalkulacji: daneZamowienia.nr_kalkulacji,
  var sql =
    "INSERT INTO artdruk.zamowienia (nr,rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,etap,waluta_id,vat_id,przedplata,cena,wartosc_zamowienia,termin_platnosci,fsc,skonto,nr_kalkulacji,nr_stary,kod_pracy,nr_zamowienia_klienta,isbn) " +
    "values ('" +
    daneZamowienia.nr +
    "','" +
    daneZamowienia.rok +
    "','" +
    daneZamowienia.firma_id +
    "','" +
    daneZamowienia.klient_id +
    "','" +
    daneZamowienia.tytul +
    "'," +
    ifNoDateSetNull(daneZamowienia.data_przyjecia) +
    "," +
    ifNoDateSetNull(daneZamowienia.data_materialow) +
    "," +
    ifNoDateSetNull(daneZamowienia.data_spedycji) +
    ",'" +
    daneZamowienia.opiekun_id +
    "','" +
    daneZamowienia.user +
    "'," +
    daneZamowienia.stan +
    "," +
    daneZamowienia.status +
    ",'" +
    daneZamowienia.uwagi +
    "'," +
    daneZamowienia.etap +
    ",'" +
    daneZamowienia.waluta_id +
    "','" +
    daneZamowienia.vat_id +
    "','" +
    daneZamowienia.przedplata +
    "','" +
    daneZamowienia.cena +
    "','" +
    daneZamowienia.wartosc_zamowienia +
    "','" +
    daneZamowienia.termin_platnosci +
    "','" +
    daneZamowienia.fsc +
    "','" +
    daneZamowienia.skonto +
    "','" +
    daneZamowienia.nr_kalkulacji +
    "','" +
    daneZamowienia.nr_stary +
    "','" +
    daneZamowienia.kod_pracy +
    "','" +
    daneZamowienia.nr_zamowienia_klienta +
    "','" +
    daneZamowienia.isbn +
    "'); ";

  promises.push(
    new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) {
          throw err;
          resolve([{ zapis: false }, err]);
        } else {
          // resolve([results,"ok arkusz"])
          resolve([{ zapis: true }, { zamowienie_id: results.insertId }]);
        }
      });
    })
  );

  // nr_stary: daneZamowienia.nr_stary,
  // kod_pracy: daneZamowienia.kod_pracy,
  // nr_zamowienia_klienta: daneZamowienia.nr_zamowienia_klienta,
  // isbn: daneZamowienia.isbn,

  Promise.all(promises).then((data) => res.status(201).json(data));
};

module.exports = {
  zamowienieInsertDane,
};
