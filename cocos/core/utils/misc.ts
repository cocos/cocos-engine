/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable no-new-func */

import { DEV } from 'internal:constants';
import { getClassName, getset, isEmptyObject } from './js';
import { legacyCC } from '../global-exports';
import { warnID } from '../platform/debug';
import { macro } from '../platform/macro';
import { setTimeoutRAF } from '../../../pal/utils';
import type { Component } from '../../scene-graph';

export const BUILTIN_CLASSID_RE = /^(?:cc|dragonBones|sp|ccsg)\..+/;

const BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
const values: number[] = new Array(123); // max char code in base64Keys
for (let i = 0; i < 123; ++i) { values[i] = 64; } // fill with placeholder('=') index
for (let i = 0; i < 64; ++i) { values[BASE64_KEYS.charCodeAt(i)] = i; }

// decoded value indexed by base64 char code
export const BASE64_VALUES = values;

/**
 * @en Defines properties for a class, or replaces getter, setter of existing properties.
 * @param ctor @en Class to modify.
 * @param sameNameGetSets @en Getters and setters of properties. The getter and setter
 * have the same name. So a property getter and setter occupy one position in `sameNameGetSets`.
 * @param diffNameGetSets @en Getters and setters of properties. The getter and setter
 * have different names. So a property getter and setter occupy two positions in `diffNameGetSets`.
 * @engineInternal
 */
export function propertyDefine (ctor, sameNameGetSets, diffNameGetSets): void {
    function define (np, propName, getter, setter): void {
        const pd = Object.getOwnPropertyDescriptor(np, propName);
        if (pd) {
            if (pd.get) { np[getter] = pd.get; }
            if (pd.set && setter) { np[setter] = pd.set; }
        } else {
            const getterFunc = np[getter];
            if (DEV && !getterFunc) {
                const clsName = (legacyCC.Class._isCCClass(ctor) && getClassName(ctor))
                    || ctor.name
                    || '(anonymous class)';
                warnID(5700, propName, getter, clsName);
            } else {
                getset(np, propName, getterFunc, np[setter]);
            }
        }
    }
    let propName; const np = ctor.prototype;
    for (let i = 0; i < sameNameGetSets.length; i++) {
        propName = sameNameGetSets[i];
        const suffix = (propName[0].toUpperCase() as string) + (propName.slice(1) as string);
        define(np, propName, `get${suffix}`, `set${suffix}`);
    }
    for (propName in diffNameGetSets) {
        const gs = diffNameGetSets[propName];
        define(np, propName, gs[0], gs[1]);
    }
}

/**
 * @en Inserts a new element into a map. All values corresponding to the same key are stored in an array.
 * @zh 往 map 插入一个元素。同一个关键字对应的所有值存储在一个数组里。
 * @param map @en The map to insert element. @zh 插入元素的 map。
 * @param key @en The key of new element. @zh 新插入元素的关键字。
 * @param value @en The value of new element. @zh 新插入元素的值。
 * @param pushFront @en Whether to put new value in front of the vector if key exists.
 * @zh 如果关键字已经存在，是否把新插入的值放到数组第一个位置。
 */
export function pushToMap (map, key, value, pushFront): void {
    const exists = map[key];
    if (exists) {
        if (Array.isArray(exists)) {
            if (pushFront) {
                exists.push(exists[0]);
                exists[0] = value;
            } else {
                exists.push(value);
            }
        } else {
            map[key] = (pushFront ? [value, exists] : [exists, value]);
        }
    } else {
        map[key] = value;
    }
}

/**
 * @en Checks whether a node is a descendant of a given node, that is the node itself, one of its direct
 * children (childNodes), one of the children's direct children, and so on.
 * @zh 检查节点是否是一个给定的节点的后代，即节点本身、它的一个直接子节点（childNodes）、该子节点的一个直接子节点，依此类推。
 * @param refNode @en The node to check. @zh 检查的节点。
 * @param otherNode @en The node to test with. @zh 用来测试的节点。
 * @returns @en True if otherNode is contained in refNode, false if not.
 * @zh 如果 refNode 包含 otherNode，返回 true；否则返回 false。
 */
export function contains (refNode, otherNode): boolean {
    if (typeof refNode.contains === 'function') {
        return refNode.contains(otherNode) as boolean;
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

/**
 * @en Checks whether a node is a DOM node. @zh 检查一个节点是否是一个 DOM 节点。
 * @param node @en The node the check. @zh 被检查节点。
 * @returns @en True if node is a DOM node, false else.
 * @zh 如果 DOM 节点，返回 true；否则返回 false。
 */
export function isDomNode (node): boolean {
    if (typeof window === 'object' && typeof Node === 'function') {
        // If "TypeError: Right-hand side of 'instanceof' is not callback" is thrown,
        // it should because window.Node was overwritten.
        return node instanceof Node;
    } else {
        return !!node
            && typeof node === 'object'
            && typeof node.nodeType === 'number'
            && typeof node.nodeName === 'string';
    }
}

/**
 * @en Invoke a function in next frame. @zh 在下一帧执行传入的函数。
 * @param callback @en The function to be invoked next frame. @zh 下一帧要执行的函数。
 * @param p1 @en The first parameter passed to `callback`. @zh 传给回调函数的第一个参数。
 * @param p2 @en The seconde parameter passed to `callback`. @zh 传给回调函数的第二个参数。
 */
export function callInNextTick (callback, p1?: any, p2?: any): void {
    if (callback) {
        setTimeoutRAF((): void => {
            callback(p1, p2);
        }, 0);
    }
}

// use anonymous function here to ensure it will not being hoisted without EDITOR
/**
 * @en Create a new function that will invoke `functionName` with try catch.
 * @zh 创建一个新函数，该函数会使用 try catch 机制调用 `functionName`.
 * @param funcName @en The function name to be invoked with try catch.
 * @zh 被 try catch 包裹的函数名。
 * @returns @en A new function that will invoke `functionName` with try catch.
 * @zh 使用 try catch 机制调用 `functionName` 的新函数.
 */
export function tryCatchFunctor_EDITOR (funcName: string): (comp: Component) => void {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return Function('target',
        `${'try {\n'
        + '  target.'}${funcName}();\n`
        + `}\n`
        + `catch (e) {\n`
        + `  cc._throw(e);\n`
        + `}`) as (comp: Component) => void;
}

/**
 * @en Checks whether an object is an empty object.
 * @zh 检查一个对象是否为空对象。
 * @param obj @en The object to check. @zh 要检查的对象。
 * @returns @en True if it is an empty object. False if it is not an empty object, not Object type, null or undefined.
 * @ 如果是空对象，返回 true。如果不是空对象，不是Object类型，空或未定义，则为假。
 */
export function isPlainEmptyObj_DEV (obj): boolean {
    if (!obj || obj.constructor !== Object) {
        return false;
    }
    return isEmptyObject(obj);
}

/**
 * @en Clamps a value between a min and a max value. </br>
 * If the original value is greater than max_inclusive, returns max_inclusive. </br>
 * If the original value is less than min_inclusive, returns min_inclusive. </br>
 * Else returns the original value.
 * @zh 限定浮点数的最大最小值。<br/>
 * 如果数值大于 max_inclusive 则返回 max_inclusive。<br/>
 * 如果数值小于 min_inclusive 则返回 min_inclusive。<br/>
 * 否则返回自身。
 * @param value @en Original value. @zh 初始值。
 * @param min_inclusive @en Minimum value in range. @zh 最小值。
 * @param max_inclusive @en Maximum value in range. @zh 最大值。
 * @returns @en The clamped value. @zh 目标值。
 * @example
 * var v1 = clampf(20, 0, 20); // 20;
 * var v2 = clampf(-1, 0, 20); //  0;
 * var v3 = clampf(10, 0, 20); // 10;
 */
export function clampf (value: number, min_inclusive: number, max_inclusive: number): number {
    if (min_inclusive > max_inclusive) {
        const temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
}

/**
 * @en Converts degree to radian.
 * @zh 将度数转换为弧度。
 * @param angle @en The degree to convert. @zh 角度。
 * @returns @en The radian. @zh 弧度。
 */
export function degreesToRadians (angle: number): number {
    return angle * macro.RAD;
}

/**
 * @en Converts radian to degree.
 * @zh 将弧度转换为角度。
 * @param angle @en The radian to convert. @zh 弧度。
 * @returns @en The degree. @zh 角度。
 */
export function radiansToDegrees (angle): number {
    return angle * macro.DEG;
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
    pushToMap,
    contains,
    isDomNode,
    callInNextTick,
    isPlainEmptyObj_DEV,
    clampf,
    degreesToRadians,
    radiansToDegrees,
};
