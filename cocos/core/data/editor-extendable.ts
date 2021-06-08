import { EDITOR } from 'internal:constants';
import { js } from '../utils/js';
import { CCClass } from './class';
import { EditorExtendableObject, editorExtrasTag } from './editor-extras-tag';

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

/**
 * Class which implements the `EditorExtendableObject` interface.
 */
export const EditorExtendable = editorExtendableInternal();

export type EditorExtendable = InstanceType<typeof EditorExtendable>;

// eslint-disable-next-line @typescript-eslint/ban-types
function editorExtendableInternal<T> (Base?: (new (...args: any[]) => T), className?: string) {
    type ResultType = new (...args: any[]) => (T & EditorExtendableObject);

    if (!EDITOR) {
        return (Base ?? Object) as unknown as ResultType;
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

    const EditorExtendable = Base ? class EditorExtendable extends (Base as unknown as any) implements EditorExtendableObject {
        public [editorExtrasTag]!: unknown;
    } : class EditorExtendable implements EditorExtendableObject {
        public [editorExtrasTag]!: unknown;
    };

    CCClass.fastDefine(name, EditorExtendable, { [editorExtrasTag]: {} });
    CCClass.Attr.setClassAttr(EditorExtendable, editorExtrasTag, 'editorOnly', true);

    return EditorExtendable as unknown as ResultType;
}
