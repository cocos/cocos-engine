import EventTarget from "./EventTarget"
import Event from "./Event"
import FILE_CACHE from "./util/FileCache"

export default class XMLHttpRequestEventTarget extends EventTarget {
    _xhr;

    constructor(xhr) {
        super();
        this._xhr = xhr;

        xhr.onabort = function (e) {
            let event = new Event("abort");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
        xhr.onerror = function (e) {
            let event = new Event("error");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
        xhr.onload = function (e) {
            if (this.response instanceof ArrayBuffer) {
                FILE_CACHE.setItem(this.response, this._url);
            }
            let event = new Event("load");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
        xhr.onloadstart = function (e) {
            let event = new Event("loadstart");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
        xhr.onprogress = function (e) {
            let event = new Event("progress");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
        xhr.ontimeout = function (e) {
            let event = new Event("timeout");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
        xhr.onloadend = function (e) {
            let event = new Event("loadend");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
    }
}