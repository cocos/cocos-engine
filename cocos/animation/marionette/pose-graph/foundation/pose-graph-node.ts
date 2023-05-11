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
     */
    public getTitle?(): string;

    /**
     * @zh
     * 获取该结点的进入信息。
     * @en
     * Gets enter info of this node.
     */
    public getEnterInfo?(): EnterNodeInfo | undefined;
}
