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

        this.preByteOffset = 0;
        this.preVertexOffset = 0;
        this.preIndexOffset = 0;

        this._vertexFormat = vertexFormat;
        this._vertexBytes = this._vertexFormat._bytes;

        this._arrOffset = 0;
        this._vbArr = [];
        this._vb = new gfx.VertexBuffer(
            batcher._device,
            vertexFormat,
            gfx.USAGE_DYNAMIC,
            new ArrayBuffer(),
            0
        );
        this._vbArr[0] = this._vb;

        this._ibArr = [];
        this._ib = new gfx.IndexBuffer(
            batcher._device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            new ArrayBuffer(),
            0
        );
        this._ibArr[0] = this._ib;

        this._vDataArr = [];
        this._vData = null;
        this._uintVData = null;
        this._iDataArr = [];
        this._iData = null;

        this._batcher = batcher;

        this._constVDataCount = 256 * vertexFormat._bytes;// actually 256 * 4 * (vertexFormat._bytes / 4)
        this._constIDataCount = 256 * 6;

        this._initVDataCount = this._constVDataCount;
        this._initIDataCount = this._constIDataCount
        
        this._reallocBuffer();
    },

    uploadData () {
        if (this.byteOffset === 0 || !this._dirty) {
            return;
        }

        for (let i = 0; i <= this._arrOffset; i++) {
            let vDataInfo = this._vDataArr[i];
            // update vertext data
            let vertexsData = new Float32Array(vDataInfo.vData.buffer, 0, vDataInfo.byteOffset >> 2);
            let vb = this._vbArr[i];
            vb.update(0, vertexsData);
        }
        
        for (let i = 0; i <= this._arrOffset; i++) {
            let iDataInfo = this._iDataArr[i];
            let indicesData = new Uint16Array(iDataInfo.iData.buffer, 0, iDataInfo.indiceOffset);
            let ib = this._ibArr[i];
            ib.update(0, indicesData);
        }

        this._dirty = false;
    },

    requestStatic (vertexCount, indiceCount) {

        if (this.vertexOffset + vertexCount > 65535) {
            this._batcher._flush();
            let offset = ++this._arrOffset;
            let vDataInfo = this._vDataArr[offset];
            let iDataInfo = this._iDataArr[offset];

            this.byteStart = 0;
            this.byteOffset = 0;
            this.vertexStart = 0;
            this.vertexOffset = 0;
            this.indiceStart = 0;
            this.indiceOffset = 0;

            if (vDataInfo) {
                this._vData = vDataInfo.vData;
                this._uintVData = vDataInfo.uintVData;
                this._iData = iDataInfo.iData;

                this._initVDataCount = this._vData.length;
                this._initIDataCount = this._iData.length;

                this._vb = this._vbArr[offset];
                this._ib = this._ibArr[offset];
            } else {

                this._vb = new gfx.VertexBuffer(
                    this._batcher._device,
                    this._vertexFormat,
                    gfx.USAGE_DYNAMIC,
                    new ArrayBuffer(),
                    0
                );
                this._vbArr[offset] = this._vb;

                this._ib = new gfx.IndexBuffer(
                    this._batcher._device,
                    gfx.INDEX_FMT_UINT16,
                    gfx.USAGE_STATIC,
                    new ArrayBuffer(),
                    0
                );
                this._ibArr[offset] = this._ib;

                this._iData = null;
                this._vData = null;
                this._uintVData = null;

                this._initVDataCount = this._constVDataCount;
                this._initIDataCount = this._constIDataCount;
                this._reallocBuffer();
            }
        }

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

        this.preVertexOffset = this.vertexOffset;
        this.vertexOffset += vertexCount;

        this.preIndexOffset = this.indiceOffset;
        this.indiceOffset += indiceCount;
        let iDataInfo = this._iDataArr[this._arrOffset];
        iDataInfo.indiceOffset = this.indiceOffset;

        this.preByteOffset = this.byteOffset;
        this.byteOffset = byteOffset;
        let vDataInfo = this._vDataArr[this._arrOffset];
        vDataInfo.byteOffset = byteOffset;

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

        this._vDataArr[this._arrOffset] = this._vDataArr[this._arrOffset] || {};
        let vDataInfo = this._vDataArr[this._arrOffset];
        vDataInfo.vData = this._vData;
        vDataInfo.uintVData = this._uintVData;

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
        this._iDataArr[this._arrOffset] = this._iDataArr[this._arrOffset] || {};
        let iDataInfo = this._iDataArr[this._arrOffset];
        iDataInfo.iData = this._iData;

        if (oldIData && copyOldData) {
            let iData = this._iData;
            for (let i = 0, l = oldIData.length; i < l; i++) {
                iData[i] = oldIData[i];
            }
        }

        this._ib._bytes = this._iData.byteLength;
    },

    reset () {
        this._arrOffset = 0;
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexStart = 0;
        this.vertexOffset = 0;

        let vDataInfo = this._vDataArr[0];
        this._vData = vDataInfo.vData;
        this._uintVData = vDataInfo.uintVData;
        let iDataInfo = this._iDataArr[0];
        this._iData = iDataInfo.iData;

        this._initVDataCount = this._vData.length;
        this._initIDataCount = this._iData.length;

        this._vb = this._vbArr[0];
        this._ib = this._ibArr[0];

        this.preByteOffset = 0;
        this.preVertexOffset = 0;
        this.preIndexOffset = 0;

        this._dirty = false;
    },

    destroy () {
        for (let key in this._vbArr) {
            let vb = this._vbArr[key];
            vb.destroy();
        }
        this._vbArr = undefined;

        for (let key in this._ibArr) {
            let ib = this._ibArr[key];
            ib.destroy();
        }
        this._ibArr = undefined;

        this._ib = undefined;
        this._vb = undefined;
    }
});

cc.MeshBuffer = module.exports = MeshBuffer;
