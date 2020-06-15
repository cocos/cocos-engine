/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

const WHITE = (255<<16) + (255<<8) + 255;
const MAX_CANVAS_COUNT = 32;

function colorizedFrame (canvas, texture, color, sx, sy, sw, sh) {
    let image = texture._image;

    let ctx = canvas.getContext("2d");
    canvas.width = sw;
    canvas.height = sh;

    // Draw color
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.fillRect(0, 0, sw, sh);

    // Multiply color with texture
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);

    // Clip out transparent pixels
    ctx.globalCompositeOperation = "destination-atop";
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
    return canvas;
}

let canvasMgr = {
    canvasMap: {},
    canvasUsed: {},
    canvasPool: [],

    checking: false,

    check () {
        let exist = false;
        for (let key in this.canvasUsed) {
            exist = true;
            if (!this.canvasUsed[key]) {
                let canvas = this.canvasMap[key];
                canvas.width = 0;
                canvas.height = 0;
                if (this.canvasPool.length < 32) {
                    this.canvasPool.push(canvas);
                }
                delete this.canvasMap[key];
                delete this.canvasUsed[key];
            }
            else {
                this.canvasUsed[key] = false;
            }
        }
        if (!exist) {
            cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.check, this);
            this.checking = false;
        }
    },

    startCheck () {
        cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.check, this);
        this.checking = true;
    },

    getCanvas (key) {
        this.canvasUsed[key] = true;
        return this.canvasMap[key];
    },

    cacheCanvas (canvas, key) {
        this.canvasMap[key] = canvas;
        this.canvasUsed[key] = true;
        if (!this.checking) {
            this.startCheck();
        }
    },
    
    dropImage (key) {
        if (this.canvasMap[key]) {
            delete this.canvasMap[key];
        }
    }
};

module.exports = {
    getColorizedImage (texture, color) {
        if (!texture) return null;
        if (texture.width === 0 || texture.height === 0)  return texture._image;

        // original image
        let cval = color._val & 0x00ffffff;
        if (cval === WHITE) {
            return texture._image;
        }

        // get from cache
        let key = texture.nativeUrl + cval;
        let cache = canvasMgr.getCanvas(key);
        if (!cache) {
            cache = canvasMgr.canvasPool.pop() || document.createElement("canvas");
            colorizedFrame(cache, texture, color, 0, 0, texture.width, texture.height);
            canvasMgr.cacheCanvas(cache, key);
        }
        return cache;
    },

    getFrameCache (texture, color, sx, sy, sw, sh) {
        if (!texture || !texture.nativeUrl || sx < 0 || sy < 0 || sw <= 0 || sh <= 0) {
            return null;
        }

        let key = texture.nativeUrl;
        let generate = false;
        let cval = color._val & 0x00ffffff;
        if (cval !== WHITE) {
            key += cval;
            generate = true;
        }
        if (sx !== 0 || sy !== 0 && sw !== texture.width && sh !== texture.height) {
            key += '_' + sx + '_' + sy + '_' + sw + '_' + sh;
            generate = true;
        }
        if (!generate) {
            return texture._image;
        }
        
        // get from cache
        let cache = canvasMgr.getCanvas(key);
        if (!cache) {
            cache = canvasMgr.canvasPool.pop() || document.createElement("canvas");
            colorizedFrame(cache, texture, color, sx, sy, sw, sh);
            canvasMgr.cacheCanvas(cache, key);
        }
        return cache;
    },

    dropColorizedImage (texture, color) {
        let key = texture.nativeUrl + (color._val & 0x00ffffff);
        canvasMgr.dropImage(key);
    }
};

// cache context data of device.
let _globalAlpha = -1;

let context = {
    setGlobalAlpha (ctx, alpha) {
        if (_globalAlpha === alpha) {
            return 
        }

        _globalAlpha = alpha;
        ctx.globalAlpha = _globalAlpha;
    },

    reset () {
        _globalAlpha = -1;
    }
}

module.exports.context = context;