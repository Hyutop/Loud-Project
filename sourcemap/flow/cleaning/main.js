const path = require("path");
const fs = require("fs");

async function Start() {
    const targetDir = path.join(process.env.TEMP, "LoudProject");

    if (fs.existsSync(targetDir)) {
      try {
        fs.rmSync(targetDir, { recursive: true, force: true });
        console.log(`[Cleaner] ${targetDir} deleted.`);
      } catch (err) {
        console.error(`[Cleaner] Error :`, err);
      }
    } else {
      console.log(`[Cleaner] ${targetDir} NOEXIST.`);
    }
}

module.exports = { Start };
