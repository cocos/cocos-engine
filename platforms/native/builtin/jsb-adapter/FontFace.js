class FontFace {
    constructor(family, source, descriptors) {
        this.family = family
        this.source = source
        this.descriptors = descriptors

        this._status = 'unloaded'
        
        this._loaded = new Promise((resolve, reject) => {
            this._resolveCB = resolve
            this._rejectCB = reject
        })
    }

    load() {
        // class FontFaceSet, add(fontFace) have done the load work
    }

    get status() {
        return this._status;
    }

    get loaded() {
        return this._loaded;
    }
}

module.exports = FontFace;
