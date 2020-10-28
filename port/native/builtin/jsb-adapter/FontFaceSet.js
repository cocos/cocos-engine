const EventTarget = require('./EventTarget')
const Event = require('./Event')

class FontFaceSet extends EventTarget {
    constructor() {
        super()
        this._status = 'loading'
    }

    get status() {
        return this._status
    }

    set onloading(listener) {
        this.addEventListener('loading', listener)
    }

    set onloadingdone(listener) {
        this.addEventListener('loadingdone', listener)
    }

    set onloadingerror(listener) {
        this.addEventListener('loadingerror', listener)
    }

    add(fontFace) {
        this._status = fontFace._status = 'loading'
        this.dispatchEvent(new Event('loading'))
        // Call native binding method to set the ttf font to native platform.
        let family = jsb.loadFont(fontFace.family, fontFace.source)
        setTimeout(() => {
            if (family) {
                fontFace._status = this._status = 'loaded'
                fontFace._resolveCB()
                this.dispatchEvent(new Event('loadingdone'))
            }
            else {
                fontFace._status = this._status = 'error'
                fontFace._rejectCB()
                this.dispatchEvent(new Event('loadingerror'))
            } 
        }, 0)
    }

    clear() {

    }

    delete() {

    }

    load() {

    }

    ready() {

    }
}

module.exports = FontFaceSet
