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

var JS = require('../platform/js');
var sys = require('../platform/CCSys');

var misc = exports;

misc.propertyDefine = function (ctor, sameNameGetSets, diffNameGetSets) {
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
misc.NextPOT = function (x) {
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

if (CC_EDITOR) {
    // use anonymous function here to ensure it will not being hoisted without CC_EDITOR

    misc.tryCatchFunctor_EDITOR = function (funcName, forwardArgs, afterCall, bindArg) {
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
        return Function('arg', 'return ' + call_FUNC_InTryCatch
                    .toString()
                    .replace(/_FUNC_/g, funcName)
                    .replace('_R_ARGS_', 'target' + (forwardArgs ? ', ' + forwardArgs : ''))
                    .replace('_U_ARGS_', forwardArgs || '')
                    .replace('_AFTER_CALL_', afterCall || ''))(bindArg);
    };
}

misc.imagePool = new JS.Pool(function (img) {
                            if (img instanceof HTMLImageElement) {
                                img.src = this._smallImg;
                                return true;
                            }
                            return false;
                       }, 10);
misc.imagePool.get = function () {
    return this._get() || new Image();
};
misc.imagePool._smallImg = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";
// Avoid problems on windows IE kernels, Edge, Firefox and Linux Firefox
if ((sys.os === sys.OS_WINDOWS || sys.os === sys.OS_LINUX) && sys.browser !== sys.BROWSER_TYPE_CHROME) {
    misc.imagePool.resize(0);
}

misc.isBuiltinClassId = function (id) {
    return id.startsWith('cc.') || id.startsWith('dragonBones.') || id.startsWith('sp.') || id.startsWith('ccsg.');
};


var BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
var BASE64_VALUES = new Array(123); // max char code in base64Keys
for (let i = 0; i < 123; ++i) BASE64_VALUES[i] = 64; // fill with placeholder('=') index
for (let i = 0; i < 64; ++i) BASE64_VALUES[BASE64_KEYS.charCodeAt(i)] = i;

// decoded value indexed by base64 char code
misc.BASE64_VALUES = BASE64_VALUES;
