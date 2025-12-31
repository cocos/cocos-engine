const ImageData = require('./ImageData');

class Context2DAttribute {
    constructor () {
        this.lineWidth = undefined;
        this.lineJoin = undefined;
        this.fillStyle = undefined;
        this.font = undefined;
        this.lineCap = undefined;
        this.textAlign = undefined;
        this.textBaseline = undefined;
        this.strokeStyle = undefined;
        this.globalCompositeOperation = undefined;
        this.shadowBlur = undefined;
        this.shadowColor = undefined;
        this.shadowOffsetX = undefined;
        this.shadowOffsetY = undefined;
    }
}

class CanvasRenderingContext2D {
    constructor (width, height) {
        this.width1 = width;
        this.height1 = height;
        //this._nativeObj = //new jsb.CanvasRenderingContext2D(width, height);
        this._attris = new Context2DAttribute();
    }

    // Do not cache width and height, as they will change buffer and sync to JS.
    get width () { return this.width1; }
    set width (val) { this.width1 = val; }
    get height () { return this.height1; }
    set height (val) { this.height1 = val; }
    get lineWidth () { return this._attris.lineWidth; }
    set lineWidth (val) { this._attris.lineWidth = val; }
    get lineJoin () { return this._attris.lineJoin; }
    set lineJoin (val) { this._attris.lineJoin = val; }
    get fillStyle () { return this._attris.fillStyle; }
    set fillStyle (val) { this._attris.fillStyle = val; }
    get font () { return this._attris.font; }
    set font (val) { this._attris.font = val; }
    get lineCap () { return this._attris.lineCap; }
    set lineCap (val) { this._attris.lineCap = val; }
    get textAlign () { return this._attris.textAlign; }
    set textAlign (val) { this._attris.textAlign = val; }
    get textBaseline () { return this._attris.textBaseline; }
    set textBaseline (val) { this._attris.textBaseline = val; }
    get strokeStyle () { return this._attris.strokeStyle; }
    set strokeStyle (val) { this._attris.strokeStyle = val; }
    get globalCompositeOperation () { return this._attris.globalCompositeOperation; }
    set globalCompositeOperation (val) { this._attris.globalCompositeOperation = val; }
    get shadowBlur () { return this._attris.shadowBlur; }
    set shadowBlur (val) { this._attris.shadowBlur = val; }
    get shadowColor () { return this._attris.shadowColor; }
    set shadowColor (val) { this._attris.shadowColor = val; }
    get shadowOffsetX () { return this._attris.shadowOffsetX; }
    set shadowOffsetX (val) { this._attris.shadowOffsetX = val; }
    get shadowOffsetY () { return this._attris.shadowOffsetY; }
    set shadowOffsetY (val) { this._attris.shadowOffsetY = val; }

    restore () {  }
    moveTo (x, y) {  }
    lineTo (x, y) {  }
    setTransform (a, b, c, d, e, f) {  }
    stroke () {
        this._canvas._dataInner = null;

    }
    measureText (text) { return 100; }
    fill () {
        this._canvas._dataInner = null;
 
    }
    _fillImageData (data, width, height, offsetX, offsetY) {
        this._canvas._dataInner = null;
    }
    scale (x, y) {  }
    clearRect (x, y, width, height) {
        this._canvas._dataInner = null;
    }
    transform (a, b, c, d, e, f) { }
    fillText (text, x, y, maxWidth) {
        this._canvas._dataInner = null;
    }
    strokeText (text, x, y, maxWidth) {
        this._canvas._dataInner = null;
    }
    save () {  }
    fillRect (x, y, width, height) {
        this._canvas._dataInner = null;
    }
    fetchData () {

    }
    rotate (angle) {  }
    beginPath () { }
    rect (x, y, width, height) {  }
    translate (x, y) {  }
    createLinearGradient (x0, y0, x1, y1) { return 100; }
    closePath () {  }

    // void ctx.putImageData(imagedata, dx, dy);
    // void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
    putImageData (imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        this._canvas._data = imageData;
    }

    // ImageData ctx.createImageData(imagedata);
    // ImageData ctx.createImageData(width, height);
    createImageData (args1, args2) {
        if (typeof args1 === 'number' && typeof args2 === 'number') {
            return new ImageData(args1, args2);
        } else if (args1 instanceof ImageData) {
            return new ImageData(args1.data, args1.width, args1.height);
        }
    }

    // Comment it seems it is not used.
    // // ImageData ctx.getImageData(sx, sy, sw, sh);
    // getImageData (sx, sy, sw, sh) {
    //     var canvasWidth = this._canvas._width;
    //     var canvasHeight = this._canvas._height;
    //     var canvasBuffer = this._canvas._data.data;
    //     // image rect may bigger that canvas rect
    //     var maxValidSH = (sh + sy) < canvasHeight ? sh : (canvasHeight - sy);
    //     var maxValidSW = (sw + sx) < canvasWidth ? sw : (canvasWidth - sx);
    //     var imgBuffer = new Uint8ClampedArray(sw * sh * 4);
    //     for (var y = 0; y < maxValidSH; y++) {
    //         for (var x = 0; x < maxValidSW; x++) {
    //             var canvasPos = (y + sy) * canvasWidth + (x + sx);
    //             var imgPos = y * sw + x;
    //             imgBuffer[imgPos * 4 + 0] = canvasBuffer[canvasPos * 4 + 0];
    //             imgBuffer[imgPos * 4 + 1] = canvasBuffer[canvasPos * 4 + 1];
    //             imgBuffer[imgPos * 4 + 2] = canvasBuffer[canvasPos * 4 + 2];
    //             imgBuffer[imgPos * 4 + 3] = canvasBuffer[canvasPos * 4 + 3];
    //         }
    //     }
    //     return new ImageData(imgBuffer, sw, sh);
    // }

    _setCanvasBufferUpdatedCallback (func) {
    }
}

module.exports = CanvasRenderingContext2D;
