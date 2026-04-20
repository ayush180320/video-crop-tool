const fileInput = document.getElementById('fileInput');
const video = document.getElementById('video');
const autoBtn = document.getElementById('autoBtn');
const exportBtn = document.getElementById('exportBtn');
const output = document.getElementById('output');
const controls = document.getElementById('controls');

let filePath = null;
let crop = null;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  filePath = file.path;   // IMPORTANT for Electron
  video.src = URL.createObjectURL(file);
});

autoBtn.addEventListener('click', async () => {
  if (!filePath) return alert("Select video first");
  crop = await window.api.detectCrop(filePath);
  renderControls();
  renderOutput();
});

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

exportBtn.addEventListener('click', () => {
  if (!crop) return;

  const ffmpeg = `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`;
  alert(ffmpeg);
});

function renderOutput() {
  output.textContent = JSON.stringify(crop, null, 2);
}
