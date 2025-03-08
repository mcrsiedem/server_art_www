const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologie = (req,res) =>{


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
  connection.query("begin", function (err, result) {
    if (err){ connection.query("rollback ", function (err, result) {   });  res.status(203).json(err)   } 
  });




  //---------------- aaa

  var sql =   "INSERT INTO artdruk.technologie (nr,rok,tytul,firma_id,klient_id,zamowienie_id,autor_id,uwagi,opiekun_id,data_przyjecia,data_spedycji,data_materialow,stan,status,etap) "+
  "values ('" + daneTechEdit.nr + "','" + daneTechEdit.rok + "','" + daneTechEdit.tytul + "','" + daneTechEdit.firma_id + "','" + daneTechEdit.klient_id + "','" + daneTechEdit.zamowienie_id + "','" + daneTechEdit.autor_id + "','" + daneTechEdit.uwagi + "','" + daneTechEdit.opiekun_id + "'," +ifNoDateSetNull( daneTechEdit.data_przyjecia) + "," +ifNoDateSetNull( daneTechEdit.data_spedycji) + "," + ifNoDateSetNull(daneTechEdit.data_materialow) + "," + daneTechEdit.stan + "," + daneTechEdit.status + "," + daneTechEdit.etap + "); ";

  connection.query(sql, function (err, result) {
    if(err){console.log(err)}
    console.log("result" , result.insertId)
    // dodaje do wszystkiego id techologi
    daneTechEdit.id =result.insertId
    produktyTechEdit = produktyTechEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    elementyTechEdit = elementyTechEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    fragmentyTechEdit = fragmentyTechEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    oprawaTechEdit = oprawaTechEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    legiEdit = legiEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    legiFragmentyEdit = legiFragmentyEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    arkuszeEdit = arkuszeEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    grupaWykonanEdit = grupaWykonanEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    wykonaniaEdit = wykonaniaEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })
    procesyElementowTechEdit = procesyElementowTechEdit.map((obj) => {return{...obj, technologia_id:result.insertId} })





  for (let produkty of produktyTechEdit) {
    var sql =
      "INSERT INTO artdruk.technologie_produkty (technologia_id,id,zamowienie_id,typ,indeks,naklad,nazwa,ilosc_stron,format_x,format_y,oprawa,uwagi,etap,stan,status) " +
      "values ('" +
      produkty.technologia_id +  "','" +
      produkty.id +        "','" +
      produkty.zamowienie_id +        "','" +
      produkty.typ +        "','" +
      produkty.indeks +        "','" +
      produkty.naklad +        "','" +
      produkty.nazwa +        "','" +
      produkty.ilosc_stron +        "','" +
      produkty.format_x +        "','" +
      produkty.format_y +        "','" +
      produkty.oprawa +        "','" +
      produkty.uwagi +        "'," +
      produkty.etap +        "," +
      produkty.stan +        "," +
      produkty.status +        "); ";
    connection.query(sql, function (err, result) {
      if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
    });
  }

  for (let element of elementyTechEdit) {
      var sql =
        "INSERT INTO artdruk.technologie_elementy (id,indeks,technologia_id,zamowienie_id,produkt_id,nazwa,typ,lega,ilosc_leg,ilosc_stron,format_x,format_y,papier_id,papier_info,naklad,uwagi,etap,stan,status) " +
        "values ('" +
        element.id +  "','" +
        element.indeks +        "','" +
        element.technologia_id +        "','" +
        element.zamowienie_id +        "','" +
        element.produkt_id +        "','" +
        element.nazwa +        "','" +
        element.typ +        "','" +
        element.lega +        "','" +
        element.ilosc_leg +        "','" +
        element.ilosc_stron +        "','" +
        element.format_x +        "','" +
        element.format_y +        "','" +
        element.papier_id +        "','" +
        element.papier_info +        "','" +
        element.naklad +        "','" +
        element.uwagi +        "'," +
        element.etap +        "," +
        element.stan +        "," +
        element.status +        "); ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
      });
    }

    for (let fragment of fragmentyTechEdit) {
      var sql =
        "INSERT INTO artdruk.technologie_fragmenty (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,oprawa_id,typ,ilosc_stron,wersja,naklad,info) " +
        "values ('" +
        fragment.id +  "','" +
        fragment.indeks +        "','" +
        fragment.technologia_id +        "','" +
        fragment.zamowienie_id +        "','" +
        fragment.produkt_id +        "','" +
        fragment.element_id +        "','" +
        fragment.oprawa_id +        "','" +
        fragment.typ +        "','" +
        fragment.ilosc_stron +        "','" +
        fragment.wersja +        "','" +
        fragment.naklad +        "','" +
        fragment.info +        "'); ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
      });
    }



    for (let oprawa of oprawaTechEdit) {
      var sql =
        "INSERT INTO artdruk.technologie_oprawa (id,indeks,technologia_id,zamowienie_id,produkt_id,bok_oprawy,naklad,data_czystodrukow,data_spedycji,oprawa,wersja,uwagi) " +
        "values ('" +
        oprawa.id +  "','" +
        oprawa.indeks +        "','" +
        oprawa.technologia_id +        "','" +
        oprawa.zamowienie_id +        "','" +
        oprawa.produkt_id +        "','" +
        oprawa.bok_oprawy +        "','" +
        oprawa.naklad +        "'," +
        ifNoDateSetNull(oprawa.data_czystodrukow) +        "," +
          ifNoDateSetNull(oprawa.data_spedycji) +        ",'" +
        oprawa.oprawa+        "','" +
        oprawa.wersja +        "','" +
        oprawa.uwagi +        "'); ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
      });
    }



    for (let arkusz of arkuszeEdit) {

      var sql =
        "INSERT INTO artdruk.technologie_arkusze (id,indeks,technologia_id,typ_elementu,rodzaj_arkusza,element_id,ilosc_stron,ilosc_leg,naklad,uwagi) " +
        "values ('" +
        arkusz.id +  "','" +
        arkusz.indeks +        "','" +
        arkusz.technologia_id +        "','" +
        arkusz.typ_elementu +        "','" +
        arkusz.rodzaj_arkusza +        "','" +
        arkusz.element_id +        "','" +
        arkusz.ilosc_stron +        "','" +
        arkusz.ilosc_leg+        "','" +
        arkusz.naklad +        "','" +
        arkusz.uwagi +        "'); ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
      });
    }

    for (let lega of legiEdit) {

      var sql =
        "INSERT INTO artdruk.technologie_legi(id,indeks,technologia_id,typ_elementu,rodzaj_legi,element_id,arkusz_id,ilosc_stron,naklad,uwagi) " +
        "values ('" +
        lega.id +  "','" +
        lega.indeks +        "','" +
        lega.technologia_id +        "','" +
        lega.typ_elementu +        "','" +
        lega.rodzaj_legi +        "','" +
        lega.element_id +        "','" +
        lega.arkusz_id +        "','" +
        lega.ilosc_stron +        "','" +
        lega.naklad +        "','" +
        lega.uwagi +        "'); ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
      });
    }


    for (let legaFragment of legiFragmentyEdit) {

      var sql =
        "INSERT INTO artdruk.technologie_legi_fragmenty(id,indeks,technologia_id,element_id,fragment_id,arkusz_id,lega_id,naklad,oprawa_id,typ,wersja) " +
        "values ('" +
        legaFragment.id +  "','" +
        legaFragment.indeks +        "','" +
        legaFragment.technologia_id +        "','" +
        legaFragment.element_id +        "','" +
        legaFragment.fragment_id +        "','" +
        legaFragment.arkusz_id +        "','" +
        legaFragment.lega_id +        "','" +
        legaFragment.naklad +        "','" +
        legaFragment.oprawa_id +        "','" +
        legaFragment.typ +        "','" +
        legaFragment.wersja +        "'); ";
      connection.query(sql, function (err, result) {
          if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
      });
    }







});

    var sql = "commit";
connection.query(sql, function (err, result) {
  if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } ;
console.log("zapis OK");


odpowiedz = [daneTechEdit,produktyTechEdit,elementyTechEdit,fragmentyTechEdit,oprawaTechEdit,legiEdit,legiFragmentyEdit,arkuszeEdit,grupaWykonanEdit,wykonaniaEdit,procesyElementowTechEdit]
  res.status(201).json(odpowiedz);
});
  //-------------------  aaa
  // connection.query("commit ", function (err, result) {
  //   if (err){ connection.query("rollback ", function (err, result) {   });  res.status(203).json(err)   } 
  // });

}

module.exports = {
  zapiszTechnologie
    
}
 