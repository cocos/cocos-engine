/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

 // tslint:disable

import { getClassName, getset } from './js';

export const BUILTIN_CLASSID_RE = /^(?:cc|dragonBones|sp|ccsg)\..+/;

const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const values = new Array(123); // max char code in base64Keys
for (let i = 0; i < 123; ++i) { values[i] = 64; } // fill with placeholder('=') index
for (let i = 0; i < 64; ++i) { values[BASE64_KEYS.charCodeAt(i)] = i; }

// decoded value indexed by base64 char code
export const BASE64_VALUES = values;

/**
 * misc utilities
 * @class misc
 * @static
 */

/**
 * @method propertyDefine
 * @param {Function} ctor
 * @param {Array} sameNameGetSets
 * @param {Object} diffNameGetSets
 */
export function propertyDefine (ctor, sameNameGetSets, diffNameGetSets) {
    function define (np, propName, getter, setter) {
        const pd = Object.getOwnPropertyDescriptor(np, propName);
        if (pd) {
            if (pd.get) { np[getter] = pd.get; }
            if (pd.set && setter) { np[setter] = pd.set; }
        }
        else {
            const getterFunc = np[getter];
            if (CC_DEV && !getterFunc) {
                const clsName = (cc.Class._isCCClass(ctor) && getClassName(ctor)) ||
                    ctor.name ||
                    '(anonymous class)';
                cc.warnID(5700, propName, getter, clsName);
            }
            else {
                getset(np, propName, getterFunc, np[setter]);
            }
        }
    }
    let propName, np = ctor.prototype;
    for (let i = 0; i < sameNameGetSets.length; i++) {
        propName = sameNameGetSets[i];
        const suffix = propName[0].toUpperCase() + propName.slice(1);
        define(np, propName, 'get' + suffix, 'set' + suffix);
    }
    for (propName in diffNameGetSets) {
        const gs = diffNameGetSets[propName];
        define(np, propName, gs[0], gs[1]);
    }
}

/**
 * @method nextPOT
 * @param {Number} x
 * @return {Number}
 */
export function nextPOT (x) {
    x = x - 1;
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x + 1;
}

// set value to map, if key exists, push to array
export function pushToMap (map, key, value, pushFront) {
    const exists = map[key];
    if (exists) {
        if (Array.isArray(exists)) {
            if (pushFront) {
                exists.push(exists[0]);
                exists[0] = value;
            }
            else {
                exists.push(value);
            }
        }
        else {
            map[key] = (pushFront ? [value, exists] : [exists, value]);
        }
    }
    else {
        map[key] = value;
    }
}

/**
 * !#en Clamp a value between from and to.
 * !#zh
 * 限定浮点数的最大最小值。<br/>
 * 数值大于 max_inclusive 则返回 max_inclusive。<br/>
 * 数值小于 min_inclusive 则返回 min_inclusive。<br/>
 * 否则返回自身。
 * @method clampf
 * @param {Number} value
 * @param {Number} min_inclusive
 * @param {Number} max_inclusive
 * @return {Number}
 * @example
 * var v1 = cc.misc.clampf(20, 0, 20); // 20;
 * var v2 = cc.misc.clampf(-1, 0, 20); //  0;
 * var v3 = cc.misc.clampf(10, 0, 20); // 10;
 */
export function clampf (value, min_inclusive, max_inclusive) {
    if (min_inclusive > max_inclusive) {
        const temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
}

/**
 * !#en Clamp a value between 0 and 1.
 * !#zh 限定浮点数的取值范围为 0 ~ 1 之间。
 * @method clamp01
 * @param {Number} value
 * @return {Number}
 * @example
 * var v1 = cc.misc.clamp01(20);  // 1;
 * var v2 = cc.misc.clamp01(-1);  // 0;
 * var v3 = cc.misc.clamp01(0.5); // 0.5;
 */
export function clamp01 (value) {
    return value < 0 ? 0 : value < 1 ? value : 1;
}

/**
 * Linear interpolation between 2 numbers, the ratio sets how much it is biased to each end
 * @method lerp
 * @param {Number} a number A
 * @param {Number} b number B
 * @param {Number} r ratio between 0 and 1
 * @return {Number}
 * @example {@link utils/api/engine/docs/cocos2d/core/platform/CCMacro/lerp.js}
 */
export function lerp (a, b, r) {
    return a + (b - a) * r;
}

/**
 * converts degrees to radians
 * @param {Number} angle
 * @return {Number}
 * @method degreesToRadians
 */
export function degreesToRadians (angle) {
    return angle * cc.macro.RAD;
}

/**
 * converts radians to degrees
 * @param {Number} angle
 * @return {Number}
 * @method radiansToDegrees
 */
export function radiansToDegrees (angle) {
    return angle * cc.macro.DEG;
}

export function contains (refNode, otherNode) {
    if (typeof refNode.contains === 'function') {
        return refNode.contains(otherNode);
    } else if (typeof refNode.compareDocumentPosition === 'function') {
        return !!(refNode.compareDocumentPosition(otherNode) & 16);
    } else {
        let node = otherNode.parentNode;
        if (node) {
            do {
                if (node === refNode) {
                    return true;
                } else {
                    node = node.parentNode;
                }
            } while (node !== null);
        }
        return false;
    }
}

export function isDomNode (obj) {
    if (typeof window === 'object' && typeof Node === 'function') {
        // If "TypeError: Right-hand side of 'instanceof' is not callback" is thrown,
        // it should because window.Node was overwritten.
        return obj instanceof Node;
    }
    else {
        return obj &&
            typeof obj === 'object' &&
            typeof obj.nodeType === 'number' &&
            typeof obj.nodeName === 'string';
    }
}

export function callInNextTick (callback, p1, p2) {
    if (CC_EDITOR) {
        if (callback) {
            // @ts-ignore
            process.nextTick(function () {
                callback(p1, p2);
            });
        }
    }
    else {
        if (callback) {
            setTimeout(function () {
                callback(p1, p2);
            }, 0);
        }
    }
}

// use anonymous function here to ensure it will not being hoisted without CC_EDITOR
export function tryCatchFunctor_EDITOR (funcName, forwardArgs, afterCall, bindArg) {
    // @ts-ignore
    function call_FUNC_InTryCatch (_R_ARGS_) {
        try {
            // @ts-ignore
            target._FUNC_(_U_ARGS_);
        }
        catch (e) {
            cc._throw(e);
        }
        // @ts-ignore
        _AFTER_CALL_;
    }
    // use evaled code to generate named function
    return Function('arg', 'return ' + call_FUNC_InTryCatch
        .toString()
        .replace(/_FUNC_/g, funcName)
        .replace('_R_ARGS_', 'target' + (forwardArgs ? ', ' + forwardArgs : ''))
        .replace('_U_ARGS_', forwardArgs || '')
        .replace('_AFTER_CALL_', afterCall || ''))(bindArg);
}

export function isPlainEmptyObj_DEV (obj) {
    if (!obj || obj.constructor !== Object) {
        return false;
    }
    // jshint ignore: start
    for (const k in obj) {
        return false;
    }
    // jshint ignore: end
    return true;
}

export function cloneable_DEV (obj) {
    return obj &&
        typeof obj.clone === 'function' &&
        ((obj.constructor && obj.constructor.prototype.hasOwnProperty('clone')) || obj.hasOwnProperty('clone'));
}

// if (CC_TEST) {
//     // editor mocks using in unit tests
//     if (typeof Editor === 'undefined') {
//         window.Editor = {
//             UuidUtils: {
//                 NonUuidMark: '.',
//                 uuid () {
//                     return '' + ((new Date()).getTime() + Math.random());
//                 },
//             },
//         };
//     }
// }

cc.misc = {
    BUILTIN_CLASSID_RE,
    BASE64_VALUES,
    propertyDefine,
    nextPOT,
    pushToMap,
    clampf,
    clamp01,
    lerp,
    degreesToRadians,
    radiansToDegrees,
    contains,
    isDomNode,
    callInNextTick,
    tryCatchFunctor_EDITOR,
    isPlainEmptyObj_DEV,
    cloneable_DEV,
};
