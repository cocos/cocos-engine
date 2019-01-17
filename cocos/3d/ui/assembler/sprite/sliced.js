/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

// const dynamicAtlasManager = require('../../../utils/dynamic-atlas/manager');
import { vec3 } from '../../../../core/vmath/index';

const vec3_temp = vec3.create();

let sliced = {
    useModel: false,

    createData(sprite) {
        let renderData = sprite.requestRenderData();
        // 0-4 for local verts
        // 5-20 for world verts
        // renderData.dataLength = 20;
        renderData.dataLength = 16;

        renderData.vertexCount = 16;
        renderData.indiceCount = 54;
        return renderData;
    },

    updateRenderData(sprite, batchData) {
        let frame = sprite.spriteFrame;

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
            let vertDirty = renderData.vertDirty;
            if (vertDirty) {
                this.updateVerts(sprite);
                // this.updateWorldVerts(sprite);
            }
        }
    },

    updateVerts(sprite) {
        let renderData = sprite._renderData,
            data = renderData._data,
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

        let value = [
            cc.v3(-appx, -appy, 0),
            cc.v3(leftWidth * xScale - appx, bottomHeight * yScale - appy, 0),
            cc.v3(leftWidth * xScale - appx + sizableWidth, bottomHeight * yScale - appy + sizableHeight, 0),
            cc.v3(width - appx, height - appy, 0)
        ];

        for (let row = 0; row < 4; ++row) {
            let rowD = value[row];
            for (let col = 0; col < 4; ++col) {
                let colD = value[col];
                let world = data[row * 4 + col];
                vec3.set(world, colD.x, rowD.y, 0);
                // vec3.transformMat4(world, vec3_temp, matrix);
            }
        }

        // data[0].x = -appx;
        // data[0].y = -appy;
        // data[1].x = leftWidth * xScale - appx;
        // data[1].y = bottomHeight * yScale - appy;
        // data[2].x = data[1].x + sizableWidth;
        // data[2].y = data[1].y + sizableHeight;
        // data[3].x = width - appx;
        // data[3].y = height - appy;

        renderData.vertDirty = false;
    },

    fillBuffers(sprite, /*renderer*/buffer) {
        // if (renderer.worldMatDirty) {
        this.updateWorldVerts(sprite);
        // }

        let renderData = sprite._renderData,
            node = sprite.node,
            color = sprite._color._val,
            data = renderData._data;

        let /*buffer = is3DNode ? renderer._meshBuffer3D : renderer._meshBuffer,*/
            vertexOffset = buffer.byteOffset >> 2,
            vertexCount = renderData.vertexCount,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;

        let uvSliced = sprite.spriteFrame.uvSliced;

        buffer.request(vertexCount, renderData.indiceCount);

        // buffer data may be realloc, need get reference after request.
        let vbuf = buffer._vData,
            uintbuf = buffer._uintVData,
            ibuf = buffer._iData;

        // for (let i = 4; i < 20; ++i) {
        for (let i = 0; i < 16; ++i) {
            let vert = data[i];
            // let uvs = uvSliced[i - 4];
            let uvs = uvSliced[i];

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

    updateWorldVerts(sprite) {
        let node = sprite.node,
            data = sprite._renderData._data;

        // node._updateWorldMatrix();
        // let matrix = node._worldMatrix;
        for (let row = 0; row < 4; ++row) {
            let rowD = data[row];
            for (let col = 0; col < 4; ++col) {
                let colD = data[col];
                let world = data[4 + row * 4 + col];

                vec3.set(vec3_temp, colD.x, rowD.y, 0);
                // vec3.transformMat4(world, vec3_temp, matrix);
            }
        }
    },
};

export default sliced;
