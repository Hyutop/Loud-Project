function IsStartup() {
    return process.argv0.includes("Startup");
}

module.exports = IsStartup;