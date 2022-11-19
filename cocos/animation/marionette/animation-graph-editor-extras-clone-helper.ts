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
