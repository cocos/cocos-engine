const HTMLElement = require('./HTMLElement');
const Event = require('./Event');

class HTMLImageElement extends HTMLElement {
    constructor(width, height) {
        super('img')
        this.width = width;
        this.height = height;
        this._data = null;
        this.onload = null;
        this._src = null;
        this.complete = false;
        this._glFormat = this._glInternalFormat = gl.RGBA;
        this.crossOrigin = null;
    }

    set src(src) {
        this._src = src;
        jsb.loadImage(src, (info) => {
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

            this._alignment = 1;
            // Set the row align only when mipmapsNum == 1 and the data is uncompressed
            if (this._numberOfMipmaps == 1 && !this._compressed) {
                let bytesPerRow = this.width * this._bpp / 8;
                if (bytesPerRow % 8 == 0)
                    _alignment = 8;
                else if (bytesPerRow % 4 == 0)
                    _alignment = 4;
                else if (bytesPerRow % 2 == 0)
                    _alignment = 2;
            }

            this.complete = true;

            this.dispatchEvent(new Event('load'));

            if (this.onload) {
                this.onload();
            }
        });
    }

    get src() {
        return this._src;
    }
}

module.exports = HTMLImageElement;
