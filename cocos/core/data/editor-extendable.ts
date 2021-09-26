import { EDITOR } from 'internal:constants';
import { ccclass, editorOnly } from 'cc.decorator';
import { js } from '../utils/js';
import { CCClass } from './class';
import { EditorExtendableObject, editorExtrasTag } from './editor-extras-tag';
import { assertIsTrue } from './utils/asserts';

// Functions and classes exposed from this module are useful to
// make a class to be `EditorExtendableObject`.
//
// These helpers are used internally, don't expose them to user.

/**
 * Creates a mixin class which inherits from specific base class and implements the `EditorExtendableObject` interface.
 * @param Base The base class.
 * @param className Assign an optional cc class name. If the base class is not cc class, this param is required.
 * @returns The mixin class.
 */
export function EditorExtendableMixin<T> (Base: new (...args: any[]) => T, className?: string) {
    return editorExtendableInternal(Base);
}

class Empty {}

/**
 * Class which implements the `EditorExtendableObject` interface.
 */
export const EditorExtendable = editorExtendableInternal();

export type EditorExtendable = InstanceType<typeof EditorExtendable>;

// Note: Babel does not support decorators on computed property currently.
// So we have to use its literal value below.
assertIsTrue(editorExtrasTag === '__editorExtras__', 'editorExtrasTag needs to be updated.');

// eslint-disable-next-line @typescript-eslint/ban-types
function editorExtendableInternal<T> (Base?: (new (...args: any[]) => T), className?: string) {
    type ResultType = new (...args: any[]) => (T & EditorExtendableObject);

    if (!EDITOR) {
        return (Base ?? Empty) as unknown as ResultType;
    }

    let name: string;
    if (className) {
        name = className;
    } else if (!Base) {
        name = `cc.EditorExtendable`;
    } else {
        const baseName = js.getClassName(Base);
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

    return EditorExtendable as unknown as ResultType;
}
