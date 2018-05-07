const renderEngine = require('../render-engine');
const gfx = renderEngine.gfx;

class MeshBuffer {
    constructor (renderer, vertexFormat) {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexOffset = 0;

        this._vertexFormat = vertexFormat;
        this._vertexBytes = this._vertexFormat._bytes;

        this._vb = new gfx.VertexBuffer(
            renderer._device,
            vertexFormat,
            gfx.USAGE_DYNAMIC,
            [],
            0
        );

        this._ib = new gfx.IndexBuffer(
            renderer._device,
            gfx.INDEX_FMT_UINT16,
            gfx.USAGE_STATIC,
            [],
            0
        );

        this._vData = null;
        this._iData = null;
        this._uintVData = null;

        this._renderer = renderer;

        this._initVDataCount = 256 * vertexFormat._bytes; // actually 256 * 4 * (vertexFormat._bytes / 4)
        this._initIDataCount = 256 * 6;
        
        this._reallocBuffer();
    }

    uploadData () {
        if (this.byteOffset === 0) {
            return;
        }

        // update vertext data
        let vertexsData = new Float32Array(this._vData.buffer, 0, this.byteOffset >> 2);
        let indicesData = new Uint16Array(this._iData.buffer, 0, this.indiceOffset);

        let vb = this._vb;
        vb.update(0, vertexsData);

        let ib = this._ib;
        ib.update(0, indicesData);
    }

    request (vertexCount, indiceCount) {
        if (this._renderer._buffer !== this) {
            this._renderer._flush();
            this._renderer._buffer = this;
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

        this.vertexOffset += vertexCount;
        this.indiceOffset += indiceCount;
        
        this.byteOffset = byteOffset;
    }
    
    _reallocBuffer () {
        let oldVData = this._vData;

        this._vData = new Float32Array(this._initVDataCount);
        this._uintVData = new Uint32Array(this._vData.buffer);
        this._iData = new Uint16Array(this._initIDataCount);

        if (oldVData) {
            let vData = this._vData;
            for (let i = 0, l = oldVData.length; i < l; i++) {
                vData[i] = oldVData[i];
            }
        }

        this._vb._bytes = this._vData.byteLength;
        this._ib._bytes = this._iData.byteLength;
    }

    reset () {
        this.byteStart = 0;
        this.byteOffset = 0;
        this.indiceStart = 0;
        this.indiceOffset = 0;
        this.vertexOffset = 0;
    }
}

module.exports = MeshBuffer;
