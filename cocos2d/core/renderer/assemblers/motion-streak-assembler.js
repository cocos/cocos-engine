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

const js = require('../../platform/js');
const assembler = require('./assembler');
const MotionStreak = require('../../../motion-streak/CCMotionStreak');

var motionStreakAssembler = js.addon({
    updateRenderData (comp) {
        let renderData = comp._renderData;
        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
        renderData.effect = comp.getEffect();
        this.datas.length = 0;
        this.datas.push(renderData);
        return this.datas;
    },

    fillBuffers (batchData, vertexId, vbuf, uintbuf, ibuf) {
        let comp = batchData.comp,
            vertexOffset = batchData.vertexOffset,
            offset = vertexOffset * comp._vertexFormat._bytes / 4,
            node = comp.node,
            renderData = comp._renderData,
            data = renderData._data,
            z = node._position.z;
    
        // vertex buffer
        let vert;
        for (let i = 0, l = renderData.vertexCount; i < l; i++) {
            vert = data[i];
            vbuf[offset + 0] = vert.x;
            vbuf[offset + 1] = vert.y;
            vbuf[offset + 2] = z;
            vbuf[offset + 4] = vert.u;
            vbuf[offset + 5] = vert.v;
            uintbuf[offset + 3] = vert.color;
            offset += 6;
        }
        
        // index buffer
        offset = batchData.indiceOffset;
        for (let i = 0, l = renderData.vertexCount; i < l; i += 2) {
            let start = vertexId + i;
            ibuf[offset++] = start;
            ibuf[offset++] = start + 2;
            ibuf[offset++] = start + 1;
            ibuf[offset++] = start + 1;
            ibuf[offset++] = start + 2;
            ibuf[offset++] = start + 3;
        }
    }
}, assembler);

module.exports = MotionStreak._assembler = motionStreakAssembler;
