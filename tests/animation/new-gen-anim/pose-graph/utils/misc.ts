import { AnimationGraph } from "../../../../../cocos/animation/marionette/asset-creation";
import { poseGraphOp } from "../../../../../cocos/animation/marionette/pose-graph/op";
import { PoseGraphNode } from "../../../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import { Pose } from "../../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext, AnimationGraphSettleContext, AnimationGraphUpdateContext } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { assertIsTrue, Quat, Vec3 } from "../../../../../exports/base";
import { PoseNode } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { PureValueNode } from "../../../../../cocos/animation/marionette/pose-graph/pure-value-node";
import { PoseGraphType } from "../../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { PVNodeGetVariableBoolean, PVNodeGetVariableFloat } from "../../../../../cocos/animation/marionette/pose-graph/pure-value-nodes/get-variable";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";

export function normalizeNodeInputMetadata(nodeInputMetadata?: poseGraphOp.InputMetadata) {
    return nodeInputMetadata ? {
        deletable: false,
        insertPoint: false,
        ...nodeInputMetadata
    } : undefined;
}

export function createPoseGraph() {
    return new AnimationGraph().addLayer().stateMachine.addProceduralPoseState().graph;
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

export function getTheOnlyOutputKey2(node: PoseGraphNode) {
    return [node, getTheOnlyOutputKey(node)] as const;
}

export function composeInputKeyInternally(propertyName: string, elementIndex?: number): poseGraphOp.InputKey {
    const result: [string, number?] = [propertyName];
    if (typeof elementIndex === 'number') {
        result.push(elementIndex);
    }
    assertIsTrue(poseGraphOp.isWellFormedInputKey(result));
    return result;
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

export class UnimplementedPVNode extends PureValueNode {
    public selfEvaluate(outputs: unknown[]): void {
        throw new Error("Method not implemented.");
    }
}

export function createVariableGettingNode(type: PoseGraphType, varName: string) {
    let result: PVNodeGetVariableFloat | PVNodeGetVariableBoolean;
    switch (type) {
        case PoseGraphType.FLOAT:
            result = new PVNodeGetVariableFloat();
            break;
        case PoseGraphType.BOOLEAN:
            result = new PVNodeGetVariableBoolean();
            break;
        default:
            throw new Error(`Unrecognized pose graph type: ${type}`);
    }
    result.variableName = varName;
    return result;
}
