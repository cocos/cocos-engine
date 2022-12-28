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

import { DEBUG } from 'internal:constants';

/**
 * 在调试模式下，将属性的 Get 访问器标记为不可变的。
 * 属性必须为 Javascript 原生类型或继承自 ValueType。
 * 非调试模式下，此装饰器没有任何效果。
 */
export function constget (target: Object, propertyKey: string | symbol) {
    if (!DEBUG) {
        return;
    }

    const propertyDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (propertyDescriptor && propertyDescriptor.get) {
        const rawGet = propertyDescriptor.get;
        function constGet (this: any) {
            const value = rawGet.call(this);
            return value ? Object.freeze(value.clone()) : value;
        }
        propertyDescriptor.get = constGet;
    }
    return propertyDescriptor;
}
