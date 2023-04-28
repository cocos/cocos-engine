import { AnimationGraph } from "../../../../../cocos/animation/marionette/asset-creation";
import { poseGraphOp } from "../../../../../cocos/animation/marionette/pose-graph/op";
import { PoseGraphNode } from "../../../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import { Pose } from "../../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { Quat, Vec3 } from "../../../../../exports/base";
import { PoseNode } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { XNode } from "../../../../../cocos/animation/marionette/pose-graph/x-node";

export function normalizeNodeInputMetadata(nodeInputMetadata?: poseGraphOp.InputMetadata) {
    return nodeInputMetadata ? {
        deletable: false,
        insertPoint: false,
        ...nodeInputMetadata
    } : undefined;
}

export function createPoseGraph() {
    return new AnimationGraph().addLayer().stateMachine.addPoseState().graph;
}

export function getTheOnlyInputKey(node: PoseGraphNode) {
    const keys = poseGraphOp.getInputKeys(node);
    expect(keys).toHaveLength(1);
    return keys[0];
}

export function getTheOnlyOutputKey(node: PoseGraphNode) {
    const outputs = poseGraphOp.getOutputKeys(node);
    expect(outputs).toHaveLength(1);
    return outputs[0];
}

export function findInputKeyHavingDisplayName(node: PoseGraphNode, displayName: string) {
    const key = poseGraphOp.getInputKeys(node)
        .find((inputKey) => poseGraphOp.getInputMetadata(node, inputKey)?.displayName === displayName);
    expect(key).not.toBeUndefined();
    return key!;
}

export function checkZeroPose(pose: Pose) {
    for (let iTransform = 0; iTransform < pose.transforms.length; ++iTransform) {
        expect(pose.transforms.getPosition(iTransform, new Vec3())).toMatchObject({
            x: 0, y: 0, z: 0
        });
        expect(pose.transforms.getRotation(iTransform, new Quat())).toMatchObject({
            x: 0, y: 0, z: 0, w: 1,
        });
        expect(pose.transforms.getScale(iTransform, new Vec3())).toMatchObject({
            x: 0, y: 0, z: 0
        });
    }

    for (let iAuxiliaryCurve = 0; iAuxiliaryCurve < pose.auxiliaryCurves.length; ++iAuxiliaryCurve) {
        expect(pose.auxiliaryCurves[iAuxiliaryCurve]).toBe(0);
    }
}

export class UnimplementedPoseNode extends PoseNode {
    public settle(context: AnimationGraphSettleContext): void {
        
    }
    public reenter(): void {
        
    }

    public bind(context: AnimationGraphBindingContext): void {
    }

    protected doUpdate(context: AnimationGraphUpdateContext): void {
        
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        throw new Error("Method not implemented.");
    }
}

export class UnimplementedXNode extends XNode {
    public selfEvaluate(outputs: unknown[]): void {
        throw new Error("Method not implemented.");
    }
}