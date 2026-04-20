const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { detectCrop } = require('./backend/cropDetect');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('open-file', async () => {
  const res = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Video', extensions: ['mp4','mov','mkv'] }]
  });
  return res.canceled ? null : res.filePaths[0];
});

ipcMain.handle('detect-crop', async (_, filePath) => {
  return await detectCrop(filePath);
});
