function deobfuscate(texte) {
  return Buffer.from(texte, "base64").toString();
}

module.exports = deobfuscate;
