const axios = require("axios");

async function getIp() {
  const ip = await axios.get("https://www.myexternalip.com/raw").catch(() => null);
  return ip?.data || "Unknown";
}

module.exports = { getIp };
