let originalCreateCanvas = jsb.createCanvas.bind(jsb);
jsb.createCanvas = function () {
    let canvas = originalCreateCanvas();
    canvas.style = {};  // canvas has no style property on runtime 2.0
    return canvas;
};