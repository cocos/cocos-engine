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

const ttfUtils = require('../../../utils/label/ttf')
const js = require('../../../../platform/js');
const utils = require('../utils');

module.exports = js.addon({
    createData (sprite) {
        let renderData = sprite.requestRenderData();
        // 0 for bottom left, 1 for top right
        renderData.dataLength = 2;
        return renderData;
    },

    _updateVerts (comp) {
        let renderData = comp._renderData;

        let node = comp.node,
            width = node.width,
            height = node.height,
            appx = node.anchorX * width,
            appy = node.anchorY * height;

        let data = renderData._data;
        data[0].x = -appx;
        data[0].y = -appy;
        data[1].x = width - appx;
        data[1].y = height - appy;
    },

    _updateTexture (comp) {
        ttfUtils._updateTexture(comp);
        let texture = comp._frame._texture;
        utils.dropColorizedImage(texture, comp.node.color);
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

        let image = tex.getHtmlElementObj();

        let x = data[0].x;
        let y = data[0].y;
        let w = data[1].x - x;
        let h = data[1].y - y;
        y = - y - h;

        ctx.drawImage(image, x, y, w, h);
        return 1;
    }
}, ttfUtils);
