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
        return renderData;
    },
    
    update (sprite) {},

    draw (ctx, sprite) {
        let node = sprite.node;
        // Transform
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
        ctx.transform(a, b, c, d, tx, -ty);

        // TODO: handle blend function

        // opacity
        ctx.glphaAlpha = node.opacity / 255;

        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        let tex = frame._texture;
        let sx = rect.x;
        let sy = rect.y;
        let sw = frame._rotated ? rect.height : rect.width;
        let sh = frame._rotated ? rect.width : rect.height;

        let image = utils.getFrameCache(tex, node.color, sx, sy, sw, sh);

        let w = node.width,
            h = node.height,
            x = -node.anchorX * w,
            y = -node.anchorY * h;
        y = - y - h;

        ctx.translate(x, y);
        ctx.fillStyle = ctx.createPattern(image, 'repeat');
        ctx.fillRect(0, 0, w, h);
        return 1;
    }
}

module.exports = renderer