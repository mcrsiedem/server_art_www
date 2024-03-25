
const {port} = require('./config');


// // local
//  const {server} = require('./actions/serverLocal');
//  server.listen(port,()=>{  console.log("SERVER IS RUNNING")})


// SSL na www
const {serverSSL} = require('./actions/serverSSL');
serverSSL.listen(3443, ()=> console.log('Secure server on port 3443_')) 