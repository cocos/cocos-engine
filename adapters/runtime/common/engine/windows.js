window.__canvas = new HTMLCanvasElement();
if (window.__gl) {
    window.__gl.canvas = window.__canvas;
}
window.document.body.appendChild(window.__canvas);
window.addEventListener("resize", function () {
    window.__canvas.width = window.innerWidth;
    window.__canvas.height = window.innerHeight;
});