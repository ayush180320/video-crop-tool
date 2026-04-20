const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

const openBtn = document.getElementById('openBtn');
const autoBtn = document.getElementById('autoBtn');
const exportBtn = document.getElementById('exportBtn');

let filePath = null;

let crop = { x:100, y:100, width:400, height:200 };
let dragging = false;

openBtn.onclick = async () => {
  filePath = await window.api.openFile();
  if (!filePath) return;
  video.src = filePath;
};

video.onloadedmetadata = () => {
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;
  draw();
};

autoBtn.onclick = async () => {
  const result = await window.api.detectCrop(filePath);
  crop = result;
  draw();
};

exportBtn.onclick = () => {
  const str = `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`;
  navigator.clipboard.writeText(str);
  alert(str);
};

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle="red";
  ctx.lineWidth=2;
  ctx.strokeRect(crop.x,crop.y,crop.width,crop.height);
}

// drag
canvas.onmousedown = () => dragging = true;
canvas.onmouseup = () => dragging = false;
canvas.onmousemove = (e) => {
  if (!dragging) return;
  crop.x = e.offsetX - crop.width/2;
  crop.y = e.offsetY - crop.height/2;
  draw();
};

// frame stepping
document.addEventListener('keydown', (e)=>{
  if(e.key==="ArrowRight") video.currentTime += 1/30;
  if(e.key==="ArrowLeft") video.currentTime -= 1/30;
});
