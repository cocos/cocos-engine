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
const assembler = require('../2d/simple');
const vec3 = cc.vmath.vec3;

module.exports = js.addon({
    fillBuffers: (function() {
        let vec3_temps = [];
        for (let i = 0; i < 4; i++) {
            vec3_temps.push(vec3.create());
        }
        return function (sprite, renderer) {
            let data = sprite._renderData._data,
                node = sprite.node,
                color = node._color._val,
                matrix = node._worldMatrix;
    
            let buffer = renderer._meshBuffer3D;
            let offsetInfo = buffer.request(4, 6);
    
            // buffer data may be realloc, need get reference after request.
            let vertexOffset = offsetInfo.byteOffset >> 2,
                indiceOffset = offsetInfo.indiceOffset,
                vertexId = offsetInfo.vertexOffset,
                vbuf = buffer._vData,
                uintbuf = buffer._uintVData,
                ibuf = buffer._iData;
    
            let data0 = data[0], data3 = data[3];
            vec3.set(vec3_temps[0], data0.x, data0.y, 0);
            vec3.set(vec3_temps[1], data3.x, data0.y, 0);
            vec3.set(vec3_temps[2], data0.x, data3.y, 0);
            vec3.set(vec3_temps[3], data3.x, data3.y, 0);

            // get uv from sprite frame directly
            let uv = sprite._spriteFrame.uv;
            for (let i = 0; i < 4; i++) {
                // vertex
                let vertex = vec3_temps[i];
                vec3.transformMat4(vertex, vertex, matrix);

                vbuf[vertexOffset++] = vertex.x;
                vbuf[vertexOffset++] = vertex.y;
                vbuf[vertexOffset++] = vertex.z;

                // uv
                let uvOffset = i * 2;
                vbuf[vertexOffset++] = uv[0 + uvOffset];
                vbuf[vertexOffset++] = uv[1 + uvOffset];
    
                // color
                uintbuf[vertexOffset++] = color;
            }

            // fill indice data
            ibuf[indiceOffset++] = vertexId;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 2;
            ibuf[indiceOffset++] = vertexId + 1;
            ibuf[indiceOffset++] = vertexId + 3;
            ibuf[indiceOffset++] = vertexId + 2;
        };
    })(),
}, assembler);
