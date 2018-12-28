const renderEngine = require('../render-engine');
const gfx = renderEngine.gfx;

let MeshBuffer = cc.Class({
    name: 'cc.MeshBuffer',
    ctor (batcher, vertexFormat) {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;

        this._vertexFormat = vertexFormat;
        this._vertexBytes = this._vertexFormat._bytes;

        this._vb = new gfx.VertexBuffer(
            batcher._device,
            vertexFormat,
            gfx.USAGE_DYNAMIC,
            new ArrayBuffer(),
            0
        );

        this._ib = new gfx.IndexBuffer(
            batcher._device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            new ArrayBuffer(),
            0
        );

        this._vData = null;
        this._iData = null;
        this._uintVData = null;

        this._batcher = batcher;

        this._initVDataCount = 256 * vertexFormat._bytes; // actually 256 * 4 * (vertexFormat._bytes / 4)
        this._initIDataCount = 256 * 6;
        
        this._reallocBuffer();
    },

    uploadData () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        // update vertext data
        let vertexsData = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2);
        let indicesData = new Uint16Array(this._iData.buffer, 0, this.indiceOffset);

        let vb = this._vb;
        vb.update(0, vertexsData);

        let ib = this._ib;
        ib.update(0, indicesData);

        this._dirty = false;
    },

    requestStatic (vertexCount, indiceCount) {
        let byteOffset = this.byteOffset + vertexCount * this._vertexBytes;
        let indiceOffset = this.indiceOffset + indiceCount;

        let byteLength = this._vData.byteLength;
        let indiceLength = this._iData.length;
        if (byteOffset > byteLength || indiceOffset > indiceLength) {
            while (byteLength < byteOffset || indiceLength < indiceOffset) {
                this._initVDataCount *= 2;
                this._initIDataCount *= 2;

                byteLength = this._initVDataCount * 4;
                indiceLength = this._initIDataCount;
            }

            this._reallocBuffer();
        }

        this.vertexOffset += vertexCount;
        this.indiceOffset += indiceCount;
        
        this.byteOffset = byteOffset;

        this._dirty = true;
    },

    request (vertexCount, indiceCount) {
        if (this._batcher._buffer !== this) {
            this._batcher._flush();
            this._batcher._buffer = this;
        }

        this.requestStatic(vertexCount, indiceCount);
    },
    
    _reallocBuffer () {
        this._reallocVData(true);
        this._reallocIData(true);
    },

    _reallocVData (copyOldData) {
        let oldVData;
        if (this._vData) {
            oldVData = new Uint8Array(this._vData.buffer);
        }

        this._vData = new Float32Array(this._initVDataCount);
        this._uintVData = new Uint32Array(this._vData.buffer);
        let newData = new Uint8Array(this._uintVData.buffer);

        if (oldVData && copyOldData) {
            for (let i = 0, l = oldVData.length; i < l; i++) {
                newData[i] = oldVData[i];
            }
        }

        this._vb._bytes = this._vData.byteLength;
    },

    _reallocIData (copyOldData) {
        let oldIData = this._iData;

        this._iData = new Uint16Array(this._initIDataCount);

        if (oldIData && copyOldData) {
            let iData = this._iData;
            for (let i = 0, l = oldIData.length; i < l; i++) {
                iData[i] = oldIData[i];
            }
        }

        this._ib._bytes = this._iData.byteLength;
    },

    reset () {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;
        this._dirty = false;
    },

    destroy () {
        this._ib.destroy();
        this._vb.destroy();
    }
});

cc.MeshBuffer = module.exports = MeshBuffer;
