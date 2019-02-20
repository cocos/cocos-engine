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

const js = require('../../../../../platform/js');
const assembler = require('../2d/sliced');

const vec3 = cc.vmath.vec3;
const vec3_temp = vec3.create();

module.exports = js.addon({
    fillBuffers (sprite, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(sprite);
        }

        let renderData = sprite._renderData,
            node = sprite.node,
            color = node._color._val,
            data = renderData._data;

        let buffer = renderer._meshBuffer3D,
            vertexCount = renderData.vertexCount;

        let uvSliced = sprite.spriteFrame.uvSliced;
        let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

        // buffer data may be realloc, need get reference after request.
        let vertexOffset = offsetInfo.byteOffset >> 2,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset,
            vbuf = buffer._vData,
            uintbuf = buffer._uintVData,
            ibuf = buffer._iData;

        for (let i = 4; i < 20; ++i) {
            let vert = data[i];
            let uvs = uvSliced[i - 4];

            vbuf[vertexOffset++] = vert.x;
            vbuf[vertexOffset++] = vert.y;
            vbuf[vertexOffset++] = vert.z;
            vbuf[vertexOffset++] = uvs.u;
            vbuf[vertexOffset++] = uvs.v;
            uintbuf[vertexOffset++] = color;
        }

        for (let r = 0; r < 3; ++r) {
            for (let c = 0; c < 3; ++c) {
                let start = vertexId + r * 4 + c;
                ibuf[indiceOffset++] = start;
                ibuf[indiceOffset++] = start + 1;
                ibuf[indiceOffset++] = start + 4;
                ibuf[indiceOffset++] = start + 1;
                ibuf[indiceOffset++] = start + 5;
                ibuf[indiceOffset++] = start + 4;
            }
        }
    },

    updateWorldVerts (sprite) {
        let node = sprite.node,
            data = sprite._renderData._data;

        let matrix = node._worldMatrix;
        for (let row = 0; row < 4; ++row) {
            let rowD = data[row];
            for (let col = 0; col < 4; ++col) {
                let colD = data[col];
                let world = data[4 + row * 4 + col];

                vec3.set(vec3_temp, colD.x, rowD.y, 0);
                vec3.transformMat4(world, vec3_temp, matrix);
            }
        }
    },
}, assembler);
