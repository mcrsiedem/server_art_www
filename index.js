
const {port} = require('./config');
const {server} = require('./actions/serverLocal');
const dataStore = require('./actions/uprawnienia/dataStore');

// local

//  dataStore.loadMyDataFromDatabase();

//  server.listen(port,()=>{  console.log("SERVER IS RUNNING")})

 async function startApp(){
    await dataStore.loadMyDataFromDatabase();
 server.listen(port,()=>{  console.log("SERVER IS RUNNING")})

 }

// SSL na www
// const {serverSSL} = require('./actions/serverSSL');
// serverSSL.listen(3443, ()=> console.log('Secure server on port 3443_')) 

startApp()