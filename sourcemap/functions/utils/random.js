/**
 * Generates a random alphanumeric string of a given length.
 *
 * @param {number} length - The desired length of the output string.
 * @returns {string} A randomly generated alphanumeric string.
 */
function randomChar(length) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomInt(length) {
  let result = "";
  const characters = "0123456789";

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}
module.exports = { randomChar, randomInt };
