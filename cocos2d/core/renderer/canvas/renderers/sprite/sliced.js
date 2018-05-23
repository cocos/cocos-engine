/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

const utils = require('../utils');
const simple = require('./simple');

let renderer = {
    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 4 rows & cols
        renderData.dataLength = 4;
        return renderData;
    },

    updateRenderData: simple.updateRenderData,
    
    updateUVs (sprite) {
        let frame = sprite.spriteFrame;
        let renderData = sprite._renderData;
        let rect = frame._rect;
        let texture = frame._texture;
    
        // caculate texture coordinate
        let leftWidth = frame.insetLeft;
        let rightWidth = frame.insetRight;
        let centerWidth = rect.width - leftWidth - rightWidth;
        let topHeight = frame.insetTop;
        let bottomHeight = frame.insetBottom;
        let centerHeight = rect.height - topHeight - bottomHeight;
    
        // uv computation should take spritesheet into account.
        let data = renderData._data;
        if (frame._rotated) {
            data[0].u = rect.x;
            data[1].u = bottomHeight + rect.x;
            data[2].u = bottomHeight + centerHeight + rect.x;
            data[3].u = rect.x + rect.height;
            data[3].v = rect.y;
            data[2].v = leftWidth + rect.y;
            data[1].v = leftWidth + centerWidth + rect.y;
            data[0].v = rect.y + rect.width;
        }
        else {
            data[0].u = rect.x;
            data[1].u = leftWidth + rect.x;
            data[2].u = leftWidth + centerWidth + rect.x;
            data[3].u = rect.x + rect.width;
            data[3].v = rect.y;
            data[2].v = topHeight + rect.y;
            data[1].v = topHeight + centerHeight + rect.y;
            data[0].v = rect.y + rect.height;
        }
        renderData.uvDirty = false;
    },
    
    updateVerts (sprite) {
        let renderData = sprite._renderData,
            data = renderData._data,
            node = sprite.node,
            width = node.width, height = node.height,
            appx = node.anchorX * width, appy = node.anchorY * height;
    
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
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
        
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = leftWidth * xScale - appx;
        data[1].y = bottomHeight * yScale - appy;
        data[2].x = data[1].x + sizableWidth;
        data[2].y = data[1].y + sizableHeight;
        data[3].x = width - appx;
        data[3].y = height - appy;

        renderData.vertDirty = false;
    },

    draw (ctx, comp) {
        let node = comp.node;
        // Transform
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        ctx.transform(a, b, c, d, tx, -ty);

        // TODO: handle blend function

        // opacity
        ctx.glphaAlpha = node.opacity / 255;

        let tex = comp._spriteFrame._texture,
            data = comp._renderData._data;

        let image = utils.getColorizedImage(tex, node.color);

        let drawCall = 0;
        let off, ld, rd, td, bd,
            x, y, w, h,
            sx, sy, sw, sh;
        for (let r = 0; r < 3; ++r) {
            bd = data[r];
            td = data[r+1];
            for (let c = 0; c < 3; ++c) {
                ld = data[c];
                rd = data[c+1];
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
};

module.exports = renderer;