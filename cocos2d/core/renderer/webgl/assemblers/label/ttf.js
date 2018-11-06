/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

const js = require('../../../../platform/js');
const ttfUtls = require('../../../utils/label/ttf');

const WHITE = cc.color(255, 255, 255, 255);

module.exports = js.addon({
    createData (comp) {
        let renderData = comp.requestRenderData();

        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;

        let verts = renderData.vertices;
        verts[0].u = 0;
        verts[0].v = 1;
        verts[1].u = 1;
        verts[1].v = 1;
        verts[2].u = 0;
        verts[2].v = 0;
        verts[3].u = 1;
        verts[3].v = 0;
        return renderData;
    },

    fillBuffers (comp, renderer) {
        let verts = comp._renderData.vertices,
            node = comp.node,
            color = WHITE._val,
            matrix = node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;
    
        let buffer = renderer._quadBuffer,
            vertexOffset = buffer.byteOffset >> 2;

        buffer.request(4, 6);

        // buffer data may be realloc, need get reference after request.
        let vbuf = buffer._vData,
            uintbuf = buffer._uintVData;

        // vertex
        for (let i = 0; i < 4; i++) {
            let vert = verts[i];
            vbuf[vertexOffset++] = vert.x * a + vert.y * c + tx;
            vbuf[vertexOffset++] = vert.x * b + vert.y * d + ty;
            vbuf[vertexOffset++] = vert.u;
            vbuf[vertexOffset++] = vert.v;
            uintbuf[vertexOffset++] = color;
        }
    },

    _updateVerts (comp) {
        let renderData = comp._renderData;

        let node = comp.node,
            width = node.width,
            height = node.height,
            appx = node.anchorX * width,
            appy = node.anchorY * height;

        let verts = renderData.vertices;
        verts[0].x = -appx;
        verts[0].y = -appy;
        verts[1].x = width - appx;
        verts[1].y = -appy;
        verts[2].x = -appx;
        verts[2].y = height - appy;
        verts[3].x = width - appx;
        verts[3].y = height - appy;
    }
}, ttfUtls);
