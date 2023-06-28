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

import { EDITOR } from 'internal:constants';
import { ccclass, editorOnly } from 'cc.decorator';
import { getClassName } from '../utils/js';
import { EditorExtendableObject, editorExtrasTag } from './editor-extras-tag';
import { assertIsTrue } from './utils/asserts';

// Functions and classes exposed from this module are useful to
// make a class to be `EditorExtendableObject`.
//
// These helpers are used internally, don't expose them to the user.

/**
 * Creates a mixin class that inherits from the specific base class and implements the `EditorExtendableObject` interface.
 * @param Base The base class.
 * @param className Assign an optional cc class name. If the base class is not cc class, this param is required.
 * @returns The mixin class.
 */
export function EditorExtendableMixin<T> (Base: new (...args: any[]) => T, className?: string): new (...args: any[]) => EditorExtendableObject {
    return editorExtendableInternal(Base);
}

class Empty {}

/**
 * Class which implements the `EditorExtendableObject` interface.
 * @engineInternal
 */
export const EditorExtendable = editorExtendableInternal();

export type EditorExtendable = InstanceType<typeof EditorExtendable>;

// Note: Babel does not support decorators on computed property currently.
// So we have to use its literal value below.
assertIsTrue(editorExtrasTag === '__editorExtras__', 'editorExtrasTag needs to be updated.');

type ResultType<T> = new (...args: any[]) => (T & EditorExtendableObject);

// eslint-disable-next-line @typescript-eslint/ban-types
function editorExtendableInternal<T> (Base?: (new (...args: any[]) => T), className?: string): new (...args: any[]) => EditorExtendableObject {
    if (!EDITOR) {
        return (Base ?? Empty) as unknown as ResultType<T>;
    }

    let name: string;
    if (className) {
        name = className;
    } else if (!Base) {
        name = `cc.EditorExtendable`;
    } else {
        const baseName = getClassName(Base);
        if (baseName) {
            name = `cc.EditorExtendable/${baseName}`;
        } else {
            throw new Error(`You should supply a class name to EditorExtendable when mixin with ${Base.name}.`);
        }
    }

    let EditorExtendable: any;
    if (Base) {
        @ccclass(name)
        class C extends (Base as unknown as any) implements EditorExtendableObject {
            @editorOnly
            public __editorExtras__!: unknown;
        }

        EditorExtendable = C;
    } else {
        @ccclass(name)
        class C implements EditorExtendableObject {
            @editorOnly
            public __editorExtras__!: unknown;
        }

        EditorExtendable = C;
    }

    return EditorExtendable as unknown as ResultType<T>;
}
