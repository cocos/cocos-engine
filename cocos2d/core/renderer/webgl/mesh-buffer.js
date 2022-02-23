/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import gfx from '../../../renderer/gfx';

let FIX_IOS14_BUFFER;
if (CC_WECHATGAME) {
    FIX_IOS14_BUFFER = (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX) && GameGlobal?.isIOSHighPerformanceMode && /(OS 1[4-9])|(Version\/1[4-9])/.test(window.navigator.userAgent);
} else {
    FIX_IOS14_BUFFER = (cc.sys.os === cc.sys.OS_IOS || cc.sys.os === cc.sys.OS_OSX) && cc.sys.isBrowser && /(OS 1[4-9])|(Version\/1[4-9])/.test(window.navigator.userAgent);
}
let MeshBuffer = cc.Class({
    name: 'cc.MeshBuffer',
    ctor (batcher, vertexFormat) {
        this.init (batcher, vertexFormat);
    },

    init (batcher, vertexFormat) {
        this.byteOffset = 0;
        this.indiceOffset = 0;
        this.vertexOffset = 0;
        this.indiceStart = 0;

        this._dirty = false;

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

        this._vData = null;
        this._uintVData = null;
        this._iData = null;

        this._batcher = batcher;

        this._initVDataCount = 256 * vertexFormat._bytes;// actually 256 * 4 * (vertexFormat._bytes / 4)
        this._initIDataCount = 256 * 6;
        
        this._offsetInfo = {
            byteOffset : 0,
            vertexOffset : 0,
            indiceOffset : 0
        }
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

    switchBuffer () {
        let offset = ++this._arrOffset;

        this.byteOffset = 0;
        this.vertexOffset = 0;
        this.indiceOffset = 0;
        this.indiceStart = 0;

        if (offset < this._vbArr.length) {
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
        }
    },

    checkAndSwitchBuffer (vertexCount) {
        if (this.vertexOffset + vertexCount > 65535) {
            this.uploadData();
            this._batcher._flush();
            this.switchBuffer();
        }
    },

    requestStatic (vertexCount, indiceCount) {

        this.checkAndSwitchBuffer(vertexCount);

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
        this._updateOffset(vertexCount, indiceCount, byteOffset);
    },

    _updateOffset (vertexCount, indiceCount, byteOffset) {
        let offsetInfo = this._offsetInfo;
        offsetInfo.vertexOffset = this.vertexOffset;
        this.vertexOffset += vertexCount;

        offsetInfo.indiceOffset = this.indiceOffset;
        this.indiceOffset += indiceCount;

        offsetInfo.byteOffset = this.byteOffset;
        this.byteOffset = byteOffset;

        this._dirty = true;
    },

    request (vertexCount, indiceCount) {
        if (this._batcher._buffer !== this) {
            this._batcher._flush();
            this._batcher._buffer = this;
        }

        this.requestStatic(vertexCount, indiceCount);
        return this._offsetInfo;
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
    },

    reset () {
        this._arrOffset = 0;
        this._vb = this._vbArr[0];
        this._ib = this._ibArr[0];

        this.byteOffset = 0;
        this.indiceOffset = 0;
        this.vertexOffset = 0;
        this.indiceStart = 0;

        this._dirty = false;
    },

    destroy () {
        this.reset();
        for (let i = 0; i <  this._vbArr.length; i++) {
            let vb = this._vbArr[i];
            vb.destroy();
        }
        this._vbArr = null;

        for (let i = 0; i < this._ibArr.length; i++) {
            let ib = this._ibArr[i];
            ib.destroy();
        }
        this._ibArr = null;

        this._ib = null;
        this._vb = null;
    },

    forwardIndiceStartToOffset () {
        this.indiceStart = this.indiceOffset;
    }
});

// Should not share vb and id between multiple drawcalls on iOS14, it will cost a lot of time.
// TODO: maybe remove it after iOS14 fix it?
if (FIX_IOS14_BUFFER) {
    MeshBuffer.prototype.checkAndSwitchBuffer = function (vertexCount) {
        if (this.vertexOffset + vertexCount > 65535) {
            this.uploadData();
            this._batcher._flush();
        }
    };     
    MeshBuffer.prototype.forwardIndiceStartToOffset = function () {
        this.uploadData();
        this.switchBuffer();
    }  
}

cc.MeshBuffer = module.exports = MeshBuffer;
