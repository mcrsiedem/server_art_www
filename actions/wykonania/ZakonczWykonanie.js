const connection = require("../mysql");
const { ifNoDateSetNull } = require("../czas/ifNoDateSetNull");

const zakonczWykonanie = (req, res) => {
  let promises = [];
  let wykonanieRow = req.body;
// console.clear()
console.log(wykonanieRow.global_id)

  res.status(200).json("OK")  
};

module.exports = {
  zakonczWykonanie,
};
