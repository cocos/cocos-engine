
export default {
    get verticesFloats () {
        return this.verticesCount * this.floatsPerVert;
    },

    floatsPerVert: 5,

    verticesCount: 4,
    indicesCount: 6,

    uvOffset: 2,
    colorOffset: 4,

    createData (sprite) {
        if (sprite._renderHandle.meshCount > 0) return;
        sprite._renderHandle.createQuadData(0, this.verticesFloats, this.indicesCount);
        // l b r t
        sprite._renderHandle._local.length = 4;
    },

    updateColor (comp, color) {
        let uintVerts = comp._renderHandle.uintVDatas[0];
        if (!uintVerts) return;
        color = color ||comp.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    },

    getBuffer (renderer) {
        return renderer._meshBuffer;
    },

    fillBuffers (comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderHandle = comp._renderHandle;
        let vData = renderHandle.vDatas[0];
        let iData = renderHandle.iDatas[0];
        let verticesCount = vData.length / this.floatsPerVert;

        let buffer = this.getBuffer(renderer);
        let offsetInfo = buffer.request(verticesCount, iData.length);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        vbuf.set(vData, vertexOffset);

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    },

    updateWorldVerts (sprite) {
        let local = sprite._renderHandle._local;
        let verts = sprite._renderHandle.vDatas[0];

        let matrix = sprite.node._worldMatrix,
            a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
            tx = matrix.m12, ty = matrix.m13;

        let vl = local[0], vr = local[2],
            vb = local[1], vt = local[3];
        
        let al = a * vl, ar = a * vr,
            bl = b * vl, br = b * vr,
            cb = c * vb, ct = c * vt,
            db = d * vb, dt = d * vt;

        // left bottom
        verts[0] = al + cb + tx;
        verts[1] = bl + db + ty;
        // right bottom
        verts[5] = ar + cb + tx;
        verts[6] = br + db + ty;
        // left top
        verts[10] = al + ct + tx;
        verts[11] = bl + dt + ty;
        // right top
        verts[15] = ar + ct + tx;
        verts[16] = br + dt + ty;
    }
};
