import { Pose, PoseTransformSpace } from "../../../../../../cocos/animation/core/pose";
import { AnimationGraphEvaluationContext } from "../../../../../../cocos/animation/marionette/animation-graph-context";
import { PoseRecord } from "../../../utils/pose-record";
import { PoseNode_MapPoseRecord } from "./pose-node-map-pose-record";

/**
 * A pose node modify the result pose of `EvaluationContext.pushDefaultPose()` or `EvaluationContext.pushDefaultedPoseInComponentSpace()` during evaluation.
 */
export class PoseNode_ModifyDefaultPose extends PoseNode_MapPoseRecord {
    constructor(
        private _defaultPoseTransformSpace: PoseTransformSpace,
        record: PoseRecord,
    ) {
        super(record);
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        expect(this.transformHandleMap).not.toBeUndefined();
        const pose = this._defaultPoseTransformSpace === PoseTransformSpace.LOCAL ? context.pushDefaultedPose() : context.pushDefaultedPoseInComponentSpace();
        for (const [handle, transformRecord] of this.transformHandleMap!) {
            pose.transforms.setTransform(handle.index, transformRecord)
        }
        expect(this.auxiliaryCurveHandleMap).not.toBeUndefined();
        for (const [handle, curveValue] of this.auxiliaryCurveHandleMap!) {
            pose.auxiliaryCurves[handle.index] = curveValue;
        }
        return pose;
    }
}