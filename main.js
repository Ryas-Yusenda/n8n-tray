const { app, Tray, Menu, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let tray = null;
let n8nProcess = null;
let isShuttingDown = false;
const N8N_PORT = 17890;

// ===== LOGGING =====
const logDir = path.join(app.getPath("userData"), "logs");
const logFile = path.join(logDir, "n8n.log");

console.log(logFile);

function writeLog(message) {
  const time = new Date().toISOString();
  fs.appendFileSync(logFile, `[${time}] ${message}\n`);
}

app.whenReady().then(() => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  writeLog(`Starting n8n on port ${N8N_PORT}...`);

  // ===== START N8N =====
  n8nProcess = spawn("n8n", ["start"], {
    shell: true,
    windowsHide: true,
    env: {
      ...process.env,
      N8N_PORT: N8N_PORT,
    },
  });

  n8nProcess.stdout.on("data", (data) => {
    writeLog(`INFO: ${data.toString().trim()}`);
  });

  n8nProcess.stderr.on("data", (data) => {
    writeLog(`ERROR: ${data.toString().trim()}`);
  });

  n8nProcess.on("exit", (code) => {
    writeLog(`n8n exited with code ${code}`);
  });

  // ===== TRAY =====\
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, "assets", "tray.ico")
    : path.join(__dirname, "assets", "tray.ico");

  writeLog("Tray icon path: " + iconPath);
  writeLog("Icon exists: " + fs.existsSync(iconPath));

  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Browser",
      click: () => {
        shell.openExternal(`http://localhost:${N8N_PORT}`);
      },
    },
    { type: "separator" },
    {
      label: "Exit",
      click: () => shutdown(),
    },
  ]);

  tray.setToolTip(`n8n running on http://localhost:${N8N_PORT}`);
  tray.setContextMenu(contextMenu);
});

app.on("window-all-closed", (e) => {
  e.preventDefault();
  shutdown();
});

app.on("before-quit", () => {
  shutdown();
});

function shutdown() {
  if (isShuttingDown) return;
  isShuttingDown = true;

  writeLog("Shutting down application...");

  if (n8nProcess && !n8nProcess.killed) {
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", n8nProcess.pid, "/f", "/t"]);
        writeLog("n8n process killed (windows)");
      } else {
        n8nProcess.kill("SIGTERM");
        writeLog("n8n process killed (unix)");
      }
    } catch (err) {
      writeLog(`Failed to kill n8n: ${err.message}`);
    }
  }

  app.quit();
}
