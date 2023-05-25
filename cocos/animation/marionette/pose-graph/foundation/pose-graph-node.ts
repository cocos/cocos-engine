import { EditorExtendable } from '../../../../core';
import { EnterNodeInfo } from './authoring/enter-node-info';

/**
 * @zh
 * 姿势图中的结点类。
 * @en
 * Class of node in pose graph.
 */
export class PoseGraphNode extends EditorExtendable {
    /**
     * @internal Temporarily hack for deserialization callback.
     */
    __callOnAfterDeserializeRecursive?(): void;

    /**
     * @zh
     * 获取该结点的标题。
     * @en
     * Gets title of this node.
     * @returns @zh
     * - 若返回 `string`，则用该字符串作为标题。
     * - 否则，若返回 `undefined`，表示标题未定义。
     * - 否则，返回的是标题的参数化 i18n 表示。
     * @en
     * - If `string` is returned, then use the string as title.
     * - Otherwise, if `undefined` is returned, then the title is not defined.
     * - Otherwise, the returned value is the parametric representation of title.
     */
    public getTitle?(): string | [string, Record<string, string>] | undefined;

    /**
     * @zh
     * 获取该结点的进入信息。
     * @en
     * Gets enter info of this node.
     */
    public getEnterInfo?(): EnterNodeInfo | undefined;
}
