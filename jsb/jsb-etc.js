/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

'use strict';

// cc.path
cc.js.mixin(cc.path, {
    //todo make public after verification
    _normalize: function(url){
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(this.normalizeRE, '');
        } while(oldUrl.length !== url.length);
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

// cc.Scale9Sprite
cc.Scale9Sprite.prototype._setBlendFunc = cc.Scale9Sprite.prototype.setBlendFunc;
cc.Scale9Sprite.prototype.setBlendFunc = function(blendFunc, dst) {
    if (dst !== undefined) {
        blendFunc = {
            src : blendFunc,
            dst : dst
        };
    }
    this._setBlendFunc(blendFunc);
};
cc.Scale9Sprite.prototype._setContentSize = cc.Scale9Sprite.prototype.setContentSize;
cc.Scale9Sprite.prototype.setContentSize = function(size, height){
    if (height !== undefined) {
        size = new cc.Size(size, height);
    }
    this._setContentSize(size);
};
cc.Scale9Sprite.prototype._setAnchorPoint = cc.Scale9Sprite.prototype.setAnchorPoint;
cc.Scale9Sprite.prototype.setAnchorPoint = function(anchorPoint, y){
    if (y !== undefined) {
        anchorPoint = new cc.Vec2(anchorPoint, y);
    }
    this._setAnchorPoint(anchorPoint);
};

cc.Scale9Sprite.prototype._setSpriteFrame = cc.Scale9Sprite.prototype.setSpriteFrame;
cc.Scale9Sprite.prototype.setSpriteFrame = function(spriteFrame) {
    var contentSize = this.getContentSize();
    this._setSpriteFrame(spriteFrame);
    if (!cc.sizeEqualToSize(contentSize, cc.size(0, 0))) {
        this.setContentSize(contentSize);
    }
};

// ccsg
window._ccsg = {
    Node: cc.Node,
    Scene: cc.Scene,
    Sprite: cc.Sprite,
    ParticleSystem: cc.ParticleSystem,
    Label: cc.Label,

};

// rename cc.Class to cc._Class
cc._Class = cc.Class;
