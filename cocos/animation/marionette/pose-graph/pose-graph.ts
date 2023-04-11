import { EditorExtendable, js, warn } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { PoseNode } from './pose-node';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}PoseGraph`)
export class PoseGraph extends EditorExtendable {
    public get main () {
        return this._main;
    }

    public set main (value) {
        if (value && !this._nodes.includes(value)) {
            warn(`Specified pose expr is not within container.`);
            return;
        }
        this._main = value;
    }

    /**
     * // TODO: HACK
     * @internal
     */
    public __callOnAfterDeserializeRecursive () {
        for (const node of this._nodes) {
            if ('__callOnAfterDeserializeRecursive' in node) {
                (node as unknown as {
                    __callOnAfterDeserializeRecursive(): void;
                }).__callOnAfterDeserializeRecursive();
            }
        }
    }

    public nodes () {
        return this._nodes.values();
    }

    public addNode (node: PoseNode) {
        this._nodes.push(node);
    }

    public removeNode (node: PoseNode) {
        // Disconnect from others.
        for (const node of this._nodes) {
            // TODO before merging:
        }

        // Disconnect from output.
        if (node === this._main) {
            this._main = null;
        }

        // Remove from graph.
        js.array.remove(this._nodes, node);
    }

    @serializable
    private _nodes: PoseNode[] = [];

    @serializable
    private _main: PoseNode | null = null;
}
