// eksportuje objekt
module.exports = {
    port:  process.env.PORT || 3001,
    database : process.env.DATABASES || {
        host: "localhost",
        port:"3306",
        user:"root",
        password:"Art123druk_"
      //nooo jprd!!!
    }
}