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

import { EditorExtendableObject, editorExtrasTag } from '../../core/data/editor-extras-tag';

/**
 * Clones the editor extras from an animation-graph-specific object.
 * @internal This is a HACKY way.
 *
 * If the editor extras from an animation-graph-specific object has a method called `clone`,
 * that method would be called to perform a clone operation.
 * The return value would be used as the clone result.
 * The method `clone` has the signature: `(host: EditorExtendableObject) => unknown`.
 */
export function cloneAnimationGraphEditorExtrasFrom (object: EditorExtendableObject): unknown {
    const editorExtras = object[editorExtrasTag];
    if (typeof editorExtras === 'object' && editorExtras) {
        const maybeCloneableEditorExtras = editorExtras as {
            clone?(host: EditorExtendableObject): unknown;
        };
        return maybeCloneableEditorExtras.clone?.(object);
    }
    return undefined;
}
