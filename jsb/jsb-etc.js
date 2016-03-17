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

// Node arrivalOrder
cc.defineGetterSetter(cc.Node.prototype, "arrivalOrder", cc.Node.prototype.getOrderOfArrival, cc.Node.prototype.setOrderOfArrival);

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
        url = cc.Pipeline.UrlResolver.getRawUrl(url);
        if (cb) {
            return this._addImage(url, cb);
        }
        else {
            return this._addImage(url);
        }
    }
};

// ccsg
window._ccsg = {
    Node: cc.Node,
    Scene: cc.Scene,
    Sprite: cc.Sprite,
    ParticleSystem: cc.ParticleSystem,
    Label: cc.Label,
    EditBox: cc.EditBox,
    TMXTiledMap: cc.TMXTiledMap,
    TMXLayer: cc.TMXLayer
};

// rename cc.Class to cc._Class
cc._Class = cc.Class;
