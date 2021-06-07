/**
 * Tag to visit editor extras of an object. Never concern about its value please.
 */
export const editorExtrasTag = '__editorExtras__';

/**
 * Engine classes with this kind of signatures are integrated with editor extendability.
 */
export interface EditorExtendableObject {
    /**
     * The editor extras on this object.
     *
     * BE CAREFUL: this property is currently governed by Cocos Creator Editor.
     * Its definition is not visible and is unknown to both engine code or users codes,
     * they SHALL NOT operates it.
     *
     * You should use editor extras tag to visit this property.
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
     */
    [editorExtrasTag]: unknown;
}
