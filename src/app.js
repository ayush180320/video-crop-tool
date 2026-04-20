const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

const preview = document.getElementById("preview");
const pctx = preview.getContext("2d");

let crop = { top:100, bottom:100, left:100, right:100 };
let filePath = null;

function snap(v){ return Math.round(v/2)*2; }

canvas.width = 800;
canvas.height = 450;

function draw(){
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0,0,w,h);

  ctx.fillStyle="rgba(0,0,0,0.6)";
  ctx.fillRect(0,0,w,crop.top);
  ctx.fillRect(0,h-crop.bottom,w,crop.bottom);
  ctx.fillRect(0,crop.top,crop.left,h-crop.top-crop.bottom);
  ctx.fillRect(w-crop.right,crop.top,crop.right,h-crop.top-crop.bottom);

  ctx.strokeStyle="#00ffcc";
  ctx.strokeRect(crop.left,crop.top,w-crop.left-crop.right,h-crop.top-crop.bottom);
}

draw();

// keyboard nudging
document.addEventListener("keydown",(e)=>{
  const step = e.shiftKey ? 2 : 1;

  if(e.key==="ArrowUp") crop.top = snap(crop.top-step);
  if(e.key==="ArrowDown") crop.bottom = snap(crop.bottom-step);
  if(e.key==="ArrowLeft") crop.left = snap(crop.left-step);
  if(e.key==="ArrowRight") crop.right = snap(crop.right-step);

  draw();
});

// controls
openBtn.onclick = async ()=>{
  filePath = await window.api.openFile();
  window.api.playVideo(filePath);
};

playBtn.onclick = ()=> window.api.pause();
frameBtn.onclick = ()=> window.api.frameStep();
backBtn.onclick = ()=> window.api.seek(-1);
fwdBtn.onclick = ()=> window.api.seek(1);

exportBtn.onclick = ()=>{
  const w = 1920 - crop.left - crop.right;
  const h = 1080 - crop.top - crop.bottom;
  alert(`crop=${w}:${h}:${crop.left}:${crop.top}`);
};
