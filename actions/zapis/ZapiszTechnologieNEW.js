const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieNEW = (req,res) =>{


  let arkusze = req.body[0]
  let legi = req.body[1]
  let legiFragmenty= req.body[2]
  // let daneTechEdit = req.body[0]
  // let produktyTechEdit = req.body[1]
  // let elementyTechEdit = req.body[2]
  // let fragmentyTechEdit = req.body[3]
  // let oprawaTechEdit = req.body[4]
  // let grupaWykonanEdit = req.body[8]
  // let wykonaniaEdit = req.body[9]
  // let procesyElementowTechEdit = req.body[10]
  // let odpowiedz= []

  // let arkusze = req.body[0]
  let promises = [];



  //------------------------------
  for (let arkusz of arkusze) {
      var sql =
      "INSERT INTO artdruk.technologie_arkusze_temp (id,indeks,technologia_id,typ_elementu,rodzaj_arkusza,element_id,ilosc_stron,ilosc_leg,naklad,nadkomplet,papier_id,nr_arkusza,arkusz_szerokosc,arkusz_wysokosc,uwagi) " +
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
      arkusz.nadkomplet +        "'," +
      arkusz.papier_id +        ",'" +
      arkusz.nr_arkusza +        "','" +
      arkusz.arkusz_szerokosc +        "','" +
      arkusz.arkusz_wysokosc +        "','" +
      arkusz.uwagi +        "'); ";

      promises.push(     new Promise((resolve, reject) => {
          connection.query(sql, (err, results) => {
          if (err) {
              resolve([err,"error arkusz"]);               
          } else {
              // resolve([results,"ok arkusz"])
              resolve(["ok arkusz"])
          }
      });
  })) 

  }
//------------------------------
for (let lega of legi) {

  var sql =
    "INSERT INTO artdruk.technologie_legi_temp(id,indeks,technologia_id,typ_elementu,rodzaj_legi,element_id,arkusz_id,ilosc_stron,naklad,nr_legi,uwagi) " +
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
    lega.nr_legi +        "','" +
    lega.uwagi +        "'); ";
    promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
          resolve([err,"error lega"]);               
      } else {
          resolve(["ok lega"])
      }
  });
})) 


}
//------------------------------
for (let legaFragment of legiFragmenty) {

  var sql =
    "INSERT INTO artdruk.technologie_legi_fragmenty(id,indeks,technologia_id,element_id,fragment_id,arkusz_id,lega_id,nr_legi,naklad,oprawa_id,typ,wersja) " +
    "values ('" +
    legaFragment.id +  "','" +
    legaFragment.indeks +        "','" +
    legaFragment.technologia_id +        "','" +
    legaFragment.element_id +        "','" +
    legaFragment.fragment_id +        "','" +
    legaFragment.arkusz_id +        "','" +
    legaFragment.lega_id +        "','" +
    legaFragment.nr_legi +        "','" +
    legaFragment.naklad +        "','" +
    legaFragment.oprawa_id +        "','" +
    legaFragment.typ +        "','" +
    legaFragment.wersja +        "'); ";
    promises.push(     new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
      if (err) {
          resolve([err,"error lega fragment"]);               
      } else {
          resolve(["ok lega fragment"])
      }
  });
})) 
}

//------------------------------





  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieNEW
    
}
 