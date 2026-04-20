const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  openFile: () => ipcRenderer.invoke('open-file'),
  playVideo: (f) => ipcRenderer.invoke('play-video', f),

  pause: () => ipcRenderer.invoke('mpv-pause'),
  frameStep: () => ipcRenderer.invoke('mpv-frame'),
  seek: (s) => ipcRenderer.invoke('mpv-seek', s),

  detectCrop: (f) => ipcRenderer.invoke('detect-crop', f),

  getPresets: () => ipcRenderer.invoke('get-presets'),
  savePreset: (n,c) => ipcRenderer.invoke('save-preset', n,c),
  deletePreset: (n) => ipcRenderer.invoke('delete-preset', n),

  generateQC: (m,c) => ipcRenderer.invoke('generate-qc', m,c)
});
