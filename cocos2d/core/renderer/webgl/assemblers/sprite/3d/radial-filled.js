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

const assembler = require('../2d/radial-filled');

const vec3 = cc.vmath.vec3;
let vec3_temp = vec3.create();

module.exports = {
    useModel: false,

    createData: assembler.createData,
    updateRenderData: assembler.updateRenderData,

    fillBuffers (sprite, renderer) {
        let renderData = sprite._renderData,
            data = renderData._data,
            node = sprite.node,
            color = node._color._val;

        // buffer
        let buffer = renderer._meshBuffer3D,
            vertexOffset = buffer.byteOffset >> 2,
            vbuf = buffer._vData,
            uintbuf = buffer._uintVData;

        let ibuf = buffer._iData,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;

        buffer.request(renderData.vertexCount, renderData.indiceCount);

        let count = data.length;
        let matrix = node._worldMatrix;
        for (let i = 0; i < count; i++) {
            let vert = data[i];
            vec3.set(vec3_temp, vert.x, vert.y, 0);
            vec3.transformMat4(vec3_temp, vec3_temp, matrix);
            vbuf[vertexOffset++] = vec3_temp.x;
            vbuf[vertexOffset++] = vec3_temp.y;
            vbuf[vertexOffset++] = vec3_temp.z;
            vbuf[vertexOffset++] = vert.u;
            vbuf[vertexOffset++] = vert.v;
            uintbuf[vertexOffset++] = color;
        }

        for (let i = 0; i < count; i++) {
            ibuf[indiceOffset + i] = vertexId + i;
        }
    },
};
