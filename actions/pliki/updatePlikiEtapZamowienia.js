const { connection, pool } = require("../mysql");

const { DecodeToken } = require("../logowanie/DecodeToken");
const { nazwaElementu } = require("../nazwy/nazwaElementu");
const { nazwaEtapPlikow } = require("../nazwy/nazwaEtapPlikow");
const { SendMail } = require("../mail/SendMail");


 const updatePlikiEtapZamowienia = async (req,res)=>{
  
    //aktualizacja etapu plikow z widoku zamówień 
    const zamowienie_id = req.body.zamowienie_id;
    const element_id = req.body.element_id;
    const etap= req.body.etap;
    const stary_etap= req.body.stary_etap;
    const global_id_pliki_row= req.body.global_id_pliki_row;

       const token = req.params['token']
       let ID_SPRAWCY =  DecodeToken(token).id;

let save = () =>{ 
    return  new Promise((resolve,reject)=>{
    let data=[ID_SPRAWCY,"Pliki",nazwaElementu(element_id)+ ". Zmiana statusu z "+nazwaEtapPlikow(stary_etap)+" na "+nazwaEtapPlikow(etap),zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
                 if (err){
                reject(err); 
            } else resolve("OK")
        

        })


})
}
let save2 = () =>{ 
    return new Promise((resolve,reject)=>{

     var sql =   "call artdruk.update_pliki_etap_zamowienia (" + zamowienie_id+ "," + element_id+ "," + global_id_pliki_row+ "," + etap+ ")"
    connection.query(sql, function (err, result) {
                    if (err){
                reject(err); 
            } else resolve("OK")


})



})
}


let save3 = () =>{ 
    return  new Promise((resolve,reject)=>{
let min
        var sql = "select * from artdruk.view_zamowienia_pliki where zamowienie_id="+zamowienie_id;
        connection.query(sql, function (err, doc) {
                         if (err){
                reject(err); 
            } else {
                         min = Math.min(...doc.filter(x=> x.zamowienie_id == zamowienie_id ).map((f) => f.etap)) 
                        resolve(min)
            }

    }

);
    
})
}

let  save4 = (min) => { 
    return new Promise((resolve,reject)=>{
    //    console.log("min: "+min)
    //    console.log("zamowienie_id: "+zamowienie_id)
    var sql = "update artdruk.zamowienia set etap =" +min+ " where id ="+zamowienie_id;
    connection.query(sql, function (err, result) {
                        if (err) {
                          reject(err);
                        } else resolve("OK");
    })
    
})
}

try{
let res1 = await  save()
let res2 = await  save2()
let min = await  save3()
let res4 = await  save4(min)

 res.status(200).json(min);
}catch (error){
SendMail(error)
        console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
        res.status(200).json({ status: error});
}


}


module.exports = {
    updatePlikiEtapZamowienia
    
}
 

// let res1 = await save().catch(error => {
//         console.error("Błąd w save():", error);
//         res.status(500).json({ error: "Błąd podczas zapisywania." });
//     });