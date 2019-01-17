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

import { vec3 } from '../../../../core/vmath/index';
// const dynamicAtlasManager = require('../../../../utils/dynamic-atlas/manager');
let matrix = cc.mat4();

let simple = {
    useModel: false,

    createData(sprite) {
        let renderData = sprite.requestRenderData();
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indiceCount = 6;
        return renderData;
    },

    updateRenderData(sprite) {
        let frame = sprite._spriteFrame;

        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        // if (frame) {
        //     if (!frame._original && dynamicAtlasManager) {
        //         dynamicAtlasManager.insertSpriteFrame(frame);
        //     }
        //     if (sprite._material._texture !== frame._texture) {
        //         sprite._activateMaterial();
        //     }
        // }

        let renderData = sprite._renderData;
        if (renderData && frame) {
            if (renderData.vertDirty) {
                this.updateVerts(sprite);
            }
        }
    },

    fillBuffers: (function () {
        let vec3_temps = [];
        for (let i = 0; i < 4; i++) {
            vec3_temps.push(vec3.create());
        }
        return function (sprite, /*renderer*/buffer) {
            let data = sprite._renderData._data,
                node = sprite.node,
                color = sprite._color._val;

            node.getWorldMatrix(matrix);

            let /*buffer = renderer._meshBuffer3D,*/
                vertexOffset = buffer.byteOffset >> 2,
                indiceOffset = buffer.indiceOffset,
                vertexId = buffer.vertexOffset;

            buffer.request(4, 6);

            // buffer data may be realloc, need get reference after request.
            let vbuf = buffer.vData,
                uintbuf = buffer.uintVData,
                ibuf = buffer.iData;

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

    updateVerts(sprite) {
        let renderData = sprite._renderData,
            node = sprite.node,
            data = renderData._data,
            cw = node.width, ch = node.height,
            appx = node.anchorX * cw, appy = node.anchorY * ch,
            l, b, r, t;
        // if (sprite.trim) {
        l = -appx;
        b = -appy;
        r = cw - appx;
        t = ch - appy;
        // }
        // else {
        //     let frame = sprite.spriteFrame,
        //         ow = frame._originalSize.width, oh = frame._originalSize.height,
        //         rw = frame._rect.width, rh = frame._rect.height,
        //         offset = frame._offset,
        //         scaleX = cw / ow, scaleY = ch / oh;
        //     let trimLeft = offset.x + (ow - rw) / 2;
        //     let trimRight = offset.x - (ow - rw) / 2;
        //     let trimBottom = offset.y + (oh - rh) / 2;
        //     let trimTop = offset.y - (oh - rh) / 2;
        //     l = trimLeft * scaleX - appx;
        //     b = trimBottom * scaleY - appy;
        //     r = cw + trimRight * scaleX - appx;
        //     t = ch + trimTop * scaleY - appy;
        // }

        data[0].x = l;
        data[0].y = b;
        // data[1].x = r;
        // data[1].y = b;
        // data[2].x = l;
        // data[2].y = t;
        data[3].x = r;
        data[3].y = t;

        renderData.vertDirty = false;
    }
};

export default simple;
