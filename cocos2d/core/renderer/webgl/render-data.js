import FlexBuffer from "./flex-buffer";
import { vfmtPosUvColor } from './vertex-format';

export default function RenderData () {
    this.vDatas = [];
    this.uintVDatas = [];
    this.iDatas = [];
    this.meshCount = 0;

    this._infos = null;
    this._flexBuffer = null;
}

cc.js.mixin(RenderData.prototype, {
    init (assembler) {
    },
    clear () {
        this.vDatas.length = 0;
        this.iDatas.length = 0;
        this.uintVDatas.length = 0;
        this.meshCount = 0;

        this._infos = null;

        if (this._flexBuffer) {
            this._flexBuffer.reset();
        }
    },

    updateMesh (index, vertices, indices) {
        this.vDatas[index] = vertices;
        this.uintVDatas[index] = new Uint32Array(vertices.buffer, 0, vertices.length);
        this.iDatas[index] = indices;
    
        this.meshCount = this.vDatas.length;
    },

    updateMeshRange (verticesCount, indicesCount) {
    },
    
    createData (index, verticesFloats, indicesCount) {
        let vertices = new Float32Array(verticesFloats);
        let indices = new Uint16Array(indicesCount);
        this.updateMesh(index, vertices, indices);
    },
    
    createQuadData (index, verticesFloats, indicesCount) {
        this.createData(index, verticesFloats, indicesCount);
        this.initQuadIndices(this.iDatas[index]);
    },

    createFlexData (index, verticesFloats, indicesCount, vfmt) {
        vfmt = vfmt || vfmtPosUvColor;
        this._flexBuffer = new FlexBuffer(this, index, verticesFloats, indicesCount, vfmt);
    },

    initQuadIndices(indices) {
        let count = indices.length / 6;
        for (let i = 0, idx = 0; i < count; i++) {
            let vertextID = i * 4;
            indices[idx++] = vertextID;
            indices[idx++] = vertextID+1;
            indices[idx++] = vertextID+2;
            indices[idx++] = vertextID+1;
            indices[idx++] = vertextID+3;
            indices[idx++] = vertextID+2;
        }
    }
})

cc.RenderData = RenderData;

