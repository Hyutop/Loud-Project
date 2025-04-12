const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const {randomChar} = require("../utils/random")

/**
 * Hides the current Windows console window by generating and executing
 * a temporary PowerShell script that calls native WinAPI functions.
 *
 * @returns {void}
 */
function hideConsole() {
  const randomFileName = `${randomChar(10)}.ps1`;

  const powershellScript = `
    Add-Type -Name Window -Namespace Console -MemberDefinition '
      [DllImport("Kernel32.dll")]
      public static extern IntPtr GetConsoleWindow();

      [DllImport("user32.dll")]
      public static extern bool ShowWindow(IntPtr hWnd, Int32 nCmdShow);
    '

    $consolePtr = [Console.Window]::GetConsoleWindow()
    [Console.Window]::ShowWindow($consolePtr, 0)
  `;

  const tempDir = process.env.TEMP;
  const tempfile = path.join(tempDir, randomFileName);

  fs.writeFileSync(tempfile, powershellScript);

  try {
    execSync(`powershell.exe -ExecutionPolicy Bypass -File "${tempfile}"`, {
      stdio: "inherit",
    });
  } finally {
    fs.unlinkSync(tempfile);
  }
}

module.exports = hideConsole;
