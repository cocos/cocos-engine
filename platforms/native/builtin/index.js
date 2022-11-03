jsb.device = jsb.Device; // cc namespace will be reset to {} in creator, use jsb namespace instead.

const { btoa, atob } = require('./base64/base64.min');

window.btoa = btoa;
window.atob = atob;
const { Blob, URL } = require('./Blob');

window.Blob = Blob;
window.URL = URL;
window.DOMParser = require('./xmldom/dom-parser').DOMParser;

window.__EDITOR__ = window.process && ('electron' in window.process.versions);
require('./jsb_prepare');
require('./jsb-adapter');
// require('./jsb_audioengine');
require('./jsb_input');

let _oldRequestFrameCallback = null;
let _requestAnimationFrameID = 0;
const _requestAnimationFrameCallbacks = {};
let _firstTick = true;

window.requestAnimationFrame = function (cb) {
    const id = ++_requestAnimationFrameID;
    _requestAnimationFrameCallbacks[id] = cb;
    return id;
};

window.cancelAnimationFrame = function (id) {
    delete _requestAnimationFrameCallbacks[id];
};

function tick (nowMilliSeconds) {
    if (_firstTick) {
        _firstTick = false;
        if (window.onload) {
            const event = new Event('load');
            event._target = window;
            window.onload(event);
        }
    }
    fireTimeout(nowMilliSeconds);

    for (const id in _requestAnimationFrameCallbacks) {
        _oldRequestFrameCallback = _requestAnimationFrameCallbacks[id];
        if (_oldRequestFrameCallback) {
            delete _requestAnimationFrameCallbacks[id];
            _oldRequestFrameCallback(nowMilliSeconds);
        }
    }
}

let _timeoutIDIndex = 0;

class TimeoutInfo {
    constructor (cb, delay, isRepeat, target, args) {
        this.cb = cb;
        this.id = ++_timeoutIDIndex;
        this.start = performance.now();
        this.delay = delay;
        this.isRepeat = isRepeat;
        this.target = target;
        this.args = args;
    }
}

const _timeoutInfos = {};

function fireTimeout (nowMilliSeconds) {
    let info;
    for (const id in _timeoutInfos) {
        info = _timeoutInfos[id];
        if (info && info.cb) {
            if ((nowMilliSeconds - info.start) >= info.delay) {
                // console.log(`fireTimeout: id ${id}, start: ${info.start}, delay: ${info.delay}, now: ${nowMilliSeconds}`);
                if (typeof info.cb === 'string') {
                    Function(info.cb)();
                } else if (typeof info.cb === 'function') {
                    info.cb.apply(info.target, info.args);
                }
                if (info.isRepeat) {
                    info.start = nowMilliSeconds;
                } else {
                    delete _timeoutInfos[id];
                }
            }
        }
    }
}

function createTimeoutInfo (prevFuncArgs, isRepeat) {
    const cb = prevFuncArgs[0];
    if (!cb) {
        console.error('createTimeoutInfo doesn\'t pass a callback ...');
        return 0;
    }

    const delay = prevFuncArgs.length > 1 ? prevFuncArgs[1] : 0;
    let args;

    if (prevFuncArgs.length > 2) {
        args = Array.prototype.slice.call(prevFuncArgs, 2);
    }

    const info = new TimeoutInfo(cb, delay, isRepeat, this, args);
    _timeoutInfos[info.id] = info;
    return info.id;
}

window.setTimeout = function (cb) {
    return createTimeoutInfo(arguments, false);
};

window.clearTimeout = function (id) {
    delete _timeoutInfos[id];
};

window.setInterval = function (cb) {
    return createTimeoutInfo(arguments, true);
};

window.clearInterval = window.clearTimeout;
window.alert = console.error.bind(console);

// File utils (Temporary, won't be accessible)
if (typeof jsb.FileUtils !== 'undefined') {
    jsb.fileUtils = jsb.FileUtils.getInstance();
    delete jsb.FileUtils;
}

XMLHttpRequest.prototype.addEventListener = function (eventName, listener, options) {
    this[`on${eventName}`] = listener;
};

XMLHttpRequest.prototype.removeEventListener = function (eventName, listener, options) {
    this[`on${eventName}`] = null;
};

// SocketIO
if (window.SocketIO) {
    window.io = window.SocketIO;
    SocketIO.prototype._Emit = SocketIO.prototype.emit;
    SocketIO.prototype.emit = function (uri, delegate) {
        if (typeof delegate === 'object') {
            delegate = JSON.stringify(delegate);
        }
        this._Emit(uri, delegate);
    };
}

window.gameTick = tick;

// generate get set function
jsb.generateGetSet = function (moduleObj) {
    for (const classKey in moduleObj) {
        const classProto = moduleObj[classKey] && moduleObj[classKey].prototype;
        if (!classProto) continue;
        for (const getName in classProto) {
            const getPos = getName.search(/^get/);
            if (getPos == -1) continue;
            let propName = getName.replace(/^get/, '');
            const nameArr = propName.split('');
            const lowerFirst = nameArr[0].toLowerCase();
            const upperFirst = nameArr[0].toUpperCase();
            nameArr.splice(0, 1);
            const left = nameArr.join('');
            propName = lowerFirst + left;
            const setName = `set${upperFirst}${left}`;
            if (classProto.hasOwnProperty(propName)) continue;
            const setFunc = classProto[setName];
            const hasSetFunc = typeof setFunc === 'function';
            if (hasSetFunc) {
                Object.defineProperty(classProto, propName, {
                    get () {
                        return this[getName]();
                    },
                    set (val) {
                        this[setName](val);
                    },
                    configurable: true,
                });
            } else {
                Object.defineProperty(classProto, propName, {
                    get () {
                        return this[getName]();
                    },
                    configurable: true,
                });
            }
        }
    }
};

// promise polyfill relies on setTimeout implementation
require('./promise.min');
