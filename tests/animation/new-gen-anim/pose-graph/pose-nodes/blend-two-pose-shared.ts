import { PoseTransformSpace } from "../../../../../cocos/animation/core/pose";
import { PoseGraph } from "../../../../../cocos/animation/marionette/asset-creation";
import { PoseGraphType } from "../../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { poseGraphOp } from "../../../../../cocos/animation/marionette/pose-graph/op";
import { PoseNode } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { PVNodeGetVariableFloat } from "../../../../../cocos/animation/marionette/pose-graph/pure-value-nodes/get-variable";
import { PseudoRandomGenerator } from "../../../../utils/random";
import { BlendTwoOperator } from "../../utils/abstract-operators";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { createAnimationGraph } from "../../utils/factory";
import { PoseData_1tr_1aux } from "../../utils/pose-data-1tr-1aux";
import { PoseNode_ModifyDefaultPose } from "../utils/helping-nodes/pose-node-modify-default-pose";
import { composeInputKeyInternally, createPoseGraph, getTheOnlyOutputKey } from "../utils/misc";

export function includeTestsFor_BlendTwoPoseLike_PoseNode<TPoseNode extends PoseNode>(
    constructor: new () => TPoseNode,
    expectedPoseInput1KeyProp: keyof TPoseNode & string,
    expectedPoseInput2KeyProp: keyof TPoseNode & string,
    expectedRatioInputKeyProp: keyof TPoseNode & string,
    expectedOperator: BlendTwoOperator,
) {
    test(`Basic node structure`, () => {
        const poseGraph = createPoseGraph();
        const blendingNode = poseGraph.addNode(new constructor());

        // The blending node should have two pose input keys.
        const poseInputKeys = [expectedPoseInput1KeyProp, expectedPoseInput2KeyProp].map(composeInputKeyInternally);
        for (const poseInputKey of poseInputKeys) {
            const inputMetadata = poseGraphOp.getInputMetadata(blendingNode, poseInputKey);
            expect(inputMetadata).not.toBeUndefined();
            expect(inputMetadata!.type).toBe(PoseGraphType.POSE);
        }

        // The binding node should have a float ratio input key.
        const ratioInputKey = composeInputKeyInternally(expectedRatioInputKeyProp);
        {
            const inputMetadata = poseGraphOp.getInputMetadata(blendingNode, ratioInputKey);
            expect(inputMetadata).not.toBeUndefined();
            expect(inputMetadata!.type).toBe(PoseGraphType.FLOAT);
        }
    });

    test(`Ratio`, () => {
        const g = new PseudoRandomGenerator(10086);

        const fixture = {
            initial_ratio: g.range01(),

            blend_input_data_1: PoseData_1tr_1aux.generate(() => g.range01()),

            blend_input_data_2: PoseData_1tr_1aux.generate(() => g.range01()),
        };

        const fillPoseGraph = (poseGraph: PoseGraph) => {
            const blendingNode = poseGraph.addNode(new constructor());
            
            const inputPose1 = poseGraph.addNode(new PoseNode_ModifyDefaultPose(
                PoseTransformSpace.LOCAL, fixture.blend_input_data_1.toPoseRecord()));

            const inputPose2 = poseGraph.addNode(new PoseNode_ModifyDefaultPose(
                PoseTransformSpace.LOCAL, fixture.blend_input_data_2.toPoseRecord()));

            const ratioInput = poseGraph.addNode(new PVNodeGetVariableFloat());
            ratioInput.variableName = 'v_ratio';

            poseGraphOp.connectNode(poseGraph, blendingNode, composeInputKeyInternally(expectedPoseInput1KeyProp), inputPose1);
            poseGraphOp.connectNode(poseGraph, blendingNode, composeInputKeyInternally(expectedPoseInput2KeyProp), inputPose2);
            poseGraphOp.connectNode(poseGraph, blendingNode, composeInputKeyInternally(expectedRatioInputKeyProp), ratioInput, getTheOnlyOutputKey(ratioInput));
            poseGraphOp.connectOutputNode(poseGraph, blendingNode);
        };

        const graph = createAnimationGraph({
            variableDeclarations: {
                'v_ratio': { type: 'float', value: fixture.initial_ratio },
            },
            layers: [{
                stateMachine: {
                    states: { s: { type: 'procedural', graph: fillPoseGraph } },
                    entryTransitions: [{ to: 's' }],
                },
            }],
        });

        const node = PoseData_1tr_1aux.createHierarchy();
        const evalMock = new AnimationGraphEvalMock(node, graph);

        const checkIfResultMatchesRatio = (ratio: number) => PoseData_1tr_1aux.checkEqual(
            // The actual.
            PoseData_1tr_1aux.getResult(node, evalMock.controller),
            // The expected.
            PoseData_1tr_1aux.applyBlendTwoOperator(
                fixture.blend_input_data_1, fixture.blend_input_data_2, ratio,
                expectedOperator,
            ),
        );

        evalMock.step(0.2);
        checkIfResultMatchesRatio(fixture.initial_ratio);

        for (const ratio of [
            0.0,
            0.3,
            0.5,
            0.9,
            1.0,
        ]) {
            evalMock.controller.setValue('v_ratio', ratio);
            evalMock.step(0.1);
            checkIfResultMatchesRatio(ratio);
        }
    });
}
