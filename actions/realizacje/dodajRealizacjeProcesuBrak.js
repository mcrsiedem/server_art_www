const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const dodajRealizacjeProcesuBrak = async (req, res) => {
let row = req.body;
const token = req.params['token']
let id;
let ID_SPRAWCY =  DecodeToken(token).id;

const zamowienie_id = req.body.zamowienie_id;
const grupa_id = req.body.grupa_id;
const wykonanie_global_id = req.body.global_id;
const przeloty = req.body.przeloty;
// const wykonanie_global_id = req.body.global_id;
// const zrealizowano = req.body.zrealizowano;

// const grupa_id = req.body.id;
// const global_id = req.body.global_id;
// console.log("wykonanie_global_id "+row.global_id)
// console.log("zealizowano "+row.zrealizowano)
// console.log("procesor_id "+row.procesor_id)
// console.log("ID_SPRAWCY "+ID_SPRAWCY)
// console.log("zamowienie_id "+zamowienie_id)
// console.log("grupa_id "+grupa_id)
// console.log("wykonanie_global_id "+wykonanie_global_id)
// console.log("przeloty "+przeloty)


let SprawdzIleBrakuje = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[wykonanie_global_id]
      var sql =   "SELECT sum(zrealizowano) as realizacje from artdruk.view_technologie_realizacje where wykonanie_global_id=?  ";
      connection.execute(sql, data,function (err, result) {     
                  if (err) {
                // throw err
            reject(err); 
            }
            console.log("Zrealizowano: "+result[0].realizacje)
           resolve(result[0].realizacje || 0)
        })
})
}

let Insert = (SUMA_REALIZACJI) =>{ 
    return  new Promise((resolve,reject)=>{

              let BRAKUJACE_PRZELOTY = parseInt(row.przeloty) - parseInt(SUMA_REALIZACJI || 0)
              console.log(" BRAKUJACE_PRZELOTY: "+ BRAKUJACE_PRZELOTY)
      if(BRAKUJACE_PRZELOTY>0){

  let data=[row.global_id,BRAKUJACE_PRZELOTY,row.procesor_id,ID_SPRAWCY,2]
      var sql =   "INSERT INTO artdruk.technologie_realizacje (wykonanie_global_id,zrealizowano,procesor_id,dodal,typ) values (?,?,?,?,?); ";
      connection.execute(sql, data,function (err, result) {     
            // if (err) reject(err); 
                    if (err) {
                // throw err
            reject(err); 
            }
            id = result.insertId
           resolve(BRAKUJACE_PRZELOTY)
        })
      }else{
        resolve(0)
      }


})
}


let Historia = (BRAKUJACE_PRZELOTY) =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,row.nazwa,"Dodano brak: "+BRAKUJACE_PRZELOTY+" ark. "+"grupa id: "+row.id,row.zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
                 if (err) {
                throw err
            reject(err); 
            }
           resolve("OK")
        })
})
}





let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.global_id]
    var sql = "call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?) ";
    connection.execute(sql,data, function (err, result) {    
                  if (err) {
              throw err
            reject(err); 
            } 
           resolve("OK")
        })
})

}





let OdwiezWykonanie= () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id]
      var sql =   "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
                    if (err) {
             throw err
            reject(err); 
            }
           resolve({status:result[0].status, do_wykonania:result[0].do_wykonania})
        })
})
}

let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.technologia_id,row.grupa_id]
      var sql =   "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) {
              throw err
            reject(err); 
            }
            
           resolve({status_grupy:result[0].status})
        })
})
}





try {

let SUMA_REALIZACJI = await  SprawdzIleBrakuje();  // wstaw wykonanie

let BRAKUJACE_PRZELOTY = await  Insert(SUMA_REALIZACJI);  // wstaw wykonanie
let res2 = await  Historia(BRAKUJACE_PRZELOTY); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezWykonanie();  // sprawdza nowy status grupy
let res5 = await  OdwiezGrupe();  // sprawdza nowy status grupy


// pobierz tylko nowy status i odeślij go aby zaaktualizować
// res.status(200).json({status:"OK"});
 res.status(200).json({status:"OK",insertId : id,status_wykonania:res4.status,do_wykonania:res4.do_wykonania, status_grupy: res5.status_grupy, brakujace_przeloty:BRAKUJACE_PRZELOTY });
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }


module.exports = {
  dodajRealizacjeProcesuBrak
};


// let res1 = await save().catch(error => {
//         console.error("Błąd w save():", error);
//         res.status(500).json({ error: "Błąd podczas zapisywania." });
//     });