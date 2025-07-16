const HTMLElement = require('./HTMLElement');
const Event = require('./Event');

const _importmaps = [];

class HTMLScriptElement extends HTMLElement {
    constructor(width, height) {
        super('script');
    }

    set type (type) {
        if (type === "systemjs-importmap") {
            if (_importmaps.indexOf(this) === -1) {
                _importmaps.push(this);
            }
        }
    }

    set src(url) {
        setTimeout(()=>{
            require(url);
            this.dispatchEvent(new Event('load'));
        }, 0);
    }
}

HTMLScriptElement._getAllScriptElementsSystemJSImportType = function () {
    return _importmaps;
}

module.exports = HTMLScriptElement;
