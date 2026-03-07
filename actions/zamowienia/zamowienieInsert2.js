const { pool } = require("../mysql");
const { DecodeToken } = require("../logowanie/DecodeToken");
const { ifNoDateSetNull_exec } = require("../czas/ifNoDateSetNull_exec");
const { getShortYear } = require("../czas/getShortYear");

const zamowienieInsert = async (req, res) => {
  const token = req.params['token'];
  // Rozbijamy body na poszczególne części
  const [produkty, elementy, fragmenty, oprawa, procesyElementow, pakowanie, kosztyDodatkoweZamowienia, ksiegowosc, faktury, daneZamowienia, procesyProduktow] = req.body;

  // Pobieramy połączenie z puli
  const connection = await pool.getConnection();

  try {
    // START TRANSAKCJI
    await connection.beginTransaction();

    // Logika przygotowania danych (identyczna jak u Ciebie)
    let user_id = DecodeToken(token).id;
    let rok = getShortYear();
    let dZ = { ...daneZamowienia, utworzyl_user_id: user_id, rok: rok };

    if (dZ.etap < 3) {
      dZ.nr = ""; dZ.status = 1;
      if (dZ.stan == 1) dZ.stan = 1;
      else if (dZ.stan == 2 || dZ.stan == 3) dZ.stan = 2;
    } else {
      dZ = { ...dZ, nr: "", stan: 1, status: 1, etap: 2 };
    }

    // 1. INSERT GŁÓWNY (Zamówienie)
    const sqlMain = "INSERT INTO artdruk.zamowienia (rok,firma_id,klient_id,tytul,data_przyjecia,data_materialow,data_spedycji,opiekun_id,utworzyl_user_id,stan,status,uwagi,etap,waluta_id,vat_id,przedplata,cena,cena_z_kosztami,wartosc_zamowienia,wartosc_koncowa,termin_platnosci,fsc,skonto,nr_kalkulacji,nr_stary,kod_pracy,nr_zamowienia_klienta,isbn) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    const daneMain = [dZ.rok, dZ.firma_id, dZ.klient_id, dZ.tytul, ifNoDateSetNull_exec(dZ.data_przyjecia), ifNoDateSetNull_exec(dZ.data_materialow), ifNoDateSetNull_exec(dZ.data_spedycji), dZ.opiekun_id, dZ.utworzyl_user_id, dZ.stan, dZ.status, dZ.uwagi, dZ.etap, dZ.waluta_id, dZ.vat_id, dZ.przedplata, dZ.cena, dZ.cena_z_kosztami, dZ.wartosc_zamowienia, dZ.wartosc_koncowa, dZ.termin_platnosci, dZ.fsc, dZ.skonto, dZ.nr_kalkulacji, dZ.nr_stary, dZ.kod_pracy, dZ.nr_zamowienia_klienta, dZ.isbn];
    
    const [mainResult] = await connection.execute(sqlMain, daneMain);
    const zamowienie_id = mainResult.insertId;

    // Tablica na "wyniki", którą odeślemy na koniec (imitacja Promise.all)
    // Pierwszy element musi mieć zamowienie_id w [0][1]
    let resultsForFront = [
        [{ zapis: true }, { zamowienie_id: zamowienie_id }]
    ];

    // 2. INSERTY POTOMNE (używamy await na każdym)

    for (let p of produkty) {
      await connection.execute("INSERT INTO artdruk.zamowienia_produkty (id,zamowienie_id,nazwa,wersja,opiekun_zamowienia_id,uwagi,stan,status,etap,typ,ilosc_stron,format_x,format_y,oprawa,naklad,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
      [p.id, zamowienie_id, p.nazwa, p.wersja, p.opiekun_zamowienia_id, p.uwagi, p.stan, p.status, p.etap, p.typ, p.ilosc_stron, p.format_x, p.format_y, p.oprawa, p.naklad, p.indeks]);
      resultsForFront.push([{ zapis: true }]);
    }

    for (let e of elementy.filter(x => x.delete != true)) {
      await connection.execute("INSERT INTO artdruk.zamowienia_elementy (id,zamowienie_id,produkt_id,nazwa,typ,ilosc_stron,kolory,format_x,format_y,papier_id,papier_postac_id,naklad,info,uwagi,stan,status,etap,tytul,papier_info,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [e.id, zamowienie_id, e.produkt_id, e.nazwa, e.typ, e.ilosc_stron, e.kolory, e.format_x, e.format_y, e.papier_id, e.papier_postac_id, e.naklad, e.info, e.uwagi, e.stan, e.status, e.etap, e.tytul, e.papier_info, e.indeks]);
      
      await connection.execute("INSERT INTO artdruk.zamowienia_pliki (id,zamowienie_id,produkt_id,element_id,uwagi,stan,status,etap,indeks) values (?,?,?,?,?,?,?,?,?)",
      [e.id, zamowienie_id, e.produkt_id, e.id, e.uwagi, e.stan, e.status, 2, e.indeks]);
      resultsForFront.push([{ zapis: true }]);
    }

    for (let f of fragmenty.filter(x => x.delete != true)) {
      await connection.execute("INSERT INTO artdruk.zamowienia_fragmenty (id,zamowienie_id,produkt_id,element_id,oprawa_id,naklad,ilosc_stron,wersja,info,typ,indeks) values (?,?,?,?,?,?,?,?,?,?,?)",
      [f.id, zamowienie_id, f.produkt_id, f.element_id, f.oprawa_id, f.naklad, f.ilosc_stron, f.wersja, f.info, f.typ, f.indeks]);
      resultsForFront.push([{ zapis: true }]);
    }

    for (let o of oprawa.filter(x => x.delete != true)) {
      await connection.execute("INSERT INTO artdruk.zamowienia_oprawa (id,zamowienie_id,produkt_id,oprawa,naklad,bok_oprawy,data_spedycji,uwagi,wersja,data_czystodrukow,indeks) values (?,?,?,?,?,?,?,?,?,?,?)",
      [o.id, zamowienie_id, o.produkt_id, o.oprawa, o.naklad, o.bok_oprawy, ifNoDateSetNull_exec(o.data_spedycji), o.uwagi, o.wersja, ifNoDateSetNull_exec(o.data_czystodrukow), o.indeks]);
      resultsForFront.push([{ zapis: true }]);
    }

    for (let pe of procesyElementow.filter(x => x.delete != true)) {
      await connection.execute("INSERT INTO artdruk.zamowienia_procesy_elementow (id,zamowienie_id,ilosc_uzytkow,produkt_id,element_id,proces_id,front_ilosc,back_ilosc,front_kolor,back_kolor,info,nazwa_id,indeks) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [pe.id, zamowienie_id, pe.ilosc_uzytkow, pe.produkt_id, pe.element_id, pe.proces_id, pe.front_ilosc, pe.back_ilosc, pe.front_kolor, pe.back_kolor, pe.info, pe.nazwa_id, pe.indeks]);
      resultsForFront.push([{ zapis: true }]);
    }

    for (let pp of procesyProduktow.filter(x => x.delete != true)) {
      await connection.execute("INSERT INTO artdruk.zamowienia_procesy_produktow (id,indeks,utworzyl,zamowienie_id,oprawa_id,proces_id,nazwa_id,naklad,ilosc_uzytkow,info) values (?,?,?,?,?,?,?,?,?,?)",
      [pp.id, pp.indeks, user_id, zamowienie_id, pp.oprawa_id, pp.proces_id, pp.nazwa_id, pp.naklad, pp.ilosc_uzytkow, pp.info]);
      resultsForFront.push([{ zapis: true }]);
    }

    for (let pak of pakowanie) {
      await connection.execute("INSERT INTO artdruk.zamowienia_pakowanie(id,zamowienie_id,produkt_id,nazwa,naklad,uwagi,sztuki_w_paczce,rodzaj_pakowania,indeks) values (?,?,?,?,?,?,?,?,?)",
      [pak.id, zamowienie_id, pak.produkt_id, pak.nazwa, pak.naklad, pak.uwagi, pak.sztuki_w_paczce, pak.rodzaj_pakowania, pak.indeks]);
      resultsForFront.push([{ zapis: true }]);
    }

    await connection.execute("INSERT INTO artdruk.zamowienia_ksiegowosc (zamowienie_id,koszty_status,koszty_wartosc,faktury_status,faktury_wartosc,faktury_naklad,info) values (?,?,?,?,?,?,?)",
    [zamowienie_id, 1, "", 1, "", ksiegowosc.faktury_naklad, ksiegowosc.info]);
    resultsForFront.push([{ zapis: true }, { zamowienie_id: zamowienie_id }]);

    await connection.execute("INSERT INTO artdruk.oddania_grupy (zamowienie_id,id,status,typ) values (?,?,?,?)", [zamowienie_id, 1, 1, 1]);
    resultsForFront.push([{ zapis: true }]);

    // COMMIT - Zatwierdzamy wszystko
    await connection.commit();
    console.log("Transakcja OK, ID:", zamowienie_id);

    // Wysyłamy identyczną strukturę tablicy
    res.status(201).json(resultsForFront);

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("BŁĄD SQL - Robię ROLLBACK:", error);
    
    // Zwracamy błąd w formacie tablicy, żeby frontend się nie wywalił
    res.status(201).json([
        [{ zapis: false }, { message: error.message }]
    ]);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { zamowienieInsert };