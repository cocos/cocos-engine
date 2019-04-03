/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

const bmfontUtils = require('../../../utils/label/bmfont')
const js = require('../../../../platform/js');
const utils = require('../utils');

module.exports = js.addon({
    createData (comp) {
        return comp.requestRenderData();
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
        let dataOffset = renderData.dataLength;
        
        renderData.dataLength += 2;

        let data = renderData._data;
        let texw = texture.width,
            texh = texture.height;

        let rectWidth = rect.width,
            rectHeight = rect.height;

        let l, b, r, t;
        if (!rotated) {
            l = rect.x;
            r = rect.x + rectWidth;
            b = rect.y;
            t = rect.y + rectHeight;

            data[dataOffset].u = l;
            data[dataOffset].v = b;
            data[dataOffset+1].u = r;
            data[dataOffset+1].v = t;
        } else {
            l = rect.x;
            r = rect.x + rectHeight;
            b = rect.y;
            t = rect.y + rectWidth;

            data[dataOffset].u = l;
            data[dataOffset].v = t;
            data[dataOffset+1].u = l;
            data[dataOffset+1].v = b;
        }

        data[dataOffset].x = x;
        data[dataOffset].y = y - rectHeight * scale;
        data[dataOffset+1].x = x + rectWidth * scale;
        data[dataOffset+1].y = y;
    },

    draw (ctx, comp) {
        let node = comp.node;
        // Transform
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        ctx.transform(a, b, c, d, tx, ty);
        ctx.scale(1, -1);

        // TODO: handle blend function

        // opacity
        utils.context.setGlobalAlpha(ctx, node.opacity / 255);

        let tex = comp._frame._texture,
            data = comp._renderData._data;

        let image = utils.getColorizedImage(tex, node._color);

        for (let i = 0, l = data.length; i < l; i+=2) {
            let x = data[i].x;
            let y = data[i].y;
            let w = data[i+1].x - x;
            let h = data[i+1].y - y;
            y = - y - h;

            let sx = data[i].u;
            let sy = data[i].v;
            let sw = data[i+1].u - sx;
            let sh = data[i+1].v - sy;

            ctx.drawImage(image, 
                sx, sy, sw, sh,
                x, y, w, h);
        }
        
        return 1;
    }
}, bmfontUtils);
