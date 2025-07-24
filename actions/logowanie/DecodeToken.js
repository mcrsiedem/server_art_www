const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = require("./ACCESS_TOKEN");
const connection = require("../mysql");


const DecodeToken=(token) =>{

let res
// console.log("toeknm" +token)
    if(token){
        jwt.verify(token,ACCESS_TOKEN,(err,decoded)=>{
          // console.log("decoded",decoded.id)
          if(decoded)   res=decoded
          if(err)   res=null

        })
    }
  return res
}

module.exports = {
  DecodeToken
    
}
 