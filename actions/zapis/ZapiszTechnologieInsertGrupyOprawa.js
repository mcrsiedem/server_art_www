const { connection, pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");
const zapiszTechnologieInsertGrupyOprawa = (req,res) =>{

  let grupy = req.body[0]
  let promises = [];
  //------------------------------
  for (let grupa of grupy) {
    let czas = grupa.czas;

    let poczatek ="select case when (select max(koniec) from artdruk.technologie_grupy_wykonan_oprawa where (procesor_id =  "+ grupa.procesor_id +") and typ_grupy < 3) is null then now() else (select max(koniec) from artdruk.technologie_grupy_wykonan_oprawa where (procesor_id = "+ grupa.procesor_id +") and typ_grupy < 3) END "
    let koniec =" (select case when (select max(koniec) from artdruk.technologie_grupy_wykonan_oprawa where (procesor_id =  "+ grupa.procesor_id +") and typ_grupy < 3) is null then now() + interval " + czas + " minute else (select max(koniec) + interval " + czas + " minute from artdruk.technologie_grupy_wykonan_oprawa where (procesor_id = "+ grupa.procesor_id +") and typ_grupy < 3) END) "

var sql =
"INSERT INTO artdruk.technologie_grupy_wykonan_oprawa(poczatek,id,indeks,bok_oprawy,ilosc_zbieran,oprawa_id,naklad,technologia_id,zamowienie_id,mnoznik,czas,koniec,narzad,nazwa,predkosc,proces_id,procesor_id,status,stan,typ_grupy,uwagi) " +
" " +
poczatek +  ",'" +
grupa.id +  "','" +
grupa.indeks +        "','" +
grupa.bok_oprawy +        "'," +
grupa.ilosc_zbieran +        "," +
grupa.oprawa_id +        "," +
grupa.naklad +        ",'" +
grupa.technologia_id +        "','" +
grupa.zamowienie_id +        "','" +
grupa.mnoznik +        "','" +
grupa.czas +        "'," +
koniec +        ",'" +
grupa.narzad +        "','" +
grupa.nazwa +        "','" +
grupa.predkosc +        "','" +
grupa.proces_id +        "','" +
grupa.procesor_id +        "','" +
grupa.status +        "','" +
grupa.stan +        "',2,'" +
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
  zapiszTechnologieInsertGrupyOprawa
}