const { pool } = require("../mysql");

const zamowienieInsertNumer = (req, res) => {
  let promises = [];
  // Zakładam, że dane przychodzą w tablicy tak jak w Twoim przykładzie: req.body[0]
  let daneZamowienia = req.body[0];

  const sql = "INSERT INTO artdruk.zamowienia_numer (user_id, zamowienie_id) values (?,?);";
  const dane = [daneZamowienia.user_id, daneZamowienia.zamowienie_id];

  // Korzystamy z faktu, że pool.execute() sam zwraca Promise
  promises.push(
    pool.execute(sql, dane)
      .then(([results]) => {
        return [{ zapis: true }, { zamowienie_nr: results.insertId }];
      })
      .catch((err) => {
        // console.error(err); // Odkomentuj, jeśli chcesz widzieć błędy w konsoli
        return [{ zapis: false }, err];
      })
  );

  Promise.all(promises).then((data) => res.status(201).json(data));
};

module.exports = {
  zamowienieInsertNumer
};