/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

window.CC_JSB = true;

window.CanvasRenderingContext2D = cc.CanvasRenderingContext2D;
delete cc.CanvasRenderingContext2D;

const { btoa, atob } = require('./base64/base64.min');
window.btoa = btoa;
window.atob = atob;
const { Blob, URL } = require('./Blob');
window.Blob = Blob;
window.URL = URL;
window.DOMParser = require('./xmldom/dom-parser').DOMParser;

require('./jsb_prepare');
require('./jsb_opengl');
require('./jsb-adapter');
require('./jsb_audioengine');
require('./jsb_editbox');

let _oldRequestFrameCallback = null;
let _requestAnimationFrameID = 0;
let _requestAnimationFrameCallbacks = {};
let _firstTick = true;

window.requestAnimationFrame = function(cb) {
    let id = ++_requestAnimationFrameID;
    _requestAnimationFrameCallbacks[id] = cb;
    return id;
};

window.cancelAnimationFrame = function(id) {
    delete _requestAnimationFrameCallbacks[id];
};

const {disableBatchGLCommandsToNative, flushCommands} = require('./glOptMode');
window.optConfig = {
    disableBatchGLCommandsToNative: disableBatchGLCommandsToNative
};

function tick(nowMilliSeconds) {
    if (_firstTick) {
        _firstTick = false;
        if (window.onload) {
            var event = new Event('load');
            event._target = window;
            window.onload(event);
        }
    }
    fireTimeout(nowMilliSeconds);

    for (let id in _requestAnimationFrameCallbacks) {
        _oldRequestFrameCallback = _requestAnimationFrameCallbacks[id];
        if (_oldRequestFrameCallback) {
            delete _requestAnimationFrameCallbacks[id];
            _oldRequestFrameCallback(nowMilliSeconds);
        }
    }
    flushCommands();
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

jsb.urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");

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

