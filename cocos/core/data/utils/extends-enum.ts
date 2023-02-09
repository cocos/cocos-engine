/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { DEV } from 'internal:constants';
import { errorID } from '../../platform/debug';

/**
 * @zh
 * 组合任意多个枚举。
 * 此函数的行为等价于返回了一个新的枚举，其成员囊括了所有源枚举的成员。
 * 这些枚举的成员必须各不相同（包括成员名和值），否则行为是未定义的。
 * @en
 * Combine an arbitrary number of enumerations.
 * It behaves like an enumeration having members that are a combination of members of the source enumerations
 * is returned.
 * These enumerations shall have non-overlapped member names or member values.
 * If not, the behavior is undefined.
 * @example
 * ```ts
 * enum Apple { apple = 'apple', }
 * enum Pen { pen = 'pen' }
 * // As if `enum ApplePen { apple = 'apple'; pen = 'pen'; }`
 * const ApplePen = extendsEnum(Apple, Pen);
 * ```
 */
export function extendsEnum (): {};

export function extendsEnum<E0> (e0: E0): E0;

export function extendsEnum<E0, E1> (e0: E0, e1: E1): E0 & E1;

export function extendsEnum<E0, E1, E2> (e0: E0, e1: E1, e2: E2): E0 & E1 & E2;

export function extendsEnum<E0, E1, E2, E3> (e0: E0, e1: E1, e2: E2, e3: E3): E0 & E1 & E2 & E3;

export function extendsEnum (...enums: any[]): any {
    if (DEV) {
        const kvs: PropertyKey[] = [];
        for (const e of enums) {
            for (const kv of Object.keys(e)) {
                if (kvs.indexOf(kv) >= 0) {
                    errorID(3659);
                } else {
                    kvs.push(kv);
                }
            }
        }
    }
    return Object.assign({}, ...enums);
}
