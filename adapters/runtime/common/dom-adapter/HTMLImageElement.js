import HTMLElement from './HTMLElement'
import Event from "./Event"

window.jsb = window.jsb || {};
let _creteImage = jsb.createImage;
let _image;
let _setter;
let _getter;

if (_creteImage) {
    _image = _creteImage();
    let _descriptor = Object.getOwnPropertyDescriptor(_image.__proto__, "src");
    _setter = _descriptor.set;
    _getter = _descriptor.get;
}

export default class HTMLImageElement extends HTMLElement {
    constructor(width, height, isCalledFromImage) {
        if (!isCalledFromImage) {
            throw new TypeError("Illegal constructor, use 'new Image(w, h); instead!'");
        }
        super('IMG');
        this.complete = false;
        this.crossOrigin = null;
        this.naturalWidth = 0;
        this.naturalHeight = 0;
        this.width = width || 0;
        this.height = height || 0;

        if (_creteImage) {
            // since runtime 2.0.0
            let image = _creteImage();
            Object.keys(this).forEach(function (key) {
                image[key] = this[key];
            }.bind(this));
            image._onload = function () {
                this.complete = true;
                this.naturalWidth = this.width;
                this.naturalHeight = this.height;
                this.dispatchEvent(new Event("load"));
            }.bind(image);
            image._onerror = function () {
                this.dispatchEvent(new Event("error"));
            }.bind(image);
            Object.defineProperty(image, "src", {
                configurable: true,
                enumerable: true,
                get: function () {
                    return _getter.call(this);
                },
                set: function (value) {
                    this.complete = false;
                    return _setter.call(this, value);
                }
            });
            return image;
        }
    }

    getBoundingClientRect() {
        return new DOMRect(0, 0, this.width, this.height);
    }

    set src(src) {
        this._src = src;

        if (src === "") {
            this.width = 0;
            this.height = 0;
            this._data = null;
            this._imageMeta = null;
            this.complete = true;
            this._glFormat = this._glInternalFormat = 0x1908;
            this.crossOrigin = null;
            return;
        }

        jsb.loadImageData(src, (info) => {
            if (!info) {
                let event = new Event('error');
                this.dispatchEvent(event);
                return;
            }
            this._imageMeta = info;
            this.width = this.naturalWidth = info.width;
            this.height = this.naturalHeight = info.height;
            this._data = info.data;
            // console.log(`glFormat: ${info.glFormat}, glInternalFormat: ${info.glInternalFormat}, glType: ${info.glType}`);
            this._glFormat = info.glFormat;
            this._glInternalFormat = info.glInternalFormat;
            this._glType = info.glType;
            this._numberOfMipmaps = info.numberOfMipmaps;
            this._compressed = info.compressed;
            this._bpp = info.bpp;
            this._premultiplyAlpha = info.premultiplyAlpha;

            this._alignment = 1;
            // Set the row align only when mipmapsNum == 1 and the data is uncompressed
            if ((this._numberOfMipmaps == 0 || this._numberOfMipmaps == 1) && !this._compressed) {
                const bytesPerRow = this.width * this._bpp / 8;
                if (bytesPerRow % 8 == 0)
                    this._alignment = 8;
                else if (bytesPerRow % 4 == 0)
                    this._alignment = 4;
                else if (bytesPerRow % 2 == 0)
                    this._alignment = 2;
            }

            this.complete = true;

            var event = new Event('load');
            this.dispatchEvent(event);
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
}
