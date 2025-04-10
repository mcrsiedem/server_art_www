const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");




const zamowienieInsertDane = (req,res) =>{

  let promises = [];
  let daneZamowienia = req.body[0]
  // daneZamowienia.id = result.insertId;
  // produkty = produkty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // elementy = elementy.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // fragmenty = fragmenty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // oprawa = oprawa.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
  // procesyElementow = procesyElementow.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
    var sql =   "INSERT INTO artdruk.zamowienia (nr,rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,etap,waluta_id,vat_id,przedplata,cena,termin_platnosci,fsc) "+
    "values ('" + daneZamowienia.nr + "','" + daneZamowienia.rok + "','" + daneZamowienia.firma_id+ "','" + daneZamowienia.klient_id + "','" + daneZamowienia.tytul + "'," + ifNoDateSetNull(daneZamowienia.data_przyjecia) + "," +ifNoDateSetNull(daneZamowienia.data_materialow)  + "," + ifNoDateSetNull(daneZamowienia.data_spedycji) + ",'" + daneZamowienia.opiekun_id + "','" + daneZamowienia.user + "'," + daneZamowienia.stan + "," + daneZamowienia.status + ",'" + daneZamowienia.uwagi + "'," + daneZamowienia.etap + ",'" + daneZamowienia.waluta_id + "','" + daneZamowienia.vat_id + "','" + daneZamowienia.przedplata + "','" + daneZamowienia.cena + "','" + daneZamowienia.termin_platnosci + "','" + daneZamowienia.fsc + "'); ";
   
    promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
          resolve([{zapis: false},err]);               
      } else {
          // resolve([results,"ok arkusz"])
          resolve([{zapis: true},{zamowienie_id:results.insertId}])
      }
  });
  })) 
 
  
  Promise.all(promises).then((data) => res.status(201).json(data));

}

module.exports = {
  zamowienieInsertDane
    
}
 