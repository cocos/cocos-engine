/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import type { Component } from './component';

/**
 * @en Create a new function that will invoke `functionName` with try catch.
 * @zh 创建一个新函数，该函数会使用 try catch 机制调用 `functionName`.
 * @param funcName @en The function name to be invoked with try catch.
 * @zh 被 try catch 包裹的函数名。
 * @returns @en A new function that will invoke `functionName` with try catch.
 * @zh 使用 try catch 机制调用 `functionName` 的新函数.
 */
export function tryCatchFunctor_EDITOR (funcName: string): (comp: Component) => void {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
    return Function(
        'target',
        `${'try {\n'
        + '  target.'}${funcName}();\n`
        + `}\n`
        + `catch (e) {\n`
        + `  cc._throw(e);\n`
        + `}`,
    ) as (comp: Component) => void;
}
