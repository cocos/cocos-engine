import { AuxiliaryCurveHandle } from "../../../../../cocos/animation/core/animation-handle";
import { Pose } from "../../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphEvaluationContext } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { AnimationGraph, VariableType } from "../../../../../cocos/animation/marionette/asset-creation";
import { Node } from "../../../../../cocos/scene-graph";
import { input } from "../../../../../cocos/animation/marionette/pose-graph/decorator/input";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import 'jest-extended';
import { poseGraphOp } from "../../../../../cocos/animation/marionette/pose-graph/op";
import { PoseGraphType } from "../../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { getTheOnlyInputKey, getTheOnlyOutputKey, UnimplementedPoseNode } from "../utils/misc";
import { PVNodeGetVariableFloat } from "../../../../../cocos/animation/marionette/pose-graph/pure-value-nodes/get-variable";

describe(`Pure value node`, () => {
    test(`Get number variable`, () => {
        class OutputNumberPoseNode extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.FLOAT })
            public value = 0.0;

            public bind(context: AnimationGraphBindingContext): void {
                this.#handle = context.bindAuxiliaryCurve('x');
            }

            protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
                const pose = context.pushDefaultedPose();
                pose.auxiliaryCurves[this.#handle!.index] = this.value;
                return pose;
            }
            
            #handle: AuxiliaryCurveHandle | null = null;
        }

        const animationGraph = new AnimationGraph();
        const layer = animationGraph.addLayer();
        const poseState = layer.stateMachine.addPoseState();
        const poseNodeMock = poseState.graph.addNode(new OutputNumberPoseNode());
        const getVar = poseState.graph.addNode(new PVNodeGetVariableFloat());
        getVar.variableName = '_x';
        const keys = poseGraphOp.getInputKeys(poseNodeMock);
        expect(keys).toHaveLength(1);
        poseGraphOp.connectNode(poseState.graph, poseNodeMock, keys[0], getVar, getTheOnlyOutputKey(getVar));
        poseGraphOp.connectNode(poseState.graph, poseState.graph.outputNode, getTheOnlyInputKey(poseState.graph.outputNode), poseNodeMock);
        layer.stateMachine.connect(layer.stateMachine.entryState, poseState);

        animationGraph.addVariable('_x', VariableType.FLOAT, 2.);

        const node = new Node();
        const evalMock = new AnimationGraphEvalMock(node, animationGraph);
        evalMock.step(0.2);
        expect(evalMock.controller.getAuxiliaryCurveValue_experimental('x')).toBe(2.);

        evalMock.controller.setValue('_x', 3.);
        evalMock.step(0.15);
        expect(evalMock.controller.getAuxiliaryCurveValue_experimental('x')).toBe(3.);
    });
});