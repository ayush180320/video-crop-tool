// shortened header for clarity
const canvas=document.getElementById("overlay");
const ctx=canvas.getContext("2d");
const video=document.getElementById("video");
const preview=document.getElementById("preview");
const pctx=preview.getContext("2d");

let crop={top:100,bottom:100,left:100,right:100};

function snap(v){return Math.round(v/2)*2;}

video.onloadedmetadata=()=>{
  canvas.width=video.clientWidth;
  canvas.height=video.clientHeight;
  draw();
};

// DRAW + PREVIEW
function draw(){
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle="rgba(0,0,0,0.6)";
  ctx.fillRect(0,0,w,crop.top);
  ctx.fillRect(0,h-crop.bottom,w,crop.bottom);
  ctx.fillRect(0,crop.top,crop.left,h-crop.top-crop.bottom);
  ctx.fillRect(w-crop.right,crop.top,crop.right,h-crop.top-crop.bottom);

  ctx.strokeStyle="#00ffcc";
  ctx.strokeRect(crop.left,crop.top,w-crop.left-crop.right,h-crop.top-crop.bottom);

  // preview
  pctx.clearRect(0,0,preview.width,preview.height);
  pctx.drawImage(video,crop.left,crop.top,
    video.videoWidth-crop.left-crop.right,
    video.videoHeight-crop.top-crop.bottom,
    0,0,preview.width,preview.height);
}

// KEYBOARD NUDGE
document.addEventListener("keydown",(e)=>{
  const step=e.shiftKey?2:1;

  if(e.key==="ArrowUp") crop.top=snap(crop.top-step);
  if(e.key==="ArrowDown") crop.bottom=snap(crop.bottom-step);
  if(e.key==="ArrowLeft") crop.left=snap(crop.left-step);
  if(e.key==="ArrowRight") crop.right=snap(crop.right-step);

  draw();
});
