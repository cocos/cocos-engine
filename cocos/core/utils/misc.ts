/*
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
*/

 // tslint:disable

import { getClassName, getset } from './js';
import { clamp, clamp01 as clampValue01, lerp as lerpUtil, toRadian, toDegree } from '../value-types/utils';

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
 * @zh
 * 限定浮点数的最大最小值。
 * 数值大于 max_inclusive 则返回 max_inclusive。
 * 数值小于 min_inclusive 则返回 min_inclusive。
 * 否则返回自身。
 *
 * @param value
 * @param min_inclusive
 * @param max_inclusive
 * @return
 * @example
 * ```
 * var v1 = cc.misc.clampf(20, 0, 20); // 20;
 * var v2 = cc.misc.clampf(-1, 0, 20); //  0;
 * var v3 = cc.misc.clampf(10, 0, 20); // 10;
 * ```
 */
function clampf(value: number, min_inclusive: number, max_inclusive: number) {
    return clamp(value, min_inclusive, max_inclusive);
}

/**
 * @zh
 * 限定浮点数的取值范围为 0 ~ 1 之间。
 *
 * @param value
 * @example
 * ```typescript
 * let v1 = cc.misc.clamp01(20);  // 1;
 * let v2 = cc.misc.clamp01(-1);  // 0;
 * let v3 = cc.misc.clamp01(0.5); // 0.5;
 * ```
 */
function clamp01 (value: number) {
    return clampValue01(value);
}

/**
 * @zh
 * 两个数字之间的线性插值，比率决定了它对两端的偏向程度。
 *
 * @param a number A
 * @param b number B
 * @param r ratio between 0 and 1
 * @return
 * @example
 * ```
 * let v1 = cc.misc.lerp(2,10,0.5); // 6;
 * let v2 = cc.misc.lerp(2,10,0.2); // 3.6;
 * ```
 */
function lerp (a: number, b: number, r: number) {
    return lerpUtil(a, b, r);
}

/**
 * @zh
 * 角度转弧度
 *
 * @param angle
 * @return
 */
export function degreesToRadians (angle: number) {
    return toRadian(angle);
}

/**
 * @zh
 * 弧度转角度
 *
 * @param angle
 * @return
 */
export function radiansToDegrees (angle: number) {
    return toDegree(angle);
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

export function callInNextTick (callback, p1?:any, p2?:any) {
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
export function tryCatchFunctor_EDITOR (funcName, forwardArgs?, afterCall?, bindArg?) {
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
