const HTMLElement = require('./HTMLElement');
const Event = require('./Event');
const sharp = globalThis.nodeEnv.sharp;

class HTMLImageElement extends HTMLElement {
    constructor(width, height, isCalledFromImage) {
        if (!isCalledFromImage) {
            throw new TypeError("Illegal constructor, use 'new Image(w, h); instead!'");
        }
        super('img')
        this.width = width ? width : 0;
        this.height = height ? height : 0;
        this._data = null;
        this._src = null;
        this.complete = false;
        this.crossOrigin = null;
        this._mipmapLevelDataSize = [];
    }

    destroy() {
        if (this._data) {
            this._data = null;
        }
        this._src = null;
    }

    set src(src) {
        this._src = src;
        if (src === '') return;
        
        let image = src;
        if (typeof src === 'string' && src.startsWith('data:')) {
            const matches = src.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const { Buffer } = require('buffer');
                // Convert to Uint8Array to avoid Buffer version mismatch issues with sharp
                image = new Uint8Array(Buffer.from(matches[2], 'base64'));
            }
        }

        sharp(image).metadata().then(info => {
                this.width = info.width;
                this.height = info.height;
                return setTimeout(()=>{
                    var event = new Event('load');
                    this.dispatchEvent(event);
                }, 0);
        }).catch(err => {
            console.warn(`Failed to load source image from ${src}, error reason: ${err}`);
            this._data = null;
            setTimeout(()=>{
                var event = new Event('error');
                this.dispatchEvent(event);
            }, 0);
        });
    }

    get src() {
        return this._src;
    }

    get clientWidth() {
        return this.width;
    }

    get clientHeight() {
        return this.height;
    }

    getBoundingClientRect() {
        return new DOMRect(0, 0, this.width, this.height);
    }
}

module.exports = HTMLImageElement;
