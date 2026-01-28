const { DecodeToken } = require("../logowanie/DecodeToken");
const { SendMail } = require("../mail/SendMail");
const { connection, pool } = require("../mysql");

const dodajProof = async (req, res) => {
  const token = req.params["token"];

  let ID_SPRAWCY = DecodeToken(token).id;

  let Dodaj = () => {
    return new Promise((resolve, reject) => {
      let data = [ID_SPRAWCY];
      var sql = "INSERT INTO artdruk.zamowienia_proofy (utworzyl_user_id) values (?); ";
      connection.execute(sql, data, function (err, result) {
        if (err) {
          reject(err);
        } else resolve(result.insertId);
      });
    });
  };

  try {
    // console.log("Wynik Update:", res1); // Teraz powinno się wyświetlić
    let res2 = await Dodaj(); // dodaj do historii
    console.log(res2)
    res.status(200).json({ status: "ok", id: res2 });
  } catch (error) {
    SendMail(error);
    console.error("Wystąpił błąd podczas operacji na bazie danych:", error);
    res.status(200).json({ status: error });
  }
};

module.exports = {
  dodajProof
};
