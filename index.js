
const { port } = require("./config");
const { server } = require("./actions/serverLocal");
const dataStore = require("./actions/uprawnienia/dataStore");

// local

async function startApp() {
  //  await dataStore.loadMyDataFromDatabase();
  await dataStore.loadPrivileges();
  server.listen(port, () => {
    console.log("SERVER IS RUNNING");
  });
}

startApp();