
const {port} = require('./config');

const {serverSSL} = require('./actions/serverSSL');
const dataStore = require('./actions/uprawnienia/dataStore');


 async function startApp(){
    await dataStore.loadMyDataFromDatabase();
 serverSSL.listen(3443, ()=> console.log('Secure server on port 3443_')) 

 }


startApp()

// const {port} = require('./config');

// const {serverSSL} = require('./actions/serverSSL');
// serverSSL.listen(3443, ()=> console.log('Secure server on port 3443_')) 

