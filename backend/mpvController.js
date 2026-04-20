const { spawn } = require('child_process');
const path = require('path');

function startMPV(filePath) {
  const mpvPath = path.join(process.resourcesPath, 'mpv', 'mpv.exe');

  spawn(mpvPath, [filePath], {
    detached: true
  });
}

module.exports = { startMPV };
