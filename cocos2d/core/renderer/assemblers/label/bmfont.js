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

const macro = require('../../../platform/CCMacro');
const renderEngine = require('../../render-engine');

const js = require('../../../platform/js');
const bmfontUtls = require('../../utils/label/bmfont');
const assembler = require('../assembler');
const ttfAssembler = require('./ttf');

module.exports = js.addon({
    createData (comp) {
        return comp.requestRenderData();
    },

    updateRenderData: ttfAssembler.updateRenderData,

    fillBuffers (comp, renderer) {
        let node = comp.node;
        let renderData = comp._renderData;
        let data = renderData._data;
        // let z = node._position.z;
        let color = node.color._val;
        
        let matrix = node._worldMatrix;
        let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05, 
            tx = matrix.m12, ty = matrix.m13;
    
        let length = renderData.vertexCount;
        
        let buffer = renderer.getQuadBuffer();
        let vertexOffset = buffer.byteOffset >> 2;
        let vbuf = buffer._vData;
        let uintbuf = buffer._uintVData;
        buffer.request(length, renderData.indiceCount, 24*length);

        for (let i = 0; i < length; i++) {
            let vert = data[i];
            vbuf[vertexOffset] = vert.x * a + vert.y * c + tx;
            vbuf[vertexOffset+1] = vert.x * b + vert.y * d + ty;
            // vbuf[vertexOffset+2] = z;
            uintbuf[vertexOffset+3] = color;
            vbuf[vertexOffset+4] = vert.u;
            vbuf[vertexOffset+5] = vert.v;
            vertexOffset += 6;
        }
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
        let dataOffset = renderData.dataLength;
        
        renderData.dataLength += 4;
        renderData.vertexCount = renderData.dataLength;
        renderData.indiceCount = renderData.dataLength / 2 * 3;

        let data = renderData._data;
        let texw = texture.width,
            texh = texture.height;

        let rectWidth = rect.width,
            rectHeight = rect.height;

        let l, b, r, t;
        if (!rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            data[dataOffset].u = l;
            data[dataOffset].v = b;
            data[dataOffset+1].u = r;
            data[dataOffset+1].v = b;
            data[dataOffset+2].u = l;
            data[dataOffset+2].v = t;
            data[dataOffset+3].u = r;
            data[dataOffset+3].v = t;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            data[dataOffset].u = l;
            data[dataOffset].v = t;
            data[dataOffset+1].u = l;
            data[dataOffset+1].v = b;
            data[dataOffset+2].u = r;
            data[dataOffset+2].v = t;
            data[dataOffset+3].u = r;
            data[dataOffset+3].v = b;
        }

        data[dataOffset].x = x;
        data[dataOffset].y = y - rectHeight * scale;
        data[dataOffset+1].x = x + rectWidth * scale;
        data[dataOffset+1].y = y - rectHeight * scale;
        data[dataOffset+2].x = x;
        data[dataOffset+2].y = y;
        data[dataOffset+3].x = x + rectWidth * scale;
        data[dataOffset+3].y = y;
    },
}, bmfontUtls, assembler);
