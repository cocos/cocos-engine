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

/**
 * Tag to visit editor extras of an object. Never be concerned about its value, please.
 */
export const editorExtrasTag = '__editorExtras__';

/**
 * Engine classes with this kind of signature are integrated with editor extendability.
 * @internal
 */
export interface EditorExtendableObject {
    /**
     * @en
     * The editor extras on this object.
     *
     * BE CAREFUL: this property is currently governed by Cocos Creator Editor.
     * Its definition is not visible and is unknown to both engine code and users codes,
     * they SHALL NOT operate it.
     *
     * You should use the editor extras tag to visit this property.
     * @example
     * ```ts
     * import { editorExtrasTag } from 'cc';
     * node[editorExtrasTag] = {};
     * node[editorExtrasTag].someWhat;
     * ```
     * Even if you know `editorExtrasTag === '__editorExtras__'` in current,
     * don't access the property through that:
     * ```ts
     * node.__editorExtras__ = {}; // Error: might be break in future.
     * ```
     * @zh
     * 此对象的编辑器额外数据。
     *
     * **注意**：此属性目前由 Cocos Creator 编辑器管理。
     * 它的定义不管是对于引擎还是用户代码都是不可见的，也 **不应该** 操作该数据。
     *
     * 你应该仅使用编辑器额外数据标签来访问此数据。
     * @example
     * ```ts
     * import { editorExtrasTag } from 'cc';
     * node[editorExtrasTag] = {};
     * node[editorExtrasTag].someWhat;
     * ```
     * 即使你知道目前 `editorExtrasTag === '__editorExtras__'`，
     * 也不要通过字符串属性来访问：
     * ```ts
     * node.__editorExtras__ = {}; // 错误：在未来可能无法生效
     * ```
     */
    [editorExtrasTag]: unknown;
}
