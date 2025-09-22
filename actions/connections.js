
const connection = require("./mysql");
const jwt = require("jsonwebtoken");
const { teraz } = require("./czas/teraz");
const { dodaj_minuty } = require("./czas/dodaj_minuty");
const { ACCESS_TOKEN } = require("./logowanie/ACCESS_TOKEN");
const dataStore = require('./uprawnienia/dataStore');
const { DecodeToken } = require("./logowanie/DecodeToken");
const { nazwaEtapPlikow } = require("./nazwy/nazwaEtapPlikow");
const { nazwaElementu } = require("./nazwy/nazwaElementu");
const { exec } = require('child_process');

class Connections {

    getUser(req,res){


        const login = req.params['login']
        const haslo = req.params['haslo']
    
        var sql = "select id,imie,nazwisko,login,haslo,zamowienie_przyjmij,zamowienie_skasuj,zamowienie_odblokuj,zamowienie_zapis,zamowienie_oddaj,klienci_wszyscy,klienci_zapis,klienci_usun,papier_zapis,papier_usun,procesy_edycja,zamowienia_wszystkie,technologie_wszystkie,technologia_zapis,harmonogram_przyjmij,wersja_max,mini_druk,mini_falc,mini_oprawa,mini_uv,mini_inne,manage_druk,manage_falc,manage_oprawa,manage_inne,procesor_domyslny,uprawnienia_ustaw,asystent1,asystent2,realizacje_dodaj,realizacje_usun,gant from artdruk.users where login =? and haslo = ?;";

        connection.execute(sql, [login,haslo], (err, result) => {
    
            if(err) return res.json({Status: "Error", Error: "Error in running query"})
            if(result.length >0 ){

                        const id = result[0].id;
                        const imie = result[0].imie;
                        const nazwisko = result[0].nazwisko;
                        const zamowienie_przyjmij = result[0].zamowienie_przyjmij;
                        const zamowienie_zapis = result[0].zamowienie_zapis;
                        const zamowienie_skasuj = result[0].zamowienie_skasuj;
                        const zamowienie_odblokuj = result[0].zamowienie_odblokuj;
                        const klienci_wszyscy = result[0].klienci_wszyscy;
                        const klienci_zapis = result[0].klienci_zapis;
                        const klienci_usun = result[0].klienci_usun;
                        const papier_zapis = result[0].papier_zapis;
                        const zamowienie_oddaj = result[0].zamowienie_oddaj;
                        const papier_usun = result[0].papier_usun;
                        const procesy_edycja = result[0].procesy_edycja;
                        const zamowienia_wszystkie = result[0].zamowienia_wszystkie;
                        const technologie_wszystkie = result[0].technologie_wszystkie;
                        const technologia_zapis = result[0].technologia_zapis;
                        const harmonogram_przyjmij = result[0].harmonogram_przyjmij;
                        const wersja_max = result[0].wersja_max;
                        const mini_druk = result[0].mini_druk;
                        const mini_falc = result[0].mini_falc;
                        const mini_oprawa = result[0].mini_oprawa;
                        const mini_uv = result[0].mini_uv;
                        const mini_inne = result[0].mini_inne;
                        const manage_druk = result[0].manage_druk;
                        const manage_falc = result[0].manage_falc;
                        const manage_oprawa = result[0].manage_oprawa;
                        const manage_inne = result[0].manage_inne;
                        const procesor_domyslny = result[0].procesor_domyslny;
                        const uprawnienia_ustaw = result[0].uprawnienia_ustaw;
                        const asystent1 = result[0].asystent1;
                        const asystent2 = result[0].asystent2;
                        const realizacje_dodaj = result[0].realizacje_dodaj;
                        const realizacje_usun = result[0].realizacje_usun;
                        const gant = result[0].gant;
                        
                        
            
                        

                        const paylod = {
                            id,
                            imie,
                            nazwisko,
                            login,
                            zamowienie_przyjmij,zamowienie_zapis,zamowienie_oddaj,zamowienie_odblokuj,
                            klienci_wszyscy,klienci_zapis,zamowienie_skasuj,klienci_usun,
                            papier_zapis,papier_usun,
                            procesy_edycja,
                            zamowienia_wszystkie,technologie_wszystkie,technologia_zapis,
                            harmonogram_przyjmij,wersja_max,mini_druk,mini_falc,mini_oprawa,mini_uv,mini_inne,manage_druk,manage_falc,manage_oprawa,manage_inne,procesor_domyslny,uprawnienia_ustaw,asystent1,asystent2,realizacje_dodaj,realizacje_usun,gant
                            
                        }
     
                              
           
               const token = jwt.sign(paylod, ACCESS_TOKEN, {expiresIn:'8h'});
            //    const token = jwt.sign(paylod, ACCESS_TOKEN, {expiresIn:'1m'});

                var sql =   "INSERT INTO artdruk.historia (user_id,user,kategoria) values (?,?,?); ";
               connection.query(sql, [id,imie+ " "+nazwisko,"Logowanie"],function (err, result) {            if (err) throw err;            })
    
                return res.status(200).json(token)
                
        
            } else {
                var sql =   "INSERT INTO artdruk.historia (user_id,user,kategoria,event) values (?,?,?,?); ";
               connection.execute(sql, [0,"","Logowanie",login+" "+haslo], (err, result) => {            if (err) throw err;            })

                return res.json({Status: "Error", Error: "Wrong Email or Password"})


            }
    }
   
    );
   
    }  

     isLogged(req,res){
        //  przed wywyłaniem tej fukncji sprawdzany jest verifyToken jako middleware w endpoincie
      //   const token = req.params['token']
      
      
       return res.json({Status: "Success"});
      }





    getPapieryParametry(req,res){
        let dane=[];
        //  const idZamowienia = req.params['idZamowienia']
         // const zamowienie_prime_id = req.params['zamowienie_prime_id']
 
         var sql = "begin";
         connection.query(sql, function (err, result) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         });
 
         var sql = "SELECT * FROM artdruk.view_papiery ;";
        
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
     
         });
 
         var sql = "SELECT * FROM artdruk.papiery_nazwy;";
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
         
         } );
 
         var sql = "SELECT * FROM artdruk.papiery_grupa;";
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
    
         } );
 
         var sql = "SELECT * FROM artdruk.papiery_postac;";
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
      
         } );
 
         var sql = "SELECT * FROM artdruk.papiery_rodzaj;";
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
 
         } );
 
         
         var sql = "SELECT * FROM artdruk.papiery_wykonczenia;";
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
         } );
 
         var sql = "SELECT * FROM artdruk.papiery_powleczenie;";
         connection.query(sql, function (err, doc) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         dane.push(doc)
         } );

 
         var sql = "commit";
         connection.query(sql, function (err, result) {
             if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
         console.log("Pobranie papierów oraz paramaterów");
         res.status(200).json(dane);
         });
 
     }
    //---
          //pobierz wszystkie objekty do TECHNOLOGI nr...
          getParametryTechnologii(req,res){
            let dane=[];

            //idTechnologii/:technologia_prime_id
             const idTechnologii = req.params['idTechnologii']
            //  const prime_id = req.params['prime_id']
            //  const technologia_prime_id = req.params['technologia_prime_id']


     
             var sql  = "select * from artdruk.view_technologie  where id = '" + idTechnologii + "'  ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             // res.status(200).json(dane);
         
             });
     
             var sql = "select * from artdruk.technologie_produkty where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.view_technologie_elementy where technologia_id = '" + idTechnologii + "' ORDER BY typ ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.technologie_fragmenty where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );



             var sql = "select * from artdruk.view_technologie_oprawa where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.view_technologie_procesy_elementow where technologia_id =  '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.technologie_legi where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.technologie_legi_fragmenty where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );
     
             var sql = "select * from artdruk.technologie_arkusze where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             // (select prime_id from  artdruk.technologie where id= '" + idTechnologii + "' ) = prime_id
             var sql = "select * from artdruk.view_technologie_grupy_wykonan where technologia_id =  '" + idTechnologii + "'  ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.view_technologie_wykonania where technologia_id =  '" + idTechnologii + "'  ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );


             var sql = "select * from artdruk.view_technologie_grupy_wykonan_oprawa where technologia_id =  '" + idTechnologii + "'  ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

                     var sql = "select * from artdruk.view_technologie_wykonania_oprawa where technologia_id =  '" + idTechnologii + "'  ORDER BY global_id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

                                  var sql = "select * from artdruk.view_technologie_realizacje where technologia_id =  '" + idTechnologii + "'  ORDER BY global_id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );
            //  var sql = "select * from artdruk.view_technologie_grupy_wykonan where technologia_id = '" + prime_id + "' ORDER BY id ASC";
            //  connection.query(sql, function (err, doc) {
            //  if (err) throw err;
            //  dane.push(doc)
            //  } );

            //  var sql = "select * from artdruk.view_technologie_wykonania where technologia_id = '" + prime_id + "' ORDER BY id ASC";
            //  connection.query(sql, function (err, doc) {
            //  if (err) throw err;
            //  dane.push(doc)
            //  } );

             

            var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("odczyt technologi OK");
            res.status(200).json(dane);
            });
     
         }
    //-----
                  getGrupyAll(req,res){
                    // uæywane do sprawdzenia na wersji mini czy w procesorze są jakieś wykonania i czy wyświetlić dany procesor

                let dane=[];
    
                //idTechnologii/:technologia_prime_id
                //  const idTechnologii = req.params['idTechnologii']
                //  const technologia_prime_id = req.params['technologia_prime_id']

                // typ_grupy < 3 oznacza grypy  nie z harmonogramu
    
                 var sql = "select * from artdruk.view_technologie_grupy_wykonan where status <4 and typ_grupy < 3 ORDER BY poczatek";
                 connection.query(sql, function (err, doc) {
                 if (err) throw err;
                 dane.push(doc)
                 } );
    

     var sql = "select * from artdruk.view_technologie_grupy_wykonan_oprawa where status <4 and typ_grupy < 3 ORDER BY poczatek";
                 connection.query(sql, function (err, doc) {
                 if (err) throw err;
                 dane.push(doc)
                 res.status(200).json(dane);
                 } );
    


         
             }

              //pobierz wszystkie objekty do TECHNOLOGI nr...
              getWykonania_i_grupyAll(req,res){
                let dane=[];
    
                //idTechnologii/:technologia_prime_id
                //  const idTechnologii = req.params['idTechnologii']
                //  const technologia_prime_id = req.params['technologia_prime_id']
    
    
                var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
         
                 var sql  = "select * from artdruk.view_technologie_wykonania  ORDER BY id ASC";
                 connection.query(sql, function (err, doc) {
                 if (err) throw err;
                 dane.push(doc)
                 // res.status(200).json(dane);
             
                 });
         
                 var sql = "select * from artdruk.view_technologie_grupy_wykonan  ORDER BY poczatek";
                 connection.query(sql, function (err, doc) {
                 if (err) throw err;
                 dane.push(doc)
                 } );
    
                var sql = "commit";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("odczyt technologi OK");
                res.status(200).json(dane);
                });
         
             }
        //-----

        getWykonania_i_grupy_for_procesor(req,res){
            let dane=[];

            //idTechnologii/:technologia_prime_id
             const procesor_id = req.params['procesor_id']
            //  const dniWstecz = req.params['dniWstecz']
            //  const technologia_prime_id = req.params['technologia_prime_id']


            var sql = "begin";
            connection.query(sql, function (err, result) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            });
     
             var sql  = "select * from artdruk.view_technologie_wykonania where procesor_id = '" + procesor_id + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
         
             });
     
             var sql = "select * from artdruk.view_technologie_grupy_wykonan where poczatek >  (select min(poczatek) - interval 1 day from artdruk.view_technologie_grupy_wykonan where status <4 and procesor_id = '" + procesor_id + "')  and procesor_id = '" + procesor_id + "' ORDER BY poczatek";
             connection.query(sql, function (err, doc) {
                if (err){ throw err } 
             dane.push(doc)
             } );

           
            var sql = "select   DATE_FORMAT(min(poczatek) - interval 1 day, '%Y-%m-%d') AS `dni` from artdruk.view_technologie_grupy_wykonan where status <4 and procesor_id = " + procesor_id ;
            // var sql = "select min(poczatek) - interval 1 day as dni from artdruk.view_technologie_grupy_wykonan where status <4 and procesor_id = " + procesor_id ;
             connection.query(sql, function (err, doc) {
                if (err){ throw err } 
             dane.push(doc)
             } );



            var sql = "commit";
            connection.query(sql, function (err, result) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            console.log("Get Grupy i Wykonania dla procesora "+ procesor_id);
            res.status(200).json(dane);
            });
     
         }
    //-----
            getWykonania_i_grupy_for_procesor_dni_wstecz(req,res){

                // tylko odświeżanie procesora po zmianie kalendarza
            let dane=[];

            //idTechnologii/:technologia_prime_id
             const procesor_id = req.params['procesor_id']
             const dniWstecz = req.params['dniWstecz']
            //  const technologia_prime_id = req.params['technologia_prime_id']


            var sql = "begin";
            connection.query(sql, function (err, result) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            });
     
             var sql  = "select * from artdruk.view_technologie_wykonania where procesor_id = '" + procesor_id + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
             // res.status(200).json(dane);
         
             });
     
             var sql = "select * from artdruk.view_technologie_grupy_wykonan where poczatek >  '"+dniWstecz+"'  and procesor_id = '" + procesor_id + "' ORDER BY poczatek";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
             } );

            var sql = "commit";
            connection.query(sql, function (err, result) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            console.log("Get Grupy i Wykonania dla procesora "+ procesor_id);
            res.status(200).json(dane);
            });
     
         }


         //-----
                     getWykonania_i_grupy_for_procesor_dni_wstecz_oprawa(req,res){

                // tylko odświeżanie procesora po zmianie kalendarza
            let dane=[];

            //idTechnologii/:technologia_prime_id
             const procesor_id = req.params['procesor_id']
             const dniWstecz = req.params['dniWstecz']
            //  const technologia_prime_id = req.params['technologia_prime_id']


            var sql = "begin";
            connection.query(sql, function (err, result) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            });
     
             var sql  = "select * from artdruk.view_technologie_wykonania where procesor_id = '" + procesor_id + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
             // res.status(200).json(dane);
         
             });
     
             var sql = "select * from artdruk.view_technologie_grupy_wykonan_oprawa where poczatek >  '"+dniWstecz+"'  and procesor_id = '" + procesor_id + "' ORDER BY poczatek";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
             } );

            var sql = "commit";
            connection.query(sql, function (err, result) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            console.log("Get Grupy i Wykonania dla procesora "+ procesor_id);
            res.status(200).json(dane);
            });
     
         }
    //--------

        getGrupy_oprawa_for_procesor(req,res){
            let dane=[];


             const procesor_id = req.params['procesor_id']
          



            //  var sql  = "select * from artdruk.view_technologie_wykonania where procesor_id = '" + procesor_id + "' ORDER BY id ASC";
            //  connection.query(sql, function (err, doc) {
            //     if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
            //  dane.push(doc)
            //  });
     
             var sql = "select * from artdruk.view_technologie_grupy_wykonan_oprawa where poczatek >  (select min(poczatek) - interval 1 day from artdruk.view_technologie_grupy_wykonan_oprawa where status <4 and procesor_id = '" + procesor_id + "')  and procesor_id = '" + procesor_id + "' ORDER BY poczatek";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
             } );

                      var sql = "select   DATE_FORMAT(min(poczatek) - interval 1 day, '%Y-%m-%d') AS `dni` from artdruk.view_technologie_grupy_wykonan_oprawa where status <4 and procesor_id = " + procesor_id ;
            // var sql = "select min(poczatek) - interval 1 day as dni from artdruk.view_technologie_grupy_wykonan where status <4 and procesor_id = " + procesor_id ;
             connection.query(sql, function (err, doc) {
                if (err){ throw err } 
             dane.push(doc)
             res.status(200).json(dane);

             } );



     
         }
    //----




    sprawdzCzyPapierUzyty(req,res){
        // spraawdza czy papier był użyty w trzech miejscach i zlicza je. 
        // jeśli był użyty to nie da się go skasować
        const papier_id = req.params['papier_id']
        let dane=[];

        var sql  = "select count(*) as ilosc from artdruk.technologie_arkusze  where papier_id= "+ papier_id ;
        connection.query(sql, function (err, doc) {
            dane.push(doc)
        if (err) throw err;
        });

        var sql  = "select count(*) as ilosc from artdruk.zamowienia_elementy  where papier_id= "+ papier_id ;
        connection.query(sql, function (err, doc) {
            dane.push(doc)

        if (err) throw err;
        });
        
        var sql  = "select count(*) as ilosc from artdruk.technologie_elementy  where papier_id= "+ papier_id ;
        connection.query(sql, function (err, doc) {
            dane.push(doc)
            //sumowanie ilosci
           dane =  dane.map(x => x[0].ilosc).reduce((a, b) => a + b, 0)

            
        if (err) throw err;
        res.status(200).json(dane);
        });



    }


    // pobie
    getTechnologie(req,res){
        const idzlecenia = req.params['idzlecenia']
        var sql  = "select * from artdruk.view_technologie  where final is null ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

        getGantGrupy(req,res){
        const idzlecenia = req.params['idzlecenia']
        // var sql  = "select * from artdruk.view_gant_grupy where status <4 and typ_grupy= 2  and (proces_nazwa_id = 1 or proces_nazwa_id = 1)  ORDER BY start ASC";
        var sql  = "select * from artdruk.view_gant_grupy where status <4 and typ_grupy= 2   ORDER BY start ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }



            getZamowieniaKalendarz(req,res){
            let dane=[];

             const procesor_id = req.params['procesor_id']

             var sql = "select * from artdruk.view_zamowienia_kalendarz ORDER BY data_spedycji";
             connection.query(sql, function (err, doc) {
                if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
             dane.push(doc)
             } );

                      var sql = "select   DATE_FORMAT(min(data_spedycji), '%Y-%m-%d') AS `data_spedycji_min`, DATE_FORMAT(max(data_spedycji), '%Y-%m-%d') AS `data_spedycji_max`,  DateDiff((select max(data_spedycji) FROM  artdruk.view_zamowienia_kalendarz),(select min(data_spedycji) FROM  artdruk.view_zamowienia_kalendarz)) AS ilosc_dni  from artdruk.view_zamowienia_kalendarz  ";
             connection.query(sql, function (err, doc) {
                if (err){ throw err } 
             dane.push(doc)
             res.status(200).json(dane);

             } );
     
         }






    getZamowieniaPliki(req,res){
        const orderby = req.params['orderby']
        var sql  = "select * from artdruk.view_zamowienia_pliki" ;
        // var sql  = "select * from artdruk.view_zamowienia_produkty_koszty ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    // getKlienci(req,res){
   
    //     var sql  = "select * from artdruk.view_klienci ORDER BY firma_nazwa ASC";
    //     connection.query(sql, function (err, doc) {
    //     if (err) throw err;
    //     res.status(200).json(doc);
    // });
    // }

    getProdukty(req,res){
   
        var sql  = "select * from artdruk.produkty ORDER BY id";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    getUsersM(req,res){
        // pobiera listę użytkowników  w App getUserList
        var sql  = "select * from artdruk.users ORDER BY Imie";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    // zapis w ModalInsert ( razem z zmaowienie - produkty - elementy - fragmenty itp)
    postProdukty(req,res){
        const zamowienie_id = req.body.zamowienie_id;
        const typ = req.body.typ;
        const nazwa = req.body.nazwa;
        const wersja = req.body.wersja;
        const ilosc_stron = req.body.ilosc_stron;
        const format_x = req.body.format_x;
        const format_y = req.body.format_y;
        const oprawa = req.body.oprawa;
        const naklad = req.body.naklad;
        const indeks = req.body.indeks;
        const uwagi = req.body.uwagi;
        var sql =   "INSERT INTO artdruk.zamowienia_produkty (nazwa,wersja,zamowienie_id,typ,uwagi,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) "+
        "values ('" + nazwa+ "','" + wersja + "','" + zamowienie_id + "','" + typ + "','" + uwagi + "','" + ilosc_stron + "','" + format_x + "','" + format_y + "','" + oprawa + "','" + naklad + "','" + indeks + "'); ";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);

    });}

    postKlient(req,res){
        const firma = req.body.firma;
        const firma_nazwa = req.body.firma_nazwa;
        const adres = req.body.adres;
        const kod = req.body.kod;
        const nip = req.body.nip;
        const opiekun_id = req.body.opiekun_id;
        const utworzyl_user_id = req.body.utworzyl_user_id;
        let deleted = 0

        let dane=[firma,firma_nazwa,adres,kod,nip,opiekun_id,utworzyl_user_id,deleted ]

        var sql =   "INSERT INTO artdruk.klienci (firma,firma_nazwa,adres,kod,nip,opiekun_id,utworzyl_user_id,deleted) "+
        "values (?,?,?,?,?,?,?,?); ";
        connection.execute(sql,dane, function (err, result) {
        if (err) throw err;
        // console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);

    });}


setOrderOpen(req,res){
    // sprawdza czy zamówienie jest już otwarte przez kogoś
    // dodaje token, id, i date do zamowienia aby zablokowac jego edytowanie

    const id = req.body.id;
    const token = req.body.token;
    const user = req.body.user;

    var sql  = "select * from artdruk.view_zamowienia_stan_otwarcia where id = '" + id+ "' ORDER BY id ASC ";
    connection.query(sql, function (err, doc) {
        console.log("user"+user)
//         console.log("Wartość doc[0].open_user_id:", doc[0].open_user_id);
// console.log("Typ doc[0].open_user_id:", typeof doc[0].open_user_id);
// console.log("Wartość id:", id);
// console.log("Typ id:", typeof id);
// console.log("Wynik porównania doc[0].open_user_id == id:", doc[0].open_user_id == id);
// console.log("Wartość doc[0].open_stan:", doc[0].open_stan);
// console.log("Wynik porównania doc[0].open_stan != 1:", doc[0].open_stan != 1);
        if (err) throw err;
        if(doc[0].open_user_id == user || doc[0].open_stan != 1  )
        {
                var sql = "update artdruk.zamowienia set open_token = '" + token+ "', open_user = '" + user+ "', open_data = now(), open_stan = 1 where id = " + id+ "";
                connection.query(sql, function (err, result) {
                if (err) throw err;
            
                res.status(200).json(
                    {stan:"OK",
                    user:doc[0].open_user,
                    data: doc[0].open_data
                    });
                    })
        }else{
            res.status(200).json({stan:"error",
            user:doc[0].open_user,
            data: doc[0].open_data});
        }
        });
}

setOrderClosed(req,res){
    // zmienia wartość open_stan na null przy zamknięciu zamówienia!
    const id = req.body.id || 1;
    // const token = req.body.token;
    // const user = req.body.user;
                
                var sql = "update artdruk.zamowienia set open_stan = null, open_data = null, open_user = null where id = " + id+ "";
                connection.query(sql, function (err, result) {
                if (err) throw err;
            
                res.status(200).json(
                    {stan:"closed"
                    });
        });
}

dragDropProcesGrup(req,res){

    const id_drag_grupa_proces = req.params['id_drag_grupa_proces']
    const id_drop_grupa_proces = req.params['id_drop_grupa_proces']

    
    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.drag("+ id_drag_grupa_proces +", "+ id_drop_grupa_proces +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

dragDropProcesGrupOprawa(req,res){

    const id_drag_grupa_proces = req.params['id_drag_grupa_proces']
    const id_drop_grupa_proces = req.params['id_drop_grupa_proces']

    
    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.drag_oprawa("+ id_drag_grupa_proces +", "+ id_drop_grupa_proces +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}



zakoncz_proces_elementu_uwolnij_nastepny(req,res){
console.log("tuuuuu")
    const technologia_id = req.body.technologia_id;
    const proces_id = req.body.proces_id;
    const element_id = req.body.element_id;
    const grupa_id = req.body.grupa_id;
    const status = req.body.status;
    const grupa_global_id = req.body.global_id;
    const zamowienie_id = req.body.zamowienie_id;
    const grupa_nazwa = req.body.grupa_nazwa;
    const stary_status = req.body.stary_status;
    let info="stop";
    
    

     let indeks_procesu;
     let global_id_procesu;
     let id_procesu;
     let grupyWykonan =[]
     let grupyAktualnegoProcesu = []

     let indeks_nastepnego_procesu;
     let id_nastepnego_procesu;

       const token = req.params['token']
       let ID_SPRAWCY =  DecodeToken(token).id;

 var sql = " update artdruk.technologie_grupy_wykonan set status ="+ status +" where global_id ="+grupa_global_id
connection.query(sql, function (err, result) {
    if (err) throw err
 });
 var sql = " update artdruk.technologie_wykonania set status ="+ status +" where technologia_id ="+technologia_id+" and global_id !=0 and grupa_id="+grupa_id
connection.query(sql, function (err, result) {
    if (err) throw err
 });
  
    
// indeks procesu
var sql = "select indeks,global_id,id from artdruk.technologie_procesy_elementow where technologia_id ="+ technologia_id +" and element_id ="+element_id+" and id ="+proces_id
connection.query(sql, function (err, result) {
indeks_procesu = result[0].indeks
indeks_nastepnego_procesu= parseInt(indeks_procesu)+1
global_id_procesu = result[0].global_id
id_procesu = result[0].id

    if (err) throw err
 });




 var sql = "SELECT * FROM artdruk.technologie_grupy_wykonan where technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
 // indeks.push(result[0].indeks)
 grupyWykonan = result
 grupyAktualnegoProcesu = [...result.filter(x=> x.proces_id == id_procesu )]

let max_status = Math.max(...grupyAktualnegoProcesu.map((f) => f.status))
 if(status !=4){
//  zmien status procesu na najwyzszy status grupy 
var sql = " update artdruk.technologie_procesy_elementow set status ="+ max_status +" where global_id ="+global_id_procesu
connection.query(sql, function (err, result) {
    if (err) throw err
 });
 

  }

  if(status ==4){  // status == 4 zakonczone
//  console.log("status:"+status)   
 
//     console.log("grupyAktualnegoProcesu:",grupyAktualnegoProcesu)
    if(grupyAktualnegoProcesu.every(x=>x.status == 4)){

var sql = " update artdruk.technologie_procesy_elementow set status =4 where global_id ="+global_id_procesu
connection.query(sql, function (err, result) {
    if (err) throw err
 });
//  console.log('id_nastepnego_procesu XX --'+result[0].id)
 var sql = "select id from artdruk.technologie_procesy_elementow where technologia_id ="+ technologia_id +" and (element_id ="+element_id+" and indeks ="+indeks_nastepnego_procesu+") and (status=1 or status is null)"
 connection.query(sql, function (err, result) {
// console.log('technologia_id XX --'+technologia_id)
// console.log('element_id XX --'+element_id)
// console.log('indeks_nastepnego_procesu XX --'+indeks_nastepnego_procesu)
// console.log('id_nastepnego_procesu XX --'+result[0]?.id)
// console.log('')

 id_nastepnego_procesu = result[0]?.id || 0

 console.log(" id_nastepnego_procesu: "+id_nastepnego_procesu)

        var sql =
        " update artdruk.technologie_procesy_elementow set status = 2 where technologia_id ="+ technologia_id +" and element_id ="+element_id+" and global_id !=0 and id ="+id_nastepnego_procesu
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });
        var sql =
        " update artdruk.technologie_grupy_wykonan set status = 2 where technologia_id ="+ technologia_id +" and element_id ="+element_id+" and global_id !=0 and proces_id ="+id_nastepnego_procesu
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });

        var sql =
        " update artdruk.technologie_wykonania set status = 2 where technologia_id ="+ technologia_id +" and element_id ="+element_id+" and global_id !=0 and proces_id ="+id_nastepnego_procesu
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });

     if (err) throw err
  });
    }


//--- zakoncz element jeśli to wszystkie grupy i uwolnij oprawe

//-----

 var sql = "SELECT * FROM artdruk.view_technologie_wykonania where technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
        if(result.every(x=>x.status == 4)){
        var sql = " update artdruk.technologie_grupy_wykonan_oprawa set status = CASE WHEN status = '1' THEN 2 ELSE status END where global_id !=0 and technologia_id ="+ technologia_id 
        connection.query(sql, function (err, result) {
            if (err) throw err
        });
            }
            if (err) throw err
     });



// nr1 sprawdz czy cały druk zakonczony, jeśli tak to zmień etap zamowienia na wydrukowane
 var sql = "SELECT * FROM artdruk.view_technologie_procesy_elementow where nazwa_id = 1 and technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
        if(result.every(x=> x.status == 4)){
        var sql = " update artdruk.zamowienia set etap = CASE WHEN etap < 8 THEN 8 ELSE etap END where id !=0 and technologia_id ="+ technologia_id 
        connection.query(sql, function (err, result) {
            if (err) throw err
        });
            }
            if (err) throw err
     });
// nr1 end
// nr2 sprawdz czy cały falc zakonczony, jeśli tak to zmień etap zamowienia na wydrukowane
 var sql = "SELECT * FROM artdruk.view_technologie_procesy_elementow where nazwa_id = 3 and technologia_id="+ technologia_id 
 connection.query(sql, function (err, result) {
        if(result.every(x=> x.status == 4)){
        var sql = " update artdruk.zamowienia set etap = CASE WHEN etap < 10 THEN 10 ELSE etap END where id !=0 and technologia_id ="+ technologia_id 
        connection.query(sql, function (err, result) {
            if (err) throw err
        });
            }
            if (err) throw err
     });
// nr2 end


  }

  if (err) throw err
  });

    let STATUSY = {1:"NIEDOSTĘPNE",2:"OCZEKUJĄCE",3:"W TRAKCIE",4:"ZAKOŃCZONE"}
    let data=[ID_SPRAWCY,grupa_nazwa,"Zmiana statusu grupy ID:"+ grupa_id+" z "+STATUSY[stary_status]+" na "+STATUSY[status],zamowienie_id]
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {    
           if (err) throw err; 
        info = "OK"
        })
              
           

 var sql = "commit";
 connection.query(sql, function (err, result) {
     if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 



     
//  res.status(200).json(indeks_procesu)  
 res.status(200).json(info)  
 });

 
}

zakoncz_oprawe(req,res){
// console.log("tuuuuu")
    const grupa_id = req.body.grupa_id;
    const status = req.body.status;
    const grupa_global_id = req.body.global_id;
    const stary_status = req.body.stary_status;
    const zamowienie_id = req.body.zamowienie_id;
    let info;

     let indeks_procesu;
const token = req.params['token']
       let ID_SPRAWCY =  DecodeToken(token).id;
 var sql = " update artdruk.technologie_grupy_wykonan_oprawa set status ="+ status +" where global_id ="+grupa_global_id
connection.query(sql, function (err, result) {
       info = "OK"

    if (err) throw err
 });

 
     let STATUSY = {1:"NIEDOSTĘPNE",2:"OCZEKUJĄCE",3:"W TRAKCIE",4:"ZAKOŃCZONE"}
     let data=[ID_SPRAWCY,"Oprawa","Zmiana statusu grupy ID:"+ grupa_id+" z "+STATUSY[stary_status]+" na "+STATUSY[status],zamowienie_id]
    //  console.log(data)
     var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) values (?,?,?,?); ";
    connection.execute(sql,data, function (err, result) {  
           if (err) throw err;   })

 var sql = "commit";
 connection.query(sql, function (err, result) {
     if (err){ connection.query("rollback ", function (err, result) {   }); res.status(203).json(err) } 
     
 res.json(info)  
 });

 
}

zmien_status_przerwy(req,res){

    const technologia_id = req.body.technologia_id;
    const proces_id = req.body.proces_id;
    const element_id = req.body.element_id;
    const grupa_id = req.body.grupa_id;
    const status = req.body.status;
    const grupa_global_id = req.body.global_id;


 var sql = " update artdruk.technologie_grupy_wykonan set status ="+ status +" where global_id ="+grupa_global_id
connection.query(sql, function (err, result) {
    if (err) throw err
 res.status(200).json("OK")  
 });

 
}






dragDropProcesGrupToProcesor(req,res){

    const id_drag_grupa_proces = req.params['id_drag_grupa_proces']
    const id = req.params['id']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.zmien_procesor("+ id_drag_grupa_proces +", "+ id +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateWykonaniaOrazGrupa(req,res){

    const global_id_grupa_wykonan = req.params['global_id_grupa_wykonan']
    const kolumna = req.params['kolumna']
    const wartosc = req.params['wartosc']


    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.update_wykonania_oraz_grupa("+ global_id_grupa_wykonan +", "+ kolumna +", "+ wartosc +") as technologia_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateWykonania(req,res){

    const global_id_wykonania = req.params['global_id_wykonania']
    const kolumna = req.params['kolumna']
    const wartosc = req.params['wartosc']


    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.update_wykonania("+ global_id_wykonania +", "+ kolumna +", "+ wartosc +") as technologia_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateWydzielWykonanieZgrupy(req,res){

    const global_id_wykonania = req.params['global_id_wykonania']
    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.wyodrebnij_wykonanie_do_nowej_grupy("+ global_id_wykonania +") as technologia_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}


updatePrzeniesWykonanieDoInnejGrupy(req,res){

    const global_id_wykonania = req.params['global_id_wykonania']
    const grupa_id_drop = req.params['grupa_id_drop']
    const ostatnie_wykonania = req.params['ostatnie_wykonania']
    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.przenies_wykonanie("+ global_id_wykonania +","+ grupa_id_drop +","+ ostatnie_wykonania +") as technologia_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateAddPrzerwa(req,res){

    const global_id_grupa = req.params['global_id_grupa']
    const czas = req.params['czas']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.add_przerwa("+ global_id_grupa +","+ czas +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateAddPrzerwaOprawa(req,res){

    const global_id_grupa = req.params['global_id_grupa']
    const czas = req.params['czas']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.add_przerwa_oprawa("+ global_id_grupa +","+ czas +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateDeletePrzerwa(req,res){

    const global_id_grupa = req.params['global_id_grupa']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.delete_przerwa("+ global_id_grupa +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

updateDeletePrzerwaOprawa(req,res){

    const global_id_grupa = req.params['global_id_grupa']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.delete_przerwa_oprawa("+ global_id_grupa +") as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

zmienCzasTrwaniaGrupy(req,res){

    const drop_grupa_global_id = req.params['drop_grupa_global_id']
    const nowy_koniec = req.params['nowy_koniec']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.zmien_czas_trwania_grupy("+ drop_grupa_global_id +",'"+ nowy_koniec +"') as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}
zmienCzasTrwaniaGrupyOprawa(req,res){

    const drop_grupa_global_id = req.params['drop_grupa_global_id']
    const nowy_koniec = req.params['nowy_koniec']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.zmien_czas_trwania_grupy_oprawa("+ drop_grupa_global_id +",'"+ nowy_koniec +"') as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

zmienCzasTrwaniaGrupyOprawaPrzerwa(req,res){

    const drop_grupa_global_id = req.params['drop_grupa_global_id']
    const nowy_koniec = req.params['nowy_koniec']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.zmien_czas_trwania_grupy_oprawa_przerwa("+ drop_grupa_global_id +",'"+ nowy_koniec +"') as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}


zmienCzasTrwaniaGrupyPrzerwa(req,res){

    const drop_grupa_global_id = req.params['drop_grupa_global_id']
    const nowy_koniec = req.params['nowy_koniec']

    // po zmianie kolejnosci funkcją drag zwracany jest id procesor drag
    var sql = "select artdruk.zmien_czas_trwania_grupy_przerwa("+ drop_grupa_global_id +",'"+ nowy_koniec +"') as procesor_id";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}


skasujTechnologie(req,res){

    const id_delete = req.params['id_delete']
    const zamowienie_id = req.params['zamowienie_id']
    const user_id = req.params['user_id']


    // kasowanie grupy wykonan wg global_id grupy
    var sql = "call artdruk.deletedforever_technologia("+ id_delete +","+ zamowienie_id +","+ user_id +") ";
    console.log(sql)
    connection.query(sql, function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}




skasujGrupe(req,res){

    const global_id_grupa = req.params['global_id_grupa']


    var sql = "select artdruk.delete_grupa_wykonan(?) as procesor_id_grupy";
    connection.execute(sql, [global_id_grupa],function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}


backup(req,res){

const scriptPath = './mb.sh';

exec(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Błąd podczas wykonywania skryptu: ${error.message}`);
      // Zwracamy błąd 500, jeśli coś poszło nie tak
      return res.status(500).json({ error: 'Failed to run script', details: stderr });
    }

    if (stderr) {
      console.warn(`Skrypt zwrócił ostrzeżenia: ${stderr}`);
    }

    console.log(`Skrypt zwrócił: ${stdout}`);
    // Zwracamy odpowiedź 200 z wynikiem działania skryptu
    res.status(200).json({ message: 'Script executed successfully', output: stdout });
  });


}


skasujGrupeOprawa(req,res){

    const global_id_grupa = req.params['global_id_grupa']


    // kasowanie grupy wykonan wg global_id grupy
    var sql = "select artdruk.delete_grupa_wykonan_oprawa(?) as procesor_id_grupy";
    console.log(sql)
    connection.execute(sql,  [global_id_grupa],function (err, result) {
       if (err) res.status(203).json(err)  
            res.status(200).json(result);
    });
}

deleteKlient(req,res){
    const id = req.body.id;

    var sql = "update artdruk.klienci set deleted = 1 where id = " + id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    // console.log("1 record delete ");
    res.status(201).json(result);
})
}

deleteZamowienie(req,res){

    //usun na zawsze
    const rowsToDelete = req.body.row


    for(let row of rowsToDelete){

        var sql =   "delete from artdruk.zamowienia where id = ?"
        connection.execute(sql,[row.id], function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_produkty  where global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_elementy where  global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_fragmenty where global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_koszty_dodatkowe where global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_oprawa where global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });
        var sql =   "delete from artdruk.zamowienia_pakowanie where global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });
        var sql =   "delete from artdruk.zamowienia_procesy_elementow where global_id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });
        var sql =   "delete from artdruk.zamowienia_historia where id !=0 and zamowienie_id = ?"
        connection.execute(sql, [row.id],function (err, result) {        if (err) console.log(err);          });


        }
console.log("Zlecenie skasowane! ");
res.status(201).json("OK");

}

odblokujZamowienie(req,res){

    //usun na zawsze
    const rowsToDelete = req.body.row

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) res.status(203).json(err)  });

    for(let row of rowsToDelete){
        var sql =   "update  artdruk.zamowienia set open_data = null, open_user = null, open_stan = null where id = '" + row.id + "'"
        // var sql =   "call unlock_zamowienie('" + row.id + "')
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        }


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Zlecenie odblokowane! ");
res.status(201).json(result);
});
}




updatePapiery(req,res){
    // rows.filter(x => x.update == true) 
    const rows = req.body
    var sql = "begin";
    connection.query(sql, function (err, result) {
    if (err) res.status(203).json(err)  });

    for(let row of rows.filter(x => x.update == true && x.insert != true) ){
        var sql =   "update  artdruk.papiery set  dodal = " + row.dodal+ ", zmienil = " + row.dodal+ ", grupa_id = " + row.grupa_id+ ", nazwa_id = " + row.nazwa_id+ ", gramatura = '" + row.gramatura+ "', bulk = '" + row.bulk+ "', info = '" + row.info+ "', wykonczenie_id = " + row.wykonczenie_id+ ", powleczenie_id = " + row.powleczenie_id+ " where id = '" + row.id + "'"
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err       }});
        }

        for(let row of rows.filter(x => x.insert == true) ){
            var sql =   "INSERT INTO artdruk.papiery (dodal,zmienil,grupa_id,nazwa_id,gramatura,bulk,info,wykonczenie_id,powleczenie_id) "+
            "values (" + row.dodal + "," + row.zmienil + "," + row.grupa_id + "," + row.nazwa_id + ",'" + row.gramatura + "','" + row.bulk + "','" + row.info + "'," + row.wykonczenie_id + "," + row.powleczenie_id + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err       }});
            }

            for(let row of rows.filter(x => x.delete == true) ){
                var sql =   "DELETE from artdruk.papiery where id=" + row.id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err        }});
                }



    var sql = "commit";
    connection.query(sql, function (err, result) {
        if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err) } 

res.status(201).json(result);

});
}

updatePapieryNazwy(req,res){
    // rows.filter(x => x.update == true) 
    const rows = req.body
    var sql = "begin";
    connection.query(sql, function (err, result) {
    if (err) res.status(203).json(err)  });

    for(let row of rows.filter(x => x.update == true && x.insert != true) ){
        var sql =   "update  artdruk.papiery_nazwy set  nazwa = '" + row.nazwa+ "', grupa_id = " + row.grupa_id+ ", powleczenie_id = " + row.powleczenie_id+ " where id = '" + row.id + "'"
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err     }});
        }

        for(let row of rows.filter(x => x.insert == true) ){
            var sql =   "INSERT INTO artdruk.papiery_nazwy (nazwa,grupa_id,powleczenie_id) value ('" + row.nazwa + "'," + row.grupa_id + "," + row.powleczenie_id + "); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });  throw err       }});
            }

            for(let row of rows.filter(x => x.delete == true) ){
                var sql =   "DELETE from artdruk.papiery_nazwy where id=" + row.id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err          }});
                }



    var sql = "commit";
    connection.query(sql, function (err, result) {
        if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err) } 

res.status(201).json(result);

});
}


updatePapieryGrupa(req,res){
    // rows.filter(x => x.update == true) 
    const rows = req.body
    var sql = "begin";
    connection.query(sql, function (err, result) {
    if (err) res.status(203).json(err)  });

    for(let row of rows.filter(x => x.update == true && x.insert != true) ){
        var sql =   "update  artdruk.papiery_grupa set  grupa = '" + row.grupa+ "' where id = '" + row.id + "'"
        connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });   throw err        }});
        }

        for(let row of rows.filter(x => x.insert == true) ){
            var sql =   "INSERT INTO artdruk.papiery_grupa (grupa) value ('" + row.grupa + "'); ";
            connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });  throw err        }});
            }

            for(let row of rows.filter(x => x.delete == true) ){
                var sql =   "DELETE from artdruk.papiery_grupa where id=" + row.id;
                connection.query(sql, function (err, result) {       if (err){connection.query("rollback ", function (err, result) {   });  throw err         }});
                }



    var sql = "commit";
    connection.query(sql, function (err, result) {
        if (err){connection.query("rollback ", function (err, result) {   });   res.status(203).json(err) } 

res.status(201).json(result);

});
}




updateKlient(req,res){
    const id = req.body.id;
    const firma= req.body.firma;
    const firma_nazwa= req.body.firma_nazwa;
    const adres= req.body.adres;
    const kod= req.body.kod;
    const nip= req.body.nip;
    const opiekun_id= req.body.opiekun_id;

    let dane=[firma,firma_nazwa,adres,kod,nip,opiekun_id,id ]

    var sql = "update artdruk.klienci set firma =?, firma_nazwa =?, adres =?, kod =?, nip =?, opiekun_id =? where id =?";
    connection.execute(sql,dane, function (err, result) {
    if (err) throw err;
    res.status(200).json(result);
})
}




updateHistoria(req,res){
    const kategoria = req.body.kategoria;
    const event = req.body.event;
    const zamowienie_id= req.body.zamowienie_id;
    const user_id= req.body.user_id;
    var sql =   "INSERT INTO artdruk.zamowienia_historia (user_id,kategoria,event,zamowienie_id) "+
    "values (" + user_id+ ",'" + kategoria + "','" + event + "'," + zamowienie_id+ "); ";
    connection.query(sql, function (err, result) {    
           if (err) throw err;   
               res.status(200).json(result);   
        });
}


updateWydaniePapieru_status(req,res){
    const global_id_grupa = req.body.global_id_grupa;
    const status = req.body.status;

 var sql = "update artdruk.technologie_wydanie_papieru set status = " + status+ " where global_id !=0 and global_id_grupa = '" + global_id_grupa+ "' ";

    connection.query(sql, function (err, result) {    
           if (err) throw err;   
               res.status(200).json(result);   
        });
}

insertWydaniePapieru_status(req,res){
    const global_id_grupa = req.body.global_id_grupa;
    const status = req.body.status;

  var sql =   "INSERT INTO artdruk.technologie_wydanie_papieru (global_id_grupa,status) "+
        "values ('" + global_id_grupa+ "','" + status + "'); ";
       

    connection.query(sql, function (err, result) {    
           if (err) throw err;   
               res.status(200).json(result);   
        });
}
insertWydaniePapieru_status_multiselect(req,res){
 
    const grupyWykonanSelect = req.body;

                // tutaj insert
           for( let grupa of grupyWykonanSelect.filter(x=> x.wydanie_papieru_status == null)){
           
                    var sql =   "INSERT INTO artdruk.technologie_wydanie_papieru (global_id_grupa,status) "+
                    "values ('" + grupa.global_id+ "',3); ";
                
                        connection.query(sql, function (err, result) {    
                    if (err) throw err;   
                    });


           }


           // tutaj update
                      for( let grupa of grupyWykonanSelect.filter(x=> x.wydanie_papieru_status != null)){

        var sql = "update artdruk.technologie_wydanie_papieru set status = 3 where global_id !=0 and global_id_grupa = '" + grupa.global_id+ "' ";

    connection.query(sql, function (err, result) {    
           if (err) throw err;   
        });

           }

               res.status(200).json("OK");   


}


    // zapis w ModalInsert ( razem z zmaowienie - produkty - elementy - fragmenty itp)
    postFragmenty(req,res){
        const naklad = req.body.naklad;
        const info = req.body.info;
        const zamowienie_id = req.body.zamowienie_id;
        const element_id = req.body.element_id;
        const produkt_id = req.body.produkt_id;
        const data_przyjecia = req.body.data_przyjecia;
        const oprawa_id = req.body.oprawa_id;
        const typ = req.body.typ;
        const indeks = req.body.indeks;
        const wersja = req.body.wersja;
        const ilosc_stron = req.body.ilosc_stron;


        var sql =   "INSERT INTO artdruk.zamowienia_fragmenty(zamowienie_id,produkt_id,element_id,info,naklad,oprawa_id,typ,indeks,wersja,ilosc_stron) "+
        "values ('" + zamowienie_id+ "','" + produkt_id + "','" + element_id + "','" + info + "','" + naklad + "','" + oprawa_id + "','" + typ + "','" + indeks + "','" + wersja + "','" + ilosc_stron + "'); ";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        res.status(201).json(result);

    });}

    // zapis w ModalInsert ( razem z zmaowienie - produkty - elementy - fragmenty itp)
    postElementy(req,res){
        const nazwa = req.body.nazwa;
        const typ = req.body.typ;
        const zamowienie_id = req.body.zamowienie_id;
        const produkt_id = req.body.produkt_id;
        const naklad = req.body.naklad;
        const papier_id = req.body.papier_id;
        const gramatura_id = req.body.gramatura_id;
        const ilosc_stron = req.body.strony;
        const format_x = req.body.format_x;
        const format_y = req.body.format_y;
        const uwagi = req.body.uwagi;
        const papier_info = req.body.papier_info;
        const indeks = req.body.indeks;


        var sql =   "INSERT INTO artdruk.zamowienia_elementy(zamowienie_id,produkt_id,nazwa,typ,naklad,papier_id,gramatura_id,ilosc_stron,format_x,format_y,uwagi,papier_info,indeks) "+
        "values ('" + zamowienie_id+ "','" + produkt_id + "','" + nazwa + "','" + typ + "','" + naklad + "','" + papier_id + "','" + gramatura_id + "','" + ilosc_stron + "','" + format_x + "','" + format_y + "','" + uwagi + "','" + papier_info + "','" + indeks + "'); ";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);

    });}









    postPakowanie(req,res){
        const zamowienie_id = req.body.zamowienie_id;
        const produkt_id = req.body.produkt_id;
        const nazwa = req.body.nazwa;
        const naklad = req.body.naklad;
        const uwagi = req.body.uwagi;
        const rodzaj_pakowania = req.body.rodzaj_pakowania;
        const sztuki_w_paczce = req.body.sztuki_w_paczce;
        const indeks = req.body.indeks;

        var sql =   "INSERT INTO artdruk.zamowienia_pakowanie(zamowienie_id,produkt_id,nazwa,naklad,uwagi,sztuki_w_paczce,rodzaj_pakowania,indeks) "+
        "values ('" + zamowienie_id+ "','" + produkt_id + "','" + nazwa + "','" + naklad + "','" + uwagi + "','" + sztuki_w_paczce + "','" + rodzaj_pakowania + "','" + indeks + "'); ";
        connection.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(400).json(err);

        };
        // console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);

    });}
    postKoszty(req,res){
        // zajmuje dodatkowe id przy dodawaniu nowego kosztu na froncie - taka atrapa


        var sql =   "INSERT INTO artdruk.koszty_dodatkowe(info) "+
        "values ('atrapa'); ";
        connection.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(400).json(err);
        };
        res.status(201).json(result);

    });}

    postKosztyDodatkoweZamowienia(req,res){
        // dodanie kosztow do zamówienia - guzik " Dodaj koszty dodatkowe"
        const status = req.body.status;
        const zamowienia_id = req.body.zamowienie_id;
        const zamowienie_prime_id = req.body.zamowienie_prime_id;

        var sql =   "INSERT INTO artdruk.zamowienia_koszty_dodatkowe(status,zamowienie_id,zamowienie_prime_id) "+
        "values ('" + status+ "','" + zamowienia_id + "','" + zamowienie_prime_id + "'); ";
        connection.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(400).json(err);
        };
        res.status(201).json(result);

    });}


        updateSetOrderNotFinal(req,res){
            // przy zapisie zamowienia zmiana final z 1 na 0, final = 1 to najnowsza wersja zamowienia, 0 to poprzednie wersje
            const zamowienie_id = req.body.zamowienie_id;


            var sql = "update artdruk.zamowienia set final = 0 where id = '" + zamowienie_id+ "' ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            res.status(201).json(result);
            });
        }

        updateSetOrderToDeleted(req,res){
            
            // zmiana final na 2 oznacza ukrycie zamowienia w kosztu - czyli skasowanie z możliwością przywrócenias

            const rowsToDelete = req.body.rowsToDelete


            var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) res.status(203).json(err)  });
        
            for(let row of rowsToDelete){

                var sql = "update artdruk.zamowienia set final = 2 where id = '" + row.id+ "' ";
                connection.query(sql, function (err, result) {        if (err) console.log(err);          });
        
                }
        
        
            var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Przeniesione do kosza! ");
        res.status(201).json(result);
        });

        }

//------------------------------------------------
        zapisKosztowDodatkowych(req,res){
// * zapis kosztów dodatkowych:
//     - update koszty_dodatkowe set final= 0 where zamowienie_prime_id = X 
//     - insert wszystko z przesłanej tablicy koszty_dodatkowe
//     - update kosztyDodatkoweZamowienia


             const kosztyDodatkoweTemporary = req.body.kosztyDodatkoweTemporary;
            const kosztyDodatkoweZamowienia = req.body.kosztyDodatkoweZamowienia;

    
            var sql = "start transaction";
                    connection.query(sql, function (err, result) {
                    if (err) throw err;
                    });
            // console.log("zapis ok"+req.body.kosztyDodatkoweZamowienia[0].suma)
                    var sql = "update artdruk.koszty_dodatkowe set final= 0 where zamowienie_prime_id="+kosztyDodatkoweZamowienia[0].zamowienie_prime_id;
                    connection.query(sql, function (err, result) {
                    if (err) throw err;
                    });
    
                    for(let koszt of kosztyDodatkoweTemporary){
                    var sql =   "INSERT INTO artdruk.koszty_dodatkowe(indeks,nazwa,ilosc,cena,suma,info,zamowienia_koszty_id,autor_id,zamowienie_prime_id,final) "+
                    "values ('" + koszt.indeks+ "','" + koszt.nazwa + "','" + koszt.ilosc + "','" + koszt.cena + "','" + koszt.suma + "','" + koszt.info + "','" + koszt.zamowienia_koszty_id + "','" + koszt.autor_id + "','" + koszt.zamowienie_prime_id + "',1); ";
                    connection.query(sql, function (err, result) {
                    if (err) console.log(err);
              
                    });
                    }

                    var sql = "update artdruk.zamowienia_koszty_dodatkowe set suma= '" + kosztyDodatkoweZamowienia[0].suma + "' where id="+kosztyDodatkoweZamowienia[0].id;
                    connection.query(sql, function (err, result) {
                    if (err) throw err;
                    });
         
    
    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    // console.log("1 record update ");
      res.status(201).json(result);
    });
    
    
    }

//-----------
zapisKosztowDodatkowychZamowienia(req,res){
    // zapis zmiany status kosztow dodatkowych zmaówienia
    
                const id = req.body.id;
                const value = req.body.value;
    
                        var sql = "update artdruk.zamowienia_koszty_dodatkowe set status= '" + value + "' where id="+id;
                        connection.query(sql, function (err, result) {
                        if (err) throw err;
                        res.status(201).json(result);
                        });
             
        

        
        }


    getNadkomplety(req,res){
        var sql = "SELECT * FROM artdruk.nadkomplety;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getListaPapierow(req,res){
        var sql = "SELECT * FROM artdruk.view_papiery ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}
    getListaPapierowNazwy(req,res){
        var sql = "SELECT * FROM artdruk.papiery_nazwy;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getListaPapierowGrupa(req,res){
        var sql = "SELECT * FROM artdruk.papiery_grupa;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getListaPapierowPostac(req,res){
        var sql = "SELECT * FROM artdruk.papiery_postac;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}
    getListaPapierowRodzaj(req,res){
        var sql = "SELECT * FROM artdruk.papiery_rodzaj;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}

    getListaPapierowWykonczenia(req,res){
        var sql = "SELECT * FROM artdruk.papiery_wykonczenia;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}

    getListaPapierowPowleczenie(req,res){
        var sql = "SELECT * FROM artdruk.papiery_powleczenie;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}

    getListaProcesow(req,res){
        var sql = "SELECT * FROM artdruk.view_procesy ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}
    getListaProcesowNazwa(req,res){
        var sql = "SELECT id,nazwa FROM artdruk.procesy_nazwa ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getProcesyElementow(req,res){
        var sql = "SELECT artdruk.zamowienia_procesy.id,zamowienie_id,produkt_id,element_id,proces_id,front, front_info,back,back_info, uwagi,artdruk.lista_procesow.proces,artdruk.lista_procesow.typ,artdruk.lista_procesow.rodzaj FROM artdruk.zamowienia_procesy INNER JOIN artdruk.lista_procesow ON zamowienia_procesy.proces_id = lista_procesow.id ORDER BY id ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getProcesory(req,res){
        var sql = "SELECT * from artdruk.procesory ORDER BY indeks ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}




}

module.exports = new Connections();