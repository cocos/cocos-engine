/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { DEBUG } from 'internal:constants';

/**
 * Asserts that the expression is non-nullable, i.e. is neither `null` nor `undefined`.
 * @param expr Testing expression.
 * @param message Optional message.
 * @engineInternal
 */
export function assertIsNonNullable<T> (expr: T, message?: string): asserts expr is NonNullable<T> {
    assertIsTrue(!(expr === null || expr === undefined), message);
}

/**
 * Asserts that the expression evaluated to `true`.
 * @param expr Testing expression.
 * @param message Optional message.
 * @engineInternal
 */
export function assertIsTrue (expr: unknown, message?: string): asserts expr {
    if (DEBUG && !expr) {
        // eslint-disable-next-line no-debugger
        // debugger;
        throw new Error(`Assertion failed: ${message ?? '<no-message>'}`);
    }
}

/**
 * Assets that the index is valid.
 * @engineInternal
 */
export function assertsArrayIndex<T> (array: T[], index: number): void {
    assertIsTrue(index >= 0 && index < array.length, `Array index ${index} out of bounds: [0, ${array.length})`);
}

/**
 * Asserts the caller code's reachability.
 *
 * @example
 * ```ts
 * enum Color { RED, GREEN, BLUE }
 *
 * function toHex(colorThatDefinitelyCannotBeRed: Color): string {
 *     switch(colorThatDefinitelyCannotBeRed) {
 *     case Color.GREEN: return '0x00FF00';
 *     case Color.BLUE: return '0x0000FF';
 *
 *     // Without this:
 *     // - tsc reports error ts(2366).
 *     // - eslint reports error about 'consistent-return' and 'default-case'.
 *     default: return assertsUnreachable();
 *     }
 * }
 * ```
 *
 * @note This function throws in debug mode and returns `undefined` otherwise.
 */
export function assertsUnreachable (): never {
    if (DEBUG) {
        throw new Error('Here should never be reachable');
    }
    return undefined as never;
}
