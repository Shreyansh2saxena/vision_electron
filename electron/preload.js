const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveJson: (data) => ipcRenderer.invoke("save-json", data),
});