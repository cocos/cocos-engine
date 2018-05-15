/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
 
const HTMLElement = require('./HTMLElement');
const ImageData = require('./ImageData');
const DOMRect = require('./DOMRect');

class CanvasGradient {
    constructor() {
        console.log("==> CanvasGradient constructor");
    }

    addColorStop(offset, color) {
        console.log("==> CanvasGradient addColorStop");
    }
}

class TextMetrics {
    constructor(width) {
        this._width = width;
    }

    get width() {
        return this._width;
    }
}

class HTMLCanvasElement extends HTMLElement {
    constructor(width, height) {
        super('canvas')

        this.id = 'glcanvas';
        this.type = 'canvas';

        this.top = 0;
        this.left = 0;
        this._width = width ? width : 0;
        this._height = height ? height : 0;
        var w = Math.ceil(this._width);
        var h = Math.ceil(this._height);
        w = w <= 0 ? 1 : w;
        h = h <= 0 ? 1 : h;
        this._bufferWidth = w % 2 === 0 ? w : ++w;
        this._bufferHeight = h % 2 === 0 ? h : ++h;
        this._context2D = null;
        this._data = null;
    }

    //TODO: implement opts.
    getContext(name, opts) {
        var self = this;
        // console.log(`==> Canvas getContext(${name})`);
        if (name === 'webgl' || name === 'experimental-webgl') {
            return window.__ccgl;
        } else if (name === '2d') {
            if (!this._context2D) {
                this._context2D = new CanvasRenderingContext2D(this._bufferWidth, this._bufferHeight);
                this._context2D._canvas = this;
                this._context2D._setCanvasBufferUpdatedCallback(function(data) {
                    // Canvas's data will take 2x memory size, one in C++, another is obtained by Uint8Array here.
                    // HOW TO FIX ?
                    self._data = new ImageData(data, self._bufferWidth, self._bufferHeight);
                });
            }
            return this._context2D;
        }

        return null;
    }

    toDataURL() {
        //TODO:
        console.log("==> Canvas toDataURL");
        return "";
    }

    set width(width) {
        this._width = width;
        width = Math.ceil(width);
        // console.log(`==> HTMLCanvasElement.width = ${width}`);
        // Make sure width could be divided by 2, otherwise text display may be wrong.
        width = width % 2 === 0 ? width : ++width;
        if (this._bufferWidth !== width) {
            this._bufferWidth = width;
            if (this._context2D) {
                this._context2D._width = width;
            }
        }
    }

    get width() {
        return this._width;
    }

    set height(height) {
        this._height = height;
        height = Math.ceil(height);
        // console.log(`==> HTMLCanvasElement.height = ${height}`);
        // Make sure height could be divided by 2, otherwise text display may be wrong.
        height = height % 2 === 0 ? height : ++height;
        if (this._bufferHeight !== height) {
            this._bufferHeight = height;
            if (this._context2D) {
                this._context2D._height = height;
            }
        }
    }

    get height() {
        return this._height;
    }

    get clientWidth() {
        return this._width;
    }

    get clientHeight() {
        return this._height;
    }

    getBoundingClientRect() {
        return new DOMRect(0, 0, this._width, this._height);
    }
}

var ctx2DProto = CanvasRenderingContext2D.prototype;
ctx2DProto.createImageData = function(width, height) {
    return new ImageData(width, height);
}

ctx2DProto.putImageData = function(imagedata, dx, dy) {
    this._canvas._data = imagedata; //TODO: consider dx, dy?
}

ctx2DProto.getImageData = function(sx, sy, sw, sh) {
    //TODO:cjh
    return this._canvas._data;
}

ctx2DProto.drawImage = function(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    //TODO:cjh
}

//TODO:cjh
ctx2DProto.bezierCurveTo = function() {}
ctx2DProto.fill = function() {}

module.exports = HTMLCanvasElement;

