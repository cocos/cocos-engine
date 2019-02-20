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

const packToDynamicAtlas = require('../../../../utils/utils').packToDynamicAtlas;
module.exports = {
    vertexOffset: 5,
    uvOffset: 2,
    colorOffset: 4,

    createData (sprite) {
        return sprite.requestRenderData();
    },

    updateRenderData (sprite) {
        packToDynamicAtlas(sprite, sprite._spriteFrame);

        let renderData = sprite._renderData;
        let frame = sprite.spriteFrame;
        if (!frame || !renderData || 
            !(renderData.uvDirty || renderData.vertDirty)) 
            return;

        let node = sprite.node,
            contentWidth = Math.abs(node.width),
            contentHeight = Math.abs(node.height),
            appx = node.anchorX * contentWidth,
            appy = node.anchorY * contentHeight;

        let rect = frame._rect,
            rectWidth = rect.width,
            rectHeight = rect.height,
            hRepeat = contentWidth / rectWidth,
            vRepeat = contentHeight / rectHeight,
            row = Math.ceil(vRepeat), 
            col = Math.ceil(hRepeat);

        let data = renderData._data;
        renderData.dataLength = Math.max(8, row+1, col+1);

        for (let i = 0; i <= col; ++i) {
            data[i].x = Math.min(rectWidth * i, contentWidth) - appx;
        }
        for (let i = 0; i <= row; ++i) {
            data[i].y = Math.min(rectHeight * i, contentHeight) - appy;
        }
        
        // update data property
        renderData.vertexCount = row * col * 4;
        renderData.indiceCount = row * col * 6;
        renderData.uvDirty = false;
        renderData.vertDirty = false;
    },

    fillVertices (vbuf, vertexOffset, matrix, row, col, data) {
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        let x, x1, y, y1;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = data[yindex].y;
            y1 = data[yindex+1].y;
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                x = data[xindex].x;
                x1 = data[xindex+1].x;

                // Vertex
                // lb
                vbuf[vertexOffset] = x * a + y * c + tx;
                vbuf[vertexOffset+1] = x * b + y * d + ty;
                // rb
                vbuf[vertexOffset+5] = x1 * a + y * c + tx;
                vbuf[vertexOffset+6] = x1 * b + y * d + ty;
                // lt
                vbuf[vertexOffset+10] = x * a + y1 * c + tx;
                vbuf[vertexOffset+11] = x * b + y1 * d + ty;
                // rt
                vbuf[vertexOffset+15] = x1 * a + y1 * c + tx;
                vbuf[vertexOffset+16] = x1 * b + y1 * d + ty;

                vertexOffset += 20;
            }
        }
    },

    fillBuffers (sprite, renderer) {
        let node = sprite.node,
            is3DNode = node.is3DNode,
            color = node._color._val,
            renderData = sprite._renderData,
            data = renderData._data;

        // buffer
        let buffer = is3DNode ? renderer._meshBuffer3D : renderer._meshBuffer;
        let offsetInfo = buffer.request(renderData.vertexCount, renderData.indiceCount);

        // buffer data may be realloc, need get reference after request.
        let indiceOffset = offsetInfo.indiceOffset,
            vertexOffset = offsetInfo.byteOffset >> 2,
            vertexId = offsetInfo.vertexOffset,
            vbuf = buffer._vData,
            uintbuf = buffer._uintVData,
            ibuf = buffer._iData;

        let rotated = sprite.spriteFrame._rotated;
        let uv = sprite.spriteFrame.uv;
        let rect = sprite.spriteFrame._rect;
        let contentWidth = Math.abs(node.width);
        let contentHeight = Math.abs(node.height);
        let hRepeat = contentWidth / rect.width;
        let vRepeat = contentHeight / rect.height;
        let row = Math.ceil(vRepeat), 
            col = Math.ceil(hRepeat);
        
        let matrix = node._worldMatrix;
        
        this.fillVertices(vbuf, vertexOffset, matrix, row, col, data);

        let offset = this.vertexOffset, uvOffset = this.uvOffset, colorOffset = this.colorOffset;
        let offset1 = offset, offset2 = offset*2, offset3 = offset*3, offset4 = offset*4;
        let coefu, coefv;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            coefv = Math.min(1, vRepeat - yindex);
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                coefu = Math.min(1, hRepeat - xindex);

                let vertexOffsetU = vertexOffset + uvOffset;
                let vertexOffsetV = vertexOffsetU + 1;
                // UV
                if (rotated) {
                    // lb
                    vbuf[vertexOffsetU] = uv[0];
                    vbuf[vertexOffsetV] = uv[1];
                    // rb
                    vbuf[vertexOffsetU+offset1] = uv[0];
                    vbuf[vertexOffsetV+offset1] = uv[1] + (uv[7] - uv[1]) * coefu;
                    // lt
                    vbuf[vertexOffsetU+offset2] = uv[0] + (uv[6] - uv[0]) * coefv;
                    vbuf[vertexOffsetV+offset2] = uv[1];
                    // rt
                    vbuf[vertexOffsetU+offset3] = vbuf[vertexOffsetU+offset2];
                    vbuf[vertexOffsetV+offset3] = vbuf[vertexOffsetV+offset1];
                }
                else {
                    // lb
                    vbuf[vertexOffsetU] = uv[0];
                    vbuf[vertexOffsetV] = uv[1];
                    // rb
                    vbuf[vertexOffsetU+offset1] = uv[0] + (uv[6] - uv[0]) * coefu;
                    vbuf[vertexOffsetV+offset1] = uv[1];
                    // lt
                    vbuf[vertexOffsetU+offset2] = uv[0];
                    vbuf[vertexOffsetV+offset2] = uv[1] + (uv[7] - uv[1]) * coefv;
                    // rt
                    vbuf[vertexOffsetU+offset3] = vbuf[vertexOffsetU+offset1];
                    vbuf[vertexOffsetV+offset3] = vbuf[vertexOffsetV+offset2];
                }
                // color
                uintbuf[vertexOffset+colorOffset] = color;
                uintbuf[vertexOffset+colorOffset+offset1] = color;
                uintbuf[vertexOffset+colorOffset+offset2] = color;
                uintbuf[vertexOffset+colorOffset+offset3] = color;
                vertexOffset += offset4;
            }
        }

        // update indices
        let length = renderData.indiceCount;
        for (let i = 0; i < length; i+=6) {
            ibuf[indiceOffset++] = vertexId;
            ibuf[indiceOffset++] = vertexId+1;
            ibuf[indiceOffset++] = vertexId+2;
            ibuf[indiceOffset++] = vertexId+1;
            ibuf[indiceOffset++] = vertexId+3;
            ibuf[indiceOffset++] = vertexId+2;
            vertexId += 4;
        }
    },
};