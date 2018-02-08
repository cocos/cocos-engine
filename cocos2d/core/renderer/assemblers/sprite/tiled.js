/****************************************************************************
 Copyright (c) 2017-2018 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const Sprite = require('../../../components/CCSprite');
const RenderData = require('../../render-engine').RenderData;

module.exports = {
    createData (sprite) {
        return RenderData.alloc();
    },

    update (sprite) {
        let renderData = sprite._renderData;
        if (!renderData.uvDirty && !renderData.vertDirty) return;

        let effect = sprite.getEffect();
        if (!effect || !renderData) return;

        let texture = effect.getProperty('texture');
        let texw = texture._width,
            texh = texture._height;
        let frame = sprite.spriteFrame;
        let rect = frame._rect;
        let contentWidth = Math.abs(renderData._width);
        let contentHeight = Math.abs(renderData._height);

        let rectWidth = rect.width;
        let rectHeight = rect.height;
        let hRepeat = contentWidth / rectWidth;
        let vRepeat = contentHeight / rectHeight;
        let row = Math.ceil(vRepeat), 
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

        let appx = renderData._pivotX * contentWidth,
            appy = renderData._pivotY * contentHeight;

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

    fillVertexBuffer (sprite, index, vbuf, uintbuf) {
        let node = sprite.node;
        let renderData = sprite._renderData;
        let data = renderData._data;
        let z = node._position.z;
        let color = node._color._val;

        let rect = sprite.spriteFrame._rect;
        let contentWidth = Math.abs(renderData._width);
        let contentHeight = Math.abs(renderData._height);
        let hRepeat = contentWidth / rect.width;
        let vRepeat = contentHeight / rect.height;
        let row = Math.ceil(vRepeat), 
            col = Math.ceil(hRepeat);
        
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;

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
                vbuf[index++] = x * a + y * c + tx;
                vbuf[index++] = x * b + y * d + ty;
                vbuf[index++] = z;
                uintbuf[index++] = color;
                vbuf[index++] = lastx ? data[4].u : data[0].u;
                vbuf[index++] = lasty ? data[4].v : data[0].v;

                // rb
                vbuf[index++] = x1 * a + y * c + tx;
                vbuf[index++] = x1 * b + y * d + ty;
                vbuf[index++] = z;
                uintbuf[index++] = color;
                vbuf[index++] = lastx ? data[5].u : data[1].u;
                vbuf[index++] = lasty ? data[5].v : data[1].v;

                // lt
                vbuf[index++] = x * a + y1 * c + tx;
                vbuf[index++] = x * b + y1 * d + ty;
                vbuf[index++] = z;
                uintbuf[index++] = color;
                vbuf[index++] = lastx ? data[6].u : data[2].u;
                vbuf[index++] = lasty ? data[6].v : data[2].v;

                // rt
                vbuf[index++] = x1 * a + y1 * c + tx;
                vbuf[index++] = x1 * b + y1 * d + ty;
                vbuf[index++] = z;
                uintbuf[index++] = color;
                vbuf[index++] = lastx ? data[7].u : data[3].u;
                vbuf[index++] = lasty ? data[7].v : data[3].v;
            }
        }
    },
    
    fillIndexBuffer (sprite, offset, vertexId, ibuf) {
        let renderData = sprite._renderData;
        let length = renderData.indiceCount;
        for (let i = 0; i < length; i+=6) {
            ibuf[offset++] = vertexId;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+2;
            ibuf[offset++] = vertexId+1;
            ibuf[offset++] = vertexId+3;
            ibuf[offset++] = vertexId+2;
            vertexId += 4;
        }
    }
};