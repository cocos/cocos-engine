
import { AnimationClip, Component, Node, Vec2, Vec3, warnID } from '../../cocos/core';
import { PoseBlend1D, PoseBlend2D, Condition, InvalidTransitionError, VariableNotDefinedError, __getDemoGraphs, AnimatedPose, PoseBlendDirect, VectorTrack, VariableType } from '../../cocos/core/animation/animation';
import { LayerBlending, PoseGraph, PoseSubgraph, Transition, isPoseTransition, PoseTransition } from '../../cocos/core/animation/newgen-anim/pose-graph';
import { createEval } from '../../cocos/core/animation/newgen-anim/create-eval';
import { VariableTypeMismatchedError } from '../../cocos/core/animation/newgen-anim/errors';
import { PoseGraphEval, PoseNodeStats, PoseStatus } from '../../cocos/core/animation/newgen-anim/graph-eval';
import { createGraphFromDescription } from '../../cocos/core/animation/newgen-anim/__tmp__/graph-from-description';
import gAnyTransition from './graphs/any-transition';
import gUnspecifiedCondition from './graphs/unspecified-condition';
import glUnspecifiedConditionOnEntryNode from './graphs/unspecified-condition-for-non-entry-node';
import gSuccessiveSatisfaction from './graphs/successive-satisfaction';
import gVariableNotFoundInCondition from './graphs/variable-not-found-in-condition';
import gVariableNotFoundInPoseBlend from './graphs/variable-not-found-in-pose-blend';
import gPoseBlendRequiresNumbers from './graphs/pose-blend-requires-numbers';
import gInfinityLoop from './graphs/infinity-loop';
import gZeroTimePiece from './graphs/zero-time-piece';
import { blend1D } from '../../cocos/core/animation/newgen-anim/blend-1d';
import '../utils/matcher-deep-close-to';
import { BinaryCondition, UnaryCondition, TriggerCondition } from '../../cocos/core/animation/newgen-anim/condition';
import { NewGenAnim } from '../../cocos/core/animation/newgen-anim/newgenanim-component';
import { StateMachineComponent } from '../../cocos/core/animation/newgen-anim/state-machine-component';

describe('NewGen Anim', () => {
    const demoGraphs = __getDemoGraphs();

    test('Defaults', () => {
        const graph = new PoseGraph();
        expect(graph.layers).toHaveLength(0);
        const layer = graph.addLayer();
        expect(layer.blending).toBe(LayerBlending.additive);
        expect(layer.mask).toBeNull();
        expect(layer.weight).toBe(1.0);
        const layerGraph = layer.graph;
        testGraphDefaults(layerGraph);

        const graphNode = layerGraph.addPoseNode();
        expect(graphNode.name).toBe('');
        expect(graphNode.speed.variable).toBe('');
        expect(graphNode.speed.value).toBe(1.0);
        expect(graphNode.loop).toBe(true);
        expect(graphNode.pose).toBeNull();
        expect(graphNode.startRatio.variable).toBe('');
        expect(graphNode.startRatio.value).toBe(0.0);

        testGraphDefaults(layerGraph.addSubgraph());

        const animationPose = new AnimatedPose();
        expect(animationPose.clip).toBeNull();
        
        const poseBlend1D = new PoseBlend1D();
        expect(Array.from(poseBlend1D.children)).toHaveLength(0);
        expect(poseBlend1D.param.variable).toBe('');
        expect(poseBlend1D.param.value).toBe(0.0);

        const poseBlend2D = new PoseBlend2D();
        expect(poseBlend2D.algorithm).toBe(PoseBlend2D.Algorithm.SIMPLE_DIRECTIONAL);
        expect(Array.from(poseBlend2D.children)).toHaveLength(0);
        expect(poseBlend2D.paramX.variable).toBe('');
        expect(poseBlend2D.paramX.value).toBe(0.0);
        expect(poseBlend2D.paramY.variable).toBe('');
        expect(poseBlend2D.paramY.value).toBe(0.0);

        const poseBlendDirect = new PoseBlendDirect();
        expect(Array.from(poseBlendDirect.children)).toHaveLength(0);

        const transition = layerGraph.connect(layerGraph.entryNode, graphNode);
        testTransitionDefaults(transition);

        const poseTransition = layerGraph.connect(graphNode, graphNode);
        testTransitionDefaults(poseTransition);
        expect(poseTransition.duration).toBe(0.3);
        expect(poseTransition.exitConditionEnabled).toBe(true);
        expect(poseTransition.exitCondition).toBe(1.0);

        function testGraphDefaults(graph: PoseSubgraph) {
            expect(Array.from(graph.nodes())).toStrictEqual(expect.arrayContaining([
                graph.entryNode,
                graph.exitNode,
                graph.anyNode,
            ]));
            expect(graph.entryNode.name).toBe('Entry');
            expect(graph.exitNode.name).toBe('Exit');
            expect(graph.anyNode.name).toBe('Any');
            expect(Array.from(graph.transitions())).toHaveLength(0);
        }

        function testTransitionDefaults (transition: Transition) {
            expect(transition.conditions).toHaveLength(0);
        }
    });

    describe('Asset transition API', () => {
        const graph = new PoseGraph();
        const layer = graph.addLayer();
        const layerGraph = layer.graph;
        const n1 = layerGraph.addPoseNode();
        const n2 = layerGraph.addPoseNode();
        const trans1 = layerGraph.connect(n1, n2);
        expect([...layerGraph.getOutgoings(n1)].map((t) => t.to)).toContain(n2);
        expect([...layerGraph.getIncomings(n2)].map((t) => t.from)).toContain(n1);

        // There may be multiple transitions between two nodes.
        const trans2 = layerGraph.connect(n1, n2);
        expect(trans2).not.toBe(trans1);
        expect([...layerGraph.getTransition(n1, n2)]).toEqual(expect.arrayContaining([trans1, trans2]));

        // Self transitions are also allowed.
        const n3 = layerGraph.addPoseNode();
        const selfTransition = layerGraph.connect(n3, n3);
        expect([...layerGraph.getTransition(n3, n3)]).toMatchObject([selfTransition]);
    });

    describe('Transitions', () => {
        test('Could not transition to entry node', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            expect(() => layerGraph.connect(layerGraph.addPoseNode(), layerGraph.entryNode)).toThrowError(InvalidTransitionError);
        });

        test('Could not transition from exit node', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            expect(() => layerGraph.connect(layerGraph.exitNode, layerGraph.addPoseNode())).toThrowError(InvalidTransitionError);
        });

        test('Zero time piece', () => {
            // SPEC: Whenever zero time piece is encountered,
            // no matter the time piece is generated since originally passed to `update()`,
            // or was exhausted and left zero.
            // The following updates at that time would still steadily proceed:
            // - The graph is in transition state and the transition specified 0 duration, then the switch will happened;
            // - The graph is in node state and a transition is judged to be happened, then the graph will run in transition state.
            const graphEval = createPoseGraphEval(createGraphFromDescription(gZeroTimePiece), new Node());
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'SubgraphNode1' },
            });
        });

        test(`Transition: pose -> pose`, () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;
            const node1 = graph.addPoseNode();
            node1.pose = createPosePositionX(1.0, 2.0);
            const node2 = graph.addPoseNode();
            node2.pose = createPosePositionX(1.0, 3.0);
            graph.connect(graph.entryNode, node1);
            const transition = graph.connect(node1, node2);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.0;
            
            const rootNode = new Node();
            const graphEval = createPoseGraphEval(poseGraph, rootNode);
            graphEval.update(0.15);
            expect(rootNode.position).toBeDeepCloseTo(new Vec3(2.5));
        });

        test('Condition not specified', () => {
            const graphEval = createPoseGraphEval(createGraphFromDescription(gUnspecifiedCondition), new Node());
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
               currentNode: { __DEBUG_ID__: 'asd' },
            });
        });

        test('Condition not specified for non-entry node', () => {
            const graphEval = createPoseGraphEval(createGraphFromDescription(glUnspecifiedConditionOnEntryNode), new Node());
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node1' },
                transition: {
                    nextNode: { __DEBUG_ID__: 'Node2' },
                },
             });
            graphEval.update(0.32);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node2' },
            });
        });

        test('Successive transitions', () => {
            const graphEval = createPoseGraphEval(createGraphFromDescription(gSuccessiveSatisfaction), new Node());
            graphEval.update(0.0);
            
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node2' },
            });
        });

        test('Infinity loop', () => {
            const warnMockInstance = warnID as unknown as jest.MockInstance<ReturnType<typeof warnID>, Parameters<typeof warnID>>;
            warnMockInstance.mockClear();

            const graphEval = createPoseGraphEval(createGraphFromDescription(gInfinityLoop), new Node());
            graphEval.update(0.0);

            expect(warnMockInstance).toBeCalledTimes(1);
            expect(warnMockInstance.mock.calls[0]).toHaveLength(2);
            expect(warnMockInstance.mock.calls[0][0]).toStrictEqual(14000);
            expect(warnMockInstance.mock.calls[0][1]).toStrictEqual(100);
        });

        test('Self transition', () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;
            
            const poseNode = graph.addPoseNode();
            poseNode.name = 'Node';
            const pose = poseNode.pose = createPosePositionXLinear(1.0, 0.3, 1.4);
            const clip = pose.clip!;

            graph.connect(graph.entryNode, poseNode);
            
            const selfTransition = graph.connect(poseNode, poseNode);
            selfTransition.exitConditionEnabled = true;
            selfTransition.exitCondition = 0.9;
            selfTransition.duration = 0.3;

            const node = new Node();
            const graphEval = createPoseGraphEval(poseGraph, node);
            
            graphEval.update(0.7);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip,
                    weight: 1.0,
                },
            });
            expect(node.position.x).toBeCloseTo(0.3 + (1.4 - 0.3) * 0.7);

            graphEval.update(0.25);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip,
                    weight: 0.83333,
                },
                transition: {
                    time: 0.05,
                    next: {
                        clip,
                        weight: 0.16667,
                    },
                },
            });
            expect(node.position.x).toBeCloseTo(
                (0.3 + (1.4 - 0.3) * 0.95) * 0.83333 +
                (0.3 + (1.4 - 0.3) * 0.05) * 0.16667
            );
        });

        test('Subgraph transitions are selected only when subgraph exited', () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;

            const subgraph = graph.addSubgraph();
            subgraph.name = 'Subgraph';
            const subgraphEntryToExit = subgraph.connect(subgraph.entryNode, subgraph.exitNode);
            const [subgraphEntryToExitCondition] = subgraphEntryToExit.conditions = [new TriggerCondition()];
            poseGraph.addVariable('subgraphExitTrigger', VariableType.TRIGGER, false);
            subgraphEntryToExitCondition.trigger = 'subgraphExitTrigger';

            graph.connect(graph.entryNode, subgraph);
            const node = graph.addPoseNode();
            node.name = 'Node';
            const subgraphToNode = graph.connect(subgraph, node);
            const [triggerCondition] = subgraphToNode.conditions = [new TriggerCondition()];

            poseGraph.addVariable('trigger', VariableType.TRIGGER);
            triggerCondition.trigger = 'trigger';

            const graphEval = createPoseGraphEval(poseGraph, new Node());

            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: null,
            });

            graphEval.setValue('trigger', true);
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: null,
            });

            graphEval.setValue('subgraphExitTrigger', true);
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: 'Node',
                },
            });
        });

        test(`In single frame: exit condition just satisfied or satisfied and remain time`, () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;

            const poseNode1 = graph.addPoseNode();
            poseNode1.name = 'PoseNode';
            const poseNode1Clip = poseNode1.pose = createPosePositionX(1.0, 2.0, 'PoseNode1Clip');
            
            const poseNode2 = graph.addPoseNode();
            poseNode2.name = 'PoseNode';
            const poseNode2Clip = poseNode2.pose = createPosePositionX(1.0, 2.0, 'PoseNode2Clip');

            graph.connect(graph.entryNode, poseNode1);
            const node1To2 = graph.connect(poseNode1, poseNode2);
            node1To2.duration = 0.0;
            node1To2.exitConditionEnabled = true;
            node1To2.exitCondition = 1.0;

            {
                const graphEval = createPoseGraphEval(poseGraph, new Node());
                graphEval.update(poseNode1Clip.clip!.duration);
                expectPoseGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: poseNode2Clip.clip!,
                        weight: 1.0,
                    },
                });
            }

            {
                const graphEval = createPoseGraphEval(poseGraph, new Node());
                graphEval.update(poseNode1Clip.clip!.duration + 0.1);
                expectPoseGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: poseNode2Clip.clip!,
                        weight: 1.0,
                    },
                });
            }
        });

        test(`Transition into subgraph`, () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;

            const poseNode = graph.addPoseNode();
            poseNode.name = 'PoseNode';
            const poseNodeClip = poseNode.pose = createPosePositionX(1.0, 2.0, 'PoseNodeClip');

            const subgraph = graph.addSubgraph();
            subgraph.name = 'Subgraph';

            const subgraphPoseNode = subgraph.addPoseNode();
            subgraphPoseNode.name = 'SubgraphPoseNode';
            const subgraphPoseNodeClip = subgraphPoseNode.pose = createPosePositionX(1.0, 3.0, 'SubgraphPoseNodeClip');
            subgraph.connect(subgraph.entryNode, subgraphPoseNode);

            const subgraphPoseNode2 = subgraph.addPoseNode();
            subgraphPoseNode2.name = 'SubgraphPoseNode2';
            const subgraphPoseNode2Clip = subgraphPoseNode2.pose = createPosePositionX(0.1, 3.0, 'SubgraphPoseNode2Clip');
            const poseToSubgraphPose1ToPose2 = subgraph.connect(subgraphPoseNode, subgraphPoseNode2);
            poseToSubgraphPose1ToPose2.duration = 0.3;
            poseToSubgraphPose1ToPose2.exitConditionEnabled = true;
            poseToSubgraphPose1ToPose2.exitCondition = 1.0;

            graph.connect(graph.entryNode, poseNode);
            const poseToSubgraph = graph.connect(poseNode, subgraph);
            poseToSubgraph.duration = 0.3;
            poseToSubgraph.exitConditionEnabled = true;
            poseToSubgraph.exitCondition = 0.0;

            const graphEval = createPoseGraphEval(poseGraph, new Node());

            graphEval.update(0.2);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: poseNodeClip.clip!,
                    weight: 0.33333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: subgraphPoseNodeClip.clip!,
                        weight: 0.66667,
                    },
                },
            });

            graphEval.update(0.1);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraphPoseNodeClip.clip!,
                    weight: 1.0,
                },
            });

            graphEval.update(subgraphPoseNodeClip.clip!.duration - 0.3 + 0.1);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraphPoseNodeClip.clip!,
                    weight: 0.66667,
                },
                transition: {
                    time: 0.1,
                    next: {
                        clip: subgraphPoseNode2Clip.clip!,
                        weight: 0.33333,
                    },
                },
            });
        });

        test('Transition from subgraph', () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;

            const poseNode = graph.addPoseNode();
            poseNode.name = 'PoseNode';
            const poseNodeClip = poseNode.pose = createPosePositionX(1.0, 2.0, 'PoseNodeClip');

            const {
                subgraph,
                subgraphPoseNodeClip,
            } = (() => {
                const subgraph = graph.addSubgraph();
                subgraph.name = 'Subgraph';

                const subgraphPoseNode = subgraph.addPoseNode();
                subgraphPoseNode.name = 'SubgraphPoseNode';

                const subgraphPoseNodeClip = subgraphPoseNode.pose = createPosePositionX(1.0, 3.0, 'SubgraphPoseNodeClip');
                subgraph.connect(subgraph.entryNode, subgraphPoseNode);

                const subgraphPoseNodeToExit = subgraph.connect(subgraphPoseNode, subgraph.exitNode);
                subgraphPoseNodeToExit.duration = 0.3;
                subgraphPoseNodeToExit.exitConditionEnabled = true;
                subgraphPoseNodeToExit.exitCondition = 1.0;

                return {
                    subgraph,
                    subgraphPoseNodeClip,
                };
            })();

            graph.connect(graph.entryNode, subgraph);
            graph.connect(subgraph, poseNode);

            const graphEval = createPoseGraphEval(poseGraph, new Node());

            graphEval.update(
                // exit condition + duration
                subgraphPoseNodeClip.clip!.duration + 0.2,
            );
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraphPoseNodeClip.clip!,
                    weight: 0.33333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: poseNodeClip.clip!,
                        weight: 0.66667,
                    },
                },
            });

            graphEval.update(
                0.10001,
            );
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: poseNodeClip.clip!,
                },
            });
        });

        test('Transition from subgraph to subgraph', () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;

            const createSubgraph = (name: string) => {
                const subgraph = graph.addSubgraph();
                subgraph.name = name;

                const subgraphPoseNode = subgraph.addPoseNode();
                subgraphPoseNode.name = `${name}PoseNode`;

                const subgraphPoseNodeClip = subgraphPoseNode.pose = createPosePositionX(1.0, 3.0, `${name}PoseNodeClip`);
                subgraph.connect(subgraph.entryNode, subgraphPoseNode);

                const subgraphPoseNodeToExit = subgraph.connect(subgraphPoseNode, subgraph.exitNode);
                subgraphPoseNodeToExit.duration = 0.3;
                subgraphPoseNodeToExit.exitConditionEnabled = true;
                subgraphPoseNodeToExit.exitCondition = 1.0;

                return {
                    subgraph,
                    subgraphPoseNodeClip,
                };
            };

            const {
                subgraph: subgraph1,
                subgraphPoseNodeClip: subgraph1PoseNodeClip,
            } = createSubgraph('Subgraph1');

            const {
                subgraph: subgraph2,
                subgraphPoseNodeClip: subgraph2PoseNodeClip,
            } = createSubgraph('Subgraph2');

            graph.connect(graph.entryNode, subgraph1);
            graph.connect(subgraph1, subgraph2);

            const graphEval = createPoseGraphEval(poseGraph, new Node());

            graphEval.update(
                // exit condition + duration
                subgraph1PoseNodeClip.clip!.duration + 0.2,
            );
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraph1PoseNodeClip.clip!,
                    weight: 0.33333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: subgraph2PoseNodeClip.clip!,
                        weight: 0.66667,
                    },
                },
            });

            graphEval.update(
                0.10001,
            );
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraph2PoseNodeClip.clip!,
                },
            });
        });

        describe('Condition', () => {
            function createPoseGraphForConditionTest(conditions: Condition[]) {
                const poseGraph = new PoseGraph();
                const layer = poseGraph.addLayer();
                const graph = layer.graph;
                const node1 = graph.addPoseNode();
                node1.name = 'FalsyBranchNode';
                const node2 = graph.addPoseNode();
                node2.name = 'TruthyBranchNode';
                graph.connect(graph.entryNode, node1);
                const transition = graph.connect(node1, node2, conditions);
                transition.duration = 0.0;
                transition.exitConditionEnabled = false;
                return poseGraph;
            }

            test.each([
                ['Be truthy', UnaryCondition.Operator.TRUTHY, [
                    [true, true],
                    [false, false]
                ]],
                ['Be falsy', UnaryCondition.Operator.FALSY, [
                    [true, false],
                    [false, true],
                ]],
            ] as [
                title: string,
                op: UnaryCondition.Operator,
                samples: [input: boolean, output: boolean][]
            ][])(`Unary: %s`, (_title, op, samples) => {
                for (const [input, output] of samples) {
                    const condition = new UnaryCondition();
                    condition.operator = op;
                    condition.operand.value = input;
                    const graph = createPoseGraphForConditionTest([condition]);
                    const graphEval = createPoseGraphEval(graph, new Node());
                    graphEval.update(0.0);
                    if (output) {
                        expectPoseGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'TruthyBranchNode' },
                        });
                    } else {
                        expectPoseGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'FalsyBranchNode' },
                        });
                    }
                }
            });
    
            test.each([
                ['Equal to', BinaryCondition.Operator.EQUAL_TO, [
                    [0.2, 0.2, true],
                    [0.2, 0.3, false],
                ]],
                ['Not equal to', BinaryCondition.Operator.NOT_EQUAL_TO, [
                    [0.2, 0.2, false],
                    [0.2, 0.3, true],
                ]],
                ['Greater than', BinaryCondition.Operator.GREATER_THAN, [
                    [0.2, 0.2, false],
                    [0.2, 0.3, false],
                    [0.3, 0.2, true],
                ]],
                ['Less than', BinaryCondition.Operator.LESS_THAN, [
                    [0.2, 0.2, false],
                    [0.2, 0.3, true],
                    [0.3, 0.2, false],
                ]],
                ['Greater than or equal to', BinaryCondition.Operator.GREATER_THAN_OR_EQUAL_TO, [
                    [0.2, 0.2, true],
                    [0.2, 0.3, false],
                    [0.3, 0.2, true],
                ]],
                ['Less than or equal to', BinaryCondition.Operator.LESS_THAN_OR_EQUAL_TO, [
                    [0.2, 0.2, true],
                    [0.2, 0.3, true],
                    [0.3, 0.2, false],
                ]],
            ] as [
                title: string,
                op: BinaryCondition.Operator,
                samples: [lhs: number, rhs: number, output: boolean][]
            ][])(`Binary: %s`, (_title, op, samples) => {
                for (const [lhs, rhs, output] of samples) {
                    const condition = new BinaryCondition();
                    condition.operator = op;
                    condition.lhs.value = lhs;
                    condition.rhs.value = rhs;
                    const graph = createPoseGraphForConditionTest([condition]);
                    const graphEval = createPoseGraphEval(graph, new Node());
                    graphEval.update(0.0);
                    if (output) {
                        expectPoseGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'TruthyBranchNode' },
                        });
                    } else {
                        expectPoseGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'FalsyBranchNode' },
                        });
                    }
                }
            });

            test(`Trigger condition`, () => {
                const condition = new TriggerCondition();
                condition.trigger = 'theTrigger';
                const poseGraph = new PoseGraph();
                const layer = poseGraph.addLayer();
                const graph = layer.graph;
                const node1 = graph.addPoseNode();
                node1.name = 'FalsyBranchNode';
                const node2 = graph.addPoseNode();
                node2.name = 'TruthyBranchNode';
                const node3 = graph.addPoseNode();
                node3.name = 'ExtraNode';
                graph.connect(graph.entryNode, node1);
                const transition = graph.connect(node1, node2, [condition]);
                transition.duration = 0.0;
                transition.exitConditionEnabled = false;
                const transition2 = graph.connect(node2, node3, [condition]);
                transition2.duration = 0.0;
                transition2.exitConditionEnabled = false;

                poseGraph.addVariable('theTrigger', VariableType.TRIGGER);

                const graphEval = createPoseGraphEval(poseGraph, new Node());
                graphEval.update(0.0);
                expectPoseGraphEvalStatusLayer0(graphEval, {
                    currentNode: { __DEBUG_ID__: 'FalsyBranchNode' },
                });
                graphEval.setValue('theTrigger', true);
                graphEval.update(0.0);
                expectPoseGraphEvalStatusLayer0(graphEval, {
                    currentNode: { __DEBUG_ID__: 'TruthyBranchNode' },
                });
                expect(graphEval.getValue('theTrigger')).toBe(false);
            });
        });

        test('All triggers along the transition path should be reset', () => {
            const poseGraph = new PoseGraph();
            const layer = poseGraph.addLayer();
            const graph = layer.graph;

            const subgraph1 = graph.addSubgraph();
            subgraph1.name = 'Subgraph1';

            const subgraph1_1 = subgraph1.addSubgraph();
            subgraph1_1.name = 'Subgraph1_1';

            const subgraph1_2 = subgraph1.addSubgraph();
            subgraph1_2.name = 'Subgraph1_2';

            const subgraph1_2PoseNode = subgraph1_2.addPoseNode();
            subgraph1_2PoseNode.name = 'Subgraph1_2PoseNode';

            let nTriggers = 0;

            const addTriggerCondition = (transition: Transition) => {
                const [condition] = transition.conditions = [new TriggerCondition()];
                condition.trigger = `trigger${nTriggers}`;
                poseGraph.addVariable(`trigger${nTriggers}`, VariableType.TRIGGER);
                ++nTriggers;
            };

            addTriggerCondition(
                subgraph1_2.connect(subgraph1_2.entryNode, subgraph1_2PoseNode),
            );

            addTriggerCondition(
                subgraph1.connect(subgraph1.entryNode, subgraph1_1),
            );

            subgraph1_1.connect(subgraph1_1.entryNode, subgraph1_1.exitNode);

            addTriggerCondition(
                subgraph1.connect(subgraph1_1, subgraph1_2),
            );

            addTriggerCondition(
                graph.connect(graph.entryNode, subgraph1),
            );

            const graphEval = createPoseGraphEval(poseGraph, new Node());

            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, { currentNode: null });

            for (let i = 0; i < nTriggers; ++i) {
                graphEval.setValue(`trigger${i}`, true);
            }
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: 'Subgraph1_2PoseNode',
                },
            });
            const triggerStates = Array.from({ length: nTriggers }, (_, iTrigger) => graphEval.getValue(`trigger${iTrigger}`));
            expect(triggerStates).toStrictEqual(new Array(nTriggers).fill(false));
        });

        describe(`Transition priority`, () => {
            test('Transitions to different nodes, use the first-connected and first-matched transition', () => {
                const poseGraph = new PoseGraph();
                const layer = poseGraph.addLayer();
                const graph = layer.graph;
                const poseNode1 = graph.addPoseNode();
                poseNode1.name = 'Node1';
                poseNode1.pose = createEmptyClipPose(1.0);
                const poseNode2 = graph.addPoseNode();
                poseNode2.name = 'Node2';
                poseNode2.pose = createEmptyClipPose(1.0);
                const poseNode3 = graph.addPoseNode();
                poseNode3.name = 'Node3';
                poseNode3.pose = createEmptyClipPose(1.0);
                const transition1 = graph.connect(poseNode1, poseNode2);
                transition1.exitConditionEnabled = true;
                transition1.exitCondition = 0.8;
                const [ transition1Condition ] = transition1.conditions = [ new UnaryCondition() ];
                transition1Condition.operator = UnaryCondition.Operator.TRUTHY;
                transition1Condition.operand.variable = 'switch1';
                const transition2 = graph.connect(poseNode1, poseNode3);
                transition2.exitConditionEnabled = true;
                transition2.exitCondition = 0.8;
                const [ transition2Condition ] = transition2.conditions = [ new UnaryCondition() ];
                transition2Condition.operator = UnaryCondition.Operator.TRUTHY;
                transition2Condition.operand.variable = 'switch2';
                graph.connect(graph.entryNode, poseNode1);
                poseGraph.addVariable('switch1', VariableType.BOOLEAN, false);
                poseGraph.addVariable('switch2', VariableType.BOOLEAN, false);

                // #region Both satisfied
                {
                    const graphEval = createPoseGraphEval(poseGraph, new Node());
                    graphEval.setValue('switch1', true);
                    graphEval.setValue('switch2', true);
                    graphEval.update(0.9);
                    expectPoseGraphEvalStatusLayer0(graphEval, {
                        currentNode: { __DEBUG_ID__: 'Node1' },
                        transition: {
                            time: 0.1,
                            nextNode: { __DEBUG_ID__: 'Node2' },
                        },
                    });
                }
                // #endregion

                // #region The later satisfied
                {
                    const graphEval = createPoseGraphEval(poseGraph, new Node());
                    graphEval.setValue('switch1', false);
                    graphEval.setValue('switch2', true);
                    graphEval.update(0.9);
                    expectPoseGraphEvalStatusLayer0(graphEval, {
                        currentNode: { __DEBUG_ID__: 'Node1' },
                        transition: {
                            time: 0.1,
                            nextNode: { __DEBUG_ID__: 'Node3' },
                        },
                    });
                }
                // #endregion
            });
        });
    });

    describe(`Any state`, () => {
        test('Could not transition to any node', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            expect(() => layerGraph.connect(layerGraph.addPoseNode(), layerGraph.anyNode)).toThrowError(InvalidTransitionError);
        });

        test('Transition from any state node is a kind of pose transition', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const poseNode = layerGraph.addPoseNode();
            const anyTransition = layerGraph.connect(layerGraph.anyNode, poseNode);
            expect(isPoseTransition(anyTransition)).toBe(true);
        });

        test('Any transition', () => {
            const graphEval = createPoseGraphEval(createGraphFromDescription(gAnyTransition), new Node());
            graphEval.update(0.0);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node1' },
            });
        });

        test('Inheritance', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const poseNode = layerGraph.addPoseNode();
            const poseNodeClip = poseNode.pose = createPosePositionX(1.0, 0.5, 'PoseNodeClip');

            const subgraph = layerGraph.addSubgraph();
            subgraph.name = 'Subgraph';
            const subgraphPoseNode = subgraph.addPoseNode();
            const subgraphPoseNodeClip = subgraphPoseNode.pose = createPosePositionX(1.0, 0.7, 'SubgraphPoseNodeClip');
            subgraph.connect(subgraph.entryNode, subgraphPoseNode);

            layerGraph.connect(layerGraph.entryNode, subgraph);
            const anyTransition = layerGraph.connect(layerGraph.anyNode, poseNode) as PoseTransition;
            anyTransition.duration = 0.3;
            anyTransition.exitConditionEnabled = true;
            anyTransition.exitCondition = 0.1;
            const [ triggerCondition ] = anyTransition.conditions = [new TriggerCondition()];
            triggerCondition.trigger = 'trigger';
            graph.addVariable('trigger', VariableType.TRIGGER, true);

            const graphEval = createPoseGraphEval(graph, new Node());
            graphEval.update(0.2);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraphPoseNodeClip.clip!,
                    weight: 0.666667,
                },
                transition: {
                    time: 0.1,
                    next: {
                        clip: poseNodeClip.clip!,
                        weight: 0.333333,
                    },
                },
            });

            graphEval.update(0.2);
            expectPoseGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: poseNodeClip.clip!,
                    weight: 1.0,
                },
            });
        });
    });

    test('State events', () => {
        type Invocation = {
            kind: 'onEnter',
            id: string,
            args: Parameters<StateMachineComponent['onEnter']>;
        } | {
            kind: 'onExit',
            id: string,
            args: Parameters<StateMachineComponent['onExit']>;
        };

        class Recorder extends Component {
            public record = jest.fn<void, [Invocation]>();

            public clear () {
                this.record.mockClear();
            }
        }

        class StatsComponent extends StateMachineComponent {
            public id: string = '';

            onEnter (...args: Parameters<StateMachineComponent['onEnter']>) {
                this._getRecorder(args[0]).record({
                    kind: 'onEnter',
                    id: this.id,
                    args,
                });
            }

            onExit (...args: Parameters<StateMachineComponent['onExit']>) {
                this._getRecorder(args[0]).record({
                    kind: 'onExit',
                    id: this.id,
                    args,
                });
            }

            private _getRecorder(newGenAnim: NewGenAnim): Recorder {
                const receiver = newGenAnim.node.getComponent(Recorder) as Recorder | null;
                expect(receiver).not.toBeNull();
                return receiver!;
            }
        }

        const graph = new PoseGraph();
        const layer = graph.addLayer();
        const layerGraph = layer.graph;

        const poseNode = layerGraph.addPoseNode();
        const poseNodeStats = poseNode.addComponent(StatsComponent);
        poseNodeStats.id = 'PoseNode';
        poseNode.pose = createPosePositionX(1.0, 0.5, 'PoseNodeClip');

        const poseNode2 = layerGraph.addPoseNode();
        const poseNode2Stats = poseNode2.addComponent(StatsComponent);
        poseNode2Stats.id = 'PoseNode2';
        poseNode2.pose = createPosePositionX(1.0, 0.5, 'PoseNode2Clip');

        const poseNode3 = layerGraph.addPoseNode();
        const poseNode3Stats = poseNode3.addComponent(StatsComponent);
        poseNode3Stats.id = 'PoseNode3';
        poseNode3.pose = createPosePositionX(1.0, 0.5, 'PoseNode3Clip');

        const subgraph = layerGraph.addSubgraph();
        const subgraphStats = subgraph.addComponent(StatsComponent);
        subgraphStats.id = 'Subgraph';
        const subgraphPoseNode = subgraph.addPoseNode();
        const subgraphPoseNodeStats = subgraphPoseNode.addComponent(StatsComponent);
        subgraphPoseNodeStats.id = 'SubgraphPoseNode';
        subgraphPoseNode.pose = createPosePositionX(1.0, 0.5, 'SubgraphPoseNodeClip');
        subgraph.connect(subgraph.entryNode, subgraphPoseNode);
        const subgraphTransition = subgraph.connect(subgraphPoseNode, subgraph.exitNode);
        subgraphTransition.duration = 0.3;
        subgraphTransition.exitConditionEnabled = true;
        subgraphTransition.exitCondition = 0.7;

        layerGraph.connect(layerGraph.entryNode, poseNode);
        const transition = layerGraph.connect(poseNode, poseNode2);
        transition.duration = 0.3;
        transition.exitConditionEnabled = true;
        transition.exitCondition = 0.7;
        layerGraph.connect(poseNode2, subgraph);
        layerGraph.connect(subgraph, poseNode3);

        const node = new Node();
        const recorder = node.addComponent(Recorder) as Recorder;
        const { graphEval, newGenAnim } = createPoseGraphEval2(graph, node);

        graphEval.update(0.1);
        expect(recorder.record).toHaveBeenCalledTimes(1);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'PoseNode',
            args: [
                newGenAnim,
            ],
        });
        recorder.clear();

        graphEval.update(1.1);
        expect(recorder.record).toHaveBeenCalledTimes(2);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'PoseNode2',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(2, {
            kind: 'onExit',
            id: 'PoseNode',
            args: [
                newGenAnim,
            ],
        });
        recorder.clear();

        graphEval.update(1.0);
        expect(recorder.record).toHaveBeenCalledTimes(3);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'Subgraph',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(2, {
            kind: 'onEnter',
            id: 'SubgraphPoseNode',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(3, {
            kind: 'onExit',
            id: 'PoseNode2',
            args: [
                newGenAnim,
            ],
        });
        recorder.clear();

        graphEval.update(1.0);
        expect(recorder.record).toHaveBeenCalledTimes(3);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'PoseNode3',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(2, {
            kind: 'onExit',
            id: 'SubgraphPoseNode',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(3, {
            kind: 'onExit',
            id: 'Subgraph',
            args: [
                newGenAnim,
            ],
        });
        recorder.clear();
    });

    describe('Animation properties', () => {
        describe('Speed', () => {
            test(`Constant`, () => {
                const graph = new PoseGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.graph;
                const poseNode = layerGraph.addPoseNode();
                poseNode.pose = createPosePositionXLinear(1.0, 0.3, 1.7);
                poseNode.speed.value = 1.2;
                layerGraph.connect(layerGraph.entryNode, poseNode);

                const node = new Node();
                const poseGraphEval = createPoseGraphEval(graph, node);
                poseGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * (0.2 * 1.2 / 1.0),
                );
            });

            test(`Variable`, () => {
                const graph = new PoseGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.graph;
                const poseNode = layerGraph.addPoseNode();
                poseNode.pose = createPosePositionXLinear(1.0, 0.3, 1.7);
                poseNode.speed.variable = 'speed';
                poseNode.speed.value = 1.2;
                graph.addVariable('speed', VariableType.NUMBER, 0.5);
                layerGraph.connect(layerGraph.entryNode, poseNode);

                const node = new Node();
                const poseGraphEval = createPoseGraphEval(graph, node);
                poseGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * (0.2 * 0.5 / 1.0),
                );

                poseGraphEval.setValue('speed', 1.2);
                poseGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * ((0.2 * 0.5 + 0.2 * 1.2) / 1.0),
                );
            });
        });
    });

    describe('Removing nodes', () => {
        test('Could not remove special nodes', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            layerGraph.remove(layerGraph.entryNode);
            layerGraph.remove(layerGraph.exitNode);
            layerGraph.remove(layerGraph.anyNode);
            expect([...layerGraph.nodes()]).toEqual(expect.arrayContaining([
                layerGraph.entryNode,
                layerGraph.exitNode,
                layerGraph.anyNode,
            ]));
        });

        test('Also erase referred transitions', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const node1 = layerGraph.addPoseNode();
            const node2 = layerGraph.addPoseNode();
            const node3 = layerGraph.addPoseNode();
            layerGraph.connect(node1, node2);
            layerGraph.connect(node3, node1);

            layerGraph.remove(node2);
            expect([...layerGraph.getOutgoings(node1)]).toHaveLength(0);
            layerGraph.remove(node3);
            expect([...layerGraph.getIncomings(node1)]).toHaveLength(0);
        });
    });

    describe('Exotic nodes', () => {
        test('Removed nodes are dangling', () => {
            const graph = new PoseGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.graph;
            const node = layerGraph.addPoseNode();
            layerGraph.remove(node);
            expect(() => layerGraph.remove(node)).toThrow();
            expect(() => layerGraph.getIncomings(node)).toThrow();
            expect(() => layerGraph.connect(layerGraph.entryNode, node)).toThrow();
        });

        test('Nodes in different layers are isolated', () => {
            const graph = new PoseGraph();
            const layer1 = graph.addLayer();
            const layerGraph1 = layer1.graph;
            const layer2 = graph.addLayer();
            const layerGraph2 = layer2.graph;
            const node1 = layerGraph1.addPoseNode();
            const node2 = layerGraph2.addPoseNode();
            expect(() => layerGraph2.connect(node2, node1)).toThrow();
        });
    });

    describe('Blender 1D', () => {
        test('Thresholds should have been sorted', () => {
            const blender1D = new PoseBlend1D();
            blender1D.children = [[null, 0.3], [null, 0.2]];
            expect([...blender1D.children].map(([, threshold]) => threshold)).toStrictEqual([0.2, 0.3]);

            blender1D.children = [[null, 0.9], [null, -0.2]];
            expect([...blender1D.children].map(([, threshold]) => threshold)).toStrictEqual([-0.2, 0.9]);
        });

        test('1D Blending', () => {
            const thresholds = [0.1, 0.3] as const;
            const weights = new Array<number>(thresholds.length).fill(0);

            blend1D(weights, thresholds, 0.4);
            expect(weights).toBeDeepCloseTo([0.0, 1.0]);

            blend1D(weights, thresholds, 0.1);
            expect(weights).toBeDeepCloseTo([1.0, 0.0]);

            blend1D(weights, thresholds, 0.3);
            expect(weights).toBeDeepCloseTo([0.0, 1.0]);

            blend1D(weights, thresholds, 0.2);
            expect(weights).toBeDeepCloseTo([0.5, 0.5]);
        });
    });

    describe('Variable not found error', () => {
        test('Missed in conditions', () => {
            expect(() => createPoseGraphEval(createGraphFromDescription(gVariableNotFoundInCondition), new Node())).toThrowError(VariableNotDefinedError);
        });

        test('Missed in pose blend', () => {
            expect(() => createPoseGraphEval(createGraphFromDescription(gVariableNotFoundInPoseBlend), new Node())).toThrowError(VariableNotDefinedError);
        });
    });

    describe('Variable type mismatch error', () => {
        test('pose blend requires numbers', () => {
            expect(() => createPoseGraphEval(createGraphFromDescription(gPoseBlendRequiresNumbers), new Node())).toThrowError(VariableTypeMismatchedError);
        });
    });

    describe('Property binding', () => {
    });
});

function createEmptyClipPose (duration: number, name = '') {
    const clip = new AnimationClip();
    clip.name = name;
    clip.enableTrsBlending = true;
    clip.duration = duration;
    const pose = new AnimatedPose();
    pose.clip = clip;
    return pose;
}

function createPosePositionX(duration: number, value: number, name = '') {
    const clip = new AnimationClip();
    clip.name = name;
    clip.enableTrsBlending = true;
    clip.duration = duration;
    const track = new VectorTrack();
    track.componentsCount = 3;
    track.path.toProperty('position');
    track.channels()[0].curve.assignSorted([[0.0, value]]);
    clip.addTrack(track);
    const pose = new AnimatedPose();
    pose.clip = clip;
    return pose;
}

function createPosePositionXLinear(duration: number, from: number, to: number, name = '') {
    const clip = new AnimationClip();
    clip.name = name;
    clip.enableTrsBlending = true;
    clip.duration = duration;
    const track = new VectorTrack();
    track.componentsCount = 3;
    track.path.toProperty('position');
    track.channels()[0].curve.assignSorted([
        [0.0, from],
        [duration, to],
    ]);
    clip.addTrack(track);
    const pose = new AnimatedPose();
    pose.clip = clip;
    return pose;
}

type MayBeArray<T> = T | T[];

function expectPoseGraphEvalStatusLayer0 (graphEval: PoseGraphEval, status: {
    currentNode?: Parameters<typeof expectPoseNodeStatus>[1];
    current?: Parameters<typeof expectPoseStatuses>[1];
    transition?: {
        time?: number;
        nextNode?: Parameters<typeof expectPoseNodeStatus>[1];
        next?: Parameters<typeof expectPoseStatuses>[1];
    };
}) {
    if (status.currentNode) {
        expectPoseNodeStatus(graphEval.getCurrentPoseNodeStats(0), status.currentNode);
    }
    if (status.current) {
        const currentPoses = Array.from(graphEval.getCurrentPoses(0));
        expectPoseStatuses(currentPoses, status.current);
    }

    const currentTransition = graphEval.getCurrentTransition(0);
    if (!status.transition) {
        expect(currentTransition).toBeNull();
    } else {
        expect(currentTransition).not.toBeNull();
        if (typeof status.transition.time === 'number') {
            expect(currentTransition.time).toBeCloseTo(status.transition.time, 5);
        }
        if (status.transition.nextNode) {
            expectPoseNodeStatus(graphEval.getNextPoseNodeStats(0), status.transition.nextNode);
        }
        if (status.transition.next) {
            expectPoseStatuses(Array.from(graphEval.getNextPoses(0)), status.transition.next);
        }
    }
}

function expectPoseNodeStatus (poseNodeStats: Readonly<PoseNodeStats> | null, expected: null | {
    __DEBUG_ID__?: string;
}) {
    if (!expected) {
        expect(poseNodeStats).toBeNull();
    } else {
        expect(poseNodeStats).not.toBeNull();
        expect(poseNodeStats.__DEBUG_ID__).toBe(expected.__DEBUG_ID__);
    }
}

function expectPoseStatuses (poseStatues: PoseStatus[], expected: MayBeArray<{
    clip?: AnimationClip;
    weight?: number;
}>) {
    const expects = Array.isArray(expected) ? expected : [expected];
    expect(poseStatues).toHaveLength(expects.length);
    for (let i = 0; i < expects.length; ++i) {
        const { clip, weight = 1.0 } = expects[i];
        if (clip) {
            expect(poseStatues[i].clip).toBe(clip);
        }
        expect(poseStatues[i].weight).toBeCloseTo(weight, 5);
    }
}

function createPoseGraphEval (poseGraph: PoseGraph, node: Node): PoseGraphEval {
    const newGenAnim = node.addComponent(NewGenAnim) as NewGenAnim;
    const graphEval = new PoseGraphEval(
        poseGraph,
        node,
        newGenAnim,
    );
    // @ts-expect-error HACK
    newGenAnim._graphEval = graphEval;
    return graphEval;
}

function createPoseGraphEval2 (poseGraph: PoseGraph, node: Node) {
    const newGenAnim = node.addComponent(NewGenAnim) as NewGenAnim;
    const graphEval = new PoseGraphEval(
        poseGraph,
        node,
        newGenAnim,
    );
    // @ts-expect-error HACK
    newGenAnim._graphEval = graphEval;
    return {
        graphEval,
        newGenAnim,
    };
}
