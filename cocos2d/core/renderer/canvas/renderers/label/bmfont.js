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

import BmfontAssembler from '../../../utils/label/bmfont';
import RenderData from '../render-data';
import utils from '../utils';

export default class CanvasBmfontAssembler extends BmfontAssembler {
    init () {
        this._renderData = new RenderData();
    }

    updateColor () {}

    appendQuad (comp, texture, rect, rotated, x, y, scale) {
        let renderData = this._renderData;
        let dataOffset = renderData.dataLength;
        
        renderData.dataLength += 2;

        let verts = renderData.vertices;

        let rectWidth = rect.width,
            rectHeight = rect.height;

        let l, b, r, t;
        if (!rotated) {
            l = rect.x;
            r = rect.x + rectWidth;
            b = rect.y;
            t = rect.y + rectHeight;

            verts[dataOffset].u = l;
            verts[dataOffset].v = b;
            verts[dataOffset+1].u = r;
            verts[dataOffset+1].v = t;
        } else {
            l = rect.x;
            r = rect.x + rectHeight;
            b = rect.y;
            t = rect.y + rectWidth;

            verts[dataOffset].u = l;
            verts[dataOffset].v = t;
            verts[dataOffset+1].u = l;
            verts[dataOffset+1].v = b;
        }

        verts[dataOffset].x = x;
        verts[dataOffset].y = y - rectHeight * scale;
        verts[dataOffset+1].x = x + rectWidth * scale;
        verts[dataOffset+1].y = y;
    }

    draw (ctx, comp) {
        let node = comp.node;
        // Transform
        let matrix = node._worldMatrix;
        let matrixm = matrix.m;
        let a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];
        ctx.transform(a, b, c, d, tx, ty);
        ctx.scale(1, -1);

        // TODO: handle blend function

        // opacity
        utils.context.setGlobalAlpha(ctx, node.opacity / 255);

        let tex = comp._frame._texture,
            verts = this._renderData.vertices;

        let image = utils.getColorizedImage(tex, node._color);

        for (let i = 0, l = verts.length; i < l; i+=2) {
            let x = verts[i].x;
            let y = verts[i].y;
            let w = verts[i+1].x - x;
            let h = verts[i+1].y - y;
            y = - y - h;

            let sx = verts[i].u;
            let sy = verts[i].v;
            let sw = verts[i+1].u - sx;
            let sh = verts[i+1].v - sy;

            ctx.drawImage(image, 
                sx, sy, sw, sh,
                x, y, w, h);
        }
        
        return 1;
    }
}

