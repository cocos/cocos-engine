import { TransformHandle } from '../../../../cocos/animation/core/animation-handle';
import { Pose, PoseTransformSpace } from '../../../../cocos/animation/core/pose';
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from '../../../../cocos/animation/marionette/animation-graph-context';
import { Node } from '../../../../cocos/scene-graph';
import { assertIsTrue, Mat4, Quat, Vec3 } from '../../../../exports/base';
import { PoseNode, PoseTransformSpaceRequirement } from './../../../../cocos/animation/marionette/pose-graph/pose-node';
import { input } from '../../../../cocos/animation/marionette/pose-graph/decorator/input';
import { PoseGraphType } from '../../../../cocos/animation/marionette/pose-graph/foundation/type-system';
import { AnimationGraph } from '../../../../cocos/animation/marionette/animation-graph';
import { PoseGraph, poseGraphOp } from '../../../../cocos/animation/marionette/asset-creation';
import { getTheOnlyInputKey, getTheOnlyOutputKey } from './utils/misc';
import { AnimationGraphEvalMock } from '../utils/eval-mock';
import { Transform } from '../../../../cocos/animation/core/transform';
import { TransformSpace } from '../../../../cocos/animation/marionette/pose-graph/pose-nodes/transform-space';
import { generateHierarchyFixture } from '../utils/hierarchy-fixture';
import { PoseNode_MapPoseRecord } from './utils/helping-nodes/pose-node-map-pose-record';
import { PoseNode_ModifyDefaultPose } from './utils/helping-nodes/pose-node-modify-default-pose';
import { PoseRecord } from '../utils/pose-record';

describe(`Pose transform space`, () => {
    describe(`Pushing default poses`, () => {
        test.each([
            [`EvaluationContext.pushDefaultPose() yielding local space default pose`, PoseTransformSpace.LOCAL],
            [`EvaluationContext.pushDefaultedPoseInComponentSpace() yielding component space default pose`, PoseTransformSpace.COMPONENT],
        ])('%s', (_title, space) => {
            const fixture = {
                hierarchy: generateHierarchyFixture(),
            };

            const animationGraph = createPoseNodeRunner((poseGraph) => {
                return poseGraph.addNode(new PoseNode_Check_EvaluationContext_pushDefaultPose(
                    space,
                    space === PoseTransformSpace.LOCAL
                        ? fixture.hierarchy.getInitialLocalSpacePoseRecord()
                        : fixture.hierarchy.getInitialComponentSpacePoseRecord(),
                ));;
            });
    
            const evalMock = new AnimationGraphEvalMock(fixture.hierarchy.origin, animationGraph);
            evalMock.step(0.2);
        });
    });

    describe(`PoseNode.evaluate() converts spaces`, () => {
        test.each([
            ['Local -> Local', PoseTransformSpace.LOCAL, PoseTransformSpaceRequirement.LOCAL],
            ['Local -> Component', PoseTransformSpace.LOCAL, PoseTransformSpaceRequirement.COMPONENT],
            ['Local -> No', PoseTransformSpace.LOCAL, PoseTransformSpaceRequirement.NO],

            ['Component -> Component', PoseTransformSpace.COMPONENT, PoseTransformSpaceRequirement.COMPONENT],
            ['Component -> Local', PoseTransformSpace.COMPONENT, PoseTransformSpaceRequirement.LOCAL],
            ['Component -> No', PoseTransformSpace.COMPONENT, PoseTransformSpaceRequirement.NO],
        ])(`%s`, (_, inSpace: PoseTransformSpace, requiringSpace: PoseTransformSpaceRequirement) => {
            const fixture = {
                hierarchy: generateHierarchyFixture(),
            };

            const {
                localSpace: localSpacePoseRecord,
                componentSpace: componentSpaceRecord,
            } = fixture.hierarchy.generateRandomPose();

            const inSpaceRecord = inSpace === PoseTransformSpace.LOCAL ? localSpacePoseRecord : componentSpaceRecord;

            const expectedOutSpaceRecord = requiringSpace === PoseTransformSpaceRequirement.LOCAL
                ? localSpacePoseRecord
                : requiringSpace === PoseTransformSpaceRequirement.COMPONENT
                    ? componentSpaceRecord
                    : inSpaceRecord;

            const animationGraph = createPoseNodeRunner((poseGraph) => {
                // Add a node which modifying default pose according to our specified.
                const producerNode = poseGraph.addNode(new PoseNode_ModifyDefaultPose(
                    inSpace,
                    inSpaceRecord,
                ));

                // Add a node which take the producer node and invoke `producerNode.evaluate()` according to the out space.
                const consumerNode = poseGraph.addNode(new PoseNode_Check_PoseNode_evaluate(
                    requiringSpace,
                    expectedOutSpaceRecord,
                ));

                poseGraphOp.connectNode(poseGraph, consumerNode, getTheOnlyInputKey(consumerNode), producerNode, getTheOnlyOutputKey(consumerNode));

                return consumerNode;
            });
    
            const evalMock = new AnimationGraphEvalMock(fixture.hierarchy.origin, animationGraph);
            evalMock.step(0.2);
        });
    });

    describe(`Pose Transform Space <=> Transform Space`, () => {
        const specPoseTransformToTargetSpace: readonly [
            poseSpace: PoseTransformSpace,
            transformSpace: TransformSpace,
            calcExpectedApplyingTransform: (hierarchy: ReturnType<typeof generateHierarchyFixture>, localSpacePoseRecord: PoseRecord, nodeName: string) => Transform,
        ][] = [
            // * -> World
            [PoseTransformSpace.COMPONENT, TransformSpace.WORLD,
                (hierarchy) => hierarchy.getComponentToWorldTransform(),
            ],
            [PoseTransformSpace.LOCAL, TransformSpace.WORLD, (hierarchy, localSpacePoseRecord, nodeName) => {
                return Transform.multiply(new Transform(),
                    hierarchy.getComponentToWorldTransform(), // Component -> World
                    hierarchy.computeComponentSpaceTransform( // Local -> Component
                        localSpacePoseRecord,
                        hierarchy.getParentNodeName(nodeName),
                    ),
                );
            }],

            // * -> Component
            [PoseTransformSpace.COMPONENT, TransformSpace.COMPONENT, () => Transform.IDENTITY as Transform],
            [PoseTransformSpace.LOCAL, TransformSpace.COMPONENT, (hierarchy, localSpacePoseRecord, nodeName) => {
                return hierarchy.computeComponentSpaceTransform(
                    localSpacePoseRecord,
                    hierarchy.getParentNodeName(nodeName),
                );
            }],

            // * -> Parent
            [PoseTransformSpace.COMPONENT, TransformSpace.PARENT, (hierarchy, localSpacePoseRecord, nodeName) => {
                return Transform.invert(new Transform(), hierarchy.computeComponentSpaceTransform(
                    localSpacePoseRecord,
                    hierarchy.getParentNodeName(nodeName),
                ));
            }],
            [PoseTransformSpace.LOCAL, TransformSpace.PARENT, () => Transform.IDENTITY as Transform],

            // * -> Local
            [PoseTransformSpace.LOCAL, TransformSpace.LOCAL, (hierarchy, localSpacePoseRecord, nodeName) => {
                return Transform.invert(new Transform(), localSpacePoseRecord.transforms[nodeName]);
            }],
            [PoseTransformSpace.COMPONENT, TransformSpace.LOCAL, (hierarchy, localSpacePoseRecord, nodeName) => {
                return Transform.invert(new Transform(), hierarchy.computeComponentSpaceTransform(
                    localSpacePoseRecord,
                    nodeName,
                ));
            }],
        ];

        describe(`PoseNode._convertPoseSpaceTransformToTargetSpace()`, () => {
    
            const specs = specPoseTransformToTargetSpace.map(([poseTransformSpace, transformSpace, ...remain]) => {
                return [
                    `${PoseTransformSpace[poseTransformSpace]} => ${TransformSpace[transformSpace]}`,
                    poseTransformSpace,
                    transformSpace,
                    ...remain,
                ] as const;
            });
    
            test.each(specs)(`Conversion: %s`, (_, poseSpace, outSpace, calcExpectedAppliedTransformOf) => {
                const fixture = {
                    hierarchy: generateHierarchyFixture(),
                };
        
                const {
                    localSpace: localSpacePoseRecord,
                    componentSpace: componentSpacePoseRecord,
                } = fixture.hierarchy.generateRandomPose();

                const poseRecord = poseSpace === PoseTransformSpace.LOCAL ? localSpacePoseRecord : componentSpacePoseRecord;
    
                const nodesToTest = ['Middle 1.2.1', 'Root 1', 'Leaf 1.2.1.1'];
    
                for (const nodeToTest of nodesToTest) {
                    const expectedAppliedTransform = calcExpectedAppliedTransformOf(fixture.hierarchy, localSpacePoseRecord, nodeToTest);

                    const inTransform = new Transform();
                    inTransform.position = new Vec3(0.512, -7.89, 4.13);
    
                    const animationGraph = createPoseNodeRunner((poseGraph) => {
                        return poseGraph.addNode(new PoseNode_Check_EvaluationContext_convertPoseSpaceTransformToTargetSpace(
                            poseSpace,
                            poseRecord,
                            inTransform,
                            outSpace,
                            expectedAppliedTransform,
                            nodeToTest,
                        ));
                    });
        
                    const evalMock = new AnimationGraphEvalMock(fixture.hierarchy.origin, animationGraph);
                    evalMock.step(0.2);
                }
            });
        });
    
        describe(`PoseNode._convertTransformToPoseTransformSpace()`, () => {
            const specs = specPoseTransformToTargetSpace.map(([poseTransformSpace, transformSpace, calc]) => {
                return [
                    `${TransformSpace[transformSpace]} => ${PoseTransformSpace[poseTransformSpace]}`,
                    transformSpace,
                    poseTransformSpace,
                    (...args: Parameters<typeof calc>) => Transform.invert(new Transform(), calc(...args)),
                ] as const;
            });
    
            test.each(specs)(`Conversion: %s`, (_, inSpace, poseSpace, calcExpectedAppliedTransformOf) => {
                const fixture = {
                    hierarchy: generateHierarchyFixture(),
                };
        
                const {
                    localSpace: localSpacePoseRecord,
                    componentSpace: componentSpacePoseRecord,
                } = fixture.hierarchy.generateRandomPose();

                const poseRecord = poseSpace === PoseTransformSpace.LOCAL ? localSpacePoseRecord : componentSpacePoseRecord;
    
                const nodesToTest = ['Middle 1.2.1', 'Root 1', 'Leaf 1.2.1.1'];
    
                for (const nodeToTest of nodesToTest) {
                    const expectedAppliedTransform = calcExpectedAppliedTransformOf(fixture.hierarchy, localSpacePoseRecord, nodeToTest);
    
                    const inTransform = new Transform();
                    inTransform.position = new Vec3(0.512, -7.89, 4.13);
    
                    const animationGraph = createPoseNodeRunner((poseGraph) => {
                        return poseGraph.addNode(new PoseNode_Check_EvaluationContext_convertTransformToPoseTransformSpace(
                            poseSpace,
                            poseRecord,
                            inTransform,
                            inSpace,
                            expectedAppliedTransform,
                            nodeToTest,
                        ));
                    });
        
                    const evalMock = new AnimationGraphEvalMock(fixture.hierarchy.origin, animationGraph);
                    evalMock.step(0.2);
                }
            });
        });
    });
});

function createPoseNodeRunner(setup: (poseGraph: PoseGraph) => PoseNode) {
    const animationGraph = new AnimationGraph();
    const layer = animationGraph.addLayer();
    const proceduralPoseState = layer.stateMachine.addProceduralPoseState();
    const mainNode = setup(proceduralPoseState.graph);
    poseGraphOp.connectOutputNode(proceduralPoseState.graph, mainNode);
    layer.stateMachine.connect(layer.stateMachine.entryState, proceduralPoseState);
    return animationGraph;
}

/**
 * A pose node checking the result pose of `EvaluationContext.pushDefaultPose()` or `EvaluationContext.pushDefaultedPoseInComponentSpace()` during evaluation.
 */
class PoseNode_Check_EvaluationContext_pushDefaultPose extends PoseNode_MapPoseRecord {
    constructor(
        private _space: PoseTransformSpace,
        record: PoseRecord,
    ) {
        super(record);
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        expect(this.transformHandleMap).not.toBeUndefined();
        const pose = this._space === PoseTransformSpace.LOCAL
            ? context.pushDefaultedPose()
            : context.pushDefaultedPoseInComponentSpace();
        for (const [handle, expectedTransform] of this.transformHandleMap!) {
            const actualTransform = pose.transforms.getTransform(handle.index, new Transform());
            expect(Transform.equals(actualTransform, expectedTransform)).toBe(true);
        }
        return pose;
    }
}

/**
 * A pose node checking the result pose of `PoseNode.evaluate` during evaluation.
 */
class PoseNode_Check_PoseNode_evaluate extends PoseNode_MapPoseRecord {
    constructor(
        private _spaceRequirement: PoseTransformSpaceRequirement,
        expectedPoseRecord: PoseRecord,
    ) {
        super(expectedPoseRecord);
    }

    @input({ type: PoseGraphType.POSE })
    input: PoseNode | null = null;

    public bind(context: AnimationGraphBindingContext): void {
        super.bind(context);
        expect(this.input).not.toBeNull();
        this.input!.bind(context);
    }

    public settle(context: AnimationGraphSettleContext): void {
        super.settle(context);
        expect(this.input).not.toBeNull();
        this.input!.settle(context);
    }

    public reenter(): void {
        super.reenter();
        expect(this.input).not.toBeNull();
        this.input!.reenter();
    }

    protected doUpdate(context: AnimationGraphUpdateContext): void {
        super.doUpdate(context);
        expect(this.input).not.toBeNull();
        this.input!.update(context);
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        expect(this.input).not.toBeNull();
        const pose = this.input!.evaluate(context, this._spaceRequirement);
        expect(this.transformHandleMap).not.toBeUndefined();
        for (const [transformHandle, expectedTransform] of this.transformHandleMap!) {
            expect(Transform.equals(
                pose.transforms.getTransform(transformHandle.index, new Transform()),
                expectedTransform,
            )).toBe(true);
        }
        return pose;
    }
};

/**
 * A pose node checking the result pose of `EvaluationContext._convertPoseSpaceTransformToTargetSpace` during evaluation.
 */
class PoseNode_Check_EvaluationContext_convertPoseSpaceTransformToTargetSpace extends PoseNode_ModifyDefaultPose {
    constructor(
        poseSpace: PoseTransformSpace,
        record: PoseRecord,
        private _inTransform: Transform,
        private _outTransformSpace: TransformSpace,
        private _expectedApplyingOutTransform: Transform,
        private _targetNodeName: string,
    ) {
        super(poseSpace, record);
    }

    bind(context: AnimationGraphBindingContext) {
        super.bind(context);
        this._targetNodeHandle = context.bindTransformByName(this._targetNodeName) ?? undefined;
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        expect(this._targetNodeHandle).not.toBeUndefined();
        const pose = super.doEvaluate(context);

        const actualOutTransform = Transform.clone(this._inTransform);
        context._convertPoseSpaceTransformToTargetSpace(
            actualOutTransform,
            this._outTransformSpace,
            pose,
            this._targetNodeHandle!.index,
        );

        const expectedOutTransform = Transform.clone(this._inTransform);
        Transform.multiply(expectedOutTransform, this._expectedApplyingOutTransform, expectedOutTransform);

        expect(Transform.equals(actualOutTransform, expectedOutTransform)).toBe(true);
        return pose;
    }

    private _targetNodeHandle: TransformHandle | undefined = undefined;
}

/**
 * A pose node checking the result pose of `EvaluationContext._convertTransformToPoseTransformSpace` during evaluation.
 */
class PoseNode_Check_EvaluationContext_convertTransformToPoseTransformSpace extends PoseNode_ModifyDefaultPose {
    constructor(
        poseSpace: PoseTransformSpace,
        record: PoseRecord,
        private _inTransform: Transform,
        private _inTransformSpace: TransformSpace,
        private _expectedApplyingOutTransform: Transform,
        private _targetNodeName: string,
    ) {
        super(poseSpace, record);
    }

    bind(context: AnimationGraphBindingContext) {
        super.bind(context);
        this._targetNodeHandle = context.bindTransformByName(this._targetNodeName) ?? undefined;
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        expect(this._targetNodeHandle).not.toBeUndefined();
        const pose = super.doEvaluate(context);

        const actualOutTransform = Transform.clone(this._inTransform);
        context._convertTransformToPoseTransformSpace(
            actualOutTransform,
            this._inTransformSpace,
            pose,
            this._targetNodeHandle!.index,
        );

        const expectedOutTransform = Transform.clone(this._inTransform);
        Transform.multiply(expectedOutTransform, this._expectedApplyingOutTransform, expectedOutTransform);

        expect(Transform.equals(actualOutTransform, expectedOutTransform)).toBe(true);
        return pose;
    }

    private _targetNodeHandle: TransformHandle | undefined = undefined;
}
