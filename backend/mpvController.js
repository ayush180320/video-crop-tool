const { spawn } = require('child_process');

function startMPV(filePath) {
  spawn('mpv', [filePath]);
}

module.exports = { startMPV };
