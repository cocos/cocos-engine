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
let TiledMapBuffer = cc.Class({
    name: 'cc.TiledMapBuffer',
    extends: require('../core/renderer/webgl/quad-buffer'),

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

        let offsetInfo = this._offsetInfo;
        offsetInfo.vertexOffset = this.vertexOffset;
        offsetInfo.indiceOffset = this.indiceOffset;
        offsetInfo.byteOffset = this.byteOffset;
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

    adjust (vertexCount, indiceCount) {
        this.vertexOffset += vertexCount;
        this.indiceOffset += indiceCount;
        this.indiceStart = this.indiceOffset;
        this.byteOffset = this.byteOffset + vertexCount * this._vertexBytes;
        this._dirty = true;
    }
});

module.exports = TiledMapBuffer;