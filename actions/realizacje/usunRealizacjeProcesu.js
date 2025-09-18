const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const usunRealizacjeProcesu = async (req, res) => {
let row = req.body;
const token = req.params['token']
let id;
let ID_SPRAWCY =  DecodeToken(token).id ;
let REALIZACJE_USUN =  DecodeToken(token).realizacje_usun || 0;

// const wykonanie_global_id = req.body.global_id;
// const zrealizowano = req.body.zrealizowano;

// const grupa_id = req.body.id;
// const global_id = req.body.global_id;
// console.log("wykonanie_global_id "+row.global_id)
// console.log("zealizowano "+row.zrealizowano)
// console.log("procesor_id "+row.procesor_id)
// console.log("ID_SPRAWCY "+ID_SPRAWCY)


let Usun = () =>{ 
    return  new Promise((resolve,reject)=>{

    //   console.log(" Nazwa + id "+ row.nazwa,REALIZACJE_USUN)
  let data=[row.global_id,ID_SPRAWCY,REALIZACJE_USUN]

      var sql =   "delete from artdruk.technologie_realizacje where global_id=?  and (dodal=? or 1=?); ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 

            if(result.affectedRows==0) reject("Brak uprawnień do skasowania realizacji")

           resolve("OK")
        })
})
}


let Historia = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,row.nazwa,"Skasowano realizację: "+row.zrealizowano+" ark. "+"grupa id: "+row.id_grupy,row.zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})
}





let Status = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[row.global_id_wykonania]
    var sql = "call artdruk.aktualizacja_statusu_wykonania_vs_realizacja(?) ";
    connection.execute(sql,data, function (err, result) {    
          if (err) reject(err); 
           resolve("OK")
        })
})

}





let OdwiezWykonanie= () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.global_id_wykonania]
      var sql =   "SELECT status, do_wykonania from artdruk.technologie_wykonania where global_id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve({status:result[0].status, do_wykonania:result[0].do_wykonania})
        })
})
}

let OdwiezGrupe = () =>{ 
    return  new Promise((resolve,reject)=>{
  let data=[row.technologia_id,row.id_grupy]
      var sql =   "SELECT status from artdruk.view_technologie_grupy_wykonan where technologia_id=? and id=? ";
      connection.execute(sql, data,function (err, result) {     
            if (err) reject(err); 
           resolve({status_grupy:result[0].status})
        })
})
}





try {
let res1 = await  Usun();  // wstaw wykonanie
let res2 = await  Historia(); // dodaj do historii
let res3 = await  Status();  // zmieñ status grupy - w trakcie lub zakoñczone
let res4 = await  OdwiezWykonanie();  // sprawdza nowy status grupy
let res5 = await  OdwiezGrupe();  // sprawdza nowy status grupy


// pobierz tylko nowy status i odeślij go aby zaaktualizować
// res.status(200).json({status:"OK",insertId : id});
 res.status(200).json({status:"OK",status_wykonania:res4.status,do_wykonania:res4.do_wykonania, status_grupy: res5.status_grupy });
    } catch (error) {
        // Ten blok przechwyci błąd `err` przekazany przez `reject(err)`
        // z dowolnej z funkcji (Insert, Historia).
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
    }
     }


module.exports = {
  usunRealizacjeProcesu
};


// let res1 = await save().catch(error => {
//         console.error("Błąd w save():", error);
//         res.status(500).json({ error: "Błąd podczas zapisywania." });
//     });