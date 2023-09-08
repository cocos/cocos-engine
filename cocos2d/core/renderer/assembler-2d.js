import Assembler from './assembler';
import dynamicAtlasManager from './utils/dynamic-atlas/manager';
import RenderData from './webgl/render-data';

export default class Assembler2D extends Assembler {
    constructor () {
        super();

        this._renderData = new RenderData();
        this._renderData.init(this);
        
        this.initData();
        this.initLocal();
    }

    get verticesFloats () {
        return this.verticesCount * this.floatsPerVert;
    }

    initData () {
        let data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
    }
    initLocal () {
        this._local = [];
        this._local.length = 4;
    }

    updateColor (comp, color) {
        let uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = color != null ? color : comp.node.color._val;
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
        let local = this._local;
        let verts = this._renderData.vDatas[0];

        let matrix = comp.node._worldMatrix;
        let matrixm = matrix.m,
            a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5],
            tx = matrixm[12], ty = matrixm[13];

        let vl = local[0], vr = local[2],
            vb = local[1], vt = local[3];
        
        let floatsPerVert = this.floatsPerVert;
        let vertexOffset = 0;
        let justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        if (justTranslate) {
            // left bottom
            verts[vertexOffset] = vl + tx;
            verts[vertexOffset + 1] = vb + ty;
            vertexOffset += floatsPerVert;
            // right bottom
            verts[vertexOffset] = vr + tx;
            verts[vertexOffset + 1] = vb + ty;
            vertexOffset += floatsPerVert;
            // left top
            verts[vertexOffset] = vl + tx;
            verts[vertexOffset + 1] = vt + ty;
            vertexOffset += floatsPerVert;
            // right top
            verts[vertexOffset] = vr + tx;
            verts[vertexOffset + 1] = vt + ty;
        } else {
            let al = a * vl, ar = a * vr,
            bl = b * vl, br = b * vr,
            cb = c * vb, ct = c * vt,
            db = d * vb, dt = d * vt;

            // left bottom
            verts[vertexOffset] = al + cb + tx;
            verts[vertexOffset + 1] = bl + db + ty;
            vertexOffset += floatsPerVert;
            // right bottom
            verts[vertexOffset] = ar + cb + tx;
            verts[vertexOffset + 1] = br + db + ty;
            vertexOffset += floatsPerVert;
            // left top
            verts[vertexOffset] = al + ct + tx;
            verts[vertexOffset + 1] = bl + dt + ty;
            vertexOffset += floatsPerVert;
            // right top
            verts[vertexOffset] = ar + ct + tx;
            verts[vertexOffset + 1] = br + dt + ty;
        }
    }

    fillBuffers (comp, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(comp);
        }

        let renderData = this._renderData;
        let vData = renderData.vDatas[0];
        let iData = renderData.iDatas[0];

        let buffer = this.getBuffer(renderer);
        let offsetInfo = buffer.request(this.verticesCount, this.indicesCount);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        if (vData.length + vertexOffset > vbuf.length) {
            vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset);
        } else {
            vbuf.set(vData, vertexOffset);
        }

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    }

    packToDynamicAtlas (comp, frame) {
        if (CC_TEST) return;
        
        if (!frame._original && dynamicAtlasManager && frame._texture.packable && frame._texture.loaded) {
            let packedFrame = dynamicAtlasManager.insertSpriteFrame(frame);
            if (packedFrame) {
                frame._setDynamicAtlasFrame(packedFrame);
            }
        }
        let material = comp._materials[0];
        if (!material) return;
        
        if (material.getProperty('texture') !== frame._texture._texture) {
            // texture was packed to dynamic atlas, should update uvs
            comp._vertsDirty = true;
            comp._updateMaterial();
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

cc.Assembler2D = Assembler2D;
