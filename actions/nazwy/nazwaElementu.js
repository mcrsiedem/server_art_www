 const nazwaElementu=(element) =>{

const _typ_elementu = [
  {
    id: 1,
    nazwa: "Okładka",
  },
  {
    id: 2,
    nazwa: "Środek",
  },
  
  {
    id: 3,
    nazwa: "Wklejka",
  },
  
  {
    id: 4,
    nazwa: "Insert",
  },
  {
    id: 5,
    nazwa: "Samolep",
  },
  {
    id: 6,
    nazwa: "Ulotka",
  },
];

let name = _typ_elementu.filter(x=> x.id == element)[0]?.nazwa
        return name;
}


module.exports = {
    nazwaElementu
    
}
 