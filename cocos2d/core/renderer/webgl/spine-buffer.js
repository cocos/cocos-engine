var SpineBuffer = cc.Class({
    name: 'cc.SpineBuffer',
    extends: require('./mesh-buffer'),

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
    },

    adjust (vertexCount, indiceCount) {
        this.vertexOffset += vertexCount;
        this.indiceOffset += indiceCount;
        
        this.byteOffset = this.byteOffset + vertexCount * this._vertexBytes;

        this._dirty = true;
    }
});

cc.SpineBuffer = module.exports = SpineBuffer;