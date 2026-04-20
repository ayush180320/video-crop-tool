const { contextBridge } = require('electron');
const { detectCrop } = require('./backend/cropDetect');

contextBridge.exposeInMainWorld('api', {
  detectCrop,
});
