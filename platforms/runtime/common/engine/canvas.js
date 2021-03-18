let originalCreateCanvas = ral.createCanvas.bind(ral);
ral.createCanvas = function () {
    let canvas = originalCreateCanvas();
    canvas.style = {};  // canvas has no style property on runtime 2.0
    return canvas;
};