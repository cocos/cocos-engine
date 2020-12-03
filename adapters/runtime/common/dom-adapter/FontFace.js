import _wakMap from "./util/WeakMap"

class FontFace {
    constructor(family, source, descriptors) {
        this.family = family;
        this.source = source;
        this.descriptors = descriptors;

        let self = this;
        let _selfPrivate = {
            // the status of the font, one of  "unloaded", "loading", "loaded", or "error".
            status: "unloaded",
            _status: "unloaded",
            load () {
                this.status = "loading";
                let source;
                if (self.source.match(/url\(\s*'\s*(.*?)\s*'\s*\)/)) {
                    source = self.source;
                } else {
                    source = "url('"+ self.source +"')"
                }
                let family = jsb.loadFont(self.family, source);
                if (family) {
                    this._status = "loaded";
                } else {
                    this._status = "error";
                }
                setTimeout(function () {
                    let status = _selfPrivate.status = _selfPrivate._status;
                    if (status === "loaded") {
                        _selfPrivate.loadResolve();
                    } else {
                        _selfPrivate.loadReject();
                    }
                });
            }
        };
        _wakMap.set(this, _selfPrivate);
        _selfPrivate.loaded = new Promise(function (resolve, reject) {
            _selfPrivate.loadResolve = resolve;
            _selfPrivate.loadReject = reject;
        });
    }

    get status() {
        return _wakMap.get(this).status;
    }

    get loaded() {
        return _wakMap.get(this).loaded;
    }

    load() {
        _wakMap.get(this).load();
        return _wakMap.get(this).loaded;
    }
}

module.exports = FontFace;
