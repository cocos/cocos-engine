import { Pose } from "../../../../cocos/animation/core/pose";
import { AnimationGraph, PoseGraph } from "../../../../cocos/animation/marionette/asset-creation";
import { assertIsTrue, lerp, quat, v3, Vec3 } from "../../../../cocos/core";
import { Node } from "../../../../cocos/scene-graph";
import { captureErrors, captureWarns } from '../../../utils/log-capture';
import { input } from "../../../../cocos/animation/marionette/pose-graph/decorator/input";
import 'jest-extended';
import { poseGraphOp } from "../../../../cocos/animation/marionette/pose-graph/op";
import { PoseGraphType } from "../../../../cocos/animation/marionette/pose-graph/foundation/type-system";
import { PoseGraphNode } from "../../../../cocos/animation/marionette/pose-graph/foundation/pose-graph-node";
import { AddNonFreestandingNodeError } from "../../../../cocos/animation/marionette/pose-graph/foundation/errors";
import { poseGraphCreateNodeFactory, poseGraphNodeAppearance, poseGraphNodeHide, poseGraphNodeCategory } from "../../../../cocos/animation/marionette/pose-graph/decorator/node";
import { PoseGraphNodeEditorMetadata, getPoseGraphNodeEditorMetadata } from "../../../../cocos/animation/marionette/pose-graph/foundation/authoring/node-authoring";
import { composeInputKeyInternally, createPoseGraph, getTheOnlyInputKey, getTheOnlyOutputKey, normalizeNodeInputMetadata, UnimplementedPoseNode, UnimplementedPVNode } from "./utils/misc";
import { PoseNode } from "../../../../cocos/animation/marionette/pose-graph/pose-node";
import { ccclass } from "../../../../cocos/core/data/class-decorator";
import { unregisterClass } from "../../../../cocos/core/utils/js-typed";
import { attr } from "../../../../cocos/core/data/utils/attribute";

describe(`Class PoseGraph`, () => {
    test(`Default`, () => {
        const graph = createPoseGraph();

        // By default, pose graph has no node.
        expect([...graph.nodes()]).toStrictEqual(expect.arrayContaining([
            graph.outputNode,
        ]));
    });

    test(`Add and remove node`, () => {
        const graph = createPoseGraph();

        // Add a node.
        const node = new UnimplementedPoseNode();
        graph.addNode(node);
        expect([...graph.nodes()]).toStrictEqual(expect.arrayContaining([
            graph.outputNode,
            node,
        ]));

        // Can not add a node twice.
        expect(() => graph.addNode(node)).toThrowError(AddNonFreestandingNodeError);

        // Add another node.
        const anotherNode = new UnimplementedPVNode([]);
        graph.addNode(anotherNode);
        expect([...graph.nodes()]).toStrictEqual(expect.arrayContaining([
            graph.outputNode,
            node,
            anotherNode,
        ]));

        // Remove a node.
        graph.removeNode(anotherNode);
        expect([...graph.nodes()]).toStrictEqual(expect.arrayContaining([
            graph.outputNode,
            node,
        ]));

        // The node removed can be later added again to node.
        graph.addNode(anotherNode);
        expect([...graph.nodes()]).toStrictEqual(expect.arrayContaining([
            graph.outputNode,
            node,
            anotherNode,
        ]));
        // Still don't add a node twice.
        expect(() => graph.addNode(anotherNode)).toThrowError(AddNonFreestandingNodeError);

        // Remove a pose which was marked as main.
        poseGraphOp.connectNode(graph, graph.outputNode, getTheOnlyInputKey(graph.outputNode), node);
        expect(poseGraphOp.getInputBinding(graph, graph.outputNode, getTheOnlyInputKey(graph.outputNode))).toStrictEqual(expect.objectContaining({
            producer: node,
            outputIndex: 0,
        }));
        graph.removeNode(node);
        expect([...graph.nodes()]).toStrictEqual(expect.arrayContaining([
            graph.outputNode,
            anotherNode,
        ]));
        expect(poseGraphOp.getInputBinding(graph, graph.outputNode, getTheOnlyInputKey(graph.outputNode))).toBeUndefined();
    });
});

describe(`Input decorator @input`, () => {
    // No need to test for now.
    // test.skip(`Should emit error if not string-named field`, () => {
    //     const tag = Symbol();

    //     const errorWatcher = captureErrors();

    //     class _Node extends PoseNode {
    //         @input({ type: PoseGraphType.POSE, })
    //         0: PoseNode | null = null;

    //         bind() { return unusedBind(); }
    //     }

    //     expect(errorWatcher.captured).toHaveLength(1);
    //     expect(errorWatcher.captured[0]).toMatchSnapshot();

    //     expect(getPoseInputFieldKeys(new _Node())).toHaveLength(0);

    //     errorWatcher.stop();
    // });

    test(`@input specifying pose input can be only applied to fields of subclasses of PoseNode`, () => {
        const errorWatcher = captureErrors();

        for (const define of [defineSubClassOfPoseGraphNode, defineOtherClass]) {
            define();

            expect(errorWatcher.captured).toHaveLength(1);
            expect(errorWatcher.captured[0]).toMatchObject([
                '@input specifying pose input can be only applied to fields of subclasses of PoseNode.',
            ]);
            
            errorWatcher.clear();
        }

        function defineSubClassOfPoseGraphNode() {
            class _Node extends PoseGraphNode {
                @input({ type: PoseGraphType.POSE })
                pose: PoseNode | null = null;
            };
            return _Node;
        };

        function defineOtherClass() {
            class _Node {
                @input({ type: PoseGraphType.POSE })
                pose: PoseNode | null = null;
            };
            return _Node;
        };
    });

    test(`@input can be only applied to fields of subclasses of PoseNode or PureValueNode.`, () => {
        const errorWatcher = captureErrors();

        for (const define of [defineSubClassOfPoseGraphNode, defineOtherClass]) {
            define();

            expect(errorWatcher.captured).toHaveLength(1);
            expect(errorWatcher.captured[0]).toMatchObject([
                '@input can be only applied to fields of subclasses of PoseNode or PureValueNode.',
            ]);
            
            errorWatcher.clear();
        }

        function defineSubClassOfPoseGraphNode() {
            class _Node extends PoseGraphNode {
                @input({ type: PoseGraphType.FLOAT })
                v = 6;
            };
            return _Node;
        }

        function defineOtherClass() {
            class _Node {
                @input({ type: PoseGraphType.FLOAT })
                v = 6;
            };
            return _Node;
        }
    });

    test(`@input implies default visibility`, () => {
        @ccclass('C')
        class Node extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.FLOAT })
            p = 0.0;
        }

        expect(attr(Node, 'p')).toStrictEqual(expect.objectContaining({
            visible: true,
        }));

        unregisterClass(Node);
    });
});

describe(`Node editor decorators`, () => {
    test(`@poseGraphNodeCategory`, () => {
        checkInjection(
            poseGraphNodeCategory('some-menu-item-1/some-menu-item-2'),
            { category: 'some-menu-item-1/some-menu-item-2' },
        );
    });

    test(`@poseGraphNodeHide`, () => {
        checkInjection(
            poseGraphNodeHide(true),
            { hide: true },
        );
    });

    test(`@poseGraphNodeAppearance`, () => {
        checkInjection(
            poseGraphNodeAppearance({ themeColor: '#ff0012', inline: true }),
            { appearance: { themeColor: '#ff0012', inline: true } },
        );
    });

    test(`@poseGraphCreateNodeFactory`, () => {
        const factory = {
            listEntries: () => [],
            create() { throw new Error(`Should never be invoked.`); },
        };
        checkInjection(
            poseGraphCreateNodeFactory(factory),
            { factory },
        );
    });

    test(`All node decorators should be node dedicated.`, () => {
        const errorWatcher = captureErrors();

        for (const decorator of [
            poseGraphNodeCategory(''),
            poseGraphNodeAppearance({}),
            poseGraphCreateNodeFactory({
                listEntries: () => [],
                create() { throw new Error(`Should never be invoked.`); },
            }),
        ] as const) {
            @decorator
            class NotPoseGraphNode {}

            expect(errorWatcher.captured).toStrictEqual([
                ['This kind of decorator should only be applied to pose graph node classes.'],
            ]);

            errorWatcher.clear();
        }
    });

    function checkInjection(decorator: ClassDecorator, expectedMetadata: PoseGraphNodeEditorMetadata) {
        @decorator
        class SomePoseGraphNode extends PoseGraphNode {}

        expect(getPoseGraphNodeEditorMetadata(SomePoseGraphNode)).toMatchObject(expectedMetadata);
    }
});

describe(`Node`, () => {
    type PosePropertyName = 'pose_input_with_no_displayName_specified' | 'pose_input_with_displayName_specified';

    type PVNodePropertyName = 'pv_node_input_with_no_displayName_specified' | 'pv_node_input_with_displayName_specified';

    interface PoseGraphNodeTestSuite {
        makeFundamental: (poseGraph: PoseGraph) => {
            node: PoseGraphNode,
        };
        makeArrayInput: (poseGraph: PoseGraph) => {
            node: PoseGraphNode;
            visitArray: () => unknown[];
        };
    }

    const testSuitePoseNode: PoseGraphNodeTestSuite = (() => {
        class Fundamental_Node extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.POSE, })
            pose_input_with_no_displayName_specified: PoseNode | null = null;

            @input({ type: PoseGraphType.POSE,  displayName: 'SomeDisPlayName' })
            pose_input_with_displayName_specified: PoseNode | null = null;

            @input({ type: PoseGraphType.FLOAT })
            pv_node_input_with_no_displayName_specified = 1;

            @input({ type: PoseGraphType.FLOAT, displayName: 'PVNode_SomeDisPlayName' })
            pv_node_input_with_displayName_specified = 2;

            /**
             * Does not observed by this test case.
             */
            @input({ type: PoseGraphType.POSE,  })
            array_inputs: Array<PoseNode | null> = [];
        }

        class ArrayInput_Node extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.POSE, })
            array_inputs: Array<PoseNode | null> = [];
        }

        return {
            makeFundamental: (poseGraph) => {
                const node = poseGraph.addNode(new Fundamental_Node());
                return {
                    node,
                    visitProperty: (propertyKey: string) => node[propertyKey],
                };
            },
            makeArrayInput: (poseGraph) => {
                const node = poseGraph.addNode(new ArrayInput_Node());
                return {
                    node,
                    visitArray: () => node.array_inputs,
                };
            },
        };
    })();

    const testSuitePVNode: PoseGraphNodeTestSuite = (() => {
        class Fundamental_Node extends UnimplementedPVNode {
            @input({ type: PoseGraphType.FLOAT })
            pv_node_input_with_no_displayName_specified = 1;

            @input({ type: PoseGraphType.FLOAT, displayName: 'PVNode_SomeDisPlayName' })
            pv_node_input_with_displayName_specified = 2;

            /**
             * Does not observed by this test case.
             */
            @input({ type: PoseGraphType.POSE,  })
            array_inputs: Array<PoseNode | null> = [];
        }

        class ArrayInput_Node extends UnimplementedPVNode {
            @input({ type: PoseGraphType.FLOAT })
            array_inputs: number[] = [];
        }

        return {
            makeFundamental: (poseGraph: PoseGraph) => {
                const node = poseGraph.addNode(new Fundamental_Node([PoseGraphType.FLOAT]));
                return {
                    node,
                };
            },
            makeArrayInput: (poseGraph: PoseGraph) => {
                const node = poseGraph.addNode(new ArrayInput_Node([PoseGraphType.FLOAT]));
                return {
                    node,
                    visitArray: () => node.array_inputs,
                };
            },
        };
    })();

    describe.each([
        [`Pose Node`, testSuitePoseNode],
        [`PV Node`, testSuitePVNode],
    ] as [title: string, suite: PoseGraphNodeTestSuite][])(`%s`, (_, {
        makeFundamental: makeMainNode,
        makeArrayInput: makeArrayNode,
    }) => {
        test(`Fundamental`, () => {
            const animationGraph = new AnimationGraph();
            const { graph: poseGraph } = animationGraph.addLayer().stateMachine.addProceduralPoseState();

            const {
                node: mainNode,
            } = makeMainNode(poseGraph);

            const shouldContainPoseInputs = mainNode instanceof PoseNode;

            // Pose input keys and metadata query.
            const rawKeys = poseGraphOp.getInputKeys(mainNode);
            expect(rawKeys).toHaveLength(shouldContainPoseInputs ? 4 : 2);
            expect(rawKeys).toSatisfyAll((k) => poseGraphOp.isValidInputKey(mainNode, k));
            const metadataTable = rawKeys.map((k) => normalizeNodeInputMetadata(poseGraphOp.getInputMetadata(mainNode, k)));
            expect(metadataTable).toStrictEqual(expect.arrayContaining([
                expect.objectContaining({
                    displayName: undefined,
                    deletable: false,
                    insertPoint: false,
                    type: PoseGraphType.FLOAT,
                }),
                expect.objectContaining({
                    displayName: 'PVNode_SomeDisPlayName',
                    deletable: false,
                    insertPoint: false,
                    type: PoseGraphType.FLOAT,
                }),
            ]));
            if (shouldContainPoseInputs) {
                expect(metadataTable).toStrictEqual(expect.arrayContaining([
                    expect.objectContaining({
                        displayName: undefined,
                        deletable: false,
                        insertPoint: false,
                    }),
                    expect.objectContaining({
                        displayName: 'SomeDisPlayName',
                        deletable: false,
                        insertPoint: false,
                    }),
                ]));
            }
    
            // Pose inputs binding query.
            // Note: only pose node can binding poses.
            if (shouldContainPoseInputs) {
                for (const [
                    key,
                    expectedDisplayName,
                ] of [
                    [composeInputKeyInternally('pose_input_with_no_displayName_specified'), undefined],
                    [composeInputKeyInternally('pose_input_with_displayName_specified'), 'SomeDisPlayName'],
                ] as [
                    key: poseGraphOp.InputKey,
                    expectedDisplayName: string | undefined,
                ][]) {
                    const metadata = poseGraphOp.getInputMetadata(mainNode, key);
                    expect(metadata).not.toBeUndefined();
                    assertIsTrue(metadata);
                    expect(metadata.displayName).toBe(expectedDisplayName)
                    // Initial: no binding.
                    expect(poseGraphOp.getInputBinding(poseGraph,mainNode, key)).toBeUndefined();
                    // Connect and reconnect.
                    for (let i = 0; i < 2; ++i) {
                        const bindingPose = poseGraph.addNode(new UnimplementedPoseNode());
                        // Connect.
                        poseGraphOp.connectNode(poseGraph,mainNode, key, bindingPose);
                        // `poseGraphOp.getInputBinding` should returns the connected pose.
                        expect(poseGraphOp.getInputBinding(poseGraph,mainNode, key)).toStrictEqual(expect.objectContaining({
                            producer: bindingPose,
                            outputIndex: 0,
                        }));
                    }
                    // Disconnect.
                    poseGraphOp.disconnectNode(poseGraph,mainNode, key);
                    expect(poseGraphOp.getInputBinding(poseGraph,mainNode, key)).toBeUndefined();
                }
            }

            // PV node input binding query.
            for (const [
                key,
                expectedDisplayName,
            ] of [
                [composeInputKeyInternally('pv_node_input_with_no_displayName_specified'), undefined],
                [composeInputKeyInternally('pv_node_input_with_displayName_specified'), 'PVNode_SomeDisPlayName'],
            ] as [
                key: poseGraphOp.InputKey,
                expectedDisplayName: string,
            ][]) {
                const metadata = poseGraphOp.getInputMetadata(mainNode, key);
                expect(metadata).not.toBeUndefined();
                assertIsTrue(metadata);
                expect(metadata.displayName).toBe(expectedDisplayName);
                // Initial: no binding.
                expect(poseGraphOp.getInputBinding(poseGraph,mainNode, key)).toBeUndefined();
                // Connect and reconnect.
                for (let i = 0; i < 2; ++i) {
                    const bindingNode = poseGraph.addNode(new UnimplementedPVNode([PoseGraphType.FLOAT]));
                    // Connect.
                    poseGraphOp.connectNode(poseGraph,mainNode, key, bindingNode, 0);
                    // Query the binding.
                    expect(poseGraphOp.getInputBinding(poseGraph,mainNode, key)).toStrictEqual(expect.objectContaining({
                        producer: bindingNode,
                        outputIndex: getTheOnlyOutputKey(bindingNode),
                    }));
                }
                // Disconnect.
                poseGraphOp.disconnectNode(poseGraph,mainNode, key);
                expect(poseGraphOp.getInputBinding(poseGraph,mainNode, key)).toBeUndefined();
            }
        });
    
        test(`Array input`, () => {
            const animationGraph = new AnimationGraph();
            const { graph: poseGraph } = animationGraph.addLayer().stateMachine.addProceduralPoseState();

            const {
                node,
                visitArray,
            } = makeArrayNode(poseGraph);

            expect(poseGraphOp.getInputKeys(node)).toStrictEqual([]);
    
            // Array input.
            const inputInsertInfos = Object.entries(poseGraphOp.getInputInsertInfos(node));
            expect(inputInsertInfos).toHaveLength(1);
            expect(inputInsertInfos.map(([_, v]) => v)).toStrictEqual(expect.arrayContaining([
                expect.objectContaining({
                    displayName: 'array_inputs',
                }),
            ]));
    
            // Inserts inputs.
            for (let i = 0; i < 5; ++i) {
                poseGraphOp.insertInput(poseGraph, node, inputInsertInfos[0][0]);
                const expectedElementCount = i + 1;
                expect(visitArray()).toHaveLength(expectedElementCount);
                const keys = poseGraphOp.getInputKeys(node);
                expect(keys).toHaveLength(expectedElementCount);
                const metadataTable = keys.map((k) => normalizeNodeInputMetadata(poseGraphOp.getInputMetadata(node, k)));
                expect(metadataTable).toStrictEqual(expect.arrayContaining(Array.from({ length: expectedElementCount }, (_, j) => {
                    return expect.objectContaining({
                        displayName: undefined,
                        deletable: true,
                        insertPoint: true,
                    });
                })));
            }
    
            // Delete a middle element.
            const middleInputKey = composeInputKeyInternally('array_inputs', 3);
            expect(middleInputKey).not.toBeUndefined();
            assertIsTrue(middleInputKey);
            poseGraphOp.deleteInput(poseGraph, node, middleInputKey);
            {
                expect(visitArray()).toHaveLength(4);
                const keys = poseGraphOp.getInputKeys(node);
                expect(keys).toHaveLength(4);
                const metadataTable = keys.map((k) => poseGraphOp.getInputMetadata(node, k));
                expect(metadataTable).toStrictEqual(expect.arrayContaining(Array.from({ length: 4 }, (_, j) => {
                    return expect.objectContaining({
                        displayName: undefined,
                        deletable: true,
                        insertPoint: true,
                    });
                })));
            }
        });
    });

    describe(`Array input properties sync`, () => {
        test(`The group has only one member`, () => {
            class SomeNode extends UnimplementedPoseNode {
                @input({ type: PoseGraphType.POSE,  arraySyncGroup: 'sync-group-1' })
                public prop: PoseNode[] = [];
            }

            const poseGraph = createPoseGraph();
            const node = poseGraph.addNode(new SomeNode());
            const insertIds = Object.keys(poseGraphOp.getInputInsertInfos(node));
            expect(insertIds).toHaveLength(1);
            poseGraphOp.insertInput(poseGraph, node, insertIds[0]);
            // The insertion should succeed with one key inserted!
            expect(poseGraphOp.getInputKeys(node)).toHaveLength(1);
        });

        test(`The group has only more than one member`, () => {
            class SomeNode extends UnimplementedPoseNode {
                @input({ type: PoseGraphType.POSE,  arraySyncGroup: 'sync-group-1' })
                public prop1: PoseNode[] = [];

                @input({ type: PoseGraphType.POSE,  arraySyncGroup: 'sync-group-1' })
                public prop2: PoseNode[] = [];

                @input({ type: PoseGraphType.BOOLEAN,  arraySyncGroup: 'sync-group-1', arraySyncGroupFollower: true })
                public prop_follower: boolean[] = [];

                @input({ type: PoseGraphType.FLOAT, arraySyncGroup: 'sync-group-1' })
                public prop3: number[] = [];
            }

            const poseGraph = createPoseGraph();
            const node = poseGraph.addNode(new SomeNode());

            const GROUP_MEMBER_COUNT = 4; 
            const GROUP_MEMBER_FOLLOWER_COUNT = 1;

            const insertIds = Object.keys(poseGraphOp.getInputInsertInfos(node));
            // Note: follower does not have insert id -- it's not actively insert-able.
            expect(insertIds).toHaveLength(GROUP_MEMBER_COUNT - GROUP_MEMBER_FOLLOWER_COUNT);

            const expectedProp1ConstantValue: null[] = [];
            const expectedProp2ConstantValue: null[] = [];
            const expectedProp3ConstantValue: number[] = [];
            const expectedPropFollowerConstantValue: boolean[] = [];

            const check = () => {
                expect(poseGraphOp.getInputKeys(node)).toHaveLength(GROUP_MEMBER_COUNT * expectedProp1ConstantValue.length);
                for (let i = 0; i < expectedProp1ConstantValue.length; ++i) {
                    // Non-followers' inputs are deletable.
                    for (const prop of ['prop1', 'prop2', 'prop3'])
                    {
                        const metadata = poseGraphOp.getInputMetadata(
                            node,
                            composeInputKeyInternally(prop, i));
                        expect(metadata).not.toBeUndefined();
                        expect(metadata!.deletable).toBe(true);
                    }
                    // Followers' inputs are not deletable.
                    {
                        const metadata = poseGraphOp.getInputMetadata(
                            node,
                            composeInputKeyInternally('prop_follower', i));
                        expect(metadata).not.toBeUndefined();
                        expect(metadata!.deletable).toBe(false);
                    }
                }

                expect(node.prop1).toStrictEqual(expectedProp1ConstantValue);
                expect(node.prop2).toStrictEqual(expectedProp2ConstantValue);
                expect(node.prop3).toStrictEqual(expectedProp3ConstantValue);
                expect(node.prop_follower).toStrictEqual(expectedPropFollowerConstantValue);
            };

            // Fire 4 times insertion on prop1/prop2/prop3... in turn.
            for (let i = 0; i < 4; ++i) {
                poseGraphOp.insertInput(poseGraph, node, insertIds[i % (GROUP_MEMBER_COUNT - GROUP_MEMBER_FOLLOWER_COUNT)]);

                // The insertion should causes both all props extending 1 element with its type-specified default value.
                expectedProp1ConstantValue.push(null);
                expectedProp2ConstantValue.push(null);
                expectedProp3ConstantValue.push(0.0);
                expectedPropFollowerConstantValue.push(false);
                check();

                // Fill elements with different constant values to inspect if we're doing something right.
                expectedProp3ConstantValue[i] = node.prop3[i] = 1 + lerp(0, 1, i / 4);
            }

            // Now perform deletion.
            for (let i = 0; i < 3; ++i) {
                const deleteIndex = i === 0
                    ? 1 // Deletes the middle
                    : i === 1
                        ? 1 // the tail
                        : 0; // the head
                const propName = i === 0
                    ? 'prop1'
                    : i === 1
                        ? 'prop2'
                        : 'prop3';
                poseGraphOp.deleteInput(
                    poseGraph,
                    node,
                    composeInputKeyInternally(propName, deleteIndex),
                );

                // The deletion should causes both all props delete its element at specified index.
                expectedProp1ConstantValue.splice(deleteIndex, 1);
                expectedProp2ConstantValue.splice(deleteIndex, 1);
                expectedProp3ConstantValue.splice(deleteIndex, 1);
                expectedPropFollowerConstantValue.splice(deleteIndex, 1);
                check();
            }
        });
    });

    test(`connecting()`, () => {
        const poseGraph = createPoseGraph();

        class PoseNode1 extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.FLOAT })
            public pv_node_prop = 2;

            @input({ type: PoseGraphType.POSE, })
            public pose_prop: Pose | null = null;
        }

        class PVNode1 extends UnimplementedPVNode {
            constructor() { super([PoseGraphType.FLOAT]); }
            @input({ type: PoseGraphType.FLOAT })
            public pv_node_prop = 2;
        }

        const poseNode1 = poseGraph.addNode(new PoseNode1());
        const poseNode2 = poseGraph.addNode(new PoseNode1());
        const pvNode1 = poseGraph.addNode(new PVNode1());
        const pvNode2 = poseGraph.addNode(new PVNode1());

        const logCapture = captureErrors();

        // OK: connect pv-node to pv-node input of pose node.
        poseGraphOp.connectNode(
            poseGraph,
            poseNode1,
            composeInputKeyInternally('pv_node_prop'),
            pvNode1,
            getTheOnlyOutputKey(pvNode1),
        );
        expect(logCapture.captured).toHaveLength(0);

        // OK: connect pv-node to pv-node input of pv-node.
        poseGraphOp.connectNode(
            poseGraph,
            pvNode2,
            composeInputKeyInternally('pv_node_prop'),
            pvNode1,
            getTheOnlyOutputKey(pvNode1),
        );
        expect(logCapture.captured).toHaveLength(0);

        // Error: connect pv-node to pose input of pose node.
        poseGraphOp.connectNode(
            poseGraph,
            poseNode1,
            composeInputKeyInternally('pose_prop'),
            pvNode1,
            getTheOnlyOutputKey(pvNode1),
        );
        expect(logCapture.captured).toHaveLength(1);
        expect(logCapture.captured[0]).toStrictEqual([`Type mismatch: input has type POSE, output has type FLOAT.`]);
        logCapture.clear();

        // OK: connect pose node to pose input of pose node.
        poseGraphOp.connectNode(
            poseGraph,
            poseNode1,
            composeInputKeyInternally('pose_prop'),
            poseNode2,
            getTheOnlyOutputKey(poseNode2),
        );
        expect(logCapture.captured).toHaveLength(0);

        // Error: connect pose node to pv-node input of pose node.
        poseGraphOp.connectNode(
            poseGraph,
            poseNode1,
            composeInputKeyInternally('pv_node_prop'),
            poseNode2,
            getTheOnlyOutputKey(poseNode2),
        );
        expect(logCapture.captured).toHaveLength(1);
        expect(logCapture.captured[0]).toStrictEqual([`Type mismatch: input has type FLOAT, output has type POSE.`]);
        logCapture.clear();

        // Error: connect pose node to pv-node input of pv-node node.
        poseGraphOp.connectNode(
            poseGraph,
            pvNode1,
            composeInputKeyInternally('pv_node_prop'),
            poseNode1,
            getTheOnlyOutputKey(poseNode1),
        );
        expect(logCapture.captured).toHaveLength(1);
        expect(logCapture.captured[0]).toStrictEqual([`Type mismatch: input has type FLOAT, output has type POSE.`]);
        logCapture.clear();
    });

    test(`Remove one binding shall not affect others`, () => {
        class PoseNode_HavingMultipleInputs extends UnimplementedPoseNode {
            @input({ type: PoseGraphType.POSE })
            pose_input: Pose | null = null;

            @input({ type: PoseGraphType.VEC3 })
            vec3_input = new Vec3();

            @input({ type: PoseGraphType.FLOAT })
            float_input = 1.0;
        }

        const poseGraph = createPoseGraph();
        const consumerNode = poseGraph.addNode(new PoseNode_HavingMultipleInputs());
        const poseInputNode = poseGraph.addNode(new UnimplementedPoseNode());
        const vec3InputNode = poseGraph.addNode(new UnimplementedPVNode([PoseGraphType.VEC3]));
        const floatInputNode = poseGraph.addNode(new UnimplementedPVNode([PoseGraphType.FLOAT]));
        poseGraphOp.connectNode(poseGraph, consumerNode, composeInputKeyInternally('pose_input'), poseInputNode);
        poseGraphOp.connectNode(poseGraph, consumerNode, composeInputKeyInternally('vec3_input'), vec3InputNode, getTheOnlyOutputKey(vec3InputNode));
        poseGraphOp.connectNode(poseGraph, consumerNode, composeInputKeyInternally('float_input'), floatInputNode, getTheOnlyOutputKey(floatInputNode));
        poseGraphOp.disconnectNode(poseGraph, consumerNode, composeInputKeyInternally('vec3_input'));
        expect(poseGraphOp.getInputBinding(poseGraph, consumerNode, composeInputKeyInternally('vec3_input'))).toBeUndefined();
        expect(poseGraphOp.getInputBinding(poseGraph, consumerNode, composeInputKeyInternally('pose_input'))).toStrictEqual(expect.objectContaining({
            producer: poseInputNode,
            outputIndex: 0,
        }));
        expect(poseGraphOp.getInputBinding(poseGraph, consumerNode, composeInputKeyInternally('float_input'))).toStrictEqual(expect.objectContaining({
            producer: floatInputNode,
            outputIndex: 0,
        }));
    });
});

test(`Inputs from base classes`, () => {
    class Base extends UnimplementedPoseNode {
        @input({ type: PoseGraphType.FLOAT })
        base_pvNode_input = 1.0;

        @input({ type: PoseGraphType.POSE, })
        base_pose_input: Pose | null = null;

        @input({ type: PoseGraphType.POSE, displayName: 'Some_base_pose_input_displayName' })
        base_pose_input_with_displayName_specified: Pose | null = null;

        @input({ type: PoseGraphType.POSE })
        base_input_about_to_be_overrode: Pose | null = null;

        @input({ type: PoseGraphType.POSE, displayName: 'Some_base_pose_input_displayName_to_be_overrode' })
        base_input_about_to_be_overrode_with_display_name_specified: Pose | null = null;
    }

    class Sub extends Base {
        @input({ type: PoseGraphType.FLOAT })
        sub_pvNode_input = 2.0;

        @input({ type: PoseGraphType.POSE, })
        sub_pose_input: Pose | null = null;

        @input({ type: PoseGraphType.POSE })
        base_input_about_to_be_overrode: Pose | null = null;

        @input({ type: PoseGraphType.POSE, displayName: 'Some_overrode_base_pose_input_displayName' })
        base_input_about_to_be_overrode_with_display_name_specified: Pose | null = null;
    }

    const poseGraph = createPoseGraph();
    const node = poseGraph.addNode(new Sub());

    {
        const inputKeys = poseGraphOp.getInputKeys(node);
        for (const inputKey of inputKeys) {
            expect(poseGraphOp.isValidInputKey(node, inputKey)).toBeTrue();
            expect(poseGraphOp.getInputBinding(poseGraph, node, inputKey)).toBeUndefined();
        }
        expect(inputKeys.map((key) => ({
            displayName: poseGraphOp.getInputMetadata(node, key)?.displayName,
            value: poseGraphOp.getInputConstantValue(node, key),
        }))).toStrictEqual([
            // Base inputs first.
            { displayName: undefined, value: 1.0 },
            { displayName: undefined, value: null },
            { displayName: 'Some_base_pose_input_displayName', value: null },
            { displayName: undefined, value: null },
            { displayName: 'Some_overrode_base_pose_input_displayName', value: null },
            { displayName: undefined, value: 2.0 },
            { displayName: undefined, value: null },
        ]);
    }
});

describe(`Input value assignment`, () => {
    test.todo(`Assign number input`);

    // Shall not use simple assignment but Vec3.copy.
    test.todo(`Assign vec3 input`);

    // Shall not use simple assignment but Quat.copy.
    test.todo(`Assign quat input`);
});

test(`Input/output query`, () => {
    const poseGraph = createPoseGraph();

    // Query on the unique output node.
    {
        // Root output node does not has any output.
        expect(poseGraphOp.getOutputKeys(poseGraph.outputNode)).toStrictEqual([]);

        // Root output node has a pose input.
        const inputKeys = poseGraphOp.getInputKeys(poseGraph.outputNode);
        expect(inputKeys).toHaveLength(1);
        expect(poseGraphOp.getInputMetadata(poseGraph.outputNode, inputKeys[0])).toStrictEqual(expect.objectContaining({
            type: PoseGraphType.POSE,
        }));
    }
});

test(`isWellFormedInputKey()`, () => {
    expect(poseGraphOp.isWellFormedInputKey(['a'])).toBe(true);
    expect(poseGraphOp.isWellFormedInputKey(['a', 0])).toBe(true);
    expect(poseGraphOp.isWellFormedInputKey(['a', 1])).toBe(true);

    expect(poseGraphOp.isWellFormedInputKey('a')).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey(0)).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey(1)).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey([1, 'a'])).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey(['a', -1])).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey(['a', -Infinity])).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey(['a', Infinity])).toBe(false);
    expect(poseGraphOp.isWellFormedInputKey(['a', Number.NaN])).toBe(false);
});

test(`Disallow connect a pose node to multiple inputs`, () => {
    const poseGraph = createPoseGraph();

    class Consumer extends UnimplementedPoseNode {
        @input({ type: PoseGraphType.POSE })
        pose: Pose | null = null;
    }

    const producer = poseGraph.addNode(new UnimplementedPoseNode());
    const consumerA = poseGraph.addNode(new Consumer());
    const consumerB = poseGraph.addNode(new Consumer());

    /** Checks if the whole graph only has one specified `expectedConsumer` which consumes the `producer`. */
    const check = (expectedConsumer: undefined | PoseNode | PoseGraph['outputNode']) => {
        for (const node of [poseGraph.outputNode, consumerA, consumerB]) {
            const binding = poseGraphOp.getInputBinding(poseGraph, node, getTheOnlyInputKey(node));
            if (node === expectedConsumer) {
                expect(binding).toStrictEqual(expect.objectContaining({
                    producer,
                    outputIndex: 0,
                }));
            } else {
                expect(binding).toBeUndefined();
            }
        }
    };

    // Connect nothing.
    check(undefined);

    // Connect the producer to output node.
    poseGraphOp.connectOutputNode(poseGraph, producer);
    check(poseGraph.outputNode);

    // Re-connect the producer to a.
    poseGraphOp.connectNode(poseGraph, consumerA, getTheOnlyInputKey(consumerA), producer);
    check(consumerA);

    // Re-connect the producer to b.
    poseGraphOp.connectNode(poseGraph, consumerB, getTheOnlyInputKey(consumerB), producer);
    check(consumerB);

    // Re-connect to the output node.
    poseGraphOp.connectOutputNode(poseGraph, producer);
    check(poseGraph.outputNode);

    // Disconnect.
    poseGraphOp.disconnectNode(poseGraph, poseGraph.outputNode, getTheOnlyInputKey(poseGraph.outputNode));
    check(undefined);
});
