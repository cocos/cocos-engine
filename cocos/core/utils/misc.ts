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

import { DEBUG, DEV } from 'internal:constants';
import { isDescendantElementOf, isDomNode as _isDomNode, setTimeoutRAF } from '@pal/utils';
import { cclegacy } from '@base/global';
import { warnID } from '@base/debug';
import { js } from '@base/utils';
import { isPlainEmptyObj } from '@base/utils/internal';
import { toRadian, toDegree, clamp } from '@base/math';
import { callInNextTick as _callInNextTick } from './internal';
import values from '../../../external/compression/base64-values';

/**
 * @deprecated since v3.9.0
 */
export const BUILTIN_CLASSID_RE = /^(?:cc|dragonBones|sp|ccsg)\..+/;

/**
 * @deprecated since v3.9.0
 */
export const BASE64_VALUES = values;

/**
 * @en Inserts a new element into a map. All values corresponding to the same key are stored in an array.
 * @zh 往 map 插入一个元素。同一个关键字对应的所有值存储在一个数组里。
 * @param map @en The map to insert element. @zh 插入元素的 map。
 * @param key @en The key of new element. @zh 新插入元素的关键字。
 * @param value @en The value of new element. @zh 新插入元素的值。
 * @param pushFront @en Whether to put new value in front of the vector if key exists.
 * @zh 如果关键字已经存在，是否把新插入的值放到数组第一个位置。
 *
 * @deprecated since v3.9.0, please use `js.pushToMap` instead.
 */
export function pushToMap (map: Record<string, unknown>, key: string, value: unknown, pushFront: boolean): void {
    if (DEBUG) {
        warnID(16001, 'misc.pushToMap', '3.9.0', 'js.pushToMap');
    }
    js.pushToMap(map, key, value, pushFront);
}

/**
 * @en Checks whether a node is a descendant of a given node, that is the node itself, one of its direct
 * children (childNodes), one of the children's direct children, and so on.
 * @zh 检查节点是否是一个给定的节点的后代，即节点本身、它的一个直接子节点（childNodes）、该子节点的一个直接子节点，依此类推。
 * @param refNode @en The node to check. @zh 检查的节点。
 * @param otherNode @en The node to test with. @zh 用来测试的节点。
 * @returns @en True if otherNode is contained in refNode, false if not.
 * @zh 如果 refNode 包含 otherNode，返回 true；否则返回 false。
 *
 * @deprecated since 3.9.0, the engine should not provide the web specific interface anymore.
 */
export function contains (refNode, otherNode): boolean {
    if (DEBUG) {
        warnID(16000, 'misc.contains', '3.9.0');
    }
    return isDescendantElementOf(refNode, otherNode);
}

/**
 * @en Checks whether a node is a DOM node. @zh 检查一个节点是否是一个 DOM 节点。
 * @param node @en The node the check. @zh 被检查节点。
 * @returns @en True if node is a DOM node, false else.
 * @zh 如果 DOM 节点，返回 true；否则返回 false。
 *
 * @deprecated since 3.9.0, the engine should not provide the web specific interface anymore.
 */
export function isDomNode (node): boolean {
    if (DEBUG) {
        warnID(16000, 'misc.isDomNode', '3.9.0');
    }
    return _isDomNode(node);
}

/**
 * @en Invoke a function in next frame. @zh 在下一帧执行传入的函数。
 * @param callback @en The function to be invoked next frame. @zh 下一帧要执行的函数。
 * @param p1 @en The first parameter passed to `callback`. @zh 传给回调函数的第一个参数。
 * @param p2 @en The seconde parameter passed to `callback`. @zh 传给回调函数的第二个参数。
 *
 * @deprecated since v3.9.0, please use `component.scheduleOnce(callback)` instead.
 */
export function callInNextTick (callback: AnyFunction, p1?: unknown, p2?: unknown): void {
    if (DEBUG) {
        warnID(16001, 'misc.callInNextTick', '3.9.0', 'component.scheduleOnce');
    }
    _callInNextTick(callback, p1, p2);
}

// use anonymous function here to ensure it will not being hoisted without EDITOR
/**
 * @en Create a new function that will invoke `functionName` with try catch.
 * @zh 创建一个新函数，该函数会使用 try catch 机制调用 `functionName`.
 * @param funcName @en The function name to be invoked with try catch.
 * @zh 被 try catch 包裹的函数名。
 * @returns @en A new function that will invoke `functionName` with try catch.
 * @zh 使用 try catch 机制调用 `functionName` 的新函数.
 *
 * @deprecated since v3.9.0.
 */
export function tryCatchFunctor_EDITOR (funcName: string): (comp: unknown) => void {
    if (DEBUG) {
        warnID(16000, 'misc.tryCatchFunctor_EDITOR', '3.9.0');
    }
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return Function(
        'target',
        `${'try {\n'
        + '  target.'}${funcName}();\n`
        + `}\n`
        + `catch (e) {\n`
        + `  cc._throw(e);\n`
        + `}`,
    ) as (comp: unknown) => void;
}

/**
 * @en Checks whether an object is an empty object.
 * @zh 检查一个对象是否为空对象。
 * @param obj @en The object to check. @zh 要检查的对象。
 * @returns @en True if it is an empty object. False if it is not an empty object, not Object type, null or undefined.
 * @ 如果是空对象，返回 true。如果不是空对象，不是Object类型，空或未定义，则为假。
 *
 * @deprecated since v3.9.0, please use `js.isEmptyObject` instead.
 */
export function isPlainEmptyObj_DEV (obj): boolean {
    if (DEBUG) {
        warnID(16001, 'misc.isPlainEmptyObj_DEV', '3.9.0', 'js.isEmptyObject');
    }
    return isPlainEmptyObj(obj);
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
 *
 * @deprecated since v3.9.0, please use `math.clamp` instead.
 */
export function clampf (value: number, min_inclusive: number, max_inclusive: number): number {
    if (DEBUG) {
        warnID(16001, 'misc.clampf', '3.9.0', 'math.clamp');
    }
    return clamp(value, min_inclusive, max_inclusive);
}

/**
 * @en Converts degree to radian.
 * @zh 将度数转换为弧度。
 * @param angle @en The degree to convert. @zh 角度。
 * @returns @en The radian. @zh 弧度。
 *
 * @deprecated since v3.9.0, please use `math.toRadian` instead.
 */
export function degreesToRadians (angle: number): number {
    if (DEBUG) {
        warnID(16001, 'misc.degreesToRadians', '3.9.0', 'math.toRadian');
    }
    return toRadian(angle);
}

/**
 * @en Converts radian to degree.
 * @zh 将弧度转换为角度。
 * @param angle @en The radian to convert. @zh 弧度。
 * @returns @en The degree. @zh 角度。
 *
 * @deprecated since v3.9.0, please use `math.toDegree` instead.
 */
export function radiansToDegrees (angle: number): number {
    if (DEBUG) {
        warnID(16001, 'misc.radiansToDegrees', '3.9.0', 'math.toDegree');
    }
    return toDegree(angle);
}

cclegacy.misc = {
    BUILTIN_CLASSID_RE,
    BASE64_VALUES,
    pushToMap,
    contains,
    isDomNode,
    callInNextTick,
    isPlainEmptyObj_DEV,
    clampf,
    degreesToRadians,
    radiansToDegrees,
};
