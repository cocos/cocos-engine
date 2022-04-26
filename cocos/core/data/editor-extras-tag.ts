/**
 * Tag to visit editor extras of an object. Never concern about its value please.
 * @internal
 */
export const editorExtrasTag = '__editorExtras__';

/**
 * Engine classes with this kind of signatures are integrated with editor extendability.
 * @internal
 */
export interface EditorExtendableObject {
    /**
     * @en
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
