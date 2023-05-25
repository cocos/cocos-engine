import { TransformHandle } from "../../../../../../cocos/animation/core/animation-handle";
import { Transform } from "../../../../../../cocos/animation/core/transform";
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from "../../../../../../cocos/animation/marionette/animation-graph-context";
import { PoseNode } from "../../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { PoseRecord } from "../../../utils/pose-record";

export abstract class PoseNode_MapPoseRecord extends PoseNode {
    constructor(
        private _record: PoseRecord,
    ) {
        super();
    }

    public bind(context: AnimationGraphBindingContext): void {
        this.transformHandleMap = new Map(Object.entries(this._record.transforms).map(([nodeName, transformRecord]) => {
            const handle = context.bindTransformByName(nodeName);
            expect(handle).not.toBeNull();
            return [handle!, transformRecord];
        }));
    }

    public settle(context: AnimationGraphSettleContext): void { }

    public reenter(): void { }

    protected doUpdate(context: AnimationGraphUpdateContext): void { }

    protected transformHandleMap: Map<TransformHandle, Transform> | undefined = undefined;
}