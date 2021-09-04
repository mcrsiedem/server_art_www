// eksportuje objekt
module.exports = {
    port:  process.env.PORT || 3000,
    database : process.env.DATABASES || {
        host: "localhost",
        port:"3307",
        user:"root",
        password:"Art123druk_"
      
    }
}