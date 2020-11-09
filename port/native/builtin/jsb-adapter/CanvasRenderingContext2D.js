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
        if (typeof loadRuntime === "function") {
            var height = imageData.height;
            var width = imageData.width;
            var canvasWidth = this._canvas._width;
            var canvasHeight = this._canvas._height;
            dirtyX = dirtyX || 0;
            dirtyY = dirtyY || 0;
            dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
            dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
            var limitBottom = dirtyY + dirtyHeight;
            var limitRight = dirtyX + dirtyWidth;
            // shrink dirty rect if next image rect bigger than canvas rect
            dirtyHeight = limitBottom < canvasHeight ? dirtyHeight : (dirtyHeight - (limitBottom - canvasHeight))
            dirtyWidth = limitRight < canvasWidth ? dirtyWidth : (dirtyWidth - (limitRight - canvasWidth))
            // collect data needed to put
            dirtyWidth = Math.floor(dirtyWidth);
            dirtyHeight = Math.floor(dirtyHeight);
            var imageToFill = new ImageData(dirtyWidth, dirtyHeight);
            for (var y = dirtyY; y < limitBottom; y++) {
                for (var x = dirtyX; x < limitRight; x++) {
                    var imgPos = y * width + x;
                    var toPos = (y - dirtyY) * dirtyWidth + (x - dirtyX);
                    imageToFill.data[toPos * 4 + 0] = imageData.data[imgPos * 4 + 0];
                    imageToFill.data[toPos * 4 + 1] = imageData.data[imgPos * 4 + 1];
                    imageToFill.data[toPos * 4 + 2] = imageData.data[imgPos * 4 + 2];
                    imageToFill.data[toPos * 4 + 3] = imageData.data[imgPos * 4 + 3];
                }
            }
            // do image data write operation at Native (only impl on Android)
            this._nativeObj._fillImageData(imageToFill.data, dirtyWidth, dirtyHeight, dx, dy);
        }
        else {
            this._canvas._data = imageData;
        }
    }

    _setCanvasBufferUpdatedCallback (func) {
        this._nativeObj._setCanvasBufferUpdatedCallback(func);
    }
}

// var ctx2DProto = CanvasRenderingContext2D.prototype;

// ImageData ctx.createImageData(imagedata);
// ImageData ctx.createImageData(width, height);
// ctx2DProto.createImageData = function (args1, args2) {
//     if (typeof args1 === 'number' && typeof args2 == 'number') {
//         return new ImageData(args1, args2);
//     } else if (args1 instanceof ImageData) {
//         return new ImageData(args1.data, args1.width, args1.height);
//     }
// }

// void ctx.putImageData(imagedata, dx, dy);
// void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
// ctx2DProto.putImageData = function (imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
//     if (typeof loadRuntime === "function") {
//         var height = imageData.height;
//         var width = imageData.width;
//         var canvasWidth = this._canvas._width;
//         var canvasHeight = this._canvas._height;
//         dirtyX = dirtyX || 0;
//         dirtyY = dirtyY || 0;
//         dirtyWidth = dirtyWidth !== undefined ? dirtyWidth : width;
//         dirtyHeight = dirtyHeight !== undefined ? dirtyHeight : height;
//         var limitBottom = dirtyY + dirtyHeight;
//         var limitRight = dirtyX + dirtyWidth;
//         // shrink dirty rect if next image rect bigger than canvas rect
//         dirtyHeight = limitBottom < canvasHeight ? dirtyHeight : (dirtyHeight - (limitBottom - canvasHeight))
//         dirtyWidth = limitRight < canvasWidth ? dirtyWidth : (dirtyWidth - (limitRight - canvasWidth))
//         // collect data needed to put
//         dirtyWidth = Math.floor(dirtyWidth);
//         dirtyHeight = Math.floor(dirtyHeight);
//         var imageToFill = new ImageData(dirtyWidth, dirtyHeight);
//         for (var y = dirtyY; y < limitBottom; y++) {
//             for (var x = dirtyX; x < limitRight; x++) {
//                 var imgPos = y * width + x;
//                 var toPos = (y - dirtyY) * dirtyWidth + (x - dirtyX);
//                 imageToFill.data[toPos * 4 + 0] = imageData.data[imgPos * 4 + 0];
//                 imageToFill.data[toPos * 4 + 1] = imageData.data[imgPos * 4 + 1];
//                 imageToFill.data[toPos * 4 + 2] = imageData.data[imgPos * 4 + 2];
//                 imageToFill.data[toPos * 4 + 3] = imageData.data[imgPos * 4 + 3];
//             }
//         }
//         // do image data write operation at Native (only impl on Android)
//         this._fillImageData(imageToFill.data, dirtyWidth, dirtyHeight, dx, dy);
//     }
//     else {
//         this._canvas._data = imageData;
//     }
// }

// // ImageData ctx.getImageData(sx, sy, sw, sh);
// ctx2DProto.getImageData = function (sx, sy, sw, sh) {
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

module.exports = CanvasRenderingContext2D;
