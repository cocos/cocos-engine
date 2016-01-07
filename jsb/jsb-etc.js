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
    _normalize: function (url) {
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(this.normalizeRE, '');
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

// Independent Action from retain/release
var actionArr = [
    cc.ActionEase,
    cc.EaseExponentialIn,
    cc.EaseExponentialOut,
    cc.EaseExponentialInOut,
    cc.EaseSineIn,
    cc.EaseSineOut,
    cc.EaseSineInOut,
    cc.EaseBounce,
    cc.EaseBounceIn,
    cc.EaseBounceOut,
    cc.EaseBounceInOut,
    cc.EaseBackIn,
    cc.EaseBackOut,
    cc.EaseBackInOut,
    cc.EaseRateAction,
    cc.EaseIn,
    cc.EaseElastic,
    cc.EaseElasticIn,
    cc.EaseElasticOut,
    cc.EaseElasticInOut,
    cc.RemoveSelf,
    cc.FlipX,
    cc.FlipY,
    cc.Place,
    cc.CallFunc,
    cc.DelayTime,
    cc.Sequence,
    cc.Spawn,
    cc.Speed,
    cc.Repeat,
    cc.RepeatForever,
    cc.Follow,
    cc.TargetedAction,
    cc.Animate,
    cc.OrbitCamera,
    cc.GridAction,
    cc.ProgressTo,
    cc.ProgressFromTo,
    cc.ActionInterval,
    cc.RotateTo,
    cc.RotateBy,
    cc.MoveBy,
    cc.MoveTo,
    cc.SkewTo,
    cc.SkewBy,
    cc.JumpTo,
    cc.JumpBy,
    cc.ScaleTo,
    cc.ScaleBy,
    cc.Blink,
    cc.FadeTo,
    cc.FadeIn,
    cc.FadeOut,
    cc.TintTo,
    cc.TintBy,
];

function getCtorReplacer (proto) {
    var ctor = proto._ctor;
    return function () {
        ctor.apply(this, arguments);
        this.retain();
        this._retained = true;
    };
}

for (var i = 0; i < actionArr.length; ++i) {
    var proto = actionArr[i].prototype;
    proto._ctor = getCtorReplacer(proto);
}

function setChainFuncReplacer (proto, name) {
    var oldFunc = proto[name];
    proto[name] = function () {
        if (this._retained) {
            this.release();
            this._retained = false;
        }
        var newAction = oldFunc.apply(this, arguments);
        newAction.retain();
        newAction._retained = true;
    };
}

setChainFuncReplacer(cc.ActionInterval.prototype, 'repeat');
setChainFuncReplacer(cc.ActionInterval.prototype, 'repeatForever');
setChainFuncReplacer(cc.ActionInterval.prototype, 'easing');

var jsbRunAction = cc.Node.prototype.runAction;
cc.Node.prototype.runAction = function (action) {
    if (action._retained) {
        action.release();
        action._retained = false;
    }
    jsbRunAction.call(this, action);
};
var jsbAddAction = cc.ActionManager.prototype.addAction;
cc.ActionManager.prototype.addAction = function (action, target, paused) {
    if (action._retained) {
        action.release();
        action._retained = false;
    }
    jsbAddAction.call(this, action, target, paused);
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
