let crop = { top:0, bottom:0, left:0, right:0 };
let filePath = null;

openBtn.onclick = async () => {
  filePath = await window.api.openFile();
  window.api.playVideo(filePath);
};

autoBtn.onclick = async () => {
  bar.style.width = "20%";
  const result = await window.api.detectCrop(filePath);

  crop = {
    top: result.y,
    left: result.x,
    right: 1920 - (result.x + result.width),
    bottom: 1080 - (result.y + result.height)
  };

  bar.style.width = "100%";
};

exportBtn.onclick = () => {
  const w = 1920 - crop.left - crop.right;
  const h = 1080 - crop.top - crop.bottom;
  alert(`crop=${w}:${h}:${crop.left}:${crop.top}`);
};

qcBtn.onclick = async () => {
  const report = await window.api.generateQC({width:1920,height:1080}, crop);
  qcOutput.textContent = JSON.stringify(report,null,2);
};
