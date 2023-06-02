import { TransformHandle } from "../../../../../cocos/animation/core/animation-handle";
import { Pose, PoseTransformSpace } from "../../../../../cocos/animation/core/pose";
import { Transform } from "../../../../../cocos/animation/core/transform";
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { AnimationGraph, PoseGraph, poseGraphOp, PoseNode } from "../../../../../cocos/animation/marionette/asset-creation";
import { PoseTransformSpaceRequirement } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { PoseNodeModifyPoseBase, TransformModificationQueue } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/modify-pose-base";
import { Node } from "../../../../../exports/base";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { generateHierarchyFixture } from "../../utils/hierarchy-fixture";
import { PoseRecord } from "../../utils/pose-record";
import { PoseNode_ModifyDefaultPose } from "../utils/helping-nodes/pose-node-modify-default-pose";
import { getTheOnlyInputKey, getTheOnlyOutputKey } from "../utils/misc";

describe(`Base PoseNode PoseNodeModifyPoseBase`, () => {
    const hierarchyLeafNodeIds = [
        '1.2.2.1.2',
    ];

    describe(`Modification queue`, () => {
        test(`No effect if modifier queue is empty`, () => {
            const hierarchy = generateHierarchyFixture(hierarchyLeafNodeIds);

            const {
                componentSpace: poseRecordComponentSpace,
                localSpace: poseRecordLocalSpace,
            } = hierarchy.generateRandomPose();

            const evalMock = createPoseModifierNodeRunner(hierarchy.origin, poseRecordLocalSpace, (poseGraph) => {
                return poseGraph.addNode(new PoseNode_CommitSpecifiedModifications([]));
            });

            evalMock.step(0.2);
        });

        test(`Should throw in debug mode if the modification is queued in unexpected order`, () => {
            const hierarchy = generateHierarchyFixture(hierarchyLeafNodeIds);

            const {
                componentSpace: poseRecordComponentSpace,
                localSpace: poseRecordLocalSpace,
            } = hierarchy.generateRandomPose();

            expect(() => {
                createPoseModifierNodeRunner(hierarchy.origin, poseRecordLocalSpace, (poseGraph) => {
                    return poseGraph.addNode(new PoseNode_CommitSpecifiedModifications([
                        [hierarchy.getNodeNameById('1.2.1.1')!, new Transform()],
                        [hierarchy.getNodeNameById('1.2.1')!, new Transform()],
                    ]));
                }).step(0.2);
            }).toThrowError();

            expect(() => {
                createPoseModifierNodeRunner(hierarchy.origin, poseRecordLocalSpace, (poseGraph) => {
                    return poseGraph.addNode(new PoseNode_CommitSpecifiedModifications([
                        [hierarchy.getNodeNameById('1.2.1.1')!, new Transform()],
                        [hierarchy.getNodeNameById('1.2.1.1')!, new Transform()],
                    ]));
                }).step(0.2);
            }).toThrowError();
        });

        test(`Modify multiple transform`, () => {
            const hierarchy = generateHierarchyFixture(hierarchyLeafNodeIds);

            const {
                componentSpace: poseRecordComponentSpace,
                localSpace: poseRecordLocalSpace,
            } = hierarchy.generateRandomPose();

            const modifications: [string, Transform][] = [];

            const evalMock = createPoseModifierNodeRunner(hierarchy.origin, poseRecordLocalSpace, (poseGraph) => {
                return poseGraph.addNode(new PoseNode_CommitSpecifiedModifications(modifications));
            });

            evalMock.step(0.2);
        });
    });
});

function createPoseModifierNodeRunner(node: Node, inputPoseRecordLocalSpace: PoseRecord, setup: (poseGraph: PoseGraph) => PoseNode) {
    return createPoseGraphRunner(node, (poseGraph) => {
        const input = poseGraph.addNode(new PoseNode_ModifyDefaultPose(PoseTransformSpace.COMPONENT, inputPoseRecordLocalSpace));
        const modifier = setup(poseGraph);
        poseGraphOp.connectNode(poseGraph, modifier, getTheOnlyInputKey(modifier), input, getTheOnlyOutputKey(input));
        return modifier;
    });
}

function createPoseGraphRunner(node: Node, setup: (poseGraph: PoseGraph) => PoseNode) {
    const animationGraph = new AnimationGraph();
    const layer = animationGraph.addLayer();
    const proceduralPoseState = layer.stateMachine.addProceduralPoseState();
    const mainNode = setup(proceduralPoseState.graph);
    poseGraphOp.connectOutputNode(proceduralPoseState.graph, mainNode);
    layer.stateMachine.connect(layer.stateMachine.entryState, proceduralPoseState);
    const evalMock = new AnimationGraphEvalMock(node, animationGraph);
    evalMock.step(0.2);
    return evalMock;
}

class PoseNode_CommitSpecifiedModifications extends PoseNodeModifyPoseBase {
    constructor(private _modifications: [string, Transform][]) {
        super();
    }

    public bind(context: AnimationGraphBindingContext) {
        super.bind(context);
        this._boundModifications = this._modifications.map(([nodeName, transform]) => {
            const handle = context.bindTransformByName(nodeName);
            expect(handle).not.toBeNull();
            return [handle!, transform];
        });
    }

    protected getPoseTransformSpaceRequirement(): PoseTransformSpaceRequirement {
        return PoseTransformSpaceRequirement.COMPONENT;
    }

    protected modifyPose(context: AnimationGraphEvaluationContext, pose: Pose, modificationQueue: TransformModificationQueue) {
        for (const [{ index: transformIndex }, transform] of this._boundModifications) {
            modificationQueue.push(transformIndex, transform);
        }
    }

    private _boundModifications: [TransformHandle, Transform][] = [];
}
