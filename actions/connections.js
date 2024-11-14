
const connection = require("./mysql");
const { get } = require("./routes");


class Bank{
    
      
    constructor(s){
       this.zamowienie_id = s; 
    }
    setId({x}){
        zamowienie_id = x;
    }
    getId(){
        return zamowienie_id
    }
}

class Connections {

    // getZamowienia(req,res){
    //     const idzlecenia = req.params['idzlecenia']
    //     var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3')  ORDER BY Typ ASC";
    //     connection.query(sql, function (err, doc) {
    //     if (err) throw err;
    //     res.status(200).json(doc);
    // });
    // }

      //pobierz wszystkie objekty do zamówienia nr...
      getParametry(req,res){
       let dane=[];
        const idZamowienia = req.params['idZamowienia']
        const zamowienie_prime_id = req.params['zamowienie_prime_id']

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

        var sql  = "select * from artdruk.view_zamowienia_kopia where id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
        // res.status(200).json(dane);
    
        });

        var sql = "select * from artdruk.zamowienia_produkty where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
        
        } );

        var sql = "select * from artdruk.zamowienia_elementy where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
   
        } );

        var sql = "select * from artdruk.zamowienia_fragmenty where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
     
        } );

        var sql = "select * from artdruk.view_zamowienia_oprawa where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)

        } );

        var sql = "select * from artdruk.zamowienia_pakowanie where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
        // res.status(200).json(dane);
        } );

        var sql = "select * from artdruk.view_zamowienia_procesy_elementow where zamowienie_id = '" + idZamowienia + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
        } );

        var sql = "select * from artdruk.view_zamowienia_koszty_dodatkowe where zamowienie_prime_id = '" + zamowienie_prime_id + "' ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)

        } );

        var sql = "select * from artdruk.koszty_dodatkowe where zamowienie_prime_id = '" + zamowienie_prime_id + "' and final = 1 ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        dane.push(doc)
        // res.status(200).json(dane);
        } );

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("get OK");
        res.status(200).json(dane);
        });

    }
    //---
          //pobierz wszystkie objekty do TECHNOLOGI nr...
          getParametryTechnologii(req,res){
            let dane=[];

            //idTechnologii/:technologia_prime_id
             const idTechnologii = req.params['idTechnologii']
            //  const technologia_prime_id = req.params['technologia_prime_id']


            var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });
     
             var sql  = "select * from artdruk.view_technologie where id = '" + idTechnologii + "' ORDER BY id ASC";
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

             var sql = "select * from artdruk.technologie_elementy where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
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

             var sql = "select * from artdruk.technologie_procesy_elementow where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
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

             var sql = "select * from artdruk.view_technologie_grupy_wykonan where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
             connection.query(sql, function (err, doc) {
             if (err) throw err;
             dane.push(doc)
             } );

             var sql = "select * from artdruk.view_technologie_wykonania where technologia_id = '" + idTechnologii + "' ORDER BY id ASC";
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
         
                 var sql = "select * from artdruk.view_technologie_grupy_wykonan  ORDER BY id ASC";
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

    // pobie
    getTechnologie(req,res){
        const idzlecenia = req.params['idzlecenia']
        var sql  = "select * from artdruk.view_technologie ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    //pobierz zamowienia do głownego widoku
    getZamowienia(req,res){
        const idzlecenia = req.params['idzlecenia']
        var sql  = "select * from artdruk.view_zamowienia_produkty_koszty ORDER BY id ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }
    getKlienci(req,res){
   
        var sql  = "select * from artdruk.view_klienci ORDER BY firma ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }
    getOprawy(req,res){
   
        var sql  = "select * from artdruk.oprawy ORDER BY id";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }
    getProdukty(req,res){
   
        var sql  = "select * from artdruk.produkty ORDER BY id";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });
    }

    getUsersM(req,res){
        // pobiera listę użytkowników  w App getUserList
        var sql  = "select * from artdruk.users ORDER BY id ASC";
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
        const adres = req.body.adres;
        const kod = req.body.kod;
        const nip = req.body.nip;
        const opiekun_id = req.body.opiekun_id;
        const utworzyl_user_id = req.body.utworzyl_user_id;

        var sql =   "INSERT INTO artdruk.klienci (firma,adres,kod,nip,opiekun_id,utworzyl_user_id,deleted) "+
        "values ('" + firma+ "','" + adres + "','" + kod + "','" + nip + "','" + opiekun_id + "','" + utworzyl_user_id + "',0); ";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);

    });}

;

setOrderOpen(req,res){
    // sprawdza czy zamówienie jest już otwarte przez kogoś
    // dodaje token, id, i date do zamowienia aby zablokowac jego edytowanie

    const id = req.body.id;
    const token = req.body.token;
    const user = req.body.user;

    var sql  = "select * from artdruk.view_zamowienia where id = '" + id+ "' ORDER BY id ASC ";
    connection.query(sql, function (err, doc) {

        if (err) throw err;
        if(doc[0].open_stan != 1)
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
    const id = req.body.id;
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


deleteKlient(req,res){
    const id = req.body.id;

    var sql = "update artdruk.klienci set deleted = 1 where id = " + id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    // console.log("1 record delete ");
    res.status(200).json(result);
})
}

deleteZamowienie(req,res){

    //usun na zawsze
    const rowsToDelete = req.body.row


    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

    for(let row of rowsToDelete){

        var sql =   "delete from artdruk.zamowienia where id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_produkty where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_elementy where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_fragmenty where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_koszty_dodatkowe where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        var sql =   "delete from artdruk.zamowienia_oprawa where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });
        var sql =   "delete from artdruk.zamowienia_pakowanie where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });
        var sql =   "delete from artdruk.zamowienia_procesy_elementow where zamowienie_id = '" + row.id + "'"
        connection.query(sql, function (err, result) {        if (err) console.log(err);          });

        }


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Zlecenie skasowane! ");
res.status(201).json(result);
});
}

updateKlient(req,res){
    const id = req.body.id;
    const firma= req.body.firma;
    const adres= req.body.adres;
    const kod= req.body.kod;
    const nip= req.body.nip;
    const opiekun_id= req.body.opiekun_id;

    var sql = "update artdruk.klienci set firma = '" + firma+ "', adres = '" + adres+ "', kod = '" + kod+ "', nip = '" + nip+ "', opiekun_id = " + opiekun_id+ " where id = " + id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    // console.log("1 record delete ");
    res.status(200).json(result);
})
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

    postProcesyElementow(req,res){
        const zamowienie_id = req.body.zamowienie_id;
        const produkt_id = req.body.produkt_id;
        const element_id = req.body.element_id;
        const proces_id = req.body.proces_id;
        const nazwa_id = req.body.nazwa_id;

        const front_ilosc = req.body.front_ilosc;
        const back_ilosc = req.body.back_ilosc;
        const front_kolor = req.body.front_kolor;
        const back_kolor = req.body.back_kolor;
        const info = req.body.info;
        const indeks = req.body.indeks;

        var sql =   "INSERT INTO artdruk.zamowienia_procesy_elementow(zamowienie_id,produkt_id,element_id,proces_id,nazwa_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,indeks) "+
        "values ('" + zamowienie_id+ "','" + produkt_id + "','" + element_id + "','" + proces_id + "','" + nazwa_id + "','" + front_ilosc + "','" + back_ilosc + "','" + front_kolor + "','" + back_kolor + "','" + info + "','" + indeks + "'); ";
        connection.query(sql, function (err, result) {
        if (err) {
            console.log(err)
            res.status(400).json(err);

        };
        // console.log(" 1 record inserted "+result.insertId);
        res.status(201).json(result);

    });}

//--

postZamowienieNew(req,res){

    let odpowiedz =[]
    let daneZamowienia = req.body[0]
    let produkty = req.body[1]
    let elementy = req.body[2]
    let fragmenty = req.body[3]
    let oprawa = req.body[4]
    let pakowanie = req.body[5]
    let procesyElementow = req.body[6]

   

// console.log("Dane zamowienia: ", daneZamowienia.id )
// console.log("Produkty: ", produkty)


var sql = "begin";
connection.query(sql, function (err, result) {
if (err) throw err;  });



            if(daneZamowienia.prime_id != 1){  // jeżlie 1 to pierwszy zapis więc nadaj prime
                var sql = "update artdruk.zamowienia  set final = 0 where prime_id = '" + daneZamowienia.prime_id +"'";
                connection.query(sql, function (err, result) {
                    if (err){

                        connection.query("rollback ", function (err, result) {   });
                    
                            throw err;
                          } 
                });
                // daneZamowienia.prime_id = result.insertId;
            }else{

            }

    var sql =   "INSERT INTO artdruk.zamowienia (prime_id,nr,rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,final,rodzaj,waluta_id,vat_id,przedplata,cena,termin_platnosci,fsc) "+
    "values ('" + daneZamowienia.prime_id + "','" + daneZamowienia.nr + "','" + daneZamowienia.rok + "','" + daneZamowienia.firma_id+ "','" + daneZamowienia.klient_id + "','" + daneZamowienia.tytul + "','" + daneZamowienia.data_przyjecia + "','" + daneZamowienia.data_materialow + "','" + daneZamowienia.data_spedycji + "','" + daneZamowienia.opiekun_id + "','" + daneZamowienia.user + "','" + daneZamowienia.stan + "','" + daneZamowienia.status + "','" + daneZamowienia.uwagi + "','" + daneZamowienia.final + "','" + daneZamowienia.rodzaj + "','" + daneZamowienia.waluta_id + "','" + daneZamowienia.vat_id + "','" + daneZamowienia.przedplata + "','" + daneZamowienia.cena + "','" + daneZamowienia.termin_platnosci + "','" + daneZamowienia.fsc + "'); ";
    connection.query(sql, function (err, result) {

            if(daneZamowienia.id == 1){  // jeżlie 1 to pierwszy zapis więc nadaj prime
                var sql = "update artdruk.zamowienia  set prime_id = '" + result.insertId+ "' where id = '" + result.insertId+"'";
                connection.query(sql, function (err, result) {
                    if (err){

                        connection.query("rollback ", function (err, result) {   });
                    
                            throw err;
                          } 
                });
                daneZamowienia.prime_id = result.insertId;
            }else{

            }




            // do produktu przypisuję opiekuna ze zlecenia
            console.log("1")
            produkty = produkty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            elementy = elementy.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            fragmenty = fragmenty.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            oprawa = oprawa.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            pakowanie = pakowanie.map((obj) => {return{...obj, zamowienie_id:result.insertId} })
            procesyElementow = procesyElementow.map((obj) => {return{...obj, zamowienie_id:result.insertId} })

            daneZamowienia.id = result.insertId;
            // odpowiedz = [result,daneZamowienia,produkty,elementy,fragmenty,oprawa,pakowanie,procesyElementow]


            console.log("2")
for (let produkt of produkty) {
    var sql =
      "INSERT INTO artdruk.zamowienia_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) " +
      "values ('" +
      produkt.id +  "','" +
      produkt.zamowienie_id +        "','" +
      produkt.nazwa +        "','" +
      produkt.wersja +        "','" +
      produkt.opiekun_zamowienia_id +        "','" +
      produkt.uwagi +        "','" +
      produkt.stan +        "','" +
      produkt.status +        "','" +
      produkt.typ +        "','" +
      produkt.ilosc_stron +        "','" +
      produkt.format_x +        "','" +
      produkt.format_y +        "','" +
      produkt.oprawa +        "','" +
      produkt.naklad +        "','" +
      produkt.indeks +        "'); ";
    connection.query(sql, function (err, result) {
        if (err){

            connection.query("rollback ", function (err, result) {   });
        
                throw err;
              } 
    });
  }

  console.log("3")
  for (let element of elementy) {
    var sql =
      "INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,gramatura_id,naklad,info,uwagi,stan,status,tytul,papier_info,indeks) " +
      "values ('" +
      element.id +  "','" +
      element.zamowienie_id +        "','" +
      element.produkt_id +        "','" +
      element.nazwa +        "','" +
      element.typ +        "','" +
      element.ilosc_stron +        "','" +
      element.kolory +        "','" +
      element.format_x +        "','" +
      element.format_y +        "','" +
      element.papier_id +        "','" +
      element.gramatura_id +        "','" +
      element.naklad +        "','" +
      element.info +        "','" +
      element.uwagi +        "','" +
      element.stan +        "','" +
      element.status +        "','" +
      element.tytul +        "','" +
      element.papier_info +        "','" +
      element.indeks +        "'); ";
    connection.query(sql, function (err, result) {
        if (err){

            connection.query("rollback ", function (err, result) {   });
        
                throw err;
              } 
    });
  }

  console.log("4")
  for (let fragment of fragmenty) {
    var sql =
      "INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) " +
      "values ('" +
      fragment.id +  "','" +
      fragment.zamowienie_id +        "','" +
      fragment.produkt_id +        "','" +
      fragment.element_id +        "','" +
      fragment.oprawa_id +        "','" +
      fragment.naklad +        "','" +
      fragment.ilosc_stron +        "','" +
      fragment.wersja +        "','" +
      fragment.info +        "','" +
      fragment.typ +        "','" +
      fragment.indeks +        "'); ";
    connection.query(sql, function (err, result) {
        if (err){

            connection.query("rollback ", function (err, result) {   });
        
                throw err;
              } 
    });
  }

  console.log("5")
  for (let opr of oprawa) {
    var sql =
      "INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) " +
      "values ('" +
      opr.id +  "','" +
      opr.zamowienie_id +        "','" +
      opr.produkt_id +        "','" +
      opr.oprawa +        "','" +
      opr.naklad +        "','" +
      opr.bok_oprawy +        "','" +
      opr.data_spedycji +        "','" +
      opr.uwagi +        "','" +
      opr.wersja +        "','" +
      opr.data_czystodrukow +        "','" +
      opr.indeks +        "'); ";
    connection.query(sql, function (err, result) {
      if (err){

    connection.query("rollback ", function (err, result) {   });

        throw err;
      } 


    });
  }


  console.log("6")
  for (let procesy of procesyElementow) {
    var sql =
      "INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) " +
      "values ('" +
      procesy.id +  "','" +
      procesy.zamowienie_id +        "','" +
      procesy.produkt_id +        "','" +
      procesy.element_id +        "','" +
      procesy.proces_id +        "','" +
      procesy.front_ilosc +        "','" +
      procesy.back_ilosc +        "','" +
      procesy.front_kolor +        "','" +
      procesy.back_kolor +        "','" +
      procesy.info +        "','" +
      procesy.nazwa_id +        "','" +
      procesy.indeks +        "'); ";
    connection.query(sql, function (err, result) {
      if (err){

    connection.query("rollback ", function (err, result) {   });

        throw err;
      } 

      connection.query("commit ", function (err, result) {
       
    });

    });
  }



odpowiedz = [daneZamowienia,produkty,elementy,fragmenty,oprawa,pakowanie,procesyElementow]
res.status(201).json(odpowiedz);

});

}


    // zapis w ModalInsert ( razem z zmaowienie - produkty - elementy - fragmenty itp)1
    postZamowienie(req,res){

        // starey zapis nieaktualny
        const zamowienie_id = req.body.zamowienie_id; // jeśli = 1 oznacza, że jest to pierwszy zapis i trzeba nadać priem_id
        const firma_id = req.body.firma_id;
        const prime_id = req.body.prime_id;
        const klient_id = req.body.klient_id;
        const data_przyjecia = req.body.data_przyjecia;
        const data_materialow = req.body.data_materialow;
        const data_spedycji= req.body.data_spedycji;
        const nr= req.body.nr;
        const rok= req.body.rok;
        const tytul= req.body.tytul;
        const opiekun_id= req.body.opiekun_id;
        const user= req.body.user;
        const stan= req.body.stan;
        const status= req.body.status;
        const rodzaj= req.body.rodzaj;
        const uwagi= req.body.uwagi;
        const final= req.body.final;
        const waluta_id= req.body.waluta_id;
        const vat_id= req.body.vat_id;
        const przedplata= req.body.przedplata;
        const cena= req.body.cena;
        const termin_platnosci= req.body.termin_platnosci;
        const fsc= req.body.fsc;

    
        var sql =   "INSERT INTO artdruk.zamowienia (prime_id,nr,rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,final,rodzaj,waluta_id,vat_id,przedplata,cena,termin_platnosci,fsc) "+
        "values ('" + prime_id + "','" + nr + "','" + rok + "','" + firma_id+ "','" + klient_id + "','" + tytul + "','" + data_przyjecia + "','" + data_materialow + "','" + data_spedycji + "','" + opiekun_id + "','" + user + "','" + stan + "','" + status + "','" + uwagi + "','" + final + "','" + rodzaj + "','" + waluta_id + "','" + vat_id + "','" + przedplata + "','" + cena + "','" + termin_platnosci + "','" + fsc + "'); ";
        connection.query(sql, function (err, result) {

                if(zamowienie_id == 1){  // jeżlie 1 to pierwszy zapis z nadaniem prime id, else jeśli !==1 oznacza kolejny zapis a prime_id = 0 żeby można to było rozpoznać po tamtej stronie 

                    var sql = "update artdruk.zamowienia  set prime_id = '" + result.insertId+ "' where id = '" + result.insertId+"'";
                    connection.query(sql, function (err, result) {
                    if (err) throw err;
                    });

                    res.status(201).json([result,{prime_id:result.insertId}]);

                }else{
 
                    res.status(201).json([result,{prime_id:1}]);
                }

    });}

        // zapis w ModalInsert ( razem z zmaowienie - produkty - elementy - fragmenty itp)
        postOprawa(req,res){
            const zamowienie_id = req.body.zamowienie_id;
            const produkt_id = req.body.produkt_id;
            const oprawa = req.body.oprawa;
            const naklad = req.body.naklad;
            const bok_oprawy = req.body.bok_oprawy;
            const wersja = req.body.wersja;

            const uwagi = req.body.uwagi;
            const data_spedycji = req.body.data_spedycji;
            const data_czystodrukow = req.body.data_czystodrukow;
            const indeks = req.body.indeks;
    
            var sql =   "INSERT INTO artdruk.zamowienia_oprawa(zamowienie_id,produkt_id,oprawa,naklad,uwagi,data_spedycji,data_czystodrukow,indeks,bok_oprawy,wersja) "+
            "values ('" + zamowienie_id+ "','" + produkt_id + "','" + oprawa + "','" + naklad + "','" + uwagi + "','" + data_spedycji + "','" + data_czystodrukow + "','" + indeks + "','" + bok_oprawy + "','" + wersja + "'); ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            res.status(201).json(result);
            });
        }


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
            if (err) throw err;  });
        
            for(let row of rowsToDelete){

                var sql = "update artdruk.zamowienia set final = 2 where id = '" + row.id+ "' ";
                connection.query(sql, function (err, result) {        if (err) console.log(err);          });
        
                }
        
        
            var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Zlecenie skasowane! ");
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

    
//-----------
postTechnologie(req,res){
    const technologia_id = req.body.technologia_id; // jeśli = 1 oznacza, że jest to pierwszy zapis i trzeba nadać prime_id
    const firma_id = req.body.firma_id;
    const prime_id = req.body.prime_id;
    const nr = req.body.nr;
    const rok = req.body.rok;
    const klient_id = req.body.klient_id;
    const tytul = req.body.tytul;
    const final = req.body.final;
    const zamowienie_id = req.body.zamowienie_id;


    let odpowiedz= []
    var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

console.log("zamowienie_id: "+ zamowienie_id)

    var sql =   "INSERT INTO artdruk.technologie (prime_id,nr,rok,tytul,firma_id,klient_id,final,zamowienie_id) "+
    "values ('" + prime_id + "','" + nr + "','" + rok + "','" + tytul + "','" + firma_id + "','" + klient_id + "','" + final + "','" + zamowienie_id + "'); ";

    connection.query(sql, function (err, result) {

            if(technologia_id == 1){  // jeżlie 1 to pierwszy zapis z nadaniem prime id, else jeśli !==1 oznacza kolejny zapis a prime_id = 0 żeby można to było rozpoznać po tamtej stronie 

                var sql = "update artdruk.technologie  set prime_id = '" + result.insertId+ "' where id = '" + result.insertId+"'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                odpowiedz = [result,{prime_id:result.insertId}]
                // res.status(201).json([result,{prime_id:result.insertId}]);
                console.log("zapis pierwszy")
            }else{

                // zamiast updateSetTechNotFinal
                var sql = "update artdruk.technologie set final = 0 where prime_id = '" + prime_id+ "' ";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
                console.log("zapis kolejny")
                odpowiedz = [result,{prime_id:prime_id}]
                // res.status(201).json([result,{prime_id:prime_id}]);
            }

});


var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("1 record update ");
res.status(201).json(odpowiedz);
});



}
//-------------

updateSetTechNotFinal(req,res){
    // przy zapisie zamowienia zmiana final z 1 na 0, final = 1 to najnowsza wersja zamowienia, 0 to poprzednie wersje
    const technologia_id = req.body.technologia_id;


    var sql = "update artdruk.technologie set final = 0 where id = '" + technologia_id+ "' ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    res.status(201).json(result);
    });
}
//---------
postTechnologieRest(req,res){

    // global_id - nr nadawany automatycznie przez mysql
    // id - nr lokalny nadawany podczas tworzenia nowego zlecenia do komunikacji pomiedzy objektami np. okladka id=1, środek id=2
    // zapisuje wszystkie stany z technologii 
    let produktyTechEdit = req.body[0]
    let elementyTechEdit = req.body[1]
    let fragmentyTechEdit = req.body[2]
    let oprawaTechEdit = req.body[3]
    let legiEdit = req.body[4]
    let legiFragmentyEdit = req.body[5]
    let arkuszeEdit = req.body[6]
    let grupaWykonanEdit = req.body[7]
    let wykonaniaEdit = req.body[8]
    let procesyElementowTech = req.body[9]
    
    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });


    for (let produkty of produktyTechEdit) {
      var sql =
        "INSERT INTO artdruk.technologie_produkty (technologia_id,id,zamowienie_id,typ,indeks,naklad,nazwa,ilosc_stron,format_x,format_y,oprawa,uwagi,stan,status) " +
        "values ('" +
        produkty.technologia_id +  "','" +
        produkty.id +        "','" +
        produkty.zamowienie_id +        "','" +
        produkty.typ +        "','" +
        produkty.indeks +        "','" +
        produkty.naklad +        "','" +
        produkty.nazwa +        "','" +
        produkty.ilosc_stron +        "','" +
        produkty.format_x +        "','" +
        produkty.format_y +        "','" +
        produkty.oprawa +        "','" +
        produkty.uwagi +        "','" +
        produkty.stan +        "','" +
        produkty.status +        "'); ";
      connection.query(sql, function (err, result) {
        if (err) throw err;
      });
    }

    for (let element of elementyTechEdit) {
        var sql =
          "INSERT INTO artdruk.technologie_elementy (id,indeks,technologia_id,zamowienie_id,produkt_id,nazwa,typ,lega,ilosc_leg,ilosc_stron,format_x,format_y,papier_id,gramatura_id,papier_info,naklad,uwagi,stan,status) " +
          "values ('" +
          element.id +  "','" +
          element.indeks +        "','" +
          element.technologia_id +        "','" +
          element.zamowienie_id +        "','" +
          element.produkt_id +        "','" +
          element.nazwa +        "','" +
          element.typ +        "','" +
          element.lega +        "','" +
          element.ilosc_leg +        "','" +
          element.ilosc_stron +        "','" +
          element.format_x +        "','" +
          element.format_y +        "','" +
          element.papier_id +        "','" +
          element.gramatura_id +        "','" +
          element.papier_info +        "','" +
          element.naklad +        "','" +
          element.uwagi +        "','" +
          element.stan +        "','" +
          element.status +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }

      for (let fragment of fragmentyTechEdit) {
        var sql =
          "INSERT INTO artdruk.technologie_fragmenty (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,oprawa_id,typ,ilosc_stron,wersja,naklad,info) " +
          "values ('" +
          fragment.id +  "','" +
          fragment.indeks +        "','" +
          fragment.technologia_id +        "','" +
          fragment.zamowienie_id +        "','" +
          fragment.produkt_id +        "','" +
          fragment.element_id +        "','" +
          fragment.oprawa_id +        "','" +
          fragment.typ +        "','" +
          fragment.ilosc_stron +        "','" +
          fragment.wersja +        "','" +
          fragment.naklad +        "','" +
          fragment.info +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }

      for (let procesElementu of procesyElementowTech) {
        var sql =
          "INSERT INTO artdruk.technologie_procesy_elementow (id,indeks,technologia_id,zamowienie_id,produkt_id,element_id,front_ilosc,front_kolor,back_ilosc,back_kolor,predkosc,narzad,mnoznik,nazwa,nazwa_id,rodzaj,typ,obszar,wykonczenie,procesor_domyslny) " +
          "values ('" +
          procesElementu.id +  "','" +
          procesElementu.indeks +        "','" +
          procesElementu.technologia_id +        "','" +
          procesElementu.zamowienie_id +        "','" +
          procesElementu.produkt_id +        "','" +
          procesElementu.element_id +        "','" +
          procesElementu.front_ilosc +        "','" +
          procesElementu.front_kolor +        "','" +
          procesElementu.back_ilosc +        "','" +
          procesElementu.back_kolor+        "','" +
          procesElementu.predkosc +        "','" +
          procesElementu.narzad +        "','" +
          procesElementu.mnoznik +        "','" +
          procesElementu.nazwa +        "','" +
          procesElementu.nazwa_id +        "','" +
          procesElementu.rodzaj +        "','" +
          procesElementu.typ +        "','" +
          procesElementu.obszar +        "','" +
          procesElementu.wykonczenie +        "','" +
          procesElementu.procesor_domyslny +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }


      for (let oprawa of oprawaTechEdit) {
        var sql =
          "INSERT INTO artdruk.technologie_oprawa (id,indeks,technologia_id,zamowienie_id,produkt_id,bok_oprawy,naklad,data_czystodrukow,data_spedycji,oprawa,wersja,uwagi) " +
          "values ('" +
          oprawa.id +  "','" +
          oprawa.indeks +        "','" +
          oprawa.technologia_id +        "','" +
          oprawa.zamowienie_id +        "','" +
          oprawa.produkt_id +        "','" +
          oprawa.bok_oprawy +        "','" +
          oprawa.naklad +        "','" +
          oprawa.data_czystodrukow +        "','" +
          oprawa.data_spedycji +        "','" +
          oprawa.oprawa+        "','" +
          oprawa.wersja +        "','" +
          oprawa.uwagi +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }



      for (let arkusz of arkuszeEdit) {

        var sql =
          "INSERT INTO artdruk.technologie_arkusze (id,indeks,technologia_id,typ_elementu,rodzaj_arkusza,element_id,ilosc_stron,ilosc_leg,naklad,uwagi) " +
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
          arkusz.uwagi +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }

      for (let lega of legiEdit) {

        var sql =
          "INSERT INTO artdruk.technologie_legi(id,indeks,technologia_id,typ_elementu,rodzaj_legi,element_id,ilosc_stron,naklad,uwagi) " +
          "values ('" +
          lega.id +  "','" +
          lega.indeks +        "','" +
          lega.technologia_id +        "','" +
          lega.typ_elementu +        "','" +
          lega.rodzaj_legi +        "','" +
          lega.element_id +        "','" +
          lega.ilosc_stron +        "','" +
          lega.naklad +        "','" +
          lega.uwagi +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }


      for (let legaFragment of legiFragmentyEdit) {

        var sql =
          "INSERT INTO artdruk.technologie_legi_fragmenty(id,indeks,technologia_id,element_id,fragment_id,arkusz_id,lega_id,naklad,oprawa_id,typ,wersja) " +
          "values ('" +
          legaFragment.id +  "','" +
          legaFragment.indeks +        "','" +
          legaFragment.technologia_id +        "','" +
          legaFragment.element_id +        "','" +
          legaFragment.fragment_id +        "','" +
          legaFragment.arkusz_id +        "','" +
          legaFragment.lega_id +        "','" +
          legaFragment.naklad +        "','" +
          legaFragment.oprawa_id +        "','" +
          legaFragment.typ +        "','" +
          legaFragment.wersja +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }

      for (let grupa of grupaWykonanEdit) {

        var sql =
          "INSERT INTO artdruk.technologie_grupy_wykonan(id,indeks,technologia_id,mnoznik,czas,koniec,narzad,nazwa,poczatek,predkosc,proces_id,procesor_id,element_id,status,stan,uwagi) " +
          "values ('" +
          grupa.id +  "','" +
          grupa.indeks +        "','" +
          grupa.technologia_id +        "','" +
          grupa.mnoznik +        "','" +
          grupa.czas +        "','" +
          grupa.koniec +        "','" +
          grupa.narzad +        "','" +
          grupa.nazwa +        "','" +
          grupa.poczatek +        "','" +
          grupa.predkosc +        "','" +
          grupa.proces_id +        "','" +
          grupa.procesor_id +        "','" +
          grupa.element_id +        "','" +
          grupa.status +        "','" +
          grupa.stan +        "','" +
          grupa.uwagi +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }

      for (let wykonanie of wykonaniaEdit) {

        var sql =
          "INSERT INTO artdruk.technologie_wykonania(id,indeks,technologia_id, grupa_id,element_id,arkusz_id,typ_elementu,nazwa,naklad,poczatek,czas,koniec,narzad,predkosc,mnoznik,proces_id,procesor_id,status,stan,uwagi) " +
          "values ('" +
          wykonanie.id +  "','" +
          wykonanie.indeks +        "','" +
          wykonanie.technologia_id +        "','" +
          wykonanie.grupa_id +        "','" +
          wykonanie.element_id +        "','" +
          wykonanie.arkusz_id +        "','" +
          wykonanie.typ_elementu +        "','" +
          wykonanie.nazwa +        "','" +
          wykonanie.naklad +        "','" +
          wykonanie.poczatek +        "','" +
          wykonanie.czas +        "','" +
          wykonanie.koniec +        "','" +
          wykonanie.narzad +        "','" +
          wykonanie.predkosc +        "','" +
          wykonanie.mnoznik +        "','" +
          wykonanie.proces_id +        "','" +
          wykonanie.procesor_id +        "','" +
          wykonanie.status +        "','" +
          wykonanie.stan +        "','" +
          wykonanie.uwagi +        "'); ";
        connection.query(sql, function (err, result) {
          if (err) throw err;
        });
      }

      var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("zapis OK");
    res.status(201).json([{zapis:"OK"}]);
});
}
//-------------

        // updateIdFragmentow(req,res){

        //     // do skasowanie 
        //     //update id fragmentow przy zapisie zamowienia. 
        //     // Najpierw zapisane fragmenty nie mają id oprawy do ktorej należą
        //     // po zapisie oprawy można dopiero update
        //     const idFragmentu = req.body.idFragmentu;
        //     const oprawa_id_new = req.body.oprawa_id_new;
        //     // const oprawa_id_prev = req.body.oprawa_id_prev;
        //     var sql = "update artdruk.zamowienia_fragmenty set oprawa_id = '" + oprawa_id_new + "' where id="+idFragmentu;
        
        //     connection.query(sql, function (err, result) {
        //     if (err) throw err;
        //     console.log("update id fragmentow przy zapisie zamowienia ");
        //     res.status(201).json(result);
        // });}
        

    // getListaUszlachetnien(req,res){
    //     var sql = "SELECT id,nazwa FROM artdruk.uszlachetnienia ORDER BY id ASC;";
    //     connection.query(sql, function (err, doc) {
    //     if (err) throw err;
    //     //sconsole.log(doc);
    //     res.status(200).json(doc);
    // });}

    getListaPapierow(req,res){
        var sql = "SELECT id,nazwa FROM artdruk.papiery_nazwy ORDER BY id ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}
    getListaGramatur(req,res){
        var sql = "SELECT id,user,papier_id,gramatura,wykonczenie,bulk,info FROM artdruk.papiery_gramatury ORDER BY id ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
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

    // getPapiery(req,res){
    //     var sql = "SELECT id,user,nazwa,gramatura,wykonczenie,bulk,info FROM artdruk.papiery ORDER BY id ASC;";
    //     connection.query(sql, function (err, doc) {
    //     if (err) throw err;
    //     //sconsole.log(doc);
    //     res.status(200).json(doc);
    // });}







//--------------- stare
    updateStatusWWW(req,res){
        const id = req.body.id;
        const value = req.body.value;
        let idzlecenia = req.body.idzlecenia;

        if (idzlecenia==null) {
            idzlecenia = 0;
        }


        var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set status= '" + value + "' where id="+id;
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update ctp21.zlecenia set status_srodek = (select min(status) from ctp21.produkty where produkty.id_zlecenia = '" + idzlecenia + "' and typ='Środek') ,  status_okladka = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' and typ='Okładka') , status_inne = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' and typ='Inne') , status_glowny = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' ) where zlecenia.id = '" + idzlecenia + "';";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });


               // console.log(`id: ${id} status: ${value} idzlecenia: ${idzlecenia}`);

        

var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("1 record update ");
  res.status(201).json(result);
// setTimeout(() => {
  
//   }, 3000);

});


}



    getProduktyByMaszyna(req,res){
        const maszyna = req.params['maszyna']
        const iloscdniwstecz = req.params['iloscdniwstecz']

        var sql = "select DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,czasDruku,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`,ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,produkty.typ,formatPapieru,DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,naklad,przeloty,arkusze,predkoscDruku,statusy.nazwa as status,produkty.id,id_zlecenia,maszyna,narzad,folia,kolejnosc,uwagi,produkty.nazwa,naswietlenia.ilosc as sm_ok,sm_dmg ,naswietlenia.ilosc as xl_ok ,xl_dmg,oprawa, papier_stan.czy_jest as czy_jest from produkty left join naswietlenia on  produkty.id = naswietlenia.produkt_id left join statusy on produkty.status = statusy.id  left join papier_stan on produkty.id = papier_stan.produkt_id  where (naswietlenia.typ = 'prime') and ( maszyna='" + maszyna + "') and (KoniecDruku > (SELECT max(KoniecDruku) - interval '" + iloscdniwstecz + "' day FROM ctp21.produkty where Maszyna='" + maszyna + "' and Status=7)) ORDER BY PoczatekDruku";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        console.log(maszyna);
        res.status(200).json(doc);
    });}

    getProdukty_do_wydania_papieru(req,res){
        const maszyna = req.params['maszyna']
        const iloscdniwstecz = req.params['iloscdniwstecz']

        var sql = "select DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,czasDruku,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`,ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,produkty.typ,formatPapieru,DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,naklad,przeloty,arkusze,predkoscDruku,statusy.nazwa as status,produkty.id,id_zlecenia,maszyna,narzad,folia,kolejnosc,uwagi,produkty.nazwa,naswietlenia.ilosc as sm_ok,sm_dmg ,naswietlenia.ilosc as xl_ok ,xl_dmg,oprawa, papier_stan.czy_jest as czy_jest from produkty left join naswietlenia on  produkty.id = naswietlenia.produkt_id left join statusy on produkty.status = statusy.id  left join papier_stan on produkty.id = papier_stan.produkt_id  where (naswietlenia.typ = 'prime') and ( maszyna='H1' or maszyna='H3' or maszyna='XL') and (czy_jest='Wydany' or czy_jest='Przygotowany') and Status<6 ORDER BY PoczatekDruku";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        console.log(maszyna);
        res.status(200).json(doc);
    });}


    getNaswietlenia(req,res){
        var sql = "SELECT produkty.id,produkty.typ,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,klient,praca, status,DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`, "+
        "spedycja, maszyna,arkusze, naswietlenia.id as naswietlenia_id,blacha.typ as blacha_id, grupa_id,stan,ilosc,opis.nazwa as opis,DATE_FORMAT(`data`, '%Y-%m-%d %H:%i') AS `data`,kolej,naswietlenia.typ as naswietlenia_typ,nas_user FROM produkty right join naswietlenia on produkty.id = naswietlenia.produkt_id left join blacha on naswietlenia.blacha_id = blacha.id left join opis on naswietlenia.opis = opis.id where (produkty.typ !='Przerwa')  ORDER BY data ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getPapierStan(req,res){
        var sql = "select produkty.id, typ, NrZlecenia, RokZlecenia, Klient, Praca, FormatPapieru, papier_stan.czy_jest as czy_jest from produkty left join papier_stan on produkty.id = papier_stan.produkt_id where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3' )and (typ != 'Przerwa' or typ !='Licznik') and (Status < 6 or Status > 12) ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}


    getOpisNaswietlen(req,res){
        var sql = "SELECT id,nazwa from opis  ORDER BY id ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getProduktyByMaszyna_stare(req,res){
        // kopia zapasowa wczytywania ilosci blach w druku z tabeli produkty z kolumn sm_ok i xl_ok
        const maszyna = req.params['maszyna']
        const iloscdniwstecz = req.params['iloscdniwstecz']

        var sql = "select DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku`,czasDruku,DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku`,ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,typ,formatPapieru,DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,naklad,przeloty,arkusze,predkoscDruku,statusy.nazwa as status,produkty.id,id_zlecenia,maszyna,narzad,folia,kolejnosc,uwagi,produkty.nazwa,sm_ok,sm_dmg ,xl_ok ,xl_dmg,oprawa from produkty left join statusy on produkty.status = statusy.id where maszyna='" + maszyna + "' and (KoniecDruku > (SELECT max(KoniecDruku) - interval '" + iloscdniwstecz + "' day FROM ctp21.produkty where Maszyna='" + maszyna + "' and Status=7)) ORDER BY PoczatekDruku";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        console.log(maszyna);
        res.status(200).json(doc);
    });}



    dragDropDruk(req,res){

        const kierunek = req.body.kierunek;
        const drag_id = req.body.drag_id;
        const drag_poczatekDruku= req.body.drag_poczatekDruku;
        const drag_czasDruku= req.body.drag_czasDruku;
        const drop_maszyna= req.body.drop_maszyna;
        const drop_poczatekDruku= req.body.drop_poczatekDruku;
        const drop_koniecDruku= req.body.drop_koniecDruku;

        if(kierunek == "z gory na dol"){

                var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku - interval " + drag_czasDruku + " minute  where  PoczatekDruku > '" + drag_poczatekDruku+ "' and Maszyna = '" + drop_maszyna+"'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku + interval " + drag_czasDruku + " minute  where  PoczatekDruku >= '" + drop_koniecDruku+ "' - interval " + drag_czasDruku + " minute and Maszyna = '" + drop_maszyna+"'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set PoczatekDruku = '" + drop_koniecDruku+ "' - interval " + drag_czasDruku + " minute , KoniecDruku = '" + drop_koniecDruku + "' where ID = '" + drag_id+"'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "commit";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record update ");
                res.status(201).json(result);
                });
        }

        if(kierunek == "z dolu na gore"){

        var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku - interval " + drag_czasDruku + " minute  where  PoczatekDruku > '" + drag_poczatekDruku+ "' and Maszyna = '" + drop_maszyna+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval " + drag_czasDruku + " minute, KoniecDruku = KoniecDruku + interval " + drag_czasDruku + " minute  where  PoczatekDruku >= '" + drop_poczatekDruku+ "' and Maszyna = '" + drop_maszyna+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = '" + drop_poczatekDruku+ "' , KoniecDruku = '" + drop_poczatekDruku + "' + interval " + drag_czasDruku + " minute where ID = '" + drag_id+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

        var sql = "commit";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record update ");
            res.status(201).json(result);
            });
            }
}


updateCzasDruk(req,res){

    const id = req.body.id;
    const czas = req.body.czas;
    const koniecDruku= req.body.koniecDruku;
    const maszyna= req.body.maszyna;
    const zmiana= req.body.zmiana;
    const typ= req.body.typ;
    const SumaNowegoCzasu= req.body.SumaNowegoCzasu;

    var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

    if(typ == "Przerwa"){

        if(zmiana == "dodaj"){

           var sql = "update produkty set CzasDruku = CzasDruku + '" + czas + "', KoniecDruku = KoniecDruku + interval '" + czas + "' minute  where id='" + id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '" + czas + "' minute, KoniecDruku = KoniecDruku + interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' and Maszyna = '" + maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

        }

        if(zmiana == "odejmij"){
            var sql = "update produkty set CzasDruku = CzasDruku - '" + czas + "', KoniecDruku = KoniecDruku - interval '" + czas + "' minute  where id='" + id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + czas + "' minute, KoniecDruku = KoniecDruku - interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' - interval '" + SumaNowegoCzasu + "' minute and Maszyna = '" + maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

         }}


         if(typ != "Przerwa"){

            if(zmiana == "dodaj"){
    
               var sql = "update produkty set CzasDruku = CzasDruku + '" + czas + "', KoniecDruku = KoniecDruku + interval '" + czas + "' minute, PredkoscDruku = Przeloty/(  '" + SumaNowegoCzasu + "' - (Arkusze * Narzad) )*60  where id='" + id + "'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
    
                var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '" + czas + "' minute, KoniecDruku = KoniecDruku + interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' and Maszyna = '" + maszyna+ "'  ";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
    
            }
    
            if(zmiana == "odejmij"){
                var sql = "update produkty set CzasDruku = CzasDruku - '" + czas + "', KoniecDruku = KoniecDruku - interval '" + czas + "' minute, PredkoscDruku = Przeloty/(  '" + SumaNowegoCzasu + "' - (Arkusze * Narzad) )*60   where id='" + id + "'";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });
                
                console.log("koniecDruku1 ",koniecDruku);
                var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + czas + "' minute, KoniecDruku = KoniecDruku - interval '" + czas + "' minute  where PoczatekDruku >= '" + koniecDruku+ "' - interval '" + SumaNowegoCzasu + "' minute and Maszyna = '" + maszyna+ "'  ";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("koniecDruku2 ",koniecDruku);
                });
    
             }



            
    }

   

    var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
        });
}

insertPrzerwaDruk(req,res){

    const maszyna = req.body.maszyna;
    const koniecDruku = req.body.koniecDruku;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval 60 minute, KoniecDruku = KoniecDruku + interval 60 minute  where  PoczatekDruku >= '" + koniecDruku+ "' and Maszyna = '" + maszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "INSERT INTO produkty  (ID,Kolejnosc,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku)  SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" + maszyna + "','Przerwa','" + koniecDruku + "','60','" + koniecDruku + "' + interval 60 minute from produkty";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" 1 record inserted "+result.insertId);

    });

    var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
    });
}



deleteProduktSelectOne(req,res){
    const id = req.body.id;
    const kolejnosc = req.body.kolejnosc;
    const maszyna = req.body.maszyna;
    const poczatekdruku = req.body.poczatekdruku;
    const czasdruku = req.body.czasdruku;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "DELETE FROM produkty WHERE ID =" +id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;

    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + czasdruku + "' minute, KoniecDruku = KoniecDruku - interval '" + czasdruku + "' minute  where PoczatekDruku > '" + poczatekdruku+ "' and Maszyna = '" + maszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "DELETE FROM naswietlenia WHERE produkt_id =" +id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;
  
    });
    
    var sql = "DELETE FROM papier_stan WHERE produkt_id =" +id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;
  
    });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
    
    });
}

duplikujDruk(req,res){
    const id = req.body.id;
    const maszyna = req.body.maszyna;
    const koniecdruku = req.body.koniecdruku;
    const czasdruku = req.body.czasdruku;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '"+czasdruku+"' minute, KoniecDruku = KoniecDruku + interval '"+czasdruku+"' minute  where  PoczatekDruku >= '" + koniecdruku+ "' and Maszyna = '" + maszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });


    var sql = "insert into produkty (ID,ID_zlecenia,Kolejnosc,Klient,Praca,PoczatekDruku,CzasDruku,KoniecDruku,Maszyna,Typ,PredkoscDruku,Narzad,NrZlecenia,RokZlecenia,Naklad,FormatPapieru,Oprawa,OprawaCzas,OprawaPredkosc,Folia,Spedycja,Arkusze,Legi,LegiRodzaj,Przeloty,Status,Uwagi,SM_ok,SM_dmg,XL_ok,XL_dmg,FalcPredkosc,FalcCzas)\n" +
    "\n" +
    "select (select MAX(ID)+1 from produkty),ID_zlecenia, (select MAX(Kolejnosc)+1 from produkty),Klient,Praca,\n" +
    "'"+koniecdruku+"',\n" +
    "CzasDruku,\n" +
    "'"+koniecdruku+"' + interval CzasDruku Minute,\n" +
    "Maszyna,Typ,PredkoscDruku,Narzad,NrZlecenia,RokZlecenia,Naklad,FormatPapieru,Oprawa,OprawaCzas,OprawaPredkosc,Folia,Spedycja,Arkusze,Legi,LegiRodzaj,Przeloty,'1',Uwagi,SM_ok,SM_dmg,XL_ok,XL_dmg,FalcPredkosc,FalcCzas \n" +
    "from produkty\n" +
    " where id ='"+id+"'";




    connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });


            var sql = "INSERT INTO papier_stan  (produkt_id,info) select (SELECT MAX(id) from produkty) as id,'kopia' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);

});
}

//--- duplikuj naświetlenie

duplikujNaswietlenie(req,res){
    const id = req.body.id;


    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "insert into naswietlenia (produkt_id,blacha_id,kolej,grupa_id,data)  (select produkt_id,blacha_id,(select max(kolej)+1 from naswietlenia),(select max(id) from grupa), now() from naswietlenia where id= '"+id+"');";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Naswietlenie zduplikowane");
    res.status(201).json(result);


});
}

//---


//----

updateZamknijGrupe(req,res){
    const id = req.body.id;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

   
    var sql = "update grupa set stan = 'Closed', koniec= now() where stan='Open'";
    connection.query(sql, function (err, result) {
    if (err) throw err;     });

    var sql = "update naswietlenia set stan = 'Closed' where grupa_id= (select max(id) from grupa)";
    connection.query(sql, function (err, result) {
    if (err) throw err;     })

    var sql = "INSERT INTO grupa  (id,poczatek,stan)  SELECT MAX(id)+1,now(),'Open' from grupa";
    connection.query(sql, function (err, result) {
    if (err) throw err;
                                                });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
    });

}
//---


zmienMaszyne(req,res){
    const id = req.body.id;
    const czasdruku = req.body.czasdruku;
    const koniecdruku = req.body.koniecdruku;
    const staraMaszyna = req.body.staraMaszyna;
    const nowaMaszyna = req.body.nowaMaszyna;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '"+czasdruku+"' minute, KoniecDruku = KoniecDruku - interval '"+czasdruku+"' minute  where  PoczatekDruku >= '" + koniecdruku+ "' and Maszyna = '" + staraMaszyna+ "'  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });

    if((nowaMaszyna == "H1" || nowaMaszyna == "H3") && (staraMaszyna == "H1" ||staraMaszyna == "H3") ){

        console.log("z SM na SM");
        var sql =   "update produkty SET \n"+
        "PoczatekDruku = (SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku), \n" +
        "Maszyna = '" + nowaMaszyna + "',\n" +
        "KoniecDruku = ( SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku) + interval '" + czasdruku + "' minute where id='" + id + "'";

        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    }


    if((staraMaszyna == "H1" || staraMaszyna == "H3") && (nowaMaszyna == "XL") ){

        console.log("z SM na SM");
        var sql =   "update produkty SET \n"+
        "PoczatekDruku = (SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku), \n" +
        "Maszyna = '" + nowaMaszyna + "',\n" +
        "Narzad = Narzad /2 ,\n" +
        "CzasDruku = '" + czasdruku + "' /2,    \n" +
        "PredkoscDruku = PredkoscDruku *2,\n" +
        "KoniecDruku = ( SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku) + interval ('" + czasdruku + "' /2 ) minute where id='" + id + "'";

        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    }

    
    if((staraMaszyna == "XL") && (nowaMaszyna == "H1" || nowaMaszyna == "H3") ){

        console.log("z SM na SM");
        var sql =   "update produkty SET \n"+
        "PoczatekDruku = (SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku), \n" +
        "Maszyna = '" + nowaMaszyna + "',\n" +
        "Narzad = Narzad *2 ,\n" +
        "CzasDruku = '" + czasdruku + "' *2,    \n" +
        "PredkoscDruku = PredkoscDruku /2,\n" +
        "KoniecDruku = ( SELECT * FROM (SELECT MAX(KoniecDruku) FROM produkty WHERE  maszyna='" + nowaMaszyna + "') AS PoczatekDruku) + interval ('" + czasdruku + "' *2 ) minute where id='" + id + "'";

        connection.query(sql, function (err, result) {
        if (err) throw err;
        });

    }





    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);


});}

postHistoria(req,res){
        
    var sql =   "INSERT INTO historia (User,Kategoria,Event,ID_target,NrZlecenia,RokZlecenia,Klient,Praca,Typ,StatusStary,StatusNowy) "+
                "values ('" + req.body.user + "','" + req.body.kategoria + "','" + req.body.event + "','" + req.body.ID_target + "','" + req.body.nrzlecenia + "','" + req.body.rokzlecenia + "',"+
                        "'" + req.body.klient + "','" + req.body.praca + "','" + req.body.typ + "','" + req.body.statusstary + "','" + req.body.statusnowy + "'); ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" 1 record inserted "+result.insertId);
    res.status(201).json(result);
});}



getHistoria(req,res){
    var sql = "SELECT id,DATE_FORMAT(`data`, '%Y-%m-%d %H:%i') AS `data`, user,kategoria,  event , id_target, ifnull(NrZlecenia,'') as nrZlecenia, ifnull(RokZlecenia,'') as rokZlecenia,"+
    "ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(Typ,'') as typ,statusStary,statusNowy FROM historia ORDER BY Data ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

getHistoria_short(req,res){
    var sql = "SELECT id,DATE_FORMAT(`data`, '%Y-%m-%d %H:%i') AS `data`, user,kategoria,  event , id_target, ifnull(NrZlecenia,'') as nrZlecenia, ifnull(RokZlecenia,'') as rokZlecenia,"+
    "ifnull(Klient,'') as klient,ifnull(Praca,'') as praca,ifnull(Typ,'') as typ,statusStary,statusNowy FROM historia where data > now() - interval 30 day ORDER BY Data ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}







getUserJava(req,res){

    const login = req.params['login']
    const haslo = req.params['haslo']


var sql =   "INSERT INTO historia (User,Kategoria,Event,Klient) "+
"values ('" + login + "','Logowanie','" + haslo + "','java'); ";
connection.query(sql, function (err, result) {
        if (err) throw err;
        // console.log(" 1 record inserted "+result.insertId);
        // res.status(201).json(result);

        })


    var sql = "select id,imie,nazwisko,login,haslo,dostep from users where login ='" + login + "' and haslo = '" + haslo + "';";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});

}

getRestore(req,res){
    var sql = "SELECT id,DATE_FORMAT(`Utworzono`, '%Y-%m-%d %H:%i:%s') AS `utworzono`, aktualny, opis FROM backup ORDER BY Utworzono ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
});}

//---------
deleteBackup(req,res){
    const id = req.body.id;
    const data = req.body.data;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

    var sql= "DELETE FROM backup WHERE ID ='" +id+ "'";
        connection.query(sql, function (err, result) {
        if (err) throw err;

    });

    var sql= "DROP TABLE `produkty_"+data+"`";
            connection.query(sql, function (err, result) {
            if (err) throw err;
    });

    var sql= "DROP TABLE `zlecenia_"+data+"`";
            connection.query(sql, function (err, result) {
            if (err) throw err;
    });


        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Backup skasowany! ");
        res.status(201).json(result);

    });
}
//---------
restoreBackup(req,res){
    const id = req.body.id;
    const data = req.body.data;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql= "delete from produkty";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql= "INSERT INTO produkty SELECT * FROM `produkty_"+data+"`;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql= "delete from zlecenia;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql= "INSERT INTO zlecenia SELECT * FROM `zlecenia_"+data+"`;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql= "update backup set Aktualny = null";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql= "update backup set Aktualny = 'X'  where id='" + id + "'";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  
    


    var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Zlecenie skasowane! ");
        res.status(201).json(result);
                                                    });

}

//---------
createBackup(req,res){
    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });

    var sql = "SELECT DATE_FORMAT(now() , '%Y-%m-%d %H:%i:%s') AS `teraz` ;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    //doc[0].teraz
    console.log("zlecenia_"+doc[0].teraz);
    var sql= "CREATE TABLE `zlecenia_"+doc[0].teraz+"` (\n" +
    "  `ID` int NOT NULL,\n" +
    "  `Utworzono` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
    "  `Zmodyfikowano` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
    "  `Kolejnosc` int DEFAULT NULL,\n" +
    "  `NrZlecenia` int DEFAULT NULL,\n" +
    "  `RokZlecenia` int DEFAULT NULL,\n" +
    "  `Klient` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Praca` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Naklad` int DEFAULT NULL,\n" +
    "  `FormatPapieru` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Oprawa` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `OprawaCzas` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `OprawaPredkosc` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Folia` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Spedycja` date DEFAULT NULL,\n" +
    "  `Arkusze` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Legi` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `LegiRodzaj` int DEFAULT NULL,\n" +
    "  `Przeloty` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Status` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Uwagi` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `FalcPredkosc` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `FalcCzas` int DEFAULT NULL,\n" +
    "  `KolejnoscOprawa` int DEFAULT NULL,\n" +
    "  `Srodek` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Okladka` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  PRIMARY KEY (`ID`)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  
 
    
    var sql= "CREATE TABLE `produkty_"+doc[0].teraz+"` (\n" +
    "  `ID` int NOT NULL,\n" +
    "  `ID_zlecenia` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Utworzono` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
    "  `Zmodyfikowano` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
    "  `Kolejnosc` int DEFAULT NULL,\n" +
    "  `Typ` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Nazwa` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Maszyna` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `PoczatekDruku` datetime DEFAULT NULL,\n" +
    "  `PredkoscDruku` int DEFAULT NULL,\n" +
    "  `Narzad` int DEFAULT NULL,\n" +
    "  `CzasDruku` int DEFAULT NULL,\n" +
    "  `KoniecDruku` datetime DEFAULT NULL,\n" +
    "  `NrZlecenia` int DEFAULT NULL,\n" +
    "  `RokZlecenia` int DEFAULT NULL,\n" +
    "  `Klient` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Praca` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Naklad` int DEFAULT NULL,\n" +
    "  `FormatPapieru` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Oprawa` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `OprawaCzas` int DEFAULT NULL,\n" +
    "  `OprawaPredkosc` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Folia` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Spedycja` date DEFAULT NULL,\n" +
    "  `Arkusze` int DEFAULT NULL,\n" +
    "  `Legi` int DEFAULT NULL,\n" +
    "  `LegiRodzaj` text CHARACTER SET utf8 COLLATE utf8_polish_ci,\n" +
    "  `Przeloty` int DEFAULT NULL,\n" +
    "  `Status` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `Uwagi` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `SM_ok` int DEFAULT NULL,\n" +
    "  `SM_dmg` int DEFAULT NULL,\n" +
    "  `XL_ok` int DEFAULT NULL,\n" +
    "  `XL_dmg` int DEFAULT NULL,\n" +
    "  `FalcPredkosc` text CHARACTER SET utf8 COLLATE utf8_general_ci,\n" +
    "  `FalcCzas` int DEFAULT NULL,\n" +
    "  `DataCTP` datetime DEFAULT NULL, \n" +

    "  PRIMARY KEY (`ID`)\n" +
    ") ENGINE=InnoDB AUTO_INCREMENT=246 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_polish_ci;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  


    var sql= "update backup set Aktualny = null  ";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  

    var sql= "INSERT INTO backup (Utworzono,Aktualny) values ('"+doc[0].teraz+"','X') ;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  

    var sql= "INSERT INTO `produkty_" + doc[0].teraz + "` SELECT * FROM produkty;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  

    var sql = "INSERT INTO `zlecenia_" + doc[0].teraz  + "` SELECT * FROM zlecenia;";
    connection.query(sql, function (err, result) {
    if (err) throw err;                          });  





                                                 });


    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    res.status(201).json(result);
                                                });

}
//---------
updateRestore(req,res){
    const id = req.body.id;
    const value = req.body.value;
    var sql = "update backup set Opis = '" + value + "' where id='" + id + "'";

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
});}
//---------


getCTP(req,res){
    var sql = "SELECT id,utworzono, kolejnosc,praca,  status , uwagi FROM ctp ORDER BY Utworzono ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

postCTP(req,res){
    const title = req.body.title;
    const body = req.body.body;
    var sql = "INSERT INTO ctp  (Kolejnosc,Praca,Status) SELECT MAX(Kolejnosc)+1,'Nowa praca','Pliki' FROM ctp ";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" 1 record inserted "+result.insertId);
    res.status(201).json(result);
});}

deleteCTP(req,res){
    const id = req.body.id;
    const kolejnosc = req.body.kolejnosc;

    var sql = "DELETE FROM  ctp where id="+id;
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record delete ");
      //  res.status(204).json(result);
    });

  
    var sql = "update ctp set  Kolejnosc=Kolejnosc -1  WHERE Kolejnosc > '"+kolejnosc+"'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            res.status(201).json(result);
    });
}

updateCTP(req,res){
    const id = req.body.id;
    const kolumna = req.body.kolumna;
    const value = req.body.value;
    var sql = "update ctp set " + kolumna + " = '" + value + "' where id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
});}


updateProdukty(req,res){
    const id = req.body.id;
    const kolumna = req.body.kolumna;
    const value = req.body.value;
    const idzlecenia = req.body.idzlecenia;

    var sql = "start transaction";
connection.query(sql, function (err, result) {
if (err) throw err;  });


    var sql = "update produkty set " + kolumna + " = '" + value + "' where id="+id;
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");


});

var sql ="update ctp21.zlecenia set druk_przeloty = (select sum(przeloty) from ctp21.produkty where id_zlecenia = '"+idzlecenia+"' ), "+
        "druk_czas = (select sum(czasdruku) from ctp21.produkty where id_zlecenia = '"+idzlecenia+"'), "+
        "oprawa = (select oprawa from produkty where id_zlecenia = '"+idzlecenia+"' and typ='Środek' limit 1), "+
        "oprawa_czas = (select sum(OprawaCzas) from produkty where id_zlecenia = '"+idzlecenia+"' ), "+
        "falc_czas = (select sum(falcczas) from produkty where id_zlecenia ='"+idzlecenia+"' ), "+
        "legi = (select sum(legi) from produkty where id_zlecenia ='"+idzlecenia+"'  and typ='Środek'), "+
        "rodzaj_legi = (select legirodzaj from produkty where id_zlecenia ='"+idzlecenia+"'  and typ='Środek' limit 1), "+
        "falc_przeloty = (select sum(ROUND((Przeloty * (Legi/Arkusze)),0)) from ctp21.produkty where id_zlecenia = '"+idzlecenia+"' ), "+
        "uv = (select folia from produkty where id_zlecenia = '"+idzlecenia+"'  and typ='Okładka' limit 1) where id = '"+idzlecenia+"' ;";
        connection.query(sql, function (err, result) {
        if (err) throw err; });


var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("Skasoway licznik albo coś doświecane! ");
res.status(201).json(result);
                    });


}


updatenaswietlenieprime(req,res){
    const id = req.body.id;
    const ilosc = req.body.ilosc;
    const blacha_id = req.body.blacha_id;
    const user_id = req.body.user_id;

    var sql = "update naswietlenia  set "+

    "nas_naklad=(select naklad from ctp21.produkty where ID = '" + id + "'),"+
    "nas_arkusze=(select arkusze from ctp21.produkty where ID = '" + id + "'),"+
    "nas_legi=(select legi from ctp21.produkty where ID = '" + id + "'),"+
    "nas_falc=(select legirodzaj from ctp21.produkty where ID = '" + id + "'),"+
    "nas_user='" + user_id + "',"+
    " ilosc= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN '" + ilosc + "'  ELSE ilosc END, blacha_id= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN '" + blacha_id + "'  ELSE blacha_id  END, opis=0, data= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN now() ELSE data END, grupa_id= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN (select max(id) from grupa) ELSE grupa_id END where typ='prime' and produkt_id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update: "+ id +" "+ilosc+" "+blacha_id+" "+user_id);

    // setTimeout(() => {
    //  res.status(201).json(result);   
    //   }, 3000);

      res.status(201).json(result);   
    
});}



updatenaswietlenie(req,res){
    const id = req.body.id;
    const ilosc = req.body.ilosc;
    const blacha_id = req.body.blacha_id;
    var sql = "update naswietlenia  set ilosc= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN '" + ilosc + "'  ELSE ilosc END, blacha_id= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN '" + blacha_id + "'  ELSE blacha_id  END, opis=0, data= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN now() ELSE data END, grupa_id= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN (select max(id) from grupa) ELSE grupa_id END where id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update");
    res.status(201).json(result);
});}

updatenaswietlenie_grupa(req,res){
    const id = req.body.id;
    const grupa = req.body.grupa;

    var sql = "update naswietlenia  set grupa_id = '" + grupa + "', data = CASE WHEN (select max(data) from (select data from naswietlenia where grupa_id ='" + grupa + "') as data) is not null THEN (select max(data) + interval 1 minute from (select data from naswietlenia where grupa_id ='" + grupa + "') as data) ELSE (select max(data) + interval 1 minute from (select data from naswietlenia ) as data) END where id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update");
    res.status(201).json(result);
});}

// updatenaswietlenie_grupa_temp_dziala(req,res){
//     const id = req.body.id;
//     const grupa = req.body.grupa;

//     var sql = "update naswietlenia  set grupa_id = '" + grupa + "', data =(select max(data) from (select data from naswietlenia where grupa_id ='" + grupa + "') as data) where id="+id;

//     connection.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("1 record update");
//     res.status(201).json(result);
// });}




zmien_na_nowe_naswietlenie(req,res){
    const id = req.body.id;
    var sql = "update naswietlenia  set produkt_id = CASE WHEN (grupa_id =(select max(id) from grupa)) AND (typ is null) THEN 0 ELSE produkt_id END where id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update");
    res.status(201).json(result);
});}

updatenaswietlenie_opis(req,res){
    const id = req.body.id;
    const opis = req.body.opis;
    var sql = "update naswietlenia  set opis= CASE WHEN  grupa_id =(select max(id) from grupa) OR grupa_id is null THEN '" + opis + "'  ELSE opis END where id="+id;

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update");
    res.status(201).json(result);
});}



updateProduktyStatusFalcowanie(req,res){

    const id = req.body.id;
    const value = req.body.value;

    var sql = "update produkty set Status= CASE WHEN  Status ='Wydrukowane' THEN '" + value + "' ELSE Status END  where id="+id;
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
}    );



}

loadtest(req,res){
const id = req.body.id; 
var sql  = "select status from produkty where id= '" + id+ "' ";
connection.query(sql, function (err, doc) {
if (err) throw err;
res.status(200).json(doc);
                                        });
}

updateProduktyDataCTP(req,res){
    // wstawia wstawia now() do DataCTP przy dopisywaniu ilość zaświeconych blach
    const id = req.body.id;
    var sql = "update produkty set DataCTP = now() where id="+id;
    connection.query(sql, function (err, result) {
    if (err) throw err;
    res.status(201).json(result);
});}

updateNaprawCzas(req,res){
    const id = req.body.id;
    const poczatekdruku = req.body.poczatekdruku;
    const koniecdruku = req.body.koniecdruku;

    var sql = "update produkty set PoczatekDruku = '" + poczatekdruku + "', KoniecDruku = '" + koniecdruku + "'  where id='" + id + "'";

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
});}




updateProduktyByIdZleceniaAndTyp(req,res){
    const idzlecenie = req.body.idzlecenie;
    const kolumna = req.body.kolumna;
    const value = req.body.value;
    const typ = req.body.typ;
    var sql = "update produkty set " + kolumna + " = '" + value + "' where ID_zlecenia='" + idzlecenie + "' and Typ='" + typ + "'";

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
});}

updateProduktyByIdZlecenia(req,res){
    const idzlecenie = req.body.idzlecenie;
    const kolumna = req.body.kolumna;
    const value = req.body.value;
   
    var sql = "update produkty set " + kolumna + " = '" + value + "' where ID_zlecenia='" + idzlecenie + "'";

    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record update ");
    res.status(201).json(result);
});}

getProduktyById(req,res){
    const idzlecenia = req.params['idzlecenia']
    var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and ID_zlecenia = '" + idzlecenia+ "' ORDER BY Typ ASC";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
}
);
}
getProduktyAllH1XLH3(req,res){
    const idzlecenia = req.params['idzlecenia']
    var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3')  ORDER BY Typ ASC";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
});
}

getProduktyAllnieoddane(req,res){
    var sql  = "select produkty.id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    ifnull(produkty.nazwa,'') as nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    ifnull(nrZlecenia,'0') as nrZlecenia ,    rokZlecenia ,    ifnull(klient,'-') as klient ,    ifnull(praca,'-') as praca ,    ifnull(naklad,'0') as naklad ,    formatPapieru ,    ifnull (oprawa,'-') as oprawa ,  ifnull(  oprawaCzas,'0') as oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,  ifnull(Arkusze,'0') as  arkusze ,    legi ,  ifnull(LegiRodzaj,'0') as legiRodzaj , ifnull(Przeloty,'0') as   przeloty ,    statusy.nazwa as status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty left join statusy on produkty.status = statusy.id where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and (Status !=12 or Status !=13 or Status !=14 ) ORDER BY Typ ASC";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
});
}

getProduktyByIdZleceniAndTyp(req,res){
    const idzlecenia = req.params['idzlecenia']
    const typ = req.params['typ']

    if(typ !== "null"){
    var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where ID_zlecenia = '" + idzlecenia+ "' and Typ = '" + typ + "' ORDER BY Typ ASC";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
                                    });
    }

    if(typ === "null"){
        var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where ID_zlecenia = '" + idzlecenia+ "' and Typ != 'Sep' ORDER BY Typ ASC";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                        });
        }

}


updateProduktyCzasDruk(req,res){

    const id = req.body.id;
    const czas = req.body.czas;
    const kolumna= req.body.kolumna;
    const poczatekDruku= req.body.poczatekDruku;
    const maszyna= req.body.maszyna;
    const zmianaczasu= req.body.zmianaczasu;
    const kierunek= req.body.kierunek;

  //  console.log("poczatek druku "+maszyna);

    var sql = "start transaction";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set " + kolumna + " = '" + czas + "' where id='" + id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });    

            var sql = "update produkty set KoniecDruku = '" + poczatekDruku + "' + interval '" + czas + "' minute  where id='" + id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });  

         

    if(kierunek == "zmniejszamy"){
           var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + zmianaczasu + "' minute, KoniecDruku = KoniecDruku - interval '" + zmianaczasu + "' minute  where PoczatekDruku > '" + poczatekDruku+ "' and Maszyna = '" + maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });
       }

       if(kierunek == "zwiekszamy"){
        var sql = "update produkty set PoczatekDruku = PoczatekDruku + interval '" + zmianaczasu + "' minute, KoniecDruku = KoniecDruku + interval '" + zmianaczasu + "' minute  where PoczatekDruku > '" + poczatekDruku+ "' and Maszyna = '" + maszyna+ "'  ";
         connection.query(sql, function (err, result) {
         if (err) throw err;
         });
    }

    var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
        });
}
//-----------Falcowanie
loadFalcowanie(req,res){
    
    var sql  = "select produkty.id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    produkty.nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    ROUND((Przeloty * (Legi/Arkusze)),0) as przeloty ,    statusy.nazwa as status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty left join statusy on produkty.status = statusy.id where LegiRodzaj != '0'  ORDER BY Spedycja ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
                                            });
   


}
//-------------Okładki
loadOkladki(req,res){
    const view = req.params['view']

    if(view == "All"){
    var sql  = "select produkty.id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    produkty.nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,   statusy.nazwa as status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty left join statusy on produkty.status = statusy.id where ( Folia != '-' and Folia is not null and Folia !='Dyspersja błysk' and Folia !='Dyspersja mat') ORDER BY Spedycja ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
                                            });
    }

    if(view == "Wydrukowane"){
        var sql  = "select produkty.id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    produkty.nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    statusy.nazwa as status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty left join statusy on produkty.status = statusy.id where ( Folia != '-' and Folia is not null and Folia !='Dyspersja błysk' and Folia !='Dyspersja mat') and (Status =7 or Status =10) ORDER BY Spedycja ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
                                                });
        }
}

//-------------Blachy
loadBlachy(req,res){
    //const view = req.params['view']
    //  var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia ,    ifnull(Klient,'') as klient ,    ifnull(Praca,'') as praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    DATE_FORMAT(`DataCTP`, '%Y-%m-%d %H:%i:%s') AS `dataCtp` from produkty where typ != 'Przerwa' ORDER BY Kolejnosc ASC;";
    var sql  = "select produkty.id,id_zlecenia ,    utworzono ,    produkty.zmodyfikowano ,    kolejnosc ,    typ ,    produkty.nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia ,    ifnull(Klient,'') as klient ,    ifnull(Praca,'') as praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    statusy.nazwa as status,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    DATE_FORMAT(`DataCTP`, '%Y-%m-%d %H:%i:%s') AS `dataCtp`,ifnull(papier_stan.czy_jest,'')  as czy_jest from produkty left join statusy on produkty.status = statusy.id left join papier_stan on produkty.id = papier_stan.produkt_id where (typ != 'Przerwa' and typ !='Licznik' and typ !='Part') ORDER BY produkty.status DESC ;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
                                            });
    

}

loadListaKontrolna(req,res){
  
    var sql  = "select id, kolejnosc,nazwa , grupa  from listakontrolna ORDER BY Kolejnosc ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
                                            });
}

loadGrupy(req,res){
  
    var sql  = "select id, DATE_FORMAT(`poczatek`, '%Y-%m-%d %H:%i') AS `poczatek`,DATE_FORMAT(`koniec`, '%Y-%m-%d %H:%i') AS `koniec`,stan from grupa ORDER BY id ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    res.status(200).json(doc);
                                            });
}



postBlachyLicznik(req,res){
    const kolejnosc = req.body.kolejnosc;

   var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

    var sql = "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc > '" + kolejnosc + "'";
    connection.query(sql, function (err, result) {
    if (err) throw err;
                                                });
    var sql = "INSERT INTO produkty  (ID,Kolejnosc,Praca,DataCTP,Typ,Maszyna)  SELECT MAX(ID)+1,'" + kolejnosc + "'+1,CONCAT('--------  ZAŚWIECONE  od  ',now()),now(),'Licznik','L' from produkty";
    connection.query(sql, function (err, result) {
    if (err) throw err;
                                                });
    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Licznik dodany! ");
   res.status(201).json(result);
});
}

//---------
postBlachyKopia(req,res){
const kolejnosc = req.body.kolejnosc;
const ID_zlecenia = req.body.ID_zlecenia;
const maszyna = req.body.maszyna;
const nrzlecenia = req.body.nrzlecenia;
const rokzlecenia = req.body.rokzlecenia;
const klient = req.body.klient;
const praca = req.body.praca;

var sql = "start transaction";
connection.query(sql, function (err, result) {
if (err) throw err;  });

var sql = "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc > '" + kolejnosc + "'";
connection.query(sql, function (err, result) {
if (err) throw err;
                                            });
var sql = "INSERT INTO produkty  (ID,Kolejnosc,ID_zlecenia,Typ,Maszyna,NrZlecenia,RokZlecenia,Klient,Praca,Arkusze)  SELECT MAX(ID)+1,'" + kolejnosc + "'+1,'" + ID_zlecenia + "','Part',CONCAT('P','" + maszyna + "'),'" + nrzlecenia + "','" + rokzlecenia + "','" + klient + "','" + praca + "','0' from produkty";
connection.query(sql, function (err, result) {
if (err) throw err;
                                            });
var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("Kopia blachy! ");
res.status(201).json(result);
});
}

//-----------------
deleteBlachy(req,res){
const id = req.body.id;
const kolejnosc = req.body.kolejnosc;

var sql = "start transaction";
connection.query(sql, function (err, result) {
if (err) throw err;  });

var sql = "DELETE FROM produkty WHERE ID =" +id+ "";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record delete ");
  //  res.status(204).json(result);
});

var sql = "update produkty set  Kolejnosc=Kolejnosc -1  WHERE Kolejnosc >" +kolejnosc+ "";
        connection.query(sql, function (err, result) {
        if (err) throw err;

});

var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("Skasoway licznik albo coś doświecane! ");
res.status(201).json(result);
                    });
}

//-------------
updateKolejnoscZgoryNaDol(req,res){
const k1_drag = req.body.k1_drag;
const k2_drop = req.body.k2_drop;
const widok = req.body.widok;
const id_drag = req.body.id_drag;


connection.query("start transaction", function (err, result) { if (err) throw err;  });

    if(widok=="Oprawa"){
        var sql = "update zlecenia set KolejnoscOprawa = KolejnoscOprawa+1 where KolejnoscOprawa>'" + k2_drop + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

        var sql = "update zlecenia set KolejnoscOprawa = '" + k2_drop + "'+1 where id='" + id_drag + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

        var sql = "update zlecenia  set KolejnoscOprawa = KolejnoscOprawa-1 where KolejnoscOprawa>'" + k1_drag + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });
    }

    
    if(widok=="Blachy"){
        var sql= "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc>'" + k2_drop + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

        var sql = "update produkty set Kolejnosc = '" + k2_drop + "'+1 where id='" + id_drag + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

        var sql = "update produkty  set Kolejnosc = Kolejnosc-1 where Kolejnosc>'" + k1_drag + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });
    }

connection.query("commit", function (err, result) { if (err) throw err;  console.log("z gory do dolu ");  res.status(201).json(result); });

}

updateKolejnoscZdoluNaGore(req,res){
const k_drag = req.body.k_drag;
const k_drop = req.body.k_drop;
const widok = req.body.widok;
const id_drag = req.body.id_drag;


connection.query("start transaction", function (err, result) { if (err) throw err;  });

    if(widok=="Oprawa"){
        var sql = "update zlecenia set KolejnoscOprawa = KolejnoscOprawa+1 where KolejnoscOprawa>='" + k_drop + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

        var sql = "update zlecenia set KolejnoscOprawa = '" + k_drop + "' where id='" + id_drag + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

    }

    
    if(widok=="Blachy"){
        var sql= "update produkty set Kolejnosc = Kolejnosc+1 where Kolejnosc>='" + k_drop + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });

        var sql  = "update produkty set Kolejnosc = '" + k_drop + "' where id='" + id_drag + "'";
        connection.query(sql, function (err, result) {    if (err) throw err;  });
    }

connection.query("commit", function (err, result) { if (err) throw err;  console.log("z dolu na gore ");  res.status(201).json(result); });

}




getZlecenia(req,res){

        const WHEREZLECENIA = req.params['WHEREZLECENIA']

        var sql = "SELECT zlecenia.id,utworzono, zmodyfikowano,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia, "+
        "klient,praca,naklad , "+
        "oprawa ,  "+
        "oprawa_czas as oprawaCzas , "+
        "uv as folia , "+
        "DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , "+
        "druk_przeloty as przeloty , "+
        "statusGlowny.nazwa as status ,"+
        "uwagi , "+
        "falc_czas as falcCzas , "+
        "kolejnoscOprawa , ifnull( statusSrodek.nazwa,'-') as srodek , ifnull(statusOkladka.nazwa,'-') as okladka,statusInne.nazwa as inne "+

        "from zlecenia "+
        "left join statusy as statusGlowny on zlecenia.status_glowny  = statusGlowny.id "+
        "left join statusy as statusSrodek on zlecenia.status_srodek = statusSrodek.id "+
        "left join statusy as statusOkladka on zlecenia.status_okladka = statusOkladka.id "+
        "left join statusy as statusInne on zlecenia.status_inne  = statusInne.id "+
        " "+WHEREZLECENIA+" ORDER BY Utworzono ASC;";
        
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    


    getZleceniaNieoddane(req,res){


        var sql = "SELECT zlecenia.id,utworzono, zmodyfikowano,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia, "+
        "klient,praca,naklad , "+
        "oprawa ,  "+
        "oprawa_czas as oprawaCzas , "+
        "uv as folia , "+
        "DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` , "+
        "druk_przeloty as przeloty , "+
        "statusGlowny.nazwa as status ,"+
        "uwagi , "+
        "falc_czas as falcCzas , "+
        "kolejnoscOprawa ,  ifnull(statusSrodek.nazwa,'') as srodek , statusOkladka.nazwa as okladka,statusInne.nazwa as inne "+

        "from zlecenia "+
        "left join statusy as statusGlowny on zlecenia.status_glowny  = statusGlowny.id "+
        "left join statusy as statusSrodek on zlecenia.status_srodek = statusSrodek.id "+
        "left join statusy as statusOkladka on zlecenia.status_okladka = statusOkladka.id "+
        "left join statusy as statusInne on zlecenia.status_inne  = statusInne.id "+
        " where statusGlowny.id < 12 ORDER BY Utworzono ASC;";
        
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);

   
    });}


    getMaxNrZlecenia(req,res){
        var sql  = "SELECT  max(NrZlecenia)+1 as klient FROM zlecenia where RokZlecenia = YEAR(now()) ;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        //sconsole.log(doc);
        res.status(200).json(doc);
    });}

    getZlecenieById(req,res){
        const id = req.params['id']
        var sql =   "SELECT id,ifnull(NrZlecenia,'') as nrZlecenia,ifnull(RokZlecenia,'') as rokZlecenia,"+
                    "klient,praca,naklad , "+
                    "  DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,  uwagi "+
                    "     FROM zlecenia where id='"+id+"' ORDER BY Utworzono ASC;";
        connection.query(sql, function (err, doc) {
        if (err) throw err;
        res.status(200).json(doc);
    });}

    updateZlecenieOneValue(req,res){
        const id = req.body.id;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
        var sql = "update zlecenia set " + kolumna + " = '" + value + "' where id="+id;
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}

    updatePapierStanOneValue(req,res){
        const id = req.body.id;
        const kolumna = req.body.kolumna;
        const value = req.body.value;
        var sql = "update papier_stan set " + kolumna + " = '" + value + "' where produkt_id="+id;
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update papier stan");
        res.status(201).json(result);
    });}





    updateStatus(req,res){
        const id = req.body.id;
        const value = req.body.value;
        const idzlecenia = req.body.idzlecenia;

        var sql = "start transaction";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update produkty set status= '" + value + "' where id="+id;
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "update ctp21.zlecenia set status_srodek = (select min(status) from ctp21.produkty where produkty.id_zlecenia = '" + idzlecenia + "' and typ='Środek') ,  status_okladka = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' and typ='Okładka') , status_inne = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' and typ='Inne') , status_glowny = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' ) where zlecenia.id = '" + idzlecenia + "';";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });




var sql = "commit";
connection.query(sql, function (err, result) {
if (err) throw err;
console.log("1 record update ");
res.status(201).json(result);
});


}

//--- update wszstykie statusy produktów dla danego zlecenia
updateStatusZlecenia(req,res){
    const idzlecenia = req.body.idzlecenia;
    const value = req.body.value;

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    });
            var sql = "update produkty set status= '" + value + "' where ID_zlecenia="+idzlecenia;
            connection.query(sql, function (err, result) {
            if (err) throw err;
     
            });


            var sql = "update ctp21.zlecenia set status_srodek = (select min(status) from ctp21.produkty where produkty.id_zlecenia = '" + idzlecenia + "' and typ='Środek') ,  status_okladka = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' and typ='Okładka') , status_inne = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' and typ='Inne') , status_glowny = (select min(status) from ctp21.produkty where produkty.id_zlecenia ='" + idzlecenia + "' ) where zlecenia.id = '" + idzlecenia + "';";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                });

                var sql = "commit";
                connection.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record update ");
                res.status(201).json(result);
                });

}
//---




    updateZlecenieAllValue(req,res){
        const id = req.body.id;
        const nr = req.body.nr;
        const rok = req.body.rok;
        const klient = req.body.klient;
        const praca = req.body.praca;
        const naklad = req.body.naklad;
        const spedycja = req.body.spedycja;


        var sql = "update zlecenia set  NrZlecenia='" + nr + "', RokZlecenia='" + rok + "', Klient='" + klient + "', Praca='" + praca + "', Naklad='" + naklad + "', Spedycja='" + spedycja + "'  where ID='"+id+"'";
    
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record update ");
        res.status(201).json(result);
    });}



    postZlecenie(req,res){

         const jsonParsed = JSON.parse(JSON.stringify(req.body))
        // console.log(jsonParsed.persons[0].city);
        // console.log(Object.keys(jsonParsed.persons).length);
        // console.log(req.body);
        // console.log(jsonParsed[0].oprawa);
    //    console.log(Object.keys(jsonParsed[1]).length);
    //    console.log(jsonParsed[1][0].folia);

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        var sql ="INSERT INTO zlecenia  (ID,KolejnoscOprawa,NrZlecenia,RokZlecenia,Klient,Praca,Naklad,Spedycja,status_glowny) SELECT MAX(ID)+1,(SELECT MAX(KolejnoscOprawa)+1),'" + jsonParsed[0].nr + "','" + jsonParsed[0].rok + "','"+ jsonParsed[0].klient + "','"+ jsonParsed[0].praca + "','"+ jsonParsed[0].naklad + "','"+ jsonParsed[0].spedycja + "', '1' FROM zlecenia";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        var sql = "INSERT INTO historia (User,Kategoria,Event,ID_target,NrZlecenia,RokZlecenia,Klient,Praca,Typ,StatusStary,StatusNowy) values ('" + jsonParsed[0].user + "','Zlecenie','Dodanie zlecenia',(SELECT MAX(ID) from zlecenia),'" + jsonParsed[0].nr + "','" + jsonParsed[0].rok + "','" + jsonParsed[0].klient + "','" + jsonParsed[0].praca + "','Zlecenie','',''); ";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        for (let i = 0; i < Object.keys(jsonParsed[1]).length; i++) {
      
            var sql = "INSERT INTO produkty  (ID,Kolejnosc,Naklad,Spedycja,ID_Zlecenia,NrZlecenia,RokZlecenia,Klient,Status,Praca,Oprawa,Uwagi,Narzad,Folia,Przeloty,PredkoscDruku,Arkusze,Legi,LegiRodzaj,FalcCzas,FalcPredkosc,OprawaCzas,FormatPapieru,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku) SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" +jsonParsed[0].naklad+ "','" +jsonParsed[0].spedycja+ "', (select MAX(ID) from zlecenia) as ID_Zlecenia ,'"+ jsonParsed[0].nr + "','"+ jsonParsed[0].rok + "','"+ jsonParsed[0].klient + "',1,'"+ jsonParsed[1][i].praca + "','"+ jsonParsed[1][i].oprawa+ "','"+ jsonParsed[1][i].uwagi+ "','"+ jsonParsed[1][i].narzad+ "','"+ jsonParsed[1][i].folia+ "','"+ jsonParsed[1][i].przeloty+ "','"+ jsonParsed[1][i].predkoscDruku+ "','"+ jsonParsed[1][i].arkusze+ "','"+ jsonParsed[1][i].legi+ "','"+ jsonParsed[1][i].legiRodzaj+ "','"+ jsonParsed[1][i].falcCzas+ "','"+ jsonParsed[1][i].falcPredkosc+ "','"+ jsonParsed[1][i].oprawaCzas+ "','"+ jsonParsed[1][i].formatPapieru+ "','"+ jsonParsed[1][i].maszyna + "','"+ jsonParsed[1][i].typ + "', (select MAX(KoniecDruku) from produkty where maszyna='"+ jsonParsed[1][i].maszyna + "') as PoczatekDruku ,'"+ jsonParsed[1][i].czasDruku+ "',(select MAX(KoniecDruku) from produkty where maszyna='"+ jsonParsed[1][i].maszyna + "') + interval '"+ jsonParsed[1][i].czasDruku+ "' minute as KoniecDruku  FROM produkty";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

            var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

            var sql = "INSERT INTO papier_stan  (produkt_id) select (SELECT MAX(id) from produkty) as id ;";
            connection.query(sql, function (err, result) {
            if (err) throw err; });



          }

    
        var sql ="update ctp21.zlecenia set druk_przeloty = (select sum(przeloty) from ctp21.produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id)), "+
        "druk_czas = (select sum(czasdruku) from ctp21.produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id)), "+
        "oprawa = (select oprawa from produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id) and typ='Środek' limit 1), "+
        "oprawa_czas = (select sum(OprawaCzas) from produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id) ), "+
        "falc_czas = (select sum(falcczas) from produkty where id_zlecenia =(select max(id) from (select id from zlecenia) as id) ), "+
        "legi = (select sum(legi) from produkty where id_zlecenia =(select max(id) from (select id from zlecenia) as id)  and typ='Środek'), "+
        "rodzaj_legi = (select legirodzaj from produkty where id_zlecenia =(select max(id) from (select id from zlecenia) as id)  and typ='Środek' limit 1), "+
        "falc_przeloty = (select sum(ROUND((Przeloty * (Legi/Arkusze)),0)) from ctp21.produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id) ), "+
        "uv = (select folia from produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id)  and typ='Okładka' limit 1) where id =(select max(id) from (select id from zlecenia) as id);";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

    
        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record insert ");
    res.status(200).json(result);
    });
        
    
}
//----------

postZlecenia_z_EXCELA(req,res){

    // dodawanie zleceń z tabelki   - w trakcie budowy

    const jsonParsed = JSON.parse(JSON.stringify(req.body))

   var sql = "start transaction";
   connection.query(sql, function (err, result) {
   if (err) throw err;  });

   



   for (let i = 0; i < Object.keys(jsonParsed[0]).length; i++) {

        var sql ="INSERT INTO zlecenia  (ID,KolejnoscOprawa,NrZlecenia,RokZlecenia,Klient,Praca,Naklad,Spedycja,status_glowny) SELECT MAX(ID)+1,(SELECT MAX(KolejnoscOprawa)+1),'" + jsonParsed[0][i].nr + "','" + jsonParsed[0][i].rok + "','"+ jsonParsed[0][i].klient + "','"+ jsonParsed[0][i].praca + "','"+ jsonParsed[0][i].naklad + "','"+ jsonParsed[0][i].spedycja + "','15' FROM zlecenia";
        connection.query(sql, function (err, result) {
        if (err) throw err; });


            // okładka
       var sql = "INSERT INTO produkty  (ID,Kolejnosc,Naklad,Spedycja,ID_Zlecenia,NrZlecenia,RokZlecenia,Klient,Status,Praca,Oprawa,Uwagi,Narzad,Folia,Przeloty,PredkoscDruku,Arkusze,Legi,LegiRodzaj,FalcCzas,FalcPredkosc,OprawaCzas,FormatPapieru,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku) SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" +jsonParsed[0][i].naklad+ "','" +jsonParsed[0][i].spedycja+ "', (select MAX(ID) from zlecenia) as ID_Zlecenia ,'"+ jsonParsed[0][i].nr + "','"+ jsonParsed[0][i].rok + "','"+ jsonParsed[0][i].klient + "',15,'"+ jsonParsed[0][i].praca + "','-',' ','10','"+ jsonParsed[0][i].lakier+ "','"+ jsonParsed[0][i].przelotydrukokladka+ "','12000','"+ jsonParsed[0][i].arkusze+ "','"+ jsonParsed[0][i].legi+ "','0','0','0','0',' ','XL','Okładka', (select MAX(KoniecDruku) from produkty where maszyna='XL') as PoczatekDruku ,'"+ jsonParsed[0][i].czasdrukuokladka+ "',(select MAX(KoniecDruku) from produkty where maszyna='XL') + interval '"+ jsonParsed[0][i].czasdrukuokladka+ "' minute as KoniecDruku  FROM produkty";
       connection.query(sql, function (err, result) {
       if (err) throw err; });

       var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
       connection.query(sql, function (err, result) {
       if (err) throw err; });

        // srodek

        var sql = "INSERT INTO produkty  (ID,Kolejnosc,Naklad,Spedycja,ID_Zlecenia,NrZlecenia,RokZlecenia,Klient,Status,Praca,Oprawa,Uwagi,Narzad,Folia,Przeloty,PredkoscDruku,Arkusze,Legi,LegiRodzaj,FalcCzas,FalcPredkosc,OprawaCzas,FormatPapieru,Maszyna,Typ,PoczatekDruku,CzasDruku,KoniecDruku) SELECT MAX(ID)+1,(SELECT MAX(Kolejnosc)+1),'" +jsonParsed[0][i].naklad+ "','" +jsonParsed[0][i].spedycja+ "', (select MAX(ID) from zlecenia) as ID_Zlecenia ,'"+ jsonParsed[0][i].nr + "','"+ jsonParsed[0][i].rok + "','"+ jsonParsed[0][i].klient + "',15,'"+ jsonParsed[0][i].praca + "','"+ jsonParsed[0][i].oprawa+ "',' ','22','-','"+ jsonParsed[0][i].przelotydruk+ "','6000','"+ jsonParsed[0][i].arkusze+ "','"+ jsonParsed[0][i].legi+ "','"+ jsonParsed[0][i].rodzajlegi+ "','"+ jsonParsed[0][i].czasfalcowania+ "','"+ jsonParsed[0][i].predkoscfalcowania+ "','"+ jsonParsed[0][i].czasoprawy+ "',' ','H3','Środek', (select MAX(KoniecDruku) from produkty where maszyna='H3') as PoczatekDruku ,'"+ jsonParsed[0][i].czasdruku+ "',(select MAX(KoniecDruku) from produkty where maszyna='H3') + interval '"+ jsonParsed[0][i].czasdruku+ "' minute as KoniecDruku  FROM produkty";
        connection.query(sql, function (err, result) {
        if (err) throw err; });
 
        var sql = "INSERT INTO naswietlenia  (produkt_id,kolej,typ) select (SELECT MAX(id) from produkty) as id, (select MAX(kolej)+1 from naswietlenia) as kolej,'prime' ;";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

        var sql = "INSERT INTO papier_stan  (produkt_id) select (SELECT MAX(id) from produkty) as id ;";
        connection.query(sql, function (err, result) {
        if (err) throw err; });


        var sql ="update ctp21.zlecenia set druk_przeloty = (select sum(przeloty) from ctp21.produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id)), "+
        "druk_czas = (select sum(czasdruku) from ctp21.produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id)), "+
        "oprawa = (select oprawa from produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id) and typ='Środek' limit 1), "+
        "oprawa_czas = (select sum(OprawaCzas) from produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id) ), "+
        "falc_czas = (select sum(falcczas) from produkty where id_zlecenia =(select max(id) from (select id from zlecenia) as id) ), "+
        "legi = (select sum(legi) from produkty where id_zlecenia =(select max(id) from (select id from zlecenia) as id)  and typ='Środek'), "+
        "rodzaj_legi = (select legirodzaj from produkty where id_zlecenia =(select max(id) from (select id from zlecenia) as id)  and typ='Środek' limit 1), "+
        "falc_przeloty = (select sum(ROUND((Przeloty * (Legi/Arkusze)),0)) from ctp21.produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id) ), "+
        "uv = (select folia from produkty where id_zlecenia = (select max(id) from (select id from zlecenia) as id)  and typ='Okładka' limit 1) where id =(select max(id) from (select id from zlecenia) as id) ;";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

     }


   var sql = "commit";
   connection.query(sql, function (err, result) {
   if (err) throw err;
   console.log("1 record insert ");
res.status(200).json(result);
});
   

}
//----------

deleteZlecenie(req,res){
        const idzlecenia = req.body.idzlecenia;
        const kolejnosc = req.body.kolejnosc;
        const kolejnoscoprawa = req.body.kolejnoscoprawa;
   

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        //----  pobieramy wszystkie podroduktu których idzlecenia = req.body.idzlecenia i kasujemy w pętli
          var sql  = "select id,id_zlecenia ,    utworzono ,    zmodyfikowano ,    kolejnosc ,    typ ,    nazwa ,    maszyna ,   DATE_FORMAT(`PoczatekDruku`, '%Y-%m-%d %H:%i') AS `poczatekDruku` ,    predkoscDruku ,    narzad ,    czasDruku ,    DATE_FORMAT(`KoniecDruku`, '%Y-%m-%d %H:%i') AS `koniecDruku` ,    nrZlecenia ,    rokZlecenia ,    klient ,    praca ,    naklad ,    formatPapieru ,    oprawa ,    oprawaCzas ,   oprawaPredkosc ,    folia ,    DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,    arkusze ,    legi ,    legiRodzaj ,    przeloty ,    status ,    uwagi ,    sm_ok ,    sm_dmg ,    xl_ok ,    xl_dmg ,    falcPredkosc ,    falcCzas ,    dataCtp from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and ID_zlecenia = '" + idzlecenia+ "' ORDER BY Typ ASC";

        connection.query(sql, function (err, doc) {
        if (err) throw err;

        for (let i = 0; i < Object.keys(doc).length; i++) {
            // console.log(doc[i].typ);
            var sql = "DELETE FROM produkty WHERE ID = '" + doc[i].id + "'";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "update produkty set PoczatekDruku = PoczatekDruku - interval '" + doc[i].czasDruku + "' minute, KoniecDruku = KoniecDruku - interval '" + doc[i].czasDruku + "' minute  where PoczatekDruku > '" + doc[i].poczatekDruku+ "' and Maszyna = '" + doc[i].maszyna+ "'  ";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });

            var sql = "DELETE FROM naswietlenia WHERE produkt_id =" +doc[i].id + "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
          
            });

            var sql = "DELETE FROM papier_stan WHERE produkt_id =" +doc[i].id + "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
          
            });



          }
        //console.log(doc);
        });
        //--------koniec kasowania pojedynczych produktów

        var sql = "DELETE FROM zlecenia WHERE ID =" +idzlecenia+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });


            var sql = "update zlecenia set  KolejnoscOprawa=KolejnoscOprawa -1  WHERE KolejnoscOprawa >" +kolejnoscoprawa+ "";
            connection.query(sql, function (err, result) {
            if (err) throw err;
            });  
        

    

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Zlecenie skasowane! ");
    res.status(201).json(result);
    });
    }

    //---------utworzenie statusów

    generujStusyProduktow(req,res){
            // kopiuje staare statusy do tabeli produktystatus podając id statusu
        const status = new Map();
        status.set("Nieaktywne", "0");
        status.set("Nowe", "1");
        status.set("Pliki", "2");
        status.set("Akcept", "3");
        status.set("RIP", "4");
        status.set("Zaświecone", "5");
        status.set("Wydrukowane", "6");
        status.set("Sfalcowane", "7");
        status.set("Uszlachetnone", "8");
        status.set("Oprawione", "9");
        status.set("Oddane", "10");
        status.set("Anulowane", "11");

        var sql = "start transaction";
        connection.query(sql, function (err, result) {
        if (err) throw err;  });

        //----  pobieramy wszystkie podroduktu których idzlecenia = req.body.idzlecenia i kasujemy w pętli
        var sql  = "select id,ifnull(ID_Zlecenia,0) as id_zlecenia ,   status  from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3') and (typ != 'Przerwa' or typ !='Licznik') ";
        connection.query(sql, function (err, doc) {
        if (err) throw err;

        for (let i = 0; i < Object.keys(doc).length; i++) {
            // console.log(doc[i].typ);
            var sql = "INSERT INTO produktystatus  (idproduktu,idzlecenia,idstatusu) values ('" + doc[i].id + "','" + doc[i].id_zlecenia + "','" + status.get(doc[i].status) + "');";
            connection.query(sql, function (err, result) {
            if (err) throw err; });

          }
        //console.log(doc);
        });

        var sql = "commit";
        connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Statusy skopiowane! ");
    res.status(201).json(result);
    });
    }


  //---- generowanie naświetlen - funkcja tymczasowa do zbudowania tabeli naswietlenia

    generujTabeleNaswietlenia_temp(req,res){
        // tymczasowy tworca tabeli naswietlenia - aby przeniesc ilosc blach


    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });


    var sql  = "select id,ifnull(xl_ok,0) as xl_ok, ifnull( DATE_FORMAT(`dataCtp`, '%Y-%m-%d %H:%i:%s'),'2081-05-20 08:15:00') AS `datactp` from produkty where Maszyna='XL' and (typ != 'Przerwa' or typ !='Licznik') ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);
        var sql = "INSERT INTO naswietlenia  (produkt_id,ilosc,typ,blacha_id,data) values ('" + doc[i].id + "'," + doc[i].xl_ok + ",'prime',2,'" + doc[i].datactp + "');";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });

    var sql  = "select id,ifnull(sm_ok,0) as sm_ok,ifnull( DATE_FORMAT(`dataCtp`, '%Y-%m-%d %H:%i:%s'),'2081-05-20 08:15:00') AS `datactp`  from produkty where (Maszyna='H1' or Maszyna='H3')  and (typ != 'Przerwa' or typ !='Licznik') ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);
        var sql = "INSERT INTO naswietlenia  (produkt_id,ilosc,typ,blacha_id,data) values ('" + doc[i].id + "'," + doc[i].sm_ok + ",'prime',1,'" + doc[i].datactp + "');";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });




    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Naświetlenia skopiowane! ");
res.status(201).json(result);
});
}
    //---   koniec generowania naswietlen

    //--- generowanie dostaw temp

    generujDostawy_temp(req,res){
        // tymczasowy tworca tabeli naswietlenia - aby przeniesc ilosc blach


    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });


    var sql  = "select id from produkty where (Maszyna='H1' or Maszyna='XL' or Maszyna='H3' )and (typ != 'Przerwa' or typ !='Licznik') ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);

        var sql = "INSERT INTO papier_stan  (produkt_id) values ('" + doc[i].id + "');";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });

    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Dostawy wygenerowane! ");
res.status(201).json(result);
});
}

//------
    //---------generuj zlecenia
    generujStusyZlecen(req,res){
        // kopiuje staare statusy do tabeli zleceniastatus podając id statusu
    const status = new Map();
    status.set("Nieaktywne", "0");
    status.set("Nowe", "1");
    status.set("Pliki", "2");
    status.set("Akcept", "3");
    status.set("RIP", "4");
    status.set("Zaświecone", "5");
    status.set("Wydrukowane", "6");
    status.set("Sfalcowane", "7");
    status.set("Uszlachetnone", "8");
    status.set("Oprawione", "9");
    status.set("Oddane", "10");
    status.set("Anulowane", "11");

    var sql = "start transaction";
    connection.query(sql, function (err, result) {
    if (err) throw err;  });

  

    //----  pobieramy wszystkie podroduktu których idzlecenia = req.body.idzlecenia i kasujemy w pętli
    var sql  = "select id,status,srodek,okladka  from zlecenia ";
    connection.query(sql, function (err, doc) {
    if (err) throw err;

    for (let i = 0; i < Object.keys(doc).length; i++) {
        // console.log(doc[i].typ);
        var sql = "INSERT INTO zleceniastatus  (idzlecenia,idstatusu,idstatususrodek,idstatusuokladka,idstatusuinne) values ('" + doc[i].id + "','" + status.get(doc[i].status) + "','" + status.get(doc[i].srodek) + "','" + status.get(doc[i].okladka) + "',12);";
        connection.query(sql, function (err, result) {
        if (err) throw err; });

      }
    //console.log(doc);
    });

    var sql = "commit";
    connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Statusy skopiowane! ");
res.status(201).json(result);
});
}




   loadOprawa(req,res){
    var sql = "SELECT zlecenia.id,zlecenia.utworzono, zlecenia.zmodyfikowano,ifnull(zlecenia.NrZlecenia,'') as nrZlecenia,ifnull(zlecenia.RokZlecenia,'') as rokZlecenia, "+
    "zlecenia.klient,zlecenia.praca,zlecenia.naklad  , "+
    "ifnull(oprawa,'') as oprawa , "+
    "oprawa_czas as oprawaCzas , "+
    //"(select max(OprawaPredkosc) from produkty where id_zlecenia =zlecenia.id) as oprawaPredkosc ,  "+
    "uv as folia ,  "+
    "DATE_FORMAT(`spedycja`, '%Y-%m-%d') AS `spedycja` ,   "+
    "druk_przeloty as przeloty , "+
   //  "(select sum(przeloty) from produkty where id_zlecenia =zlecenia.id) as przeloty , "+
   " statusGlowny.nazwa as status , zlecenia.uwagi , "+
   // "(select max(FalcPredkosc) from produkty where id_zlecenia =zlecenia.id) as falcPredkosc,  "+
    "legi , "+
    "rodzaj_legi as legiRodzaj ,  "+
    "falc_czas as falcCzas  ,  zlecenia.kolejnoscOprawa ,  statusSrodek.nazwa as srodek , statusOkladka.nazwa as okladka,statusInne.nazwa as inne from zlecenia "+
   " left join statusy as statusGlowny on zlecenia.status_glowny  = statusGlowny.id "+
    "left join statusy as statusSrodek on zlecenia.status_srodek = statusSrodek.id "+
    "left join statusy as statusOkladka on zlecenia.status_okladka = statusOkladka.id "+
    "left join statusy as statusInne on zlecenia.status_inne  = statusInne.id "+
    // "where spedycja > (now() - interval (select 2-1) month)  ORDER BY KolejnoscOprawa ASC;";
    //"where spedycja > (select max(spedycja) from produkty where status =12) - interval 31 day  ORDER BY KolejnoscOprawa ASC;";
    "ORDER BY KolejnoscOprawa ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

getMagazynZamowienia(req,res){
    var sql = "SELECT magazyn_zamowienia.id,DATE_FORMAT(`data`, '%Y-%m-%d') AS `data`, blacha.typ as id_blacha ,ilosc_sztuki,ilosc_opakowania,  DATE_FORMAT(`termin_dostawy`, '%Y-%m-%d') AS `termin_dostawy` , status FROM magazyn_zamowienia left join blacha on magazyn_zamowienia.id_blacha = blacha.id ORDER BY data ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

getMagazynDostawy(req,res){
    var sql = "SELECT id,DATE_FORMAT(`data`, '%Y-%m-%d %H:%i:%s') AS `data`,  id_zamowienia  FROM magazyn_dostawy ORDER BY data ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

getMagazynListy(req,res){
    var sql = "SELECT id,DATE_FORMAT(`data_zaladunku`, '%Y-%m-%d') AS `data_zaladunku`,  id_dostawa,id_zamowienia  FROM magazyn_list ORDER BY data_zaladunku ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

getMagazynZaladunki(req,res){
    var sql = "SELECT id,id_blacha,id_list,ilosc_sztuki,ilosc_opakowania,id_dostawa,id_zamowienie  FROM magazyn_zaladunki ORDER BY id ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}



getMagazynPalety(req,res){
    var sql = "SELECT id, id_lokalizacja FROM magazyn_paleta ORDER BY id ASC;";
    connection.query(sql, function (err, doc) {
    if (err) throw err;
    //sconsole.log(doc);
    res.status(200).json(doc);
});}

}

module.exports = new Connections();