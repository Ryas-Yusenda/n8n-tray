const { app, Tray, Menu, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let tray = null;
let n8nProcess = null;
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

  // ===== TRAY =====
  tray = new Tray(path.join(__dirname, "icon.ico"));

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

app.on("window-all-closed", (e) => e.preventDefault());

function shutdown() {
  writeLog("Shutting down application...");
  if (n8nProcess && !n8nProcess.killed) {
    spawn("taskkill", ["/pid", n8nProcess.pid, "/f", "/t"]);
    writeLog("n8n process killed");
  }
  app.quit();
}
