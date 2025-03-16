const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertGrupy = (req,res) =>{



  let grypy = req.body[0]

  let promises = [];



  //------------------------------
  for (let grupa of grypy) {
    let czas = grupa.czas;

    let poczatek ="select case when (select max(koniec) from artdruk.technologie_grupy_wykonan where procesor_id =  "+ grupa.procesor_id +") is null then now() else (select max(koniec) from artdruk.technologie_grupy_wykonan where procesor_id = "+ grupa.procesor_id +") END "
    let koniec =" (select case when (select max(koniec) from artdruk.technologie_grupy_wykonan where procesor_id =  "+ grupa.procesor_id +") is null then now() + interval " + czas + " minute else (select max(koniec) + interval " + czas + " minute from artdruk.technologie_grupy_wykonan where procesor_id = "+ grupa.procesor_id +") END) "

var sql =
"INSERT INTO artdruk.technologie_grupy_wykonan(poczatek,id,indeks,technologia_id,mnoznik,czas,koniec,narzad,nazwa,predkosc,proces_id,procesor_id,element_id,przeloty,status,stan,uwagi) " +
" " +
poczatek +  ",'" +
grupa.id +  "','" +
grupa.indeks +        "','" +
grupa.technologia_id +        "','" +
grupa.mnoznik +        "','" +
grupa.czas +        "'," +
koniec +        ",'" +
grupa.narzad +        "','" +
grupa.nazwa +        "','" +
grupa.predkosc +        "','" +
grupa.proces_id +        "','" +
grupa.procesor_id +        "','" +
grupa.element_id +        "','" +
grupa.przeloty +        "','" +
grupa.status +        "','" +
grupa.stan +        "','" +
grupa.uwagi +        "'; ";

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
  zapiszTechnologieInsertGrupy
    
}
 