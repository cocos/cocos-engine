import { EditorExtendable, assertIsTrue, error, js, warn } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { PoseGraphNodeShell } from './foundation/node-shell';
import { PoseGraphNode } from './foundation/pose-graph-node';
import { AddNonFreestandingNodeError } from './foundation/errors';
import { PoseGraphOutputNode } from './graph-output-node';

/**
 * @zh
 * 姿势图。
 * @en
 * Pose graph.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseGraph`)
export class PoseGraph extends EditorExtendable {
    constructor () {
        super();
        this.addNode(this._outputNode);
    }

    /**
     * @zh 姿势图的输出结点。
     * @en The pose graph's output node.
     */
    public get outputNode (): PoseGraphOutputNode {
        return this._outputNode;
    }

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive (): void {
        assertIsTrue(this._nodes.length === this._shells.length);
        for (let iNode = 0; iNode < this._nodes.length; ++iNode) {
            const node = this._nodes[iNode];
            const shell = this._shells[iNode];
            this._shellMap.set(node, shell);
            node.__callOnAfterDeserializeRecursive?.();
        }
    }

    /**
     * @zh 获取所有结点。
     * @en Gets all nodes.
     * @returns @zh 用于遍历所有结点的迭代器。 @en The iterator to iterate all nodes.
     */
    public nodes (): IterableIterator<PoseGraphNode> {
        return this._nodes.values();
    }

    /**
     * @zh 添加一个结点到图中。
     * @en Adds a node into graph.
     * @param node @zh 要添加的结点。 @en Node to add.
     * @returns `node`
     *
     * @note
     * @zh 注意，要添加的结点必须是“独立”的，也就是说它不能已经在任何图中。否则会抛出异常。
     * @en Note, the node to add should be "freestanding",
     * means it should not been already in any graph. Otherwise, an exception would be thrown.
     */
    public addNode<TNode extends PoseGraphNode> (node: TNode): TNode {
        if (this._shellMap.has(node)) {
            throw new AddNonFreestandingNodeError(node);
        }
        const shell = new PoseGraphNodeShell();
        this._shells.push(shell);
        this._nodes.push(node);
        this._shellMap.set(node, shell);
        return node;
    }

    /**
     * @zh 将指定的结点从图中移除。
     * @en Removes specified node from the graph.
     * @param removal @zh 要移除的结点。 @en The node to remove.
     *
     * @note
     * @zh 如果要移除的结点不在图中或该结点是图的输出结点，则此方法不会生效。
     * @en If the removal node is not within graph or is the output node of graph,
     * this method takes no effect.
     */
    public removeNode (removal: PoseGraphNode): void {
        if (removal === this._outputNode) {
            error(`Can not remove the output node.`);
            return;
        }

        const nodeIndex = this._nodes.indexOf(removal);
        if (nodeIndex < 0) {
            return;
        }

        // This should be true.
        assertIsTrue(this._shellMap.has(removal));

        // Disconnect from others.
        for (const shell of this._shells) {
            shell.deleteBindingTo(removal);
        }

        // Remove from graph.
        js.array.removeAt(this._shells, nodeIndex);
        js.array.removeAt(this._nodes, nodeIndex);
        this._shellMap.delete(removal);
    }

    /**
     * @zh
     * 获取指定结点在姿势图中的外壳。
     * @en
     * Gets the specified node's shell in pose graph.
     * @internal
     */
    public getShell (node: PoseGraphNode): PoseGraphNodeShell | undefined {
        return this._shellMap.get(node);
    }

    @serializable
    private _outputNode = new PoseGraphOutputNode();

    @serializable
    private _nodes: PoseGraphNode[] = [];

    @serializable
    private _shells: PoseGraphNodeShell[] = [];

    @serializable
    private _shellMap = new Map<PoseGraphNode, PoseGraphNodeShell>();
}
