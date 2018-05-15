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

const dynamicAtlasManager = require('../../utils/dynamic-atlas/manager');

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
            if (!frame._original) {
                dynamicAtlasManager.insertSpriteFrame(frame);
            }
            if (!sprite._material || sprite._material._texture !== frame._texture) {
                sprite._material = null;
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

        let l, b, r, t;
        if (!frame._rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            data[0].u = l;
            data[0].v = b;
            data[1].u = r;
            data[1].v = b;
            data[2].u = l;
            data[2].v = t;
            data[3].u = r;
            data[3].v = t;
            
            data[4].u = l;
            data[4].v = b;
            data[5].u = l + (r-l) * Math.min(1, hRepeat - col + 1);
            data[5].v = b;
            data[6].u = l;
            data[6].v = b + (t-b) * Math.min(1, vRepeat - row + 1);
            data[7].u = data[5].u;
            data[7].v = data[6].v;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            data[0].u = l;
            data[0].v = t;
            data[1].u = l;
            data[1].v = b;
            data[2].u = r;
            data[2].v = t;
            data[3].u = r;
            data[3].v = b;

            data[4].u = l;
            data[4].v = t;
            data[5].u = l;
            data[5].v = t + (b - t) * Math.min(1, vRepeat - col + 1);
            data[6].u = l + (r - l) * Math.min(1, hRepeat - row + 1);
            data[6].v = t;
            data[7].u = data[5].u;
            data[7].v = data[6].v;
        }

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
            renderData = sprite._renderData,
            data = renderData._data;

        // buffer
        let buffer = renderer._meshBuffer,
            vertexOffset = buffer.byteOffset >> 2,
            vbuf = buffer._vData;
        
        let ibuf = buffer._iData,
            indiceOffset = buffer.indiceOffset,
            vertexId = buffer.vertexOffset;
            
        buffer.request(renderData.vertexCount, renderData.indiceCount);

        // 
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

        let x, x1, y, y1, lastx, lasty;
        for (let yindex = 0, ylength = row; yindex < ylength; ++yindex) {
            y = data[yindex].y;
            y1 = data[yindex+1].y;
            for (let xindex = 0, xlength = col; xindex < xlength; ++xindex) {
                lasty = yindex + 1 === ylength;
                lastx = xindex + 1 === xlength;
                x = data[xindex].x;
                x1 = data[xindex+1].x;

                // lb
                vbuf[vertexOffset++] = x * a + y * c + tx;
                vbuf[vertexOffset++] = x * b + y * d + ty;
                vbuf[vertexOffset++] = lastx ? data[4].u : data[0].u;
                vbuf[vertexOffset++] = lasty ? data[4].v : data[0].v;

                // rb
                vbuf[vertexOffset++] = x1 * a + y * c + tx;
                vbuf[vertexOffset++] = x1 * b + y * d + ty;
                vbuf[vertexOffset++] = lastx ? data[5].u : data[1].u;
                vbuf[vertexOffset++] = lasty ? data[5].v : data[1].v;

                // lt
                vbuf[vertexOffset++] = x * a + y1 * c + tx;
                vbuf[vertexOffset++] = x * b + y1 * d + ty;
                vbuf[vertexOffset++] = lastx ? data[6].u : data[2].u;
                vbuf[vertexOffset++] = lasty ? data[6].v : data[2].v;

                // rt
                vbuf[vertexOffset++] = x1 * a + y1 * c + tx;
                vbuf[vertexOffset++] = x1 * b + y1 * d + ty;
                vbuf[vertexOffset++] = lastx ? data[7].u : data[3].u;
                vbuf[vertexOffset++] = lasty ? data[7].v : data[3].v;
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