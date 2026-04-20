getPresets: () => ipcRenderer.invoke('get-presets'),
savePreset: (name, crop) => ipcRenderer.invoke('save-preset', name, crop),
deletePreset: (name) => ipcRenderer.invoke('delete-preset', name)
