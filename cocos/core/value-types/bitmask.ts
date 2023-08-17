/*
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

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

import { EDITOR, TEST } from 'internal:constants';
import { value } from '../utils/js';
import { legacyCC } from '../global-exports';
import { errorID } from '../platform/debug';

/**
 * @en
 * Defines a BitMask type. The editor will display different inspector depending on this data type.  It may define some properties to the object.
 * The keys of new properties are the integer type values, and the values are corresponding keys. See the example below.
 * keys.
 * @zh
 * 定义一个位掩码类型。编辑器会根据这个数据类型显示不同的显示界面。它可能会在对象添加新属性。新属性的 key 是原来的整型 value，value 是对应的 key。参考下面的例子。
 * @param obj
 * @en A JavaScript literal object containing BitMask names and values.
 * @zh 包含 BitMask 名称和值的 JavaScript 文字对象。
 * @returns @en The defined BitMask type @zh 定义的位掩码类型。
 * @example
 * ```ts
 * // `type1` and `type2` are single-selected.
 * let obj = {
 *     type1: 0,
 *     type2: 1 << 2,
 * }
 *
 * // `type1` and `type2` are multiple-selected.
 * // New properties are added to obj, obj now is
 * // {
 * //     type1: 0,
 * //     type2: 1<< 2,
 * //     0: type1,
 * //     4: type2
 * // }
 * BitMask(obj);
 * ```
 */
export function BitMask<T> (obj: T): T {
    if ('__bitmask__' in obj) {
        return obj;
    }
    value(obj, '__bitmask__', null, true);

    let lastIndex = -1;
    const keys: string[] = Object.keys(obj);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        let val = obj[key];
        if (val === -1) {
            val = ++lastIndex;
            obj[key] = val;
        } else if (typeof val === 'number') {
            lastIndex = val;
        } else if (typeof val === 'string' && Number.isInteger(parseFloat(key))) {
            continue;
        }
        const reverseKey = `${val}`;
        if (key !== reverseKey) {
            if ((EDITOR || TEST) && reverseKey in obj && obj[reverseKey] !== key) {
                errorID(7100, reverseKey);
                continue;
            }
            value(obj, reverseKey, key);
        }
    }
    return obj;
}

/**
 * @en Checks if an object is BitMask. @zh 检查一个对象是否是 BitMask。
 * @param BitMaskType @en The object to check. @zh 待检查对象。
 * @returns @en True if it is a BitMask, false else.
 * @zh 如果是 BitMask，返回 true；否则返回 false。
 */
BitMask.isBitMask = (BitMaskType): any => BitMaskType && BitMaskType.hasOwnProperty('__bitmask__');

/**
 *
 * @param BitMaskDef
 * @returns @en A sorted array with integer values. @zh 存储整型属性值的数组。该数组已排序。
 */
BitMask.getList = (BitMaskDef): any => {
    if (BitMaskDef.__bitmask__) {
        return BitMaskDef.__bitmask__;
    }

    return BitMask.update(BitMaskDef);
};

/**
 * @en
 * Update BitMask object properties.
 * @zh
 * 更新 BitMask 对象的属性列表。
 *
 * @param BitMaskDef
 * @returns @en A sorted array with integer values. @zh 存储整型属性值的数组。该数组已排序。
 */
BitMask.update = (BitMaskDef): any => {
    if (!Array.isArray(BitMaskDef.__bitmask__)) {
        BitMaskDef.__bitmask__ = [];
    }

    const bitList = BitMaskDef.__bitmask__;
    bitList.length = 0;

    for (const name in BitMaskDef) {
        const v = BitMaskDef[name];
        if (Number.isInteger(v)) {
            bitList.push({ name, value: v });
        }
    }
    bitList.sort((a, b): number => a.value - b.value);

    return bitList;
};

/**
 * @en Similar to [[BitMask]], but it doesn't add properties to the object.
 * @zh 和 [[BitMask]] 类似功能，但不会往对象添加属性。
 * @param bitmaskx @en An object to make BitMask type. @zh 要标记为 BitMask 类型的对象。
 * @returns @en The passed in object. @zh 传入的对象。
 */
export function ccbitmask (bitmaskx): void {
    if ('__bitmask__' in bitmaskx) {
        return;
    }
    value(bitmaskx, '__bitmask__', null, true);
}

legacyCC.BitMask = BitMask;
