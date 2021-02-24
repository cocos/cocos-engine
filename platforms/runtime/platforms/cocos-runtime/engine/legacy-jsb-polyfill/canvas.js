let originalCreateCanvas = jsb.createCanvas.bind(jsb);
jsb.createCanvas = function () {
    let canvas = originalCreateCanvas();
    canvas.style = {};
    return canvas;
};