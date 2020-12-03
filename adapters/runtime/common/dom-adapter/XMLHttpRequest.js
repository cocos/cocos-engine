import Event from "./Event"
import FILE_CACHE from "./util/FileCache"
import XMLHttpRequestEventTarget from "./XMLHttpRequestEventTarget"

const fsm = jsb.getFileSystemManager();
const _XMLHttpRequest = window.XMLHttpRequest;
window.jsb = window.jsb || {};

export default class XMLHttpRequest extends XMLHttpRequestEventTarget {
    _isLocal = false;
    _readyState;
    _response;
    _responseText;
    _responseURL;
    _responseXML;
    _status;
    _statusText;

    constructor() {
        super(new _XMLHttpRequest());

        let xhr = this._xhr;

        xhr.onreadystatechange = function (e) {
            let event = new Event("readystatechange");
            this.dispatchEvent(Object.assign(event, e));
        }.bind(this);
    }

    get readyState() {
        if (this._isLocal) {
            return this._readyState;
        } else {
            return this._xhr.readyState;
        }
    }

    get response() {
        if (this._isLocal) {
            return this._response;
        } else {
            return this._xhr.response;
        }
    }

    get responseText() {
        if (this._isLocal) {
            return this._responseText;
        } else {
            return this._xhr.responseText;
        }
    }

    get responseType() {
        return this._xhr.responseType;
    }

    set responseType(value) {
        this._xhr.responseType = value;
    }

    get responseURL() {
        if (this._isLocal) {
            return this._responseURL;
        } else {
            return this._xhr.responseURL;
        }
    }

    get responseXML() {
        if (this._isLocal) {
            return this._responseXML;
        } else {
            return this._xhr.responseXML;
        }
    }

    get status() {
        if (this._isLocal) {
            return this._status;
        } else {
            return this._xhr.status;
        }
    }

    get statusText() {
        if (this._isLocal) {
            return this._statusText;
        } else {
            return this._xhr.statusText;
        }
    }

    get timeout() {
        return this._xhr.timeout;
    }

    set timeout(value) {
        this._xhr.timeout = value;
    }

    get upload() {
        return this._xhr.upload;
    }

    set withCredentials(value) {
        this._xhr.withCredentials = value;
    }

    get withCredentials() {
        return this._xhr.withCredentials;
    }

    abort() {
        this._xhr.abort();
    }

    getAllResponseHeaders() {
        return this._xhr.getAllResponseHeaders();
    }

    getResponseHeader(name) {
        return this._xhr.getResponseHeader(name);
    }

    open(method, url, async, user, password) {
        if (typeof url === "string") {
            let _url = url.toLocaleString();
            if (_url.startsWith("http://") || _url.startsWith("https://")) {
                this._isLocal = false;
                return this._xhr.open(...arguments);
            }
        }
        this._isLocal = true;
        // from local
        this._url = url;
    }

    overrideMimeType() {
        return this._xhr.overrideMimeType(...arguments);
    }

    send() {
        if (this._isLocal) {
            let self = this;
            let isBinary = this._xhr.responseType === "arraybuffer";
            fsm.readFile({
                filePath: this._url,
                encoding: isBinary ? "binary" : "utf8",

                success(res) {
                    self._status = 200;
                    self._readyState = 4;
                    self._response = self._responseText = res.data;
                    if (isBinary) {
                        FILE_CACHE.setCache(self._url, res.data);
                    }
                    let eventProgressStart = new Event("progress");
                    eventProgressStart.loaded = 0;
                    eventProgressStart.total = isBinary ? res.data.byteLength : res.data.length;

                    let eventProgressEnd = new Event("progress");
                    eventProgressEnd.loaded = eventProgressStart.total;
                    eventProgressEnd.total = eventProgressStart.total;

                    self.dispatchEvent(new Event("loadstart"));
                    self.dispatchEvent(eventProgressStart);
                    self.dispatchEvent(eventProgressEnd);
                    self.dispatchEvent(new Event("load"));
                },
                fail: function (res) {
                    if (res.errCode === 1) {
                        self._status = 404;
                        self._readyState = 4;
                        self.dispatchEvent(new Event("loadstart"));
                        self.dispatchEvent(new Event("load"));
                    } else {
                        this.dispatchEvent(new Event("error"));
                    }
                }.bind(this),
                complete: function () {
                    this.dispatchEvent(new Event("loadend"));
                }.bind(this)
            });
        } else {
            this._xhr.send(...arguments);
        }
    }

    setRequestHeader() {
        this._xhr.setRequestHeader(...arguments);
    }
}