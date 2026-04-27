const { pool } = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");

const zapiszTechnologie = async (req, res) => {
  // Rozpakowanie całego payloadu z frontendu
  const [
    daneTech, produktyTech, elementyTech, fragmentyTech, oprawaTech,
    arkusze, legi, legiFragmenty, grupaWykonan, grupaOprawaTech,
    wykonania, procesyElementowTech
  ] = req.body;

  // const conn = await pool.promise().getConnection();
  const conn = await pool.getConnection();


  try {
    await conn.beginTransaction();

    console.log(grupaOprawaTech)

    // 1. INSERT GŁÓWNY: Technologie
    const [resTech] = await conn.query(
      `INSERT INTO artdruk.technologie (nr, rok, tytul, firma_id, klient_id, zamowienie_id, autor_id, uwagi, opiekun_id, data_przyjecia, data_spedycji, data_materialow, stan, status, etap) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ${ifNoDateSetNull(daneTech.data_przyjecia)}, ${ifNoDateSetNull(daneTech.data_spedycji)}, ${ifNoDateSetNull(daneTech.data_materialow)}, ?, ?, ?)`,
      [daneTech.nr, daneTech.rok, daneTech.tytul, daneTech.firma_id, daneTech.klient_id, daneTech.zamowienie_id, daneTech.autor_id, daneTech.uwagi, daneTech.opiekun_id, daneTech.stan, daneTech.status, daneTech.etap]
    );
    
    const technologia_id = resTech.insertId;

    // Funkcja pomocnicza do masowych insertów (z podmianą technologia_id)
    const massInsert = async (table, data, columns, idField = 'technologia_id') => {
      if (!data || data.length === 0) return;
      const filtered = data.filter(x => x.delete !== true);
      if (filtered.length === 0) return;

      for (let item of filtered) {
        // Podpinamy wygenerowane ID technologii do każdego rekordu
        item[idField] = technologia_id;
        const placeholders = columns.map(() => '?').join(',');
        const values = columns.map(col => item[col]);
        
        await conn.query(
          `INSERT INTO artdruk.${table} (${columns.join(',')}) VALUES (${placeholders})`,
          values
        );
      }
    };

    // 2. Produkty + Update zamówienia
    await massInsert('technologie_produkty', produktyTech, ['technologia_id', 'id', 'zamowienie_id', 'typ', 'indeks', 'naklad', 'nazwa', 'ilosc_stron', 'format_x', 'format_y', 'oprawa', 'uwagi', 'etap', 'stan', 'status']);
    await conn.query("UPDATE artdruk.zamowienia SET technologia_id = ?, stan = 3, status = 2 WHERE id = ?", [technologia_id, produktyTech[0].zamowienie_id]);

    // 3. Elementy, Fragmenty, Oprawy
    await massInsert('technologie_elementy', elementyTech, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'produkt_id', 'nazwa', 'typ', 'lega', 'ilosc_leg', 'ilosc_stron', 'format_x', 'format_y', 'papier_id', 'papier_postac_id', 'papier_info', 'arkusz_szerokosc', 'arkusz_wysokosc', 'naklad', 'uwagi', 'etap', 'stan', 'status']);
    await massInsert('technologie_fragmenty', fragmentyTech, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'produkt_id', 'element_id', 'oprawa_id', 'typ', 'ilosc_stron', 'wersja', 'naklad', 'info']);
    await massInsert('technologie_oprawa', oprawaTech, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'produkt_id', 'bok_oprawy', 'naklad', 'oprawa', 'wersja', 'uwagi']); // Daty obsłuż osobno jeśli trzeba ifNoDateSetNull

    // 4. Arkusze, Legi, LegiFragmenty
    await massInsert('technologie_arkusze', arkusze, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'typ_elementu', 'rodzaj_arkusza', 'element_id', 'ilosc_stron', 'ilosc_leg', 'naklad', 'nadkomplet', 'papier_id', 'papier_postac_id', 'nr_arkusza', 'arkusz_szerokosc', 'arkusz_wysokosc', 'uwagi']);
    await massInsert('technologie_legi', legi, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'typ_elementu', 'rodzaj_legi', 'element_id', 'arkusz_id', 'ilosc_stron', 'naklad', 'nr_legi', 'uwagi']);
    await massInsert('technologie_legi_fragmenty', legiFragmenty, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'element_id', 'fragment_id', 'arkusz_id', 'lega_id', 'nr_legi', 'naklad', 'oprawa_id', 'typ', 'wersja']);

// ... (reszta kodu wyżej)

// 5. Grupy Wykonan (Z PEŁNĄ LISTĄ PÓL I LOCKIEM)
const posortowaneGrupy = [...grupaWykonan].sort((a, b) => a.procesor_id - b.procesor_id);
for (let grupa of posortowaneGrupy) {
  // Blokujemy wiersze dla konkretnego procesora, aby nikt inny nie dopisał mu roboty w tym samym czasie
  const [rows] = await conn.query(
    `SELECT MAX(koniec) as ostatni 
     FROM artdruk.technologie_grupy_wykonan 
     WHERE procesor_id = ? AND typ_grupy < 3 
     FOR UPDATE`, 
    [grupa.procesor_id]
  );

  // Jeśli brak wpisów, startujemy od "teraz"
  const startPoint = rows[0].ostatni || new Date();
  const czasMinuty = grupa.czas || 0;

  const sqlGrupa = `
    INSERT INTO artdruk.technologie_grupy_wykonan (
      poczatek, id, indeks, technologia_id, zamowienie_id, mnoznik, czas, 
      koniec, ilosc_narzadow, narzad, naklad, nazwa, predkosc, 
      proces_id, procesor_id, element_id, przeloty, status, stan, typ_grupy, uwagi
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, 
      DATE_ADD(?, INTERVAL ? MINUTE), 
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, ?
    )`;

  const paramsGrupa = [
    startPoint,             // poczatek
    grupa.id, 
    grupa.indeks, 
    technologia_id,         // nowe ID z bazy
    daneTech.zamowienie_id, 
    grupa.mnoznik, 
    czasMinuty,             // czas
    startPoint,             // dla DATE_ADD (koniec)
    czasMinuty,             // dla DATE_ADD (koniec)
    grupa.ilosc_narzadow, 
    grupa.narzad, 
    grupa.naklad, 
    grupa.nazwa, 
    grupa.predkosc, 
    grupa.proces_id, 
    grupa.procesor_id, 
    grupa.element_id, 
    grupa.przeloty, 
    grupa.status, 
    daneTech.stan, 
    grupa.uwagi
  ];

  await conn.query(sqlGrupa, paramsGrupa);
}

// 6. Grupy Oprawa (Analogicznie, ale inna tabela)
const posortowaneGrupyOprawa = [...grupaOprawaTech].sort((a, b) => a.procesor_id - b.procesor_id);

for (let grupaO of posortowaneGrupyOprawa) {
  const [rowsO] = await conn.query(
    `SELECT MAX(koniec) as ostatni 
     FROM artdruk.technologie_grupy_wykonan_oprawa 
     WHERE procesor_id = ? AND typ_grupy < 3 
     FOR UPDATE`, 
    [grupaO.procesor_id]
  );

  const startPointO = rowsO[0].ostatni || new Date();
  const czasO = grupaO.czas || 0;

  const sqlOprawa = `
    INSERT INTO artdruk.technologie_grupy_wykonan_oprawa (
      poczatek, id, indeks, bok_oprawy, ilosc_zbieran, oprawa_id, naklad, 
      technologia_id, zamowienie_id, mnoznik, czas, koniec, narzad, 
      nazwa, predkosc, proces_id, procesor_id, status, stan, typ_grupy, uwagi
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
      DATE_ADD(?, INTERVAL ? MINUTE), 
      ?, ?, ?, ?, ?, ?, ?, 2, ?
    )`;

  const paramsOprawa = [
    startPointO, grupaO.id, grupaO.indeks, grupaO.bok_oprawy, grupaO.ilosc_zbieran, 
    grupaO.oprawa_id, grupaO.naklad, technologia_id, daneTech.zamowienie_id, 
    grupaO.mnoznik, czasO, startPointO, czasO, grupaO.narzad, grupaO.nazwa, 
    grupaO.predkosc, grupaO.proces_id, grupaO.procesor_id, grupaO.status, 
    daneTech.stan, grupaO.uwagi
  ];

  await conn.query(sqlOprawa, paramsOprawa);
}

// ... (reszta tabel jak wykonania i procesy)

    // Pozostałe tabele analogicznie...
    await massInsert('technologie_wykonania', wykonania, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'nazwa_wykonania', 'grupa_id', 'element_id', 'arkusz_id', 'lega_id', 'typ_elementu', 'nazwa', 'naklad', 'przeloty', 'poczatek', 'czas', 'koniec', 'narzad', 'predkosc', 'mnoznik', 'proces_id', 'procesor_id', 'status', 'stan', 'uwagi']);
    await massInsert('technologie_procesy_elementow', procesyElementowTech, ['id', 'indeks', 'technologia_id', 'zamowienie_id', 'produkt_id', 'element_id', 'ilosc_uzytkow', 'front_ilosc', 'front_kolor', 'back_ilosc', 'back_kolor', 'info', 'nazwa_id', 'proces_id']);

    // łączymy grupyWykonan z procesyElemtow aby można było posortować grypy po nazwa_id czyli druk falc itp
    // dzięki temu jak przybędą nowe procesory w grupie, nic nie będzie trzeba tu już robić. Falc to falc, nieważne na ilu procesorach

const grupyPolaczoneZprocesyElementow = posortowaneGrupy.map(grupa => {
  const proces = procesyElementowTech.find(u => u.id === grupa.proces_id);
  return {
    ...grupa,
    nazwa_id: proces ? proces.nazwa_id : 0
  };
});



let przeloty_druk_all = grupyPolaczoneZprocesyElementow
    // 1. Filtrujemy elementy, których procesor_id jest na liście
    .filter(x => x.nazwa_id ==1)
    // 2. Sumujemy pole 'przeloty'
    .reduce((acc, curr) => acc + (Number(curr.przeloty) || 0), 0);

let przeloty_falc_all = grupyPolaczoneZprocesyElementow
    // 1. Filtrujemy elementy, których procesor_id jest na liście
    .filter(x => x.nazwa_id == 3 )
    // 2. Sumujemy pole 'przeloty'
    .reduce((acc, curr) => acc + (Number(curr.przeloty) || 0), 0);





// proces_id 51 pur
// proces_id 50  i 52 szyto klejona i hotmelt
// proces_id 54 - 59  zeszyt



let przeloty_zeszyt_all = posortowaneGrupyOprawa
    .filter(x => x.proces_id > 53 && x.proces_id <60)
    .reduce((acc, curr) => acc + (Number(curr.naklad) || 0), 0);

    let przeloty_pur_all = posortowaneGrupyOprawa
    .filter(x => x.proces_id == 51)
    .reduce((acc, curr) => acc + (Number(curr.naklad) || 0), 0);

        let przeloty_hotmelt_all = posortowaneGrupyOprawa
    .filter(x => x.proces_id == 50 && x.proces_id==52)
    .reduce((acc, curr) => acc + (Number(curr.naklad) || 0), 0);

    // console.log("grupyPolaczoneZprocesyElementow : ",grupyPolaczoneZprocesyElementow)
    
    // console.log("przeloty_druk_all : "+przeloty_druk_all)
    // console.log("przeloty_falc_all : "+przeloty_falc_all)
    await conn.query("UPDATE artdruk.zamowienia_progres SET przeloty_druk_all = ?, przeloty_druk_zostalo=?, przeloty_falc_all = ?,przeloty_falc_zostalo=?,przeloty_zeszyt_all=?,przeloty_zeszyt_zostalo=?,przeloty_pur_all=?, przeloty_pur_zostalo=?,przeloty_hotmelt_all=?,przeloty_hotmelt_zostalo=? WHERE zamowienie_id = ?", [przeloty_druk_all,przeloty_druk_all,przeloty_falc_all,przeloty_falc_all,przeloty_zeszyt_all,przeloty_zeszyt_all,przeloty_pur_all,przeloty_pur_all, przeloty_hotmelt_all,przeloty_hotmelt_all,daneTech.zamowienie_id]);







    await conn.commit();
    res.status(201).json({ success: true, technologia_id });

  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
};

module.exports = {
  zapiszTechnologie
    
}
 