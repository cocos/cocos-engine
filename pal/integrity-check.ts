/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

declare const guard: unique symbol;

type Guard = typeof guard;

/**
 * Checks if a PAL implementation module is compatible with its target interface module.
 *
 * @example
 * If you write the following in somewhere:
 *
 * ```ts
 * checkPalIntegrity<typeof import('pal-interface-module')>(
 *   withImpl<typeof import('pal-implementation-module')>());
 * ```
 *
 * you will receive a compilation error
 * if your implementation module is not fulfil the interface module.
 *
 * @note This function should be easily tree-shaken.
 */
export function checkPalIntegrity<T> (impl: T & Guard) {
}

/**
 * Utility function, see example of `checkPalIntegrity()`.
 *
 */
export function withImpl<T> () {
    return 0 as unknown as T & Guard;
}
