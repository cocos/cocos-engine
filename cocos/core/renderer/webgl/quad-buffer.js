const MeshBuffer = require('./mesh-buffer');

let QuadBuffer = cc.Class({
    name: 'cc.QuadBuffer',
    extends: MeshBuffer,
    
    _fillQuadBuffer () {
        let count = this._initIDataCount / 6;
        let buffer = this._iData;
        for (let i = 0, idx = 0; i < count; i++) {
            let vertextID = i * 4;
            buffer[idx++] = vertextID;
            buffer[idx++] = vertextID+1;
            buffer[idx++] = vertextID+2;
            buffer[idx++] = vertextID+1;
            buffer[idx++] = vertextID+3;
            buffer[idx++] = vertextID+2;
        }

        let indicesData = new Uint16Array(this._iData.buffer, 0, count * 6 );
        this._ib.update(0, indicesData);
    },

    uploadData () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        // update vertext data
        let vertexsData = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2);
        this._vb.update(0, vertexsData);

        this._dirty = false;
    },

    _reallocBuffer () {
        this._reallocVData(true);
        this._reallocIData();
        this._fillQuadBuffer();
    }
});

cc.QuadBuffer = module.exports = QuadBuffer;
