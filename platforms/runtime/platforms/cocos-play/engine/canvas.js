let _oldCreateElement = document.createElement;
let _gl = null;
document.createElement = function (name) {
    if (name === "canvas") {
        let canvas = new window.HTMLCanvasElement;
        let getContext = canvas.getContext;
        canvas.getContext = function (type, attributes) {
            if (type === 'webgl' ||
                type === 'webgl2' ||
                type === 'experimental-webgl' ||
                type === 'experimental-webgl2') {
                if (!_gl) {
                    _gl = getContext.call(this, type, attributes);
                }
                return _gl;
            } else {
                return getContext.call(this, type, attributes);
            }
        }
        return canvas;
    }
    return _oldCreateElement(name);
}

if (typeof ral.getFeatureProperty("ral.createCanvas", "spec") === "undefined") {
    let _originalCreateCanvas = ral.createCanvas.bind(ral);
    ral.createCanvas = function () {
        let canvas = _originalCreateCanvas();
        let getContext = canvas.getContext;
        canvas.getContext = function (type, attributes) {
            if (type === 'webgl' ||
                type === 'webgl2' ||
                type === 'experimental-webgl' ||
                type === 'experimental-webgl2') {
                if (!_gl) {
                    _gl = getContext.call(this, type, attributes);
                }
                return _gl;
            } else {
                return getContext.call(this, type, attributes);
            }
        }
        return canvas;
    };
}