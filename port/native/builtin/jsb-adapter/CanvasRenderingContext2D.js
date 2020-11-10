class Context2DAttribute {
    constructor() {
        this.width = 0;
        this.height = 0;
        this.lineWidth = 0;
        this.lineJoin = 'miter';
        this.fillStyle = '#000';
        this.font = '10px sans-serif';
        this.lineCap = 'butt';
        this.textAlign = 'start';
        this.textBaseline = 'alphabetic';
        this.strokeStyle = '#000';
    }
}

class CanvasRenderingContext2D {
    constructor(width, height) {
        this._nativeObj = new jsb.CanvasRenderingContext2D(width, height);
        this._attris = new Context2DAttribute();
    }

    get width () { return this._attris.width; }
    set width (val) { this._attris.width = val; }
    get height () { return this._attris.height; }
    set height (val) { this._attris.height = val; }
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

    // ImageData ctx.createImageData(imagedata);
    // ImageData ctx.createImageData(width, height);
    createImageData (args1, args2) {
        if (typeof args1 === 'number' && typeof args2 == 'number') {
            return new ImageData(args1, args2);
        } else if (args1 instanceof ImageData) {
            return new ImageData(args1.data, args1.width, args1.height);
        }
    }

    restore () { this._nativeObj.restore(); }
    moveTo (x, y) { this._nativeObj.moveTo(x, y); }
    lineTo (x, y) { this._nativeObj.lineTo(x, y); }
    setTransform (a, b, c, d, e, f) { this._nativeObj.setTransform(a, b, c, d, e, f); }
    stroke () { this._nativeObj.stroke(); }
    measureText (text) { return this._nativeObj.measureText(text); }
    fill () { this._nativeObj.fill(); }
    _fillImageData (data, width, height, offsetX, offsetY) { this._nativeObj._fillImageData(data, width, height, offsetX, offsetY); }
    scale (x, y) { this._nativeObj.scale(x, y); }
    clearRect (x, y, width, height) { this._nativeObj.clearRect(x, y, width, height); }
    transform (a, b, c, d, e, f) { this._nativeObj.transform(a, b, c, d, e, f); }
    fillText (text, x, y, maxWidth) { this._nativeObj.fillText(text, x, y, maxWidth, this._attris); }
    strokeText (text, x, y, maxWidth) { this._nativeObj.strokeText(text, x, y, maxWidth, this._attris); }
    save () { this._nativeObj.save(); }
    fillRect (x, y, width, height) { this._nativeObj.fillRect(x, y, width, height); }
    rotate (angle) { this._nativeObj.rotate(angle); }
    beginPath () { this._nativeObj.beginPath(); }
    rect (x, y, width, height) { this._nativeObj.rect(x, y, width, height); }
    translate (x, y) { this._nativeObj.translate(x, y); }
    createLinearGradient (x0, y0, x1, y1) { this._nativeObj.createLinearGradient(x0, y0, x1, y1); }
    closePath () { this._nativeObj.closePath() }

    // void ctx.putImageData(imagedata, dx, dy);
    // void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
    putImageData (imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
            this._canvas._data = imageData;
    }

    _setCanvasBufferUpdatedCallback (func) {
        this._nativeObj._setCanvasBufferUpdatedCallback(func);
    }
}

module.exports = CanvasRenderingContext2D;
