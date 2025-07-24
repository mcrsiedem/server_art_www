const { port } = require("./config");

const { serverSSL } = require("./actions/serverSSL");
const dataStore = require("./actions/uprawnienia/dataStore");

async function startApp() {
  await dataStore.loadPrivileges();
  serverSSL.listen(3443, () => console.log("Secure server on port 3443_"));
}

startApp();
