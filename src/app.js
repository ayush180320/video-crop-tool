const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

const preview = document.getElementById("preview");
const pctx = preview.getContext("2d");

const video = document.getElementById("video");

let crop = { top:100, bottom:100, left:100, right:100 };

let dragging = false;
let activeHandle = null;

const HANDLE_SIZE = 10;

function snap(v) {
  return Math.round(v / 2) * 2;
}

video.onloadedmetadata = () => {
  canvas.width = video.clientWidth;
  canvas.height = video.clientHeight;

  preview.width = 250;
  preview.height = 150;

  draw();
};

// ---------- HANDLE DETECTION ----------
function getHandle(x, y) {
  const w = canvas.width;
  const h = canvas.height;

  const l = crop.left;
  const r = w - crop.right;
  const t = crop.top;
  const b = h - crop.bottom;

  if (near(x,y,l,t)) return "top-left";
  if (near(x,y,r,t)) return "top-right";
  if (near(x,y,l,b)) return "bottom-left";
  if (near(x,y,r,b)) return "bottom-right";

  if (nearLine(y,t)) return "top";
  if (nearLine(y,b)) return "bottom";
  if (nearLine(x,l)) return "left";
  if (nearLine(x,r)) return "right";

  return null;
}

function near(x,y,px,py){
  return Math.abs(x-px)<HANDLE_SIZE && Math.abs(y-py)<HANDLE_SIZE;
}
function nearLine(a,b){
  return Math.abs(a-b)<HANDLE_SIZE;
}

// ---------- DRAW ----------
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
  ctx.strokeRect(
    crop.left,
    crop.top,
    w-crop.left-crop.right,
    h-crop.top-crop.bottom
  );

  drawHandles();
  drawPreview();
}

function drawHandles(){
  const w = canvas.width;
  const h = canvas.height;

  const pts = [
    [crop.left, crop.top],
    [w-crop.right, crop.top],
    [crop.left, h-crop.bottom],
    [w-crop.right, h-crop.bottom]
  ];

  ctx.fillStyle="#00ffcc";
  pts.forEach(([x,y])=>{
    ctx.fillRect(x-4,y-4,8,8);
  });
}

// ---------- ZOOM PREVIEW ----------
function drawPreview(){
  const w = video.videoWidth;
  const h = video.videoHeight;

  if(!w) return;

  const sx = crop.left;
  const sy = crop.top;
  const sw = w - crop.left - crop.right;
  const sh = h - crop.top - crop.bottom;

  pctx.clearRect(0,0,preview.width,preview.height);
  pctx.drawImage(video, sx, sy, sw, sh, 0, 0, preview.width, preview.height);
}

// ---------- MOUSE ----------
canvas.onmousedown = (e)=>{
  activeHandle = getHandle(e.offsetX, e.offsetY);
  dragging = true;
};

canvas.onmouseup = ()=>{
  dragging=false;
  activeHandle=null;
};

canvas.onmousemove = (e)=>{
  const x = e.offsetX;
  const y = e.offsetY;

  const handle = getHandle(x,y);
  canvas.style.cursor = getCursor(handle);

  if(!dragging || !activeHandle) return;

  const w = canvas.width;
  const h = canvas.height;

  switch(activeHandle){
    case "top": crop.top = snap(y); break;
    case "bottom": crop.bottom = snap(h-y); break;
    case "left": crop.left = snap(x); break;
    case "right": crop.right = snap(w-x); break;

    case "top-left":
      crop.top = snap(y);
      crop.left = snap(x);
      break;

    case "top-right":
      crop.top = snap(y);
      crop.right = snap(w-x);
      break;

    case "bottom-left":
      crop.bottom = snap(h-y);
      crop.left = snap(x);
      break;

    case "bottom-right":
      crop.bottom = snap(h-y);
      crop.right = snap(w-x);
      break;
  }

  draw();
};

function getCursor(h){
  switch(h){
    case "top":
    case "bottom": return "ns-resize";
    case "left":
    case "right": return "ew-resize";
    case "top-left":
    case "bottom-right": return "nwse-resize";
    case "top-right":
    case "bottom-left": return "nesw-resize";
    default: return "default";
  }
}

// ---------- KEYBOARD NUDGING ----------
document.addEventListener("keydown",(e)=>{
  const step = e.shiftKey ? 2 : 1;

  switch(e.key){
    case "ArrowUp":
      crop.top = snap(crop.top - step);
      break;

    case "ArrowDown":
      crop.bottom = snap(crop.bottom - step);
      break;

    case "ArrowLeft":
      crop.left = snap(crop.left - step);
      break;

    case "ArrowRight":
      crop.right = snap(crop.right - step);
      break;
  }

  draw();
});
