import { EditorExtendable, assertIsTrue } from '../../../../core';
import { EnterNodeInfo } from './authoring/enter-node-info';
import type { PoseGraphNodeShell } from './node-shell';

export const shellTag = Symbol('Shell');

/**
 * @zh
 * 姿势图中的结点类。
 * @en
 * Class of node in pose graph.
 */
export class PoseGraphNode extends EditorExtendable {
    /**
     * @zh
     * 该结点在姿势图中的外壳。
     * 在结点添加到姿势图中时，该字段被置为相应的外壳对象；
     * 当结点被移出姿势图时，该字段被置空。
     * @en
     * The node's shell in pose graph.
     * This field is set to the corresponding shell object when this node is added into pose graph,
     * is set to `undefined` when this node is removed from pose graph.
     * @internal
     */
    get [shellTag] () {
        return this._shell;
    }

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

    /**
     * @internal
     */
    public _emplaceShell (shell: PoseGraphNodeShell) {
        assertIsTrue(!this._shell);
        this._shell = shell;
    }

    /**
     * @internal
     */
    public _dropShell () {
        assertIsTrue(this._shell);
        this._shell = undefined;
    }

    private _shell: PoseGraphNodeShell | undefined = undefined;
}
