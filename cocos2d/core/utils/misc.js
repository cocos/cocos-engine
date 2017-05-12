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

// jshint evil: true

// should not use long variable name because eval breaks uglify's mangle operation in this file
var m = {};

m.propertyDefine = function (ctor, sameNameGetSets, diffNameGetSets) {
    function define (np, propName, getter, setter) {
        var pd = Object.getOwnPropertyDescriptor(np, propName);
        if (pd) {
            if (pd.get) np[getter] = pd.get;
            if (pd.set && setter) np[setter] = pd.set;
        }
        else {
            var getterFunc = np[getter];
            if (CC_DEV && !getterFunc) {
                var clsName = (cc.Class._isCCClass(ctor) && cc.js.getClassName(ctor)) ||
                              ctor.name ||
                              '(anonymous class)';
                cc.warnID(5700, propName, getter, clsName);
            }
            else {
                cc.js.getset(np, propName, getterFunc, np[setter]);
            }
        }
    }
    var propName, np = ctor.prototype;
    for (var i = 0; i < sameNameGetSets.length; i++) {
        propName = sameNameGetSets[i];
        var suffix = propName[0].toUpperCase() + propName.slice(1);
        define(np, propName, 'get' + suffix, 'set' + suffix);
    }
    for (propName in diffNameGetSets) {
        var getset = diffNameGetSets[propName];
        define(np, propName, getset[0], getset[1]);
    }
};

/**
 * @param {Number} x
 * @return {Number}
 * Constructor
 */
m.NextPOT = function (x) {
    x = x - 1;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x + 1;
};

//var DirtyFlags = m.DirtyFlags = {
//    TRANSFORM: 1 << 0,
//    SIZE: 1 << 1,
//    //Visible:
//    //Color:
//    //Opacity
//    //Cache
//    //Order
//    //Text
//    //Gradient
//    ALL: (1 << 2) - 1
//};
//
//DirtyFlags.WIDGET = DirtyFlags.TRANSFORM | DirtyFlags.SIZE;

// wrap a new scope to avoid uglify's mangle process broken by eval in caller's scope

m.cleanEval_F = function (code, F) {
    return eval(code);
};

m.cleanEval_fireClass = function (code) {
    var fireClass = eval(code);
    return fireClass;
};

if (CC_EDITOR) {
    // use anonymous function here to ensure it will not being hoisted without CC_EDITOR

    m.tryCatchFunctor_EDITOR = function (funcName, receivedArgs, usedArgs, afterCall) {
        function call_FUNC_InTryCatch (_R_ARGS_) {
            try {
                target._FUNC_(_U_ARGS_);
            }
            catch (e) {
                cc._throw(e);
            }
            _AFTER_CALL_
        }
        // use evaled code to generate named function
        return Function('return ' + call_FUNC_InTryCatch
                    .toString()
                    .replace(/_FUNC_/g, funcName)
                    .replace('_R_ARGS_', 'target' + (receivedArgs ? ', ' + receivedArgs : ''))
                    .replace('_U_ARGS_', usedArgs || '')
                    .replace('_AFTER_CALL_', afterCall || ''))();
    };
}

function Pool (opt_cleanupObjFunc, size) {
    if (typeof opt_cleanupObjFunc === 'number') {
        size = opt_cleanupObjFunc;
        opt_cleanupObjFunc = null;
    }
    this.get = null;
    this.count = 0;
    this._pool = new Array(size);
    this._cleanup = opt_cleanupObjFunc;
}
Pool.prototype._get = function () {
    if (this.count > 0) {
        --this.count;
        var cache = this._pool[this.count];
        this._pool[this.count] = null;
        return cache;
    }
    return null;
};
Pool.prototype.put = function (obj) {
    var pool = this._pool;
    if (this.count < pool.length) {
        if (this._cleanup && this._cleanup(obj) === false) {
            return;
        }
        pool[this.count] = obj;
        ++this.count;
    }
};

m.Pool = Pool;

m.imagePool = new Pool(function (img) {
                            if (img instanceof HTMLImageElement) {
                                img.src = this._smallImg;
                                return true;
                            }
                            return false;
                       }, 10);
m.imagePool.get = function () {
    return this._get() || new Image();
};
m.imagePool._smallImg = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

module.exports = m;

// jshint evil: false
