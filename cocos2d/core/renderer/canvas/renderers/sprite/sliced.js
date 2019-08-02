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
import CanvasSimpleSprite from './simple';

const utils = require('../utils');

export default class CanvasSlicedSprite extends CanvasSimpleSprite {
    init () {
        this._renderData = new RenderData();
        this._renderData.dataLength = 4;
    }

    updateUVs (sprite) {
        let frame = sprite.spriteFrame;
        let renderData = this._renderData;
        let rect = frame._rect;
    
        // caculate texture coordinate
        let leftWidth = frame.insetLeft;
        let rightWidth = frame.insetRight;
        let centerWidth = rect.width - leftWidth - rightWidth;
        let topHeight = frame.insetTop;
        let bottomHeight = frame.insetBottom;
        let centerHeight = rect.height - topHeight - bottomHeight;
    
        // uv computation should take spritesheet into account.
        let verts = renderData.vertices;
        if (frame._rotated) {
            verts[0].u = rect.x;
            verts[1].u = bottomHeight + rect.x;
            verts[2].u = bottomHeight + centerHeight + rect.x;
            verts[3].u = rect.x + rect.height;
            verts[3].v = rect.y;
            verts[2].v = leftWidth + rect.y;
            verts[1].v = leftWidth + centerWidth + rect.y;
            verts[0].v = rect.y + rect.width;
        }
        else {
            verts[0].u = rect.x;
            verts[1].u = leftWidth + rect.x;
            verts[2].u = leftWidth + centerWidth + rect.x;
            verts[3].u = rect.x + rect.width;
            verts[3].v = rect.y;
            verts[2].v = topHeight + rect.y;
            verts[1].v = topHeight + centerHeight + rect.y;
            verts[0].v = rect.y + rect.height;
        }
    }
    
    updateVerts (sprite) {
        let renderData = this._renderData,
            verts = renderData.vertices,
            node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;
    
        let frame = sprite.spriteFrame;
        let leftWidth = frame.insetLeft;
        let rightWidth = frame.insetRight;
        let topHeight = frame.insetTop;
        let bottomHeight = frame.insetBottom;
    
        let sizableWidth = width - leftWidth - rightWidth;
        let sizableHeight = height - topHeight - bottomHeight;
        let xScale = width / (leftWidth + rightWidth);
        let yScale = height / (topHeight + bottomHeight);
        xScale = (isNaN(xScale) || xScale > 1) ? 1 : xScale;
        yScale = (isNaN(yScale) || yScale > 1) ? 1 : yScale;
        sizableWidth = sizableWidth < 0 ? 0 : sizableWidth;
        sizableHeight = sizableHeight < 0 ? 0 : sizableHeight;
        
        if (frame._rotated) {
            verts[0].y = -appx;
            verts[0].x = -appy;
            verts[1].y = rightWidth * xScale - appx;
            verts[1].x = bottomHeight * yScale - appy;
            verts[2].y = verts[1].y + sizableWidth;
            verts[2].x = verts[1].x + sizableHeight;
            verts[3].y = width - appx;
            verts[3].x = height - appy;
        } else {
            verts[0].x = -appx;
            verts[0].y = -appy;
            verts[1].x = leftWidth * xScale - appx;
            verts[1].y = bottomHeight * yScale - appy;
            verts[2].x = verts[1].x + sizableWidth;
            verts[2].y = verts[1].y + sizableHeight;
            verts[3].x = width - appx;
            verts[3].y = height - appy;
        }
            
        sprite._vertsDirty = false;
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

        let drawCall = 0;
        let off, ld, rd, td, bd,
            x, y, w, h,
            sx, sy, sw, sh;
        for (let r = 0; r < 3; ++r) {
            bd = verts[r];
            td = verts[r+1];
            for (let c = 0; c < 3; ++c) {
                ld = verts[c];
                rd = verts[c+1];
                x = ld.x;
                y = bd.y;
                w = rd.x - x;
                h = td.y - y;
                y = - y - h;

                sx = ld.u;
                // invert texture because texture uv is in UI coordinates (origin at top left)
                sy = td.v;
                sw = rd.u - sx;
                sh = bd.v - sy;

                if (sw > 0 && sh > 0 && w > 0 && h > 0) {
                    ctx.drawImage(image,
                        sx, sy, sw, sh,
                        x, y, w, h);
                    drawCall++;
                }
            }
        }
        return drawCall;
    }
}
