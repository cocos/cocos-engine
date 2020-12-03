import EventTarget from './EventTarget'
import Event from './Event'
import _weakMap from "./util/WeakMap"

export default class FontFaceSet extends EventTarget {
    constructor() {
        super();
        let self = this;

        // Indicates the font-face's loading status. It will be one of 'loading' or 'loaded'.
        _weakMap.get(this).status = "loaded";
        _weakMap.get(this).ready = new Promise(function (resolve, reject) {
            _weakMap.get(self).readyResolve = resolve;
            _weakMap.get(self).readyReject = reject;
        });
        _weakMap.get(this).fontFaceSet = [];
    }

    get status() {
        return _weakMap.get(this).status;
    }

    get ready() {
        return _weakMap.get(this).ready;
    }

    add(fontFace) {
        _weakMap.get(this).fontFaceSet.push(fontFace);
    }

    check() {
        console.warn("FontFaceSet.check() not implements");
    }

    clear() {
        console.warn("FontFaceSet.clear() not implements");
    }

    delete() {
        console.warn("FontFaceSet.delete() not implements");
    }

    load() {
        let self = this;
        _weakMap.get(this).status = "loading";
        this.dispatchEvent(new Event('loading'));

        return new Promise(function (resolve, reject) {
            let fontFaceSet = _weakMap.get(self).fontFaceSet;
            if (fontFaceSet) {
                for (let index in fontFaceSet) {
                    let fontFace = fontFaceSet[index];
                    let status = _weakMap.get(fontFace).status;
                    if (status === "unloaded" || status === "error") {
                        fontFace.load();
                        if (_weakMap.get(fontFace)._status !== "loaded") {
                            break;
                        }
                    }
                }
                _weakMap.get(self).status = "loaded";
                _weakMap.get(self).readyResolve([].concat(_weakMap.get(self).fontFaceSet));
                resolve([].concat(_weakMap.get(self).fontFaceSet));
                self.dispatchEvent(new Event('loadingdone'));
                return;
            }
            _weakMap.get(self).status = "loaded";
            _weakMap.get(self).readyReject();
            reject();
            self.dispatchEvent(new Event('loadingerror'));
        });
    }
}
