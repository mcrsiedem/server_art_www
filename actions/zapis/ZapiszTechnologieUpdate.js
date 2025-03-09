const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const { zapiszTechnologieUpdate_dane } = require("./ZapiszTechnologieUpdate_dane");
const { zapiszTechnologieUpdate_produkty } = require("./ZapiszTechnologieUpdate_produkty");
const { zapiszTechnologieUpdate_elementy } = require("./ZapiszTechnologieUpdate_elementy");
const { zapiszTechnologieUpdate_procesy_elementow } = require("./ZapiszTechnologieUpdate_procesy_elementow");
const { zapiszTechnologieUpdate_oprawa } = require("./ZapiszTechnologieUpdate_oprawa");
const { zapiszTechnologieUpdate_legi } = require("./ZapiszTechnologieUpdate_legi");
const { zapiszTechnologieUpdate_legi_fragmenty } = require("./ZapiszTechnologieUpdate_legi_fragmenty");
const { zapiszTechnologieUpdate_arkusze } = require("./ZapiszTechnologieUpdate_arkusze");




const zapiszTechnologieUpdate = (req,res) =>{

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
  // let odpowiedz= []

   

// console.log("Dane zamowienia: ", daneZamowienia.id )
// console.log("SaveAs: ", req.body[0].saveAs)


// var sql = "BEGIN";
// connection.query(sql, function (err, result) {
// if (err) res.status(203).json(err)  });



zapiszTechnologieUpdate_dane(daneTechEdit,res)
zapiszTechnologieUpdate_produkty(produktyTechEdit,res)
zapiszTechnologieUpdate_elementy(elementyTechEdit,res)
zapiszTechnologieUpdate_procesy_elementow(procesyElementowTechEdit,res)
zapiszTechnologieUpdate_oprawa(oprawaTechEdit,res)
zapiszTechnologieUpdate_legi(legiEdit,res)
zapiszTechnologieUpdate_legi_fragmenty(legiFragmentyEdit,res)
zapiszTechnologieUpdate_arkusze(arkuszeEdit,res)



// //-------------- fragmenty

//         for(let row of fragmenty.filter(x => x.update == true && x.insert != true) ){
//           var sql =   "update  artdruk.zamowienia_fragmenty set  id = " + row.id+ ", zamowienie_id = " + row.zamowienie_id+ ", produkt_id = " + row.produkt_id+ ", element_id = " + row.element_id+ ", oprawa_id = " + row.oprawa_id+ ", naklad = '" + row.naklad+ "', ilosc_stron = '" + row.ilosc_stron+ "', wersja = '" + row.wersja+ "', info = '" + row.info+ "', typ = '" + row.typ+ "',  indeks = " + row.indeks+ " where global_id = " + row.global_id + ""
//           connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
//           }
        
//           for(let row of fragmenty.filter(x => x.insert == true && x.delete != true) ){
//             var sql =   "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) "+
//             "values (" + row.id + "," + row.zamowienie_id + "," + row.produkt_id + "," + row.element_id + "," + row.oprawa_id + ",'" + row.naklad + "','" + row.ilosc_stron + "','" + row.wersja + "','" + row.info + "','" + row.typ + "'," + row.indeks + "); ";
//             connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
//             }
        
//             for(let row of fragmenty.filter(x => x.delete == true && x.insert != true) ){
//                 var sql =   "DELETE from artdruk.zamowienia_fragmenty where global_id=" + row.global_id;
//                 connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err)         }});
//                 }


  // connection.query("commit ", function (err, result) {
  // });


// odpowiedz = [daneTechEdit]
// res.status(201).json(odpowiedz);



}

module.exports = {
  zapiszTechnologieUpdate
    
}
 