const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  detectCrop: (filePath) => ipcRenderer.invoke('detect-crop', filePath)
});
