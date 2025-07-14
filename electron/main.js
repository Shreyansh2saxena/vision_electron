const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle("save-json", async (_, { fileName, content }) => {
    const targetDir = "C:/Users/Shreyansh/OneDrive/Desktop/json files of bahi";
    const filePath = path.join(targetDir, fileName);
    try {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8");
      return { success: true, path: filePath };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
