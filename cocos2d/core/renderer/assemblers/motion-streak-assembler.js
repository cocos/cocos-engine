
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

MotionStreak._assembler = motionStreakAssembler;

module.exports = motionStreakAssembler;