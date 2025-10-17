const { DecodeToken } = require("../logowanie/DecodeToken");
const connection = require("../mysql");

const zakonczWykonanie = (req, res) => {
  let wykonanieRow = req.body;
  let technologia_id = wykonanieRow.technologia_id;

  const zamowienie_id = wykonanieRow.zamowienie_id;
    const nazwa = wykonanieRow.nazwa;
    const stary_status = wykonanieRow.stary_status;
    const id_wykonania = wykonanieRow.id;
    const token = req.params['token']
       let ID_SPRAWCY =  DecodeToken(token).id;

     let global_id_next;
     let next_proces_indeks = parseInt(wykonanieRow.proces_indeks)+1
    var sql = " update artdruk.technologie_wykonania set status ="+ wykonanieRow.status +" where global_id ="+wykonanieRow.global_id
connection.query(sql, function (err, result) {
    if (err) console.log(err)

 })

 if(wykonanieRow.status == 4 ){

//---- znajdz wszystkie globa_id wykonania z nastepnego procesu
var sql = "select global_id,grupa_id from artdruk.view_technologie_wykonania where technologia_id ="+ wykonanieRow.technologia_id +" and arkusz_id ="+wykonanieRow.arkusz_id+" and proces_indeks ="+next_proces_indeks+" and status =1"
connection.query(sql, function (err, result) {

  for(res3 of result){
global_id_next = res3?.global_id || 0
grupa_id_next = res3?.grupa_id || 0
// console.log("nxt grupa_id: "+grupa_id_next)
 var sql = " update artdruk.technologie_wykonania set status =2 where global_id ="+global_id_next 
connection.query(sql, function (err, result) {


    if (err) console.log(err)
 });

 // zmienia grupe na oczekujący gdy wykonanie robi się oczekujące przez zakończenie wykonania z poprzedniego procesu
            var sql = " update artdruk.technologie_grupy_wykonan set status = CASE WHEN status = 1 THEN 2 ELSE status END where technologia_id ="+ wykonanieRow.technologia_id+" and global_id !=0 and id="+grupa_id_next

connection.query(sql, function (err, result) {
    if (err) console.log(err)
 });

  }




    if (err) console.log(err)
 });


//--- ostatnie wykonanie z grupy



 var sql = "SELECT * FROM artdruk.view_technologie_wykonania where technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
 // indeks.push(result[0].indeks)
 WSZYTKIE_WYKONANIA = result
 wykonaniaGrupy = [...WSZYTKIE_WYKONANIA.filter(x=> x.grupa_id == wykonanieRow.grupa_id )]
 wykonaniaProcesu = [...WSZYTKIE_WYKONANIA.filter(x=>  x.proces_id == wykonanieRow.proces_id )]
 wykonaniaElementu = [...WSZYTKIE_WYKONANIA.filter(x=>  x.element_id == wykonanieRow.element_id )]
//  wykonaniaProces = [...result.filter(x=> x.element_id == wykonanieRow.element_id && x.proces_id == wykonanieRow.proces_id )]


//-----------
 if(wykonaniaGrupy.every(x=>x.status == 4)){
 var sql = " update artdruk.technologie_grupy_wykonan set status =4 where id ="+wykonanieRow.grupa_id+" and global_id !=0 and technologia_id ="+ wykonanieRow.technologia_id 
connection.query(sql, function (err, result) {
    if (err) console.log(err)
 });
    }
//-----------
 if(wykonaniaProcesu.every(x=>x.status == 4)){
 var sql = " update artdruk.technologie_procesy_elementow set status =4 where id ="+wykonanieRow.proces_id+" and global_id !=0 and technologia_id ="+ wykonanieRow.technologia_id +" and element_id ="+ wykonanieRow.element_id 
connection.query(sql, function (err, result) {
    if (err) console.log(err)
 });


// nr1 sprawdz czy cały druk zakonczony, jeśli tak to zmień etap zamowienia na wydrukowane
 var sql = "SELECT * FROM artdruk.view_technologie_procesy_elementow where nazwa_id = 1 and technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
    result.forEach(x=> console.log("nazwa_id: "+x.nazwa_id+" status:"+x.status))
        if(result.every(x=> x.status == 4)){
        var sql = " update artdruk.zamowienia set etap = CASE WHEN etap < 8 THEN 8 ELSE etap END where id !=0 and technologia_id ="+ technologia_id 
        connection.query(sql, function (err, result) {
            if (err) console.log(err)
        });
            }
            if (err) console.log(err)
     });
// nr1 end
// nr2 sprawdz czy cały falc zakonczony, jeśli tak to zmień etap zamowienia na wydrukowane
 var sql = "SELECT * FROM artdruk.view_technologie_procesy_elementow where nazwa_id = 3 and technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
        if(result.every(x=> x.status == 4)){
        var sql = " update artdruk.zamowienia set etap = CASE WHEN etap < 10 THEN 10 ELSE etap END where id !=0 and technologia_id ="+ technologia_id 
        connection.query(sql, function (err, result) {
            if (err) console.log(err)
        });
            }
            if (err) console.log(err)
     });
// nr2 end


    }
//-----------
 if(wykonaniaElementu.every(x=>x.status == 4)){
 var sql = " update artdruk.technologie_elementy set status =4 where id ="+wykonanieRow.element_id+" and global_id !=0 and technologia_id ="+ wykonanieRow.technologia_id 
connection.query(sql, function (err, result) {
    if (err) console.log(err)
 });
    }
//-------------
         if(WSZYTKIE_WYKONANIA.every(x=>x.status == 4)){
 var sql = " update artdruk.technologie_grupy_wykonan_oprawa set status = CASE WHEN status = '1' THEN 2 ELSE status END where global_id !=0 and technologia_id ="+ wykonanieRow.technologia_id 
connection.query(sql, function (err, result) {
    if (err) console.log(err)
 });
    }
//-----------




    if (err) console.log(err)
  });





  
}



    let STATUSY = {1:"NIEDOSTĘPNE",2:"OCZEKUJĄCE",3:"W TRAKCIE",4:"ZAKOŃCZONE"}
    let data=[ID_SPRAWCY,nazwa,"Zmiana statusu wykonania ID:"+ id_wykonania+" z "+STATUSY[stary_status]+" na "+STATUSY[wykonanieRow.status],zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
           if (err) console.log(err);   })




    var sql = "commit"
connection.query(sql, function (err, result) {
    if (err) console.log(err)
        res.status(200).json("OK")  

 })

  
};

module.exports = {
  zakonczWykonanie,
};
