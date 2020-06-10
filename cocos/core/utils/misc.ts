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
import { EDITOR, DEV } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { warnID } from '../platform/debug';

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
            if (DEV && !getterFunc) {
                const clsName = (legacyCC.Class._isCCClass(ctor) && getClassName(ctor)) ||
                    ctor.name ||
                    '(anonymous class)';
                warnID(5700, propName, getter, clsName);
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

export function callInNextTick (callback, p1?: any, p2?: any) {
    if (EDITOR) {
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

// use anonymous function here to ensure it will not being hoisted without EDITOR
export function tryCatchFunctor_EDITOR (funcName) {
    return Function('target',
        'try {\n' +
        '  target.' + funcName + '();\n' +
        '}\n' +
        'catch (e) {\n' +
        '  cc._throw(e);\n' +
        '}');
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

// if (TEST) {
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

legacyCC.misc = {
    BUILTIN_CLASSID_RE,
    BASE64_VALUES,
    propertyDefine,
    nextPOT,
    pushToMap,
    contains,
    isDomNode,
    callInNextTick,
    tryCatchFunctor_EDITOR,
    isPlainEmptyObj_DEV,
    cloneable_DEV,
};
