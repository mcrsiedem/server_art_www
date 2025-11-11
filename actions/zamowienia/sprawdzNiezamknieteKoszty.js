const { pool } = require("../mysql");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("../logowanie/ACCESS_TOKEN");
const dataStore = require('../uprawnienia/dataStore');
const { DecodeToken } = require("../logowanie/DecodeToken");


// nowy zapis zamówienia - dane i parametry w jednym
const sprawdzNiezamknieteKoszty = async (req,res)=>{
const token = req.params['token']


let id =  DecodeToken(token).id;

  try {
    const [rows] = await pool.execute("SELECT count(*) as ile FROM artdruk.view_zamowienia where etap = 16 and koszty_status =1 and opiekun_id = ?", [id]) 
 
    res.status(200).json(rows);
  } catch (err) {
    console.error("Błąd w Kontrolerze: sprawdzNiezamknieteKoszty -", err);
    res.status(500).json({ error: "Błąd serwera." });
  }      
}




module.exports = {
  sprawdzNiezamknieteKoszty
    
}
 