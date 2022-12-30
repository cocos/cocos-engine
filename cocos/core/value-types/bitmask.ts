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
 * Define an BitMask type.
 * @zh
 * 定义一个位掩码类型。
 * @param obj
 * @en A JavaScript literal object containing BitMask names and values.
 * @zh 包含 BitMask 名称和值的 JavaScript 文字对象。
 * @return @en The defined BitMask type @zh 定义的位掩码类型。
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

BitMask.isBitMask = (BitMaskType) => BitMaskType && BitMaskType.hasOwnProperty('__bitmask__');

BitMask.getList = (BitMaskDef) => {
    if (BitMaskDef.__bitmask__) {
        return BitMaskDef.__bitmask__;
    }

    const bitlist: any[] = BitMaskDef.__bitmask__ = [];

    for (const name in BitMaskDef) {
        const v = BitMaskDef[name];
        if (Number.isInteger(v)) {
            bitlist.push({ name, value: v });
        }
    }
    bitlist.sort((a, b) => a.value - b.value);
    return bitlist;
};

export function ccbitmask (bitmaskx) {
    if ('__bitmask__' in bitmaskx) {
        return;
    }
    value(bitmaskx, '__bitmask__', null, true);
}

legacyCC.BitMask = BitMask;
