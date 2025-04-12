const screenshot = require("screenshot-desktop");
const { rdm } = require("../../data/Config");
const fs = require("fs");

async function screenShot() {
  const img = await screenshot().catch(() => null);
  if (img) fs.writeFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\screenshot.png`, img);
}

module.exports = screenShot;
