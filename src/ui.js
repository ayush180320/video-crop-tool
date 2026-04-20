const left = document.getElementById("leftPanel");
const resizer = document.getElementById("resizerLeft");

let isDragging = false;

resizer.addEventListener("mousedown", () => {
  isDragging = true;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  left.style.width = e.clientX + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});
