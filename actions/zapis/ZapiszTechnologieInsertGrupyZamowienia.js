const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertGrupyZamowienia = (req,res) =>{



  let grypy = req.body[0]

  let promises = [];

// console.log("grupa xxx", grypy)
console.log("grypy.length", grypy.length)

  //------------------------------
  for (let grupa of grypy) {
    let czas = grupa.czas;

    let poczatek ="select case when (select max(koniec) from artdruk.technologie_grupy_wykonan where (procesor_id =  "+ grupa.procesor_id +") and typ_grupy < 3) is null then now() else (select max(koniec) from artdruk.technologie_grupy_wykonan where (procesor_id = "+ grupa.procesor_id +" )and typ_grupy < 3) END "
    let koniec =" (select case when (select max(koniec) from artdruk.technologie_grupy_wykonan where (procesor_id =  "+ grupa.procesor_id +" ) and typ_grupy < 3) is null then now() + interval " + czas + " minute else (select max(koniec) + interval " + czas + " minute from artdruk.technologie_grupy_wykonan where (procesor_id = "+ grupa.procesor_id +") and typ_grupy < 3) END) "
  
var sql =
"INSERT INTO artdruk.technologie_grupy_wykonan(poczatek,id,indeks,technologia_id,zamowienie_id,mnoznik,czas,koniec,ilosc_narzadow,narzad,naklad,nazwa,predkosc,proces_id,procesor_id,element_id,przeloty,status,stan,typ_grupy,uwagi) " +
" " +
poczatek +  ",'" +
grupa.id +  "','" +
grupa.indeks +        "','" +
grupa.technologia_id +        "','" +
grupa.zamowienie_id +        "','" +
grupa.mnoznik +        "','" +
grupa.czas +        "'," +
koniec +        ",'" +
grupa.ilosc_narzadow +        "','" +
grupa.narzad +        "'," +
grupa.naklad +        ",'" +
grupa.nazwa +        "','" +
grupa.predkosc +        "','" +
grupa.proces_id +        "','" +
grupa.procesor_id +        "','" +
grupa.element_id +        "','" +
grupa.przeloty +        "','" +
grupa.status +        "','" +
grupa.stan +        "',2,'" +
grupa.uwagi +        "'; ";

      promises.push(     new Promise((resolve, reject) => {

        if (grypy.length != 0) {
        connection.query(sql, (err, results) => {
        if (err) {
          // console.log(err)
          console.log(err)
            resolve([{zapis: false},err]);       

        } else {
            // resolve([results,"ok arkusz"])
            resolve([{zapis: true}])
        }
    });


  }else {
          resolve([{ zapis: true }]);
        }

    })) 

  }




  Promise.all(promises).then((data) => res.status(201).json(data));
}

module.exports = {
  zapiszTechnologieInsertGrupyZamowienia
    
}
 