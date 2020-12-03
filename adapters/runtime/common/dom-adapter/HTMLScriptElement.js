import HTMLElement from './HTMLElement'
import Event from "./Event";
import FILE_CACHE from "./util/FileCache"

const _BASE64_NAME = "data:application/javascript;base64,";
const _URI_NAME = "data:application/javascript,";
let _getPathFromBase64String = function (src) {
    if (src === null || src === undefined) {
        return src;
    }
    if (src.startsWith(_BASE64_NAME)) {
        let content = src.substring(_BASE64_NAME.length);
        let source = window.atob(content);
        let len = source.length;
        if (len > 0) {
            return _getDiskPathFromArrayBuffer(source, len);
        } else {
            return src;
        }
    } else if (src.startsWith(_URI_NAME)) {
        let content = src.substring(_URI_NAME.length);
        let source = decodeURIComponent(content);
        let len = source.length;
        if (len > 0) {
            return _getDiskPathFromArrayBuffer(source, len);
        } else {
            return src;
        }
    } else {
        return src;
    }
};

function _getDiskPathFromArrayBuffer(source, len) {
    let arrayBuffer = new ArrayBuffer(len);
    let uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < len; i++) {
        uint8Array[i] = source.charCodeAt(i);
    }
    return FILE_CACHE.getCache(arrayBuffer);
}

export default class HTMLScriptElement extends HTMLElement {
    constructor() {
        super('SCRIPT');

        let self = this;
        let onAppend = function () {
            self.removeEventListener("append", onAppend);
            let src = _getPathFromBase64String(self.src);
            require(src);
            self.dispatchEvent(new Event('load'));
        };
        this.addEventListener("append", onAppend);
    }
}
