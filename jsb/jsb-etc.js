/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

var NORMALIZE_RE = /[^\.\/]+\/\.\.\//;

// cc.path
cc.js.mixin(cc.path, {
    //todo make public after verification
    _normalize: function (url) {
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(NORMALIZE_RE, '');
        } while (oldUrl.length !== url.length);
        return url;
    },

    // The platform-specific file separator. '\\' or '/'.
    sep: (cc.sys.os === cc.sys.OS_WINDOWS ? '\\' : '/'),

    // @param {string} path
    // @param {boolean|string} [endsWithSep = true]
    // @returns {string}
    _setEndWithSep: function (path, endsWithSep) {
        var sep = cc.path.sep;
        if (typeof endsWithSep === 'undefined') {
            endsWithSep = true;
        }
        else if (typeof endsWithSep === 'string') {
            sep = endsWithSep;
            endsWithSep = !!endsWithSep;
        }

        var endChar = path[path.length - 1];
        var oldEndWithSep = (endChar === '\\' || endChar === '/');
        if (!oldEndWithSep && endsWithSep) {
            path += sep;
        }
        else if (oldEndWithSep && !endsWithSep) {
            path = path.slice(0, -1);
        }
        return path;
    }
});

// cc.Scheduler
cc.Scheduler.prototype.schedule = function (callback, target, interval, repeat, delay, paused) {
    repeat = isFinite(repeat) ? repeat : cc.macro.REPEAT_FOREVER;
    delay =  delay || 0;
    paused = !!paused;
    this.scheduleCallbackForTarget(target, callback, interval, repeat, delay, paused);
};
cc.Scheduler.prototype.scheduleUpdate = cc.Scheduler.prototype.scheduleUpdateForTarget;
cc.Scheduler.prototype._unschedule = cc.Scheduler.prototype.unschedule;
cc.Scheduler.prototype.unschedule = function (callback, target) {
    if (typeof target === 'function') {
        var tmp = target;
        target = callback;
        callback = tmp;
    }
    this._unschedule(target, callback);
};

// Node
var nodeProto = cc.Node.prototype;
cc.defineGetterSetter(nodeProto, "arrivalOrder", nodeProto.getOrderOfArrival, nodeProto.setOrderOfArrival);
cc.defineGetterSetter(nodeProto, "_parent", nodeProto.getParent, nodeProto.setParent);

// TextureCache addImage
if (!cc.TextureCache.prototype._addImageAsync) {
    cc.TextureCache.prototype._addImageAsync = cc.TextureCache.prototype.addImageAsync;
}
cc.TextureCache.prototype.addImageAsync = function(url, cb, target) {
    var localTex = null;
    cc.loader.load(url, function(err, tex) {
        if (err) tex = null;
        if (cb) {
            cb.call(target, tex);
        }
        localTex = tex;
    });
    return localTex;
};
// Fix for compatibility with old APIs
cc.TextureCache.prototype.addImage = function(url, cb, target) {
    if (typeof cb === "function") {
        return this.addImageAsync(url, cb, target);
    }
    else {
        if (cb) {
            return this._addImage(url, cb);
        }
        else {
            return this._addImage(url);
        }
    }
};

// View
cc.view.isViewReady = cc.view.isOpenGLReady;
cc.view.setOrientation = function () {};

// setTimeout, setInterval, clearTimeout, clearInteval
var _windowTimeIntervalId = 0;
var _windowTimeFunHash = {};
var WindowTimeFun = function (code) {
    this._intervalId = _windowTimeIntervalId++;
    this._code = code;
};

WindowTimeFun.prototype.fun = function () {
    if (!this._code) return;
    var code = this._code;
    if (typeof code === 'string') {
        Function(code)();
    }
    else if (typeof code === 'function') {
        code.apply(null, this._args);
    }
};

/**
 * overwrite window's setTimeout
 @param {String|Function} code
 @param {number} delay
 @return {number}
 */
window.setTimeout = function (code, delay) {
    var target = new WindowTimeFun(code);
    if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
    var original = target.fun;
    target.fun = function () {
        original.apply(this, arguments);
        clearTimeout(target._intervalId);
    };
    cc.director.getScheduler()._schedule(target.fun, target, delay / 1000, 0, 0, false, target._intervalId+'');
    _windowTimeFunHash[target._intervalId] = target;
    return target._intervalId;
};

/**
 * overwrite window's setInterval
 @param {String|Function} code
 @param {number} delay
 @return {number}
 */
window.setInterval = function (code, delay) {
    var target = new WindowTimeFun(code);
    if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
    cc.director.getScheduler()._schedule(target.fun, target, delay / 1000, cc.REPEAT_FOREVER, 0, false, target._intervalId+'');
    _windowTimeFunHash[target._intervalId] = target;
    return target._intervalId;
};

/**
 * overwrite window's clearInterval
 @param {number} intervalId
 */
window.clearInterval = function (intervalId) {
    var target = _windowTimeFunHash[intervalId];
    if (target) {
        cc.director.getScheduler()._unschedule(target._intervalId+'', target);
        delete _windowTimeFunHash[intervalId];
    }
};
window.clearTimeout = clearInterval;

// SocketIO
if (window.SocketIO) {
    window.io = window.SocketIO;
}

SocketIO.prototype._jsbEmit = SocketIO.prototype.emit;
SocketIO.prototype.emit = function (uri, delegate) {
    if (typeof delegate === 'object') {
        delegate = JSON.stringify(delegate);
    }
    this._jsbEmit(uri, delegate);
};

// ccsg
window._ccsg = {
    Node: cc.Node,
    Scene: cc.Scene,
    Sprite: cc.Sprite,
    ParticleSystem: cc.ParticleSystem,
    Label: cc.Label,
    EditBox: cc.EditBox,
    VideoPlayer: cc.VideoPlayer,
    WebView: cc.WebView,
    TMXTiledMap: cc.TMXTiledMap,
    TMXLayer: cc.TMXLayer,
    MotionStreak: cc.MotionStreak
};

// __errorHandler
window.__errorHandler = function (err) {
};

// rename cc.Class to cc._Class
cc._Class = cc.Class;

// fix cc.formatStr (#2630)
cc.formatStr = cc.js.formatStr;

// disabled premultiplied alpha for png
if (cc.Image && cc.Image.setPNGPremultipliedAlphaEnabled) {
    cc.Image.setPNGPremultipliedAlphaEnabled(false);
}
