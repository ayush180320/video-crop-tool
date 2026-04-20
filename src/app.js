const fileInput = document.getElementById('fileInput');
const video = document.getElementById('video');
const autoBtn = document.getElementById('autoBtn');
const exportBtn = document.getElementById('exportBtn');
const output = document.getElementById('output');
const controls = document.getElementById('controls');

let filePath = null;
let crop = null;

// Load Video
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  filePath = file.path;
  video.src = URL.createObjectURL(file);
});

// AUTO DETECT
autoBtn.addEventListener('click', async () => {
  crop = await window.api.detectCrop(filePath);
  renderControls();
  renderOutput();
});

// MANUAL CONTROLS
function renderControls() {
  if (!crop) return;

  controls.innerHTML = `
    Width: <input id="w" value="${crop.width}"><br>
    Height: <input id="h" value="${crop.height}"><br>
    X: <input id="x" value="${crop.x}"><br>
    Y: <input id="y" value="${crop.y}"><br>
  `;

  ['w','h','x','y'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      crop.width = Number(document.getElementById('w').value);
      crop.height = Number(document.getElementById('h').value);
      crop.x = Number(document.getElementById('x').value);
      crop.y = Number(document.getElementById('y').value);
      renderOutput();
    });
  });
}

// EXPORT
exportBtn.addEventListener('click', () => {
  if (!crop) return;

  const ffmpeg = `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`;
  const json = JSON.stringify(crop, null, 2);

  alert("FFmpeg:\n" + ffmpeg + "\n\nJSON:\n" + json);
});

// DISPLAY OUTPUT
function renderOutput() {
  output.textContent = JSON.stringify(crop, null, 2);
}
