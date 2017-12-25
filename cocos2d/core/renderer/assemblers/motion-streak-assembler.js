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

const MotionStreak = require('../../../motion-streak/CCMotionStreak');

var motionStreakAssembler = {
    updateRenderData (comp) {
        let renderData = comp._renderData;
        let size = comp.node._contentSize;
        let anchor = comp.node._anchorPoint;
        renderData.updateSizeNPivot(size.width, size.height, anchor.x, anchor.y);
    },

    fillVertexBuffer (comp, index, vbuf, uintbuf) {
        let off = index * comp._vertexFormat._bytes / 4;
        let node = comp.node;
        let renderData = comp._renderData;
        let data = renderData._data;
        let z = node._position.z;
    
        let vert;
        for (let i = 0, l = renderData.vertexCount; i < l; i++) {
            vert = data[i];
            vbuf[off + 0] = vert.x;
            vbuf[off + 1] = vert.y;
            vbuf[off + 2] = z;
            vbuf[off + 4] = vert.u;
            vbuf[off + 5] = vert.v;
            uintbuf[off + 3] = vert.color;
            off += 6;
        }
    },

    fillIndexBuffer (comp, offset, vertexId, ibuf) {
        let renderData = comp._renderData;
        for (let i = 0, l = renderData.vertexCount; i<l; i+=2) {
            var start = vertexId + i;
            ibuf[offset++] = start;
            ibuf[offset++] = start + 2;
            ibuf[offset++] = start + 1;
            ibuf[offset++] = start + 1;
            ibuf[offset++] = start + 2;
            ibuf[offset++] = start + 3;
        }
    }
}

module.exports = MotionStreak._assembler = motionStreakAssembler;
