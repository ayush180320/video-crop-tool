const { loadPresets, savePreset, deletePreset } = require('./backend/presets');

ipcMain.handle('get-presets', () => loadPresets());
ipcMain.handle('save-preset', (_, name, crop) => savePreset(name, crop));
ipcMain.handle('delete-preset', (_, name) => deletePreset(name));
