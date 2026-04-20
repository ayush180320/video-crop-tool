const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('open-file'),
  detectCrop: (filePath) => ipcRenderer.invoke('detect-crop', filePath)
});
