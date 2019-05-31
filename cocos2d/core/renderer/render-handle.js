
function initQuadIndices(indices) {
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

export default function RenderHandle () {
    this.vDatas = [];
    this.uintVDatas = [];
    this.iDatas = [];

    this.meshCount = 0;

    this._local = null;
    this._infos = null;
    this._flexBuffer = null;
}

cc.js.mixin(RenderHandle.prototype, {
    reset () {
        this.vDatas.length = 0;
        this.iDatas.length = 0;
        this.uintVDatas.length = 0;
        this.meshCount = 0;

        this._local = null;
        this._infos = null;
        this._flexBuffer = null;
    },

    updateMesh (index, vertices, indices) {
        this.vDatas[index] = vertices;
        this.uintVDatas[index] = new Uint32Array(vertices.buffer, 0, vertices.length);
        this.iDatas[index] = indices;
    
        if (this.meshCount < index+1) {
            this.meshCount = index+1;
        }
    },
    
    createData (index, verticesFloats, indicesCount) {
        let vertices = new Float32Array(verticesFloats);
        let indices = new Uint16Array(indicesCount);
        this.updateMesh(index, vertices, indices);
    },
    
    createQuadData (index, verticesFloats, indicesCount) {
        this.createData(index, verticesFloats, indicesCount);
        initQuadIndices(this.iDatas[index]);
    }
})

cc.RenderHandle = RenderHandle;

