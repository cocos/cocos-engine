import Assembler from './assembler';

export default class Assembler2D extends Assembler {
    get verticesFloats () {
        return this.verticesCount * this.floatsPerVert;
    }

    updateRenderData () {
        if (this._renderData.meshCount === 0) {
            this.initData();
        }
    }

    initData () {
        let data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
        // l b r t
        data._local.length = 4;
    }

    updateColor (comp, color) {
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color ||comp.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    }

    getBuffer () {
        return cc.renderer._handle._meshBuffer;
    }

    updateWorldVerts (comp) {
        let local = this._renderData._local;
        let verts = this._renderData.vDatas[0];

        let matrix = comp.node._worldMatrix,
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

    fillBuffers (comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderData = this._renderData;
        let vData = renderData.vDatas[0];
        let iData = renderData.iDatas[0];

        let buffer = this.getBuffer(renderer);
        let offsetInfo = buffer.request(this.verticesCount, iData.length);

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
    }
}

cc.js.addon(Assembler2D.prototype, {
    floatsPerVert: 5,

    verticesCount: 4,
    indicesCount: 6,

    uvOffset: 2,
    colorOffset: 4,
});
