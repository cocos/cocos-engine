const HTMLElement = require('./HTMLElement');
const ImageData = require('./ImageData');
const DOMRect = require('./DOMRect');
const CanvasRenderingContext2D = require('./CanvasRenderingContext2D');
const jsbWindow = require('../../jsbWindow');

const clamp = function (value) {
    value = Math.round(value);
    return value < 0 ? 0 : value < 255 ? value : 255;
};

class CanvasGradient {
    constructor () {
        console.log('==> CanvasGradient constructor');
    }

    addColorStop (offset, color) {
        console.log('==> CanvasGradient addColorStop');
    }
}

class TextMetrics {
    constructor (width) {
        this._width = width;
    }

    get width () {
        return this._width;
    }
}

class HTMLCanvasElement extends HTMLElement {
    constructor (width, height) {
        super('canvas');

        this.id = 'glcanvas';
        this.type = 'canvas';

        this.top = 0;
        this.left = 0;
        this._width = width ? Math.ceil(width) : 0;
        this._height = height ? Math.ceil(height) : 0;
        this._context2D = null;
        this._dataInner = null;
    }

    //REFINE: implement opts.
    getContext (name, opts) {
        const self = this;
        if (name === '2d') {
            if (!this._context2D) {
                this._context2D = new CanvasRenderingContext2D(this._width, this._height);
                this._context2D._canvas = this;
                this._context2D._setCanvasBufferUpdatedCallback((data) => {
                    // FIXME: Canvas's data will take 2x memory size, one in C++, another is obtained by Uint8Array here.
                    self._dataInner = new ImageData(data, self._width, self._height);
                });
            }
            return this._context2D;
        }

        return null;
    }

    get _data () {
        if (this._context2D === null) {
            return null;
        }
        if (!this._dataInner) {
            this._context2D.fetchData();
        }
        return this._dataInner;
    }

    set _data (data) {
        this._dataInner = data;
    }

    set width (width) {
        width = Math.ceil(width);
        if (this._width !== width) {
            this._dataInner = null;
            this._width = width;
            if (this._context2D) {
                this._context2D.width = width;
            }
        }
    }

    get width () {
        return this._width;
    }

    set height (height) {
        height = Math.ceil(height);
        if (this._height !== height) {
            this._dataInner = null;
            this._height = height;
            if (this._context2D) {
                this._context2D.height = height;
            }
        }
    }

    get height () {
        return this._height;
    }

    get clientWidth () {
        return jsbWindow.innerWidth;
    }

    get clientHeight () {
        return jsbWindow.innerHeight;
    }

    get data () {
        if (this._data) {
            return this._data.data;
        }
        return null;
    }

    getBoundingClientRect () {
        return new DOMRect(0, 0, jsbWindow.innerWidth, jsbWindow.innerHeight);
    }

    requestPointerLock () {
        jsb.setCursorEnabled(false);
    }
}

module.exports = HTMLCanvasElement;
