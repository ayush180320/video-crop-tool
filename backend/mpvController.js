const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

let mpvProcess = null;
let socket = null;

const PIPE = '\\\\.\\pipe\\mpv-pipe';

function startMPV(filePath) {
  const mpvPath = path.join(process.resourcesPath, 'mpv', 'mpv.exe');

  if (mpvProcess) mpvProcess.kill();

  mpvProcess = spawn(mpvPath, [
    filePath,
    '--force-window=yes',
    '--border=no',
    '--ontop=yes',
    `--input-ipc-server=${PIPE}`
  ]);

  setTimeout(() => {
    socket = net.createConnection(PIPE);
  }, 1000);
}

function send(cmd) {
  if (!socket) return;
  socket.write(JSON.stringify({ command: cmd }) + '\n');
}

function pause() { send(['cycle','pause']); }
function frameStep() { send(['frame-step']); }
function seek(s) { send(['seek', s, 'relative']); }

module.exports = { startMPV, pause, frameStep, seek };
