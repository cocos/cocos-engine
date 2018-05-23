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

const Node = require('../../../CCNode');
const Mask = require('../../../components/CCMask');
const Graphics = require('../../../graphics/graphics');
const graphicsHandler = require('./graphics');

// for nested mask, we might need multiple graphics component to avoid data conflict
let _graphicsPool = [];

function getGraphics () {
    let graphics = _graphicsPool.pop();

    if (!graphics) {
        let graphicsNode = new Node();
        graphics = graphicsNode.addComponent(Graphics);
        graphics.lineWidth = 0;
    }
    return graphics;
}

let beforeHandler = {
    updateRenderData (comp) {},
    updateGraphics (mask) {
        let node = mask.node;
        let graphics = mask._graphics;
        // Share render data with graphics content
        graphics.clear(false);
        let width = node.width;
        let height = node.height;
        let x = -width * node.anchorX;
        let y = -height * node.anchorY;
        if (mask._type === Mask.Type.RECT) {
            graphics.rect(x, y, width, height);
        }
        else if (mask._type === Mask.Type.ELLIPSE) {
            let cx = x + width / 2,
                cy = y + height / 2,
                rx = width / 2,
                ry = height / 2;
            graphics.ellipse(cx, cy, rx, ry);
        }
        graphics.stroke();
    },

    draw (ctx, mask) {
        let node = mask.node;
        // Transform
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        ctx.save();
        ctx.transform(a, b, c, d, tx, -ty);

        // draw stencil
        mask._graphics = getGraphics();
        this.updateGraphics(mask);
        graphicsHandler.draw(ctx, mask._graphics);

        ctx.clip();
    }
};

let afterHandler = {
    updateRenderData (comp) {},
    draw (ctx, mask) {
        ctx.restore();
    }
};

module.exports = {
    beforeHandler,
    afterHandler
};