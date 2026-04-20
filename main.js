const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(createWindow);
const { ipcMain } = require('electron');
const { detectCrop } = require('./backend/cropDetect');

ipcMain.handle('detect-crop', async (event, filePath) => {
  return await detectCrop(filePath);
});
