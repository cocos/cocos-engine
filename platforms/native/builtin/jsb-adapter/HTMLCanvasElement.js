const HTMLElement = require('./HTMLElement');
const ImageData = require('./ImageData');
const DOMRect = require('./DOMRect');
const CanvasRenderingContext2D = require('./CanvasRenderingContext2D');

let clamp = function (value) {
    value = Math.round(value);
    return value < 0 ? 0 : value < 255 ? value : 255;
};

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
        this._width = width ? Math.ceil(width) : 0;
        this._height = height ? Math.ceil(height) : 0;
        this._context2D = null;
        this._data = null;
    }

    //REFINE: implement opts.
    getContext(name, opts) {
        var self = this;
        if (name === '2d') {
            if (!this._context2D) {
                this._context2D = new CanvasRenderingContext2D(this._width, this._height);
                this._data = new ImageData(this._width, this._height);
                this._context2D._canvas = this;
                this._context2D._setCanvasBufferUpdatedCallback(function (data) {
                    // FIXME: Canvas's data will take 2x memory size, one in C++, another is obtained by Uint8Array here.
                    self._data = new ImageData(data, self._width, self._height);
                });
            }
            return this._context2D;
        }

        return null;
    }

    set width(width) {
        width = Math.ceil(width);
        if (this._width !== width) {
            this._width = width;
            if (this._context2D) {
                this._context2D.width = width;
            }
        }
    }

    get width() {
        return this._width;
    }

    set height(height) {
        height = Math.ceil(height);
        if (this._height !== height) {
            this._height = height;
            if (this._context2D) {
                this._context2D.height = height;
            }
        }
    }

    get height() {
        return this._height;
    }

    get clientWidth() {
        return window.innerWidth;
    }

    get clientHeight() {
        return window.innerHeight;
    }

    get data() {
        if (this._data) {
            return this._data.data;
        }
        return null;
    }

    getBoundingClientRect() {
        return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    }

    requestPointerLock() {
        jsb.setCursorEnabled(false);
    }
}

module.exports = HTMLCanvasElement;
