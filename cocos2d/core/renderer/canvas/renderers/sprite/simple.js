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

import Assembler from '../../../assembler';
import RenderData from '../render-data';
const utils = require('../utils');

export default class CanvasSimpleSprite extends Assembler {
    init () {
        this._renderData = new RenderData();
        this._renderData.dataLength = 2;
    }

    updateRenderData (sprite) {
        if (sprite._vertsDirty) {
            this.updateUVs(sprite);
            this.updateVerts(sprite);
            sprite._vertsDirty = false;
        }
    }

    updateUVs (sprite) {
        let frame = sprite.spriteFrame;
        let renderData = this._renderData;
        let verts = renderData.vertices;
        let rect = frame._rect;
        
        if (frame._rotated) {
            let l = rect.x;
            let r = rect.width;
            let b = rect.y;
            let t = rect.height;
            verts[0].u = l;
            verts[0].v = b;
            verts[1].u = t;
            verts[1].v = r;
        }
        else {
            let l = rect.x;
            let r = rect.width;
            let b = rect.y;
            let t = rect.height;
            verts[0].u = l;
            verts[0].v = b;
            verts[1].u = r;
            verts[1].v = t;
        }
    }

    updateVerts (sprite) {
        let renderData = this._renderData,
            node = sprite.node,
            verts = renderData.vertices,
            frame = sprite.spriteFrame,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw;
            t = ch;
        }
        else {
            let ow = frame._originalSize.width, oh = frame._originalSize.height,
                rw = frame._rect.width, rh = frame._rect.height,
                offset = frame._offset,
                scaleX = cw / ow, scaleY = ch / oh;
            let trimLeft = offset.x + (ow - rw) / 2;
            let trimBottom = offset.y + (oh - rh) / 2;
            l = trimLeft * scaleX - appx;
            b = trimBottom * scaleY - appy;
            r = cw;
            t = ch;
        }
        
        if (frame._rotated) {
            verts[0].y = l;
            verts[0].x = b;
            verts[1].y = r;
            verts[1].x = t;
        } else {
            verts[0].x = l;
            verts[0].y = b;
            verts[1].x = r;
            verts[1].y = t;
        }
        
        renderData.vertDirty = false;
    }

    draw (ctx, comp) {
        let node = comp.node;
        let frame = comp._spriteFrame;
        // Transform
        let matrix = node._worldMatrix;
        let matrixm = matrix.m;
        let a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];
        ctx.transform(a, b, c, d, tx, ty);
        ctx.scale(1, -1);
        if (frame._rotated) {
            ctx.rotate(- Math.PI / 2);
        }

        // TODO: handle blend function

        // opacity
        utils.context.setGlobalAlpha(ctx, node.opacity / 255);

        let tex = frame._texture,
            verts = this._renderData.vertices;

        let image = utils.getColorizedImage(tex, node._color);

        let x = verts[0].x;
        let y = verts[0].y;
        let w = verts[1].x;
        let h = verts[1].y;
        y = - y - h;

        let sx = verts[0].u;
        let sy = verts[0].v;
        let sw = verts[1].u;
        let sh = verts[1].v;

        ctx.drawImage(image,
            sx, sy, sw, sh,
            x, y, w, h);
        return 1;
    }
}

