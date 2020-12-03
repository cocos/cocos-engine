if (cc.ImageAsset) {
    Object.defineProperty(cc.ImageAsset.prototype, 'data', {
        get () {
            return (this._nativeData && this._nativeData._data) || this._nativeData;
        },
    });
}