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

const dynamicAtlasManager = require('../../../utils/dynamic-atlas/manager');

module.exports = {
    useModel: false,

    createData (sprite) {
        return sprite.requestRenderData();
    },

    updateRenderData (sprite) {
        let frame = sprite.spriteFrame;
        
        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        if (frame) {
            if (!frame._original && dynamicAtlasManager) {
                dynamicAtlasManager.insertSpriteFrame(frame);
            }
            if (sprite._material._texture !== frame._texture) {
                sprite._activateMaterial();
            }
        }

        let renderData = sprite._renderData;
        if (!frame || !renderData || 
            !(renderData.uvDirty || renderData.vertDirty)) 
            return;

        let texture = frame._texture;
        let texw = texture.width,
            texh = texture.height,
            rect = frame._rect;

        let node = sprite.node,
            contentWidth = Math.abs(node.width),
            contentHeight = Math.abs(node.height),
            appx = node.anchorX * contentWidth,
            appy = node.anchorY * contentHeight;

        let rectWidth = rect.width,
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

    fillBuffers (sprite, renderer) {
        let node = sprite.node,
            color = node._color._val,
            renderData = sprite._renderData,
            data = renderData._data;

        // buffer
        let buffer = renderer._meshBuffer,
            vertexOffset = buffer.byteOffset >> 2;
        
        let indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;
            
        buffer.request(renderData.vertexCount, renderData.indiceCount);

        // buffer data may be realloc, need get reference after request.
        let vbuf = buffer._vData,
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
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        let x, x1, y, y1, coefu, coefv;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = data[yindex].y;
            y1 = data[yindex+1].y;
            coefv = Math.min(1, vRepeat - yindex);
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                coefu = Math.min(1, hRepeat - xindex);
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

                // UV
                if (rotated) {
                    // lb
                    vbuf[vertexOffset+2] = uv[0];
                    vbuf[vertexOffset+3] = uv[1];
                    // rb
                    vbuf[vertexOffset+7] = uv[0];
                    vbuf[vertexOffset+8] = uv[1] + (uv[7] - uv[1]) * coefu;
                    // lt
                    vbuf[vertexOffset+12] = uv[0] + (uv[6] - uv[0]) * coefv;
                    vbuf[vertexOffset+13] = uv[1];
                    // rt
                    vbuf[vertexOffset+17] = vbuf[vertexOffset+12];
                    vbuf[vertexOffset+18] = vbuf[vertexOffset+8];
                }
                else {
                    // lb
                    vbuf[vertexOffset+2] = uv[0];
                    vbuf[vertexOffset+3] = uv[1];
                    // rb
                    vbuf[vertexOffset+7] = uv[0] + (uv[6] - uv[0]) * coefu;
                    vbuf[vertexOffset+8] = uv[1];
                    // lt
                    vbuf[vertexOffset+12] = uv[0];
                    vbuf[vertexOffset+13] = uv[1] + (uv[7] - uv[1]) * coefv;
                    // rt
                    vbuf[vertexOffset+17] = vbuf[vertexOffset+7];
                    vbuf[vertexOffset+18] = vbuf[vertexOffset+13];
                }
                // color
                uintbuf[vertexOffset+4] = color;
                uintbuf[vertexOffset+9] = color;
                uintbuf[vertexOffset+14] = color;
                uintbuf[vertexOffset+19] = color;
                vertexOffset += 20;
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