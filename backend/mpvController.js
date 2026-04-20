const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

let mpvProcess = null;
let socket = null;

const PIPE = '\\\\.\\pipe\\mpv-pipe';

function getMPVPath() {
  const devPath = path.join(__dirname, '..', 'resources', 'mpv', 'mpv.exe');
  const prodPath = path.join(process.resourcesPath, 'mpv', 'mpv.exe');

  if (fs.existsSync(prodPath)) return prodPath;
  if (fs.existsSync(devPath)) return devPath;

  throw new Error("mpv.exe not found in both dev and production paths");
}

function startMPV(filePath) {
  const mpvPath = getMPVPath();

  console.log("MPV PATH:", mpvPath);

  if (mpvProcess) mpvProcess.kill();

  mpvProcess = spawn(mpvPath, [
    filePath,
    '--force-window=yes',
    '--border=no',
    '--ontop=yes',
    `--input-ipc-server=${PIPE}`
  ]);

  mpvProcess.on('error', (err) => {
    console.error("MPV ERROR:", err);
  });

  setTimeout(connectIPC, 1500);
}

function connectIPC() {
  socket = net.createConnection(PIPE);
}

function send(cmd) {
  if (!socket) return;
  socket.write(JSON.stringify({ command: cmd }) + '\n');
}

function pause() { send(['cycle','pause']); }
function frameStep() { send(['frame-step']); }
function seek(s) { send(['seek', s, 'relative']); }

module.exports = { startMPV, pause, frameStep, seek };
