// window.CC_RUNTIME = true;
window.CC_JSB = true;
// console.log("CC_JSB:" + CC_JSB);
window.CC_WECHATGAME = true;

// Simulate wechat game API:

window.wx = {
    getSystemInfoSync() {
        return {
            platform: 'mac',
            language: 'CN',
            system: 1.0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    },

    onShow() {

    },

    onHide() {
        
    }
}

let oldRequestFrameCallback = null;
let requestAnimationFrameID = 0;
let requestAnimationFrameCallbacks = {};

window.requestAnimationFrame = function(cb) {
    let id = ++requestAnimationFrameID;
    requestAnimationFrameCallbacks[id] = cb;
    return id;
};

window.cancelAnimationFrame = function(id) {
    delete requestAnimationFrameCallbacks[id];
};

function tick(nowMilliSeconds) {
    fireTimeout(nowMilliSeconds);

    for (let id in requestAnimationFrameCallbacks) {
        oldRequestFrameCallback = requestAnimationFrameCallbacks[id];
        if (oldRequestFrameCallback) {
            delete requestAnimationFrameCallbacks[id];
            oldRequestFrameCallback(nowMilliSeconds);
        }
    }
}

let _timeoutIDIndex = 0;

class TimeoutInfo {
    constructor(cb, delay, isRepeat, target, args) {
        this.cb = cb;
        this.id = ++_timeoutIDIndex;
        this.start = performance.now();
        this.delay = delay;
        this.isRepeat = isRepeat;
        this.target = target;
        this.args = args;
    }
}

let _timeoutInfos = {};

function fireTimeout(nowMilliSeconds) {
    let info;
    for (let id in _timeoutInfos) {
        info = _timeoutInfos[id];
        if (info && info.cb) {
            if ((nowMilliSeconds - info.start) >= info.delay) {
//                console.log(`fireTimeout: id ${id}, start: ${info.start}, delay: ${info.delay}, now: ${nowMilliSeconds}`);
                info.cb.apply(info.target, info.args);
                if (info.isRepeat) {
                    info.start = nowMilliSeconds;
                } 
                else {
                    delete _timeoutInfos[id];
                }
            }
        }
    }
}

function createTimeoutInfo(prevFuncArgs, isRepeat) {
    let cb = prevFuncArgs[0];
    if (!cb) {
        console.error("createTimeoutInfo doesn't pass a callback ...");
        return 0;
    }

    let delay = prevFuncArgs.length > 1 ? prevFuncArgs[1] : 0;
    let args;

    if (prevFuncArgs.length > 2) {
        args = Array.prototype.slice.call(prevFuncArgs, 2);
    }

    let info = new TimeoutInfo(cb, delay, isRepeat, this, args);
    _timeoutInfos[info.id] = info;
    return info.id;
}

window.setTimeout = function(cb) {
    return createTimeoutInfo(arguments, false);
};

window.clearTimeout = function(id) {
    delete _timeoutInfos[id];
};

window.setInterval = function(cb) {
    return createTimeoutInfo(arguments, true);
}

window.clearInterval = window.clearTimeout;

window.alert = console.error.bind(console);

// File utils (Temporary, won't be accessible)
cc.fileUtils = cc.FileUtils.getInstance();
cc.fileUtils.setPopupNotify(false);

/**
 * @type {Object}
 * @name jsb.fileUtils
 * jsb.fileUtils is the native file utils singleton object,
 * please refer to Cocos2d-x API to know how to use it.
 * Only available in JSB
 */
jsb.fileUtils = cc.fileUtils;
delete cc.FileUtils;
delete cc.fileUtils;

window.CanvasRenderingContext2D = cc.CanvasRenderingContext2D;
delete cc.CanvasRenderingContext2D;

jsb.urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");

require('./jsb_prepare');
require('./jsb_opengl');
window.DOMParser = require('./xmldom/dom-parser').DOMParser;
require('./jsb-adapter');
require('./jsb_audioengine');

/**
 * @type {Object}
 * @name jsb.reflection
 * jsb.reflection is a bridge to let you invoke Java static functions.
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/reflection/en
 * Only available on Android platform
 */
jsb.reflection = {
    callStaticMethod : function(){
        cc.log("not supported on current platform");
    }
};

XMLHttpRequest.prototype.addEventListener = function(eventName, listener, options) {
    this['on' + eventName] = listener;
}

XMLHttpRequest.prototype.removeEventListener = function(eventName, listener, options) {
    this['on' + eventName] = null;
}

//NOTE: Runtime API should not private Javascript bridge functionality for security issues.
// JS to Native bridges
// if(window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID){
//     jsb.reflection = new JavascriptJavaBridge();
//     cc.sys.capabilities["keyboard"] = true;
// }
// else if(window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)){
//     jsb.reflection = new JavaScriptObjCBridge();
// }

// SocketIO
if (window.SocketIO) {
    window.io = window.SocketIO;
    SocketIO.prototype._jsbEmit = SocketIO.prototype.emit;
    SocketIO.prototype.emit = function (uri, delegate) {
        if (typeof delegate === 'object') {
            delegate = JSON.stringify(delegate);
        }
        this._jsbEmit(uri, delegate);
    };
}

window.gameTick = tick;

