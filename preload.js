const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('open-file'),
  playVideo: (file) => ipcRenderer.invoke('play-video', file),
  detectCrop: (file) => ipcRenderer.invoke('detect-crop', file),

  getPresets: () => ipcRenderer.invoke('get-presets'),
  savePreset: (name, crop) => ipcRenderer.invoke('save-preset', name, crop),
  deletePreset: (name) => ipcRenderer.invoke('delete-preset', name),

  generateQC: (meta, crop) => ipcRenderer.invoke('generate-qc', meta, crop)
});
