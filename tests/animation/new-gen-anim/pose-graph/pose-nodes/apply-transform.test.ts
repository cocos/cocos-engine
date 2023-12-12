import { Transform } from "../../../../../cocos/animation/core/transform";
import { PoseGraph, poseGraphOp } from "../../../../../cocos/animation/marionette/asset-creation";
import { PoseNodeApplyTransform, TransformOperation } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/apply-transform";
import { TransformSpace } from "../../../../../cocos/animation/marionette/pose-graph/pose-nodes/transform-space";
import { Node, Quat, Vec3 } from "../../../../../exports/base";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { createAnimationGraph } from "../../utils/factory";
import '../../../../utils/matchers/value-type-asymmetric-matchers';
import '../../../utils/transform-matcher';
import { getMagicSeed, PseudoRandomGenerator } from '../../../../utils/random';
import { PoseNode, PoseTransformSpaceRequirement } from "../../../../../cocos/animation/marionette/pose-graph/pose-node";
import { Pose } from "../../../../../cocos/animation/core/pose";
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from "../../../../../cocos/animation/marionette/animation-graph-context";
import { input } from "../../../../../cocos/animation/marionette/pose-graph/decorator/input";
import { PoseGraphType } from "../../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { composeInputKeyInternally } from "../utils/misc";

describe(`PoseNodeApplyTransform`, () => {
    describe(`Position`, () => {
        const g = new PseudoRandomGenerator(getMagicSeed());

        const SIMPLE_INPUTS = true;

        const fixture = SIMPLE_INPUTS
            ? (() => {
                return {
                    originTransform: createTransformFromPRS({ position: new Vec3(0.1, 0.2, 0.3) }),
                    parentLocalTransforms: [createTransformFromPRS({ position: new Vec3(1, 2, 3) })],
                    localTransform: createTransformFromPRS({ position: new Vec3(4, 5, 6) }),
                    positionValue: Vec3.ZERO,
                    intensityValue: 1.0,
                };
            })()
            : (() => {
                return {
                    originTransform: generateRandomTransform(g),
                    parentLocalTransforms: [generateRandomTransform(g)],
                    localTransform: generateRandomTransform(g),
                    positionValue: new Vec3(g.finite(), g.finite(), g.finite()),
                    intensityValue: g.range01(),
                };
            })();

        describe(`Override`, () => {
            const replacePositionInSpace = (space: TransformSpace) => {
                const result = runPoseNodeApplyTransform(
                    fixture.originTransform,
                    fixture.parentLocalTransforms,
                    fixture.localTransform,
                    {
                        position: {
                            value: fixture.positionValue,
                            operation: TransformOperation.REPLACE,
                        },
                        intensity: fixture.intensityValue,
                        transformSpace: space,
                    },
                );
    
                return result;
            };

            test(`World`, () => {
                const result = replacePositionInSpace(TransformSpace.WORLD);
                expect(result.worldPosition).toBeCloseToVec3(Vec3.lerp(
                    new Vec3(),
                    multiplyTransforms(
                        fixture.originTransform,
                        ...fixture.parentLocalTransforms,
                        fixture.localTransform,
                    ).position,
                    fixture.positionValue,
                    fixture.intensityValue,
                ));
            });
            test(`Component`, () => {
                const result = replacePositionInSpace(TransformSpace.COMPONENT);
                expect(result.worldPosition).toBeCloseToVec3(multiplyTransforms(
                    fixture.originTransform,
                    createTransformFromPRS({
                        position: Vec3.lerp(
                            new Vec3(),
                            multiplyTransforms(
                                ...fixture.parentLocalTransforms,
                                fixture.localTransform,
                            ).position,
                            fixture.positionValue,
                            fixture.intensityValue,
                        ),
                    }),
                ).position);
            });
            test(`Parent`, () => {
                const result = replacePositionInSpace(TransformSpace.PARENT);
                expect(result.worldPosition).toBeCloseToVec3(multiplyTransforms(
                    fixture.originTransform,
                    ...fixture.parentLocalTransforms,
                    createTransformFromPRS({
                        position: Vec3.lerp(
                            new Vec3(),
                            fixture.localTransform.position,
                            fixture.positionValue,
                            fixture.intensityValue,
                        ),
                        rotation: fixture.localTransform.rotation,
                        scale: fixture.localTransform.scale,
                    }),
                ).position);
            });
            test(`Local`, () => {
                const result = replacePositionInSpace(TransformSpace.LOCAL);
                expect(result.worldPosition).toBeCloseToVec3(multiplyTransforms(
                    fixture.originTransform,
                    ...fixture.parentLocalTransforms,
                    fixture.localTransform,
                    createTransformFromPRS({
                        position: Vec3.lerp(
                            new Vec3(),
                            Vec3.ZERO,
                            fixture.positionValue,
                            fixture.intensityValue,
                        ),
                    }),
                ).position);
            });
        });

        describe(`Additive`, () => {
            const addPositionInSpace = (space: TransformSpace) => {
                const result = runPoseNodeApplyTransform(
                    fixture.originTransform,
                    fixture.parentLocalTransforms,
                    fixture.localTransform,
                    {
                        position: {
                            value: fixture.positionValue,
                            operation: TransformOperation.ADD,
                        },
                        intensity: fixture.intensityValue,
                        transformSpace: space,
                    },
                );
    
                return result;
            };

            test(`World`, () => {
                const result = addPositionInSpace(TransformSpace.WORLD);
                expect(result.worldPosition).toBeCloseToVec3(Vec3.scaleAndAdd(
                    new Vec3(),
                    multiplyTransforms(
                        fixture.originTransform,
                        ...fixture.parentLocalTransforms,
                        fixture.localTransform,
                    ).position,
                    fixture.positionValue,
                    fixture.intensityValue,
                ));
            });
            test(`Component`, () => {
                const result = addPositionInSpace(TransformSpace.COMPONENT);
                const inputComponentTransform = multiplyTransforms(
                    ...fixture.parentLocalTransforms,
                    fixture.localTransform,
                );
                expect(result.worldPosition).toBeCloseToVec3(
                    multiplyTransforms(
                        fixture.originTransform,
                        createTransformFromPRS({
                            position: Vec3.scaleAndAdd(new Vec3(), inputComponentTransform.position, fixture.positionValue, fixture.intensityValue),
                            rotation: inputComponentTransform.rotation,
                            scale: inputComponentTransform.scale,
                        }),
                    ).position,
                );
            });
            test(`Parent`, () => {
                const result = addPositionInSpace(TransformSpace.PARENT);
                expect(result.worldPosition).toBeCloseToVec3(multiplyTransforms(
                    fixture.originTransform,
                    ...fixture.parentLocalTransforms,
                    createTransformFromPRS({
                        position: Vec3.scaleAndAdd(new Vec3(), fixture.localTransform.position, fixture.positionValue, fixture.intensityValue),
                        rotation: fixture.localTransform.rotation,
                        scale: fixture.localTransform.scale,
                    }),
                ).position);
            });
            test(`Local`, () => {
                const result = addPositionInSpace(TransformSpace.LOCAL);
                expect(result.worldPosition).toBeCloseToVec3(multiplyTransforms(
                    fixture.originTransform,
                    ...fixture.parentLocalTransforms,
                    createTransformFromPRS({
                        position: Vec3.scaleAndAdd(new Vec3(),
                            fixture.localTransform.position,
                            multiplyTransforms(
                                createTransformFromPRS({ rotation: fixture.localTransform.rotation, scale: fixture.localTransform.scale }),
                                createTransformFromPRS({ position: fixture.positionValue })
                            ).position,
                            fixture.intensityValue,
                        ),
                        rotation: fixture.localTransform.rotation,
                        scale: fixture.localTransform.scale,
                    }),
                ).position);
            });
        });
    });
});

interface NodeProps {
    position?: {
        value: Readonly<Vec3>;
        operation: TransformOperation;
    };
    rotation?: {
        value: Readonly<Quat>,
        operation: TransformOperation,
    };
    transformSpace: TransformSpace,
    intensity: number;
}

function runPoseNodeApplyTransform(
    originTransform: Transform,
    parentNodeLocalTransforms: Transform[],
    localTransform: Transform,
    nodeProps: NodeProps,
) {
    const originNode = new Node(`Origin`);
    setNodeLocalTransform(originNode, originTransform);
    const parentNodes = parentNodeLocalTransforms.map((tr, index) => {
        const node = new Node(`Parent-${index}`);
        setNodeLocalTransform(node, tr);
        return node;
    });
    const applyingNode = new Node(`Applying`);
    setNodeLocalTransform(applyingNode, localTransform);
    const childNode = new Node(`Child`);
    const childLocalTransform = new Transform();
    childLocalTransform.position = new Vec3(1, 2, 3);
    childLocalTransform.rotation = Quat.fromEuler(new Quat(), 40, 50, 60);
    childLocalTransform.scale = Vec3.multiplyScalar(new Vec3(), Vec3.ONE, 7);
    setNodeLocalTransform(childNode, childLocalTransform);
    parentNodes.forEach((n, i) => {
        if (i === 0) {
            n.parent = originNode;
        } else {
            n.parent = parentNodes[i - 1];
        }
    });
    applyingNode.parent = parentNodes.length === 0 ? originNode : parentNodes[parentNodes.length - 1];
    childNode.parent = applyingNode;

    /**
     * To cover all conversion case, we do create the applying node twice
     * for same inputs but different space input pose(either a local space input pose or a component space input pose).
     * They should have same effect so we end up having an "asserts equal" node.
     */
    const createPoseGraph = (poseGraph: PoseGraph) => {
        const inputNode1 = poseGraph.addNode(new ConvertAsLocalInput());
        const applyingNode1 = createApplyingPoseNode();
        const inputNode2 = poseGraph.addNode(new ConvertAsComponentInput());
        const applyingNode2 = createApplyingPoseNode();
        const assertsNode = poseGraph.addNode(new AssertsEqualAndOutput());

        poseGraphOp.connectOutputNode(poseGraph, assertsNode);
        poseGraphOp.connectNode(poseGraph, assertsNode, composeInputKeyInternally('lhs'), applyingNode1);
        poseGraphOp.connectNode(poseGraph, assertsNode, composeInputKeyInternally('rhs'), applyingNode2);
        poseGraphOp.connectNode(poseGraph, applyingNode1, composeInputKeyInternally('pose'), inputNode1);
        poseGraphOp.connectNode(poseGraph, applyingNode2, composeInputKeyInternally('pose'), inputNode2);

        function createApplyingPoseNode() {
            const applyNode = poseGraph.addNode(new PoseNodeApplyTransform());
            applyNode.node = applyingNode.name;
            if (nodeProps.position) {
                Vec3.copy(applyNode.position, nodeProps.position.value);
                applyNode.positionOperation = nodeProps.position.operation;
            }
            if (nodeProps.rotation) {
                Quat.copy(applyNode.rotation, nodeProps.rotation.value);
                applyNode.rotationOperation = nodeProps.rotation.operation;
            }
            applyNode.transformSpace = nodeProps.transformSpace;
            applyNode.intensityValue = nodeProps.intensity;
            return applyNode;
        }
    };

    const animationGraph = createAnimationGraph({
        layers: [{
            stateMachine: {
                entryTransitions: [{ to: 'p' }],
                states: {
                    'p': {
                        type: 'procedural',
                        graph: createPoseGraph,
                    },
                },
            },
        }],
    });

    const evalMock = new AnimationGraphEvalMock(originNode, animationGraph);
    evalMock.step(0.1);

    //#region Basic checks.

    // Parent transforms shall not be affected.
    for (const [node, inputTransform] of [
        [originNode, originTransform] as const,
        ...parentNodes.map((node, i) => [node, parentNodeLocalTransforms[i]] as const),
    ]) {
        expect(getNodeLocalTransform(node)).toEqualTransform(inputTransform);
    }

    // Child local transforms shall not be affected.
    expect(getNodeLocalTransform(childNode)).toEqualTransform(childLocalTransform);

    // Applying node's scale shall not change.
    expect(applyingNode.scale).toBeCloseToVec3(localTransform.scale);
    // If position operation is "leave unchanged", the applying node's position shall not change.
    if (!nodeProps.position || nodeProps.position.operation === TransformOperation.LEAVE_UNCHANGED) {
        expect(applyingNode.position).toBeCloseToVec3(localTransform.position);
    }
    // So does rotation.
    if (!nodeProps.rotation || nodeProps.rotation.operation === TransformOperation.LEAVE_UNCHANGED) {
        expect(applyingNode.rotation).toBeCloseToQuat(localTransform.rotation);
    }

    //#endregion
    
    return {
        worldPosition: applyingNode.worldPosition,
        worldRotation: applyingNode.worldRotation,
    };
}

function setNodeLocalTransform(node: Node, tr: Transform) {
    node.position = tr.position;
    node.rotation = tr.rotation;
    node.scale = tr.scale;
}

function getNodeLocalTransform(node: Node) {
    const tr = new Transform();
    tr.position = node.position;
    tr.rotation = node.rotation;
    tr.scale = node.scale;
    return tr;
}

function getNodeWorldTransform(node: Node) {
    const tr = new Transform();
    tr.position = node.worldPosition;
    tr.rotation = node.worldRotation;
    tr.scale = node.worldScale;
    return tr;
}

function multiplyTransforms(
    ...transforms: readonly [...Transform[], Transform]
) {
    const result = Transform.clone(transforms[transforms.length - 1]);
    for (let i = transforms.length - 2; i >= 0; --i) {
        Transform.multiply(result, transforms[i], result);
    }
    return result;
}

function createTransformFromPRS(prs: { position?: Readonly<Vec3>; rotation?: Readonly<Quat>; scale?: Readonly<Vec3> }) {
    const tr = new Transform();
    if (prs.position) {
        tr.position = prs.position;
    }
    if (prs.rotation) {
        tr.rotation = prs.rotation;
    }
    if (prs.scale) {
        tr.scale = prs.scale;
    }
    return tr;
}

function generateRandomTransform(g: PseudoRandomGenerator) {
    return createTransformFromPRS({
        position: new Vec3(g.finite(), g.finite(), g.finite()),
        rotation: Quat.fromEuler(new Quat(), g.range(0, 360), g.range(0, 360), g.range(0, 360)),
        scale: Vec3.multiplyScalar(new Vec3(), Vec3.ONE, g.positive()),
    });
}

class ConvertAsLocalInput extends PoseNode {
    public bind(context: AnimationGraphBindingContext): void { }
    public settle(context: AnimationGraphSettleContext): void { }
    public reenter(): void { }
    protected doUpdate(context: AnimationGraphUpdateContext): void { }
    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        return context.pushDefaultedPose();
    }
}

class ConvertAsComponentInput extends PoseNode {
    public bind(context: AnimationGraphBindingContext): void { }
    public settle(context: AnimationGraphSettleContext): void { }
    public reenter(): void { }
    protected doUpdate(context: AnimationGraphUpdateContext): void { }
    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        return context.pushDefaultedPoseInComponentSpace();
    }
}

class AssertsEqualAndOutput extends PoseNode {
    @input({ type: PoseGraphType.POSE })
    lhs: PoseNode | null = null;

    @input({ type: PoseGraphType.POSE })
    rhs: PoseNode | null = null;

    public bind(context: AnimationGraphBindingContext): void {
        this.lhs?.bind(context);
        this.rhs?.bind(context);
    }

    public settle(context: AnimationGraphSettleContext): void {
        this.lhs?.settle(context);
        this.rhs?.settle(context);
    }

    public reenter(): void {
        this.lhs?.reenter();
        this.rhs?.reenter();
    }

    protected doUpdate(context: AnimationGraphUpdateContext): void {
        this.lhs?.update(context);
        this.rhs?.update(context);
    }

    protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
        const p1 = this.lhs!.evaluate(context, PoseTransformSpaceRequirement.LOCAL);
        const p2 = this.rhs!.evaluate(context, PoseTransformSpaceRequirement.LOCAL);
        const tr1 = new Transform();
        const tr2 = new Transform();
        for (let i = 0; i < p1.transforms.length; ++i) {
            p1.transforms.getTransform(i, tr1);
            p2.transforms.getTransform(i, tr2);
            expect(tr1).toEqualTransform(tr2);
        }
        context.popPose();
        return p1;
    }
}