 const nazwaEtapPlikow=(etap_plikow) =>{

    const _etap_plikow = [
      {
        id: 2,
        nazwa: "Brak",
      },
      {
        id: 3,
        nazwa: "Pliki",
      },
      {
        id: 4,
        nazwa: "Akcept",
      },
      {
        id: 5,
        nazwa: "Impozycja",
      },
      {
        id: 6,
        nazwa: "RIP",
      },
      {
        id: 7,
        nazwa: "Zaświecone",
      },
    ];

let name = _etap_plikow.filter(x=> x.id == etap_plikow)[0]?.nazwa
        return name;
}


module.exports = {
    nazwaEtapPlikow
    
}
 