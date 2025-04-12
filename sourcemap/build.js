const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

/**
 * Compile un fichier JavaScript avec Webpack sans inclure les modules node.
 * @param {string} entryPath - Le chemin vers le fichier d'entrée.
 * @param {string} outputDir - Le répertoire de sortie.
 * @param {string} outputFilename - Le nom du fichier de sortie.
 * @returns {Promise<void>}
 */
function bundleWithWebpack(entryPath, outputDir, outputFilename = "bundle.js") {
  return new Promise((resolve, reject) => {
    const config = {
      mode: "production",
      target: "node",
      entry: path.resolve(entryPath),
      output: {
        path: path.resolve(outputDir),
        filename: outputFilename,
      },
      externals: [nodeExternals()], // <- c'est ça qui évite de pack les deps
    };

    webpack(config, (err, stats) => {
      if (err) return reject(err);
      if (stats.hasErrors()) return reject(new Error(stats.toString("errors-only")));
      console.log(stats.toString({ colors: true }));
      resolve();
    });
  });
}

bundleWithWebpack("./new.js", "./", "index.js")
  .then(() => console.log("✅ Webpack terminé avec succès."))
  .catch((err) => console.error("❌ Erreur Webpack :", err));
