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

import TTFAssembler from '../../../utils/label/ttf';
import RenderData from '../render-data';
import utils from '../utils';

export default class CanvasTTFAssembler extends TTFAssembler {
    init () {
        this._renderData = new RenderData();
        this._renderData.dataLength = 2;
    }

    updateColor () {
    }

    updateVerts (comp) {
        let renderData = this._renderData;

        let node = comp.node,
            width = node.width,
            height = node.height,
            appx = node.anchorX * width,
            appy = node.anchorY * height;

        let verts = renderData.vertices;
        verts[0].x = -appx;
        verts[0].y = -appy;
        verts[1].x = width - appx;
        verts[1].y = height - appy;
    }

    _updateTexture (comp) {
        TTFAssembler.prototype._updateTexture.call(this, comp);
        let texture = comp._frame._texture;
        utils.dropColorizedImage(texture, comp.node.color);
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

        let image = tex.getHtmlElementObj();

        let x = verts[0].x;
        let y = verts[0].y;
        let w = verts[1].x - x;
        let h = verts[1].y - y;
        y = - y - h;

        ctx.drawImage(image, x, y, w, h);
        return 1;
    }
}
