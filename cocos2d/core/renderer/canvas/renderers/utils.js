/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const WHITE = (255<<16) + (255<<8) + 255;
let colorCanvas = {};
let canvasPool = [];

module.exports = {
    getColorizedImage (texture, color) {
        if (!texture || !texture.url) {
            return null;
        }
        
        // original image
        let cval = color._val & 0x00ffffff;
        if (cval === WHITE) {
            return texture._image;
        }

        // get from cache
        let key = texture.url + cval;
        if (colorCanvas[key]) {
            return colorCanvas[key];
        }

        let x = 0, y = 0, w = texture.width, h = texture.height;
        let image = texture._image;

        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;

        // Draw color
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ')';
        ctx.fillRect(x, y, w, h);

        // Multiply color with texture
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(image, x, y, w, h);

        // Clip out transparent pixels
        ctx.globalCompositeOperation = "destination-atop";
        ctx.drawImage(image, x, y, w, h);

        colorCanvas[key] = canvas;
        return canvas;
    },
    
    dropColorizedImage (texture, color) {
        let key = texture.url + (color._val & 0x00ffffff);
        if (colorCanvas[key]) {
            delete colorCanvas[key];
        }
    }
};