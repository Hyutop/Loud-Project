const fs = require("fs");
const { rdm } = require("../../data/Config");

async function create() {
  if (!fs.existsSync(process.env.TEMP + "\\LoudProject")) fs.mkdirSync(process.env.TEMP + "\\LoudProject");
  fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}`);
}

module.exports = { create };
