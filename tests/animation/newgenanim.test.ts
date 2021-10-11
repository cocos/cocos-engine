
import { AnimationClip, Component, Node, Vec2, Vec3, warnID } from '../../cocos/core';
import { AnimationBlend1D, AnimationBlend2D, Condition, InvalidTransitionError, VariableNotDefinedError, __getDemoGraphs, ClipMotion, AnimationBlendDirect, VectorTrack, VariableType } from '../../cocos/core/animation/animation';
import { LayerBlending, AnimationGraph, StateMachine, Transition, isAnimationTransition, AnimationTransition } from '../../cocos/core/animation/marionette/animation-graph';
import { createEval } from '../../cocos/core/animation/marionette/create-eval';
import { VariableTypeMismatchedError } from '../../cocos/core/animation/marionette/errors';
import { AnimationGraphEval, StateStatus, ClipStatus } from '../../cocos/core/animation/marionette/graph-eval';
import { createGraphFromDescription } from '../../cocos/core/animation/marionette/__tmp__/graph-from-description';
import gAnyTransition from './graphs/any-transition';
import gUnspecifiedCondition from './graphs/unspecified-condition';
import glUnspecifiedConditionOnEntryNode from './graphs/unspecified-condition-for-non-entry-node';
import gSuccessiveSatisfaction from './graphs/successive-satisfaction';
import gVariableNotFoundInCondition from './graphs/variable-not-found-in-condition';
import gVariableNotFoundInAnimationBlend from './graphs/variable-not-found-in-pose-blend';
import gAnimationBlendRequiresNumbers from './graphs/pose-blend-requires-numbers';
import gInfinityLoop from './graphs/infinity-loop';
import gZeroTimePiece from './graphs/zero-time-piece';
import { blend1D } from '../../cocos/core/animation/marionette/blend-1d';
import '../utils/matcher-deep-close-to';
import { BinaryCondition, UnaryCondition, TriggerCondition } from '../../cocos/core/animation/marionette/condition';
import { AnimationController } from '../../cocos/core/animation/marionette/animation-controller';
import { StateMachineComponent } from '../../cocos/core/animation/marionette/state-machine-component';

describe('NewGen Anim', () => {
    const demoGraphs = __getDemoGraphs();

    test('Defaults', () => {
        const graph = new AnimationGraph();
        expect(graph.layers).toHaveLength(0);
        const layer = graph.addLayer();
        expect(layer.blending).toBe(LayerBlending.additive);
        expect(layer.mask).toBeNull();
        expect(layer.weight).toBe(1.0);
        const layerGraph = layer.stateMachine;
        testGraphDefaults(layerGraph);

        const animState = layerGraph.addMotion();
        expect(animState.name).toBe('');
        expect(animState.speed.variable).toBe('');
        expect(animState.speed.value).toBe(1.0);
        expect(animState.motion).toBeNull();

        testGraphDefaults(layerGraph.addSubStateMachine().stateMachine);

        const clipMotion = new ClipMotion();
        expect(clipMotion.clip).toBeNull();
        
        const animationBlend1D = new AnimationBlend1D();
        expect(Array.from(animationBlend1D.items)).toHaveLength(0);
        expect(animationBlend1D.param.variable).toBe('');
        expect(animationBlend1D.param.value).toBe(0.0);

        const animationBlend2D = new AnimationBlend2D();
        expect(animationBlend2D.algorithm).toBe(AnimationBlend2D.Algorithm.SIMPLE_DIRECTIONAL);
        expect(Array.from(animationBlend2D.items)).toHaveLength(0);
        expect(animationBlend2D.paramX.variable).toBe('');
        expect(animationBlend2D.paramX.value).toBe(0.0);
        expect(animationBlend2D.paramY.variable).toBe('');
        expect(animationBlend2D.paramY.value).toBe(0.0);

        const animationBlendDirect = new AnimationBlendDirect();
        expect(Array.from(animationBlendDirect.items)).toHaveLength(0);

        const transition = layerGraph.connect(layerGraph.entryState, animState);
        testTransitionDefaults(transition);

        const animTransition = layerGraph.connect(animState, animState);
        testTransitionDefaults(animTransition);
        expect(animTransition.duration).toBe(0.3);
        expect(animTransition.exitConditionEnabled).toBe(true);
        expect(animTransition.exitCondition).toBe(1.0);

        function testGraphDefaults(graph: StateMachine) {
            expect(Array.from(graph.states())).toStrictEqual(expect.arrayContaining([
                graph.entryState,
                graph.exitState,
                graph.anyState,
            ]));
            expect(graph.entryState.name).toBe('Entry');
            expect(graph.exitState.name).toBe('Exit');
            expect(graph.anyState.name).toBe('Any');
            expect(Array.from(graph.transitions())).toHaveLength(0);
        }

        function testTransitionDefaults (transition: Transition) {
            expect(transition.conditions).toHaveLength(0);
        }
    });

    describe('Asset transition API', () => {
        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        const layerGraph = layer.stateMachine;
        const n1 = layerGraph.addMotion();
        const n2 = layerGraph.addMotion();
        const trans1 = layerGraph.connect(n1, n2);
        expect([...layerGraph.getOutgoings(n1)].map((t) => t.to)).toContain(n2);
        expect([...layerGraph.getIncomings(n2)].map((t) => t.from)).toContain(n1);

        // There may be multiple transitions between two nodes.
        const trans2 = layerGraph.connect(n1, n2);
        expect(trans2).not.toBe(trans1);
        expect([...layerGraph.getTransition(n1, n2)]).toEqual(expect.arrayContaining([trans1, trans2]));

        // Self transitions are also allowed.
        const n3 = layerGraph.addMotion();
        const selfTransition = layerGraph.connect(n3, n3);
        expect([...layerGraph.getTransition(n3, n3)]).toMatchObject([selfTransition]);
    });

    describe('Transitions', () => {
        test('Could not transition to entry node', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            expect(() => layerGraph.connect(layerGraph.addMotion(), layerGraph.entryState)).toThrowError(InvalidTransitionError);
        });

        test('Could not transition from exit node', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            expect(() => layerGraph.connect(layerGraph.exitState, layerGraph.addMotion())).toThrowError(InvalidTransitionError);
        });

        test('Zero time piece', () => {
            // SPEC: Whenever zero time piece is encountered,
            // no matter the time piece is generated since originally passed to `update()`,
            // or was exhausted and left zero.
            // The following updates at that time would still steadily proceed:
            // - The graph is in transition state and the transition specified 0 duration, then the switch will happened;
            // - The graph is in node state and a transition is judged to be happened, then the graph will run in transition state.
            const graphEval = createAnimationGraphEval(createGraphFromDescription(gZeroTimePiece), new Node());
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'SubStateMachineNode1' },
            });
        });

        test(`Transition: anim -> anim`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const node1 = graph.addMotion();
            node1.motion = createClipMotionPositionX(1.0, 2.0);
            const node2 = graph.addMotion();
            node2.motion = createClipMotionPositionX(1.0, 3.0);
            graph.connect(graph.entryState, node1);
            const transition = graph.connect(node1, node2);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.0;
            
            const rootNode = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, rootNode);
            graphEval.update(0.15);
            expect(rootNode.position).toBeDeepCloseTo(new Vec3(2.5));
        });

        test('Condition not specified', () => {
            const graphEval = createAnimationGraphEval(createGraphFromDescription(gUnspecifiedCondition), new Node());
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
               currentNode: { __DEBUG_ID__: 'asd' },
            });
        });

        test('Condition not specified for non-entry node', () => {
            const graphEval = createAnimationGraphEval(createGraphFromDescription(glUnspecifiedConditionOnEntryNode), new Node());
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node1' },
                transition: {
                    nextNode: { __DEBUG_ID__: 'Node2' },
                },
             });
            graphEval.update(0.32);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node2' },
            });
        });

        test('Successive transitions', () => {
            const graphEval = createAnimationGraphEval(createGraphFromDescription(gSuccessiveSatisfaction), new Node());
            graphEval.update(0.0);
            
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node2' },
            });
        });

        test('Infinity loop', () => {
            const warnMockInstance = warnID as unknown as jest.MockInstance<ReturnType<typeof warnID>, Parameters<typeof warnID>>;
            warnMockInstance.mockClear();

            const graphEval = createAnimationGraphEval(createGraphFromDescription(gInfinityLoop), new Node());
            graphEval.update(0.0);

            expect(warnMockInstance).toBeCalledTimes(1);
            expect(warnMockInstance.mock.calls[0]).toHaveLength(2);
            expect(warnMockInstance.mock.calls[0][0]).toStrictEqual(14000);
            expect(warnMockInstance.mock.calls[0][1]).toStrictEqual(100);
        });

        test('Self transition', () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            
            const animState = graph.addMotion();
            animState.name = 'Node';
            const anim = animState.motion = createClipMotionPositionXLinear(1.0, 0.3, 1.4);
            const clip = anim.clip!;

            graph.connect(graph.entryState, animState);
            
            const selfTransition = graph.connect(animState, animState);
            selfTransition.exitConditionEnabled = true;
            selfTransition.exitCondition = 0.9;
            selfTransition.duration = 0.3;

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);
            
            graphEval.update(0.7);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip,
                    weight: 1.0,
                },
            });
            expect(node.position.x).toBeCloseTo(0.3 + (1.4 - 0.3) * 0.7);

            graphEval.update(0.25);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
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
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const subStateMachine = graph.addSubStateMachine();
            subStateMachine.name = 'Subgraph';
            const subgraphEntryToExit = subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachine.stateMachine.exitState);
            const [subgraphEntryToExitCondition] = subgraphEntryToExit.conditions = [new TriggerCondition()];
            animationGraph.addVariable('subgraphExitTrigger', VariableType.TRIGGER, false);
            subgraphEntryToExitCondition.trigger = 'subgraphExitTrigger';

            graph.connect(graph.entryState, subStateMachine);
            const node = graph.addMotion();
            node.name = 'Node';
            const subgraphToNode = graph.connect(subStateMachine, node);
            const [triggerCondition] = subgraphToNode.conditions = [new TriggerCondition()];

            animationGraph.addVariable('trigger', VariableType.TRIGGER);
            triggerCondition.trigger = 'trigger';

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: null,
            });

            graphEval.setValue('trigger', true);
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: null,
            });

            graphEval.setValue('subgraphExitTrigger', true);
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: 'Node',
                },
            });
        });

        test(`In single frame: exit condition just satisfied or satisfied and remain time`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const animState1 = graph.addMotion();
            animState1.name = 'AnimState';
            const animState1Clip = animState1.motion = createClipMotionPositionX(1.0, 2.0, 'AnimState1Clip');
            
            const animState2 = graph.addMotion();
            animState2.name = 'AnimState';
            const animState2Clip = animState2.motion = createClipMotionPositionX(1.0, 2.0, 'AnimState2Clip');

            graph.connect(graph.entryState, animState1);
            const node1To2 = graph.connect(animState1, animState2);
            node1To2.duration = 0.0;
            node1To2.exitConditionEnabled = true;
            node1To2.exitCondition = 1.0;

            {
                const graphEval = createAnimationGraphEval(animationGraph, new Node());
                graphEval.update(animState1Clip.clip!.duration);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: animState2Clip.clip!,
                        weight: 1.0,
                    },
                });
            }

            {
                const graphEval = createAnimationGraphEval(animationGraph, new Node());
                graphEval.update(animState1Clip.clip!.duration + 0.1);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: animState2Clip.clip!,
                        weight: 1.0,
                    },
                });
            }
        });

        test(`Transition into subgraph`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const animState = graph.addMotion();
            animState.name = 'AnimState';
            const animClip = animState.motion = createClipMotionPositionX(1.0, 2.0, 'AnimStateClip');

            const subStateMachine = graph.addSubStateMachine();
            subStateMachine.name = 'Subgraph';

            const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
            subStateMachineAnimState.name = 'SubgraphAnimState';
            const subStateMachineAnimStateClip = subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 3.0, 'SubgraphAnimStateClip');
            subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);

            const subStateMachineAnimState2 = subStateMachine.stateMachine.addMotion();
            subStateMachineAnimState2.name = 'SubgraphAnimState2';
            const subgraphAnimState2Clip = subStateMachineAnimState2.motion = createClipMotionPositionX(0.1, 3.0, 'SubgraphAnimState2Clip');
            const animToStateMachineAnim1ToAnim2 = subStateMachine.stateMachine.connect(subStateMachineAnimState, subStateMachineAnimState2);
            animToStateMachineAnim1ToAnim2.duration = 0.3;
            animToStateMachineAnim1ToAnim2.exitConditionEnabled = true;
            animToStateMachineAnim1ToAnim2.exitCondition = 1.0;

            graph.connect(graph.entryState, animState);
            const animToStateMachine = graph.connect(animState, subStateMachine);
            animToStateMachine.duration = 0.3;
            animToStateMachine.exitConditionEnabled = true;
            animToStateMachine.exitCondition = 0.0;

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(0.2);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animClip.clip!,
                    weight: 0.33333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: subStateMachineAnimStateClip.clip!,
                        weight: 0.66667,
                    },
                },
            });

            graphEval.update(0.1);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 1.0,
                },
            });

            graphEval.update(subStateMachineAnimStateClip.clip!.duration - 0.3 + 0.1);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 0.66667,
                },
                transition: {
                    time: 0.1,
                    next: {
                        clip: subgraphAnimState2Clip.clip!,
                        weight: 0.33333,
                    },
                },
            });
        });

        test('Transition from sub-state machine', () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const animState = graph.addMotion();
            animState.name = 'AnimState';
            const animClip = animState.motion = createClipMotionPositionX(1.0, 2.0, 'AnimStateClip');

            const {
                subgraph,
                subStateMachineAnimStateClip,
            } = (() => {
                const subStateMachine = graph.addSubStateMachine();
                subStateMachine.name = 'Subgraph';
                
                const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
                subStateMachineAnimState.name = 'SubgraphAnimState';

                const subStateMachineAnimStateClip = subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 3.0, 'SubgraphAnimStateClip');
                subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);

                const subStateMachineAnimStateToExit = subStateMachine.stateMachine.connect(subStateMachineAnimState, subStateMachine.stateMachine.exitState);
                subStateMachineAnimStateToExit.duration = 0.3;
                subStateMachineAnimStateToExit.exitConditionEnabled = true;
                subStateMachineAnimStateToExit.exitCondition = 1.0;

                return {
                    subgraph: subStateMachine,
                    subStateMachineAnimStateClip: subStateMachineAnimStateClip,
                };
            })();

            graph.connect(graph.entryState, subgraph);
            graph.connect(subgraph, animState);

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(
                // exit condition + duration
                subStateMachineAnimStateClip.clip!.duration + 0.2,
            );
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 0.33333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: animClip.clip!,
                        weight: 0.66667,
                    },
                },
            });

            graphEval.update(
                0.10001,
            );
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animClip.clip!,
                },
            });
        });

        test('Transition from sub-state machine to sub-state machine', () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const createSubgraph = (name: string) => {
                const subStateMachine = graph.addSubStateMachine();
                subStateMachine.name = name;

                const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
                subStateMachineAnimState.name = `${name}AnimState`;

                const subStateMachineAnimStateClip = subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 3.0, `${name}AnimStateClip`);
                subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);

                const subgraphAnimStateToExit = subStateMachine.stateMachine.connect(subStateMachineAnimState, subStateMachine.stateMachine.exitState);
                subgraphAnimStateToExit.duration = 0.3;
                subgraphAnimStateToExit.exitConditionEnabled = true;
                subgraphAnimStateToExit.exitCondition = 1.0;

                return {
                    subgraph: subStateMachine,
                    subStateMachineAnimStateClip,
                };
            };

            const {
                subgraph: subgraph1,
                subStateMachineAnimStateClip: subgraph1AnimStateClip,
            } = createSubgraph('Subgraph1');

            const {
                subgraph: subgraph2,
                subStateMachineAnimStateClip: subgraph2AnimStateClip,
            } = createSubgraph('Subgraph2');

            graph.connect(graph.entryState, subgraph1);
            graph.connect(subgraph1, subgraph2);

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(
                // exit condition + duration
                subgraph1AnimStateClip.clip!.duration + 0.2,
            );
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraph1AnimStateClip.clip!,
                    weight: 0.33333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: subgraph2AnimStateClip.clip!,
                        weight: 0.66667,
                    },
                },
            });

            graphEval.update(
                0.10001,
            );
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subgraph2AnimStateClip.clip!,
                },
            });
        });

        describe('Condition', () => {
            function createAnimationGraphForConditionTest(conditions: Condition[]) {
                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const graph = layer.stateMachine;
                const node1 = graph.addMotion();
                node1.name = 'FalsyBranchNode';
                const node2 = graph.addMotion();
                node2.name = 'TruthyBranchNode';
                graph.connect(graph.entryState, node1);
                const transition = graph.connect(node1, node2, conditions);
                transition.duration = 0.0;
                transition.exitConditionEnabled = false;
                return animationGraph;
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
                    const graph = createAnimationGraphForConditionTest([condition]);
                    const graphEval = createAnimationGraphEval(graph, new Node());
                    graphEval.update(0.0);
                    if (output) {
                        expectAnimationGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'TruthyBranchNode' },
                        });
                    } else {
                        expectAnimationGraphEvalStatusLayer0(graphEval, {
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
                    const graph = createAnimationGraphForConditionTest([condition]);
                    const graphEval = createAnimationGraphEval(graph, new Node());
                    graphEval.update(0.0);
                    if (output) {
                        expectAnimationGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'TruthyBranchNode' },
                        });
                    } else {
                        expectAnimationGraphEvalStatusLayer0(graphEval, {
                            currentNode: { __DEBUG_ID__: 'FalsyBranchNode' },
                        });
                    }
                }
            });

            test(`Trigger condition`, () => {
                const condition = new TriggerCondition();
                condition.trigger = 'theTrigger';
                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const graph = layer.stateMachine;
                const node1 = graph.addMotion();
                node1.name = 'FalsyBranchNode';
                const node2 = graph.addMotion();
                node2.name = 'TruthyBranchNode';
                const node3 = graph.addMotion();
                node3.name = 'ExtraNode';
                graph.connect(graph.entryState, node1);
                const transition = graph.connect(node1, node2, [condition]);
                transition.duration = 0.0;
                transition.exitConditionEnabled = false;
                const transition2 = graph.connect(node2, node3, [condition]);
                transition2.duration = 0.0;
                transition2.exitConditionEnabled = false;

                animationGraph.addVariable('theTrigger', VariableType.TRIGGER);

                const graphEval = createAnimationGraphEval(animationGraph, new Node());
                graphEval.update(0.0);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    currentNode: { __DEBUG_ID__: 'FalsyBranchNode' },
                });
                graphEval.setValue('theTrigger', true);
                graphEval.update(0.0);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    currentNode: { __DEBUG_ID__: 'TruthyBranchNode' },
                });
                expect(graphEval.getValue('theTrigger')).toBe(false);
            });
        });

        test('All triggers along the transition path should be reset', () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const subStateMachine1 = graph.addSubStateMachine();
            subStateMachine1.name = 'Subgraph1';

            const subStateMachine1_1 = subStateMachine1.stateMachine.addSubStateMachine();
            subStateMachine1_1.name = 'Subgraph1_1';

            const subStateMachine1_2 = subStateMachine1.stateMachine.addSubStateMachine();
            subStateMachine1_2.name = 'Subgraph1_2';

            const subgraph1_2AnimState = subStateMachine1_2.stateMachine.addMotion();
            subgraph1_2AnimState.name = 'Subgraph1_2AnimState';

            let nTriggers = 0;

            const addTriggerCondition = (transition: Transition) => {
                const [condition] = transition.conditions = [new TriggerCondition()];
                condition.trigger = `trigger${nTriggers}`;
                animationGraph.addVariable(`trigger${nTriggers}`, VariableType.TRIGGER);
                ++nTriggers;
            };

            addTriggerCondition(
                subStateMachine1_2.stateMachine.connect(subStateMachine1_2.stateMachine.entryState, subgraph1_2AnimState),
            );

            addTriggerCondition(
                subStateMachine1.stateMachine.connect(subStateMachine1.stateMachine.entryState, subStateMachine1_1),
            );

            subStateMachine1_1.stateMachine.connect(subStateMachine1_1.stateMachine.entryState, subStateMachine1_1.stateMachine.exitState);

            addTriggerCondition(
                subStateMachine1.stateMachine.connect(subStateMachine1_1, subStateMachine1_2),
            );

            addTriggerCondition(
                graph.connect(graph.entryState, subStateMachine1),
            );

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, { currentNode: null });

            for (let i = 0; i < nTriggers; ++i) {
                graphEval.setValue(`trigger${i}`, true);
            }
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: 'Subgraph1_2AnimState',
                },
            });
            const triggerStates = Array.from({ length: nTriggers }, (_, iTrigger) => graphEval.getValue(`trigger${iTrigger}`));
            expect(triggerStates).toStrictEqual(new Array(nTriggers).fill(false));
        });

        describe(`Transition priority`, () => {
            test('Transitions to different nodes, use the first-connected and first-matched transition', () => {
                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const graph = layer.stateMachine;
                const animState1 = graph.addMotion();
                animState1.name = 'Node1';
                animState1.motion = createEmptyClipMotion(1.0);
                const animState2 = graph.addMotion();
                animState2.name = 'Node2';
                animState2.motion = createEmptyClipMotion(1.0);
                const animState3 = graph.addMotion();
                animState3.name = 'Node3';
                animState3.motion = createEmptyClipMotion(1.0);
                const transition1 = graph.connect(animState1, animState2);
                transition1.exitConditionEnabled = true;
                transition1.exitCondition = 0.8;
                const [ transition1Condition ] = transition1.conditions = [ new UnaryCondition() ];
                transition1Condition.operator = UnaryCondition.Operator.TRUTHY;
                transition1Condition.operand.variable = 'switch1';
                const transition2 = graph.connect(animState1, animState3);
                transition2.exitConditionEnabled = true;
                transition2.exitCondition = 0.8;
                const [ transition2Condition ] = transition2.conditions = [ new UnaryCondition() ];
                transition2Condition.operator = UnaryCondition.Operator.TRUTHY;
                transition2Condition.operand.variable = 'switch2';
                graph.connect(graph.entryState, animState1);
                animationGraph.addVariable('switch1', VariableType.BOOLEAN, false);
                animationGraph.addVariable('switch2', VariableType.BOOLEAN, false);

                // #region Both satisfied
                {
                    const graphEval = createAnimationGraphEval(animationGraph, new Node());
                    graphEval.setValue('switch1', true);
                    graphEval.setValue('switch2', true);
                    graphEval.update(0.9);
                    expectAnimationGraphEvalStatusLayer0(graphEval, {
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
                    const graphEval = createAnimationGraphEval(animationGraph, new Node());
                    graphEval.setValue('switch1', false);
                    graphEval.setValue('switch2', true);
                    graphEval.update(0.9);
                    expectAnimationGraphEvalStatusLayer0(graphEval, {
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

        test(`Transition duration: in seconds`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const animState1 = graph.addMotion();
            animState1.name = 'Node1';
            const { clip: animState1Clip } = animState1.motion = createEmptyClipMotion(4.0);
            const animState2 = graph.addMotion();
            animState2.name = 'Node2';
            const { clip: animState2Clip } = animState2.motion = createEmptyClipMotion(1.0);
            graph.connect(graph.entryState, animState1);
            const transition = graph.connect(animState1, animState2);
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.1;
            transition.duration = 0.3;
            transition.relativeDuration = false;

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(0.1 * animState1Clip.duration + 0.1);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animState1Clip!,
                    weight: 0.666667,
                },
                transition: {
                    duration: 0.3,
                    time: 0.1,
                    next: {
                        clip: animState2Clip!,
                        weight: 0.33333,
                    },
                },
            });
        });

        test(`Transition duration: normalized`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const animState1 = graph.addMotion();
            animState1.name = 'Node1';
            const { clip: animState1Clip } = animState1.motion = createEmptyClipMotion(4.0);
            const animState2 = graph.addMotion();
            animState2.name = 'Node2';
            const { clip: animState2Clip } = animState2.motion = createEmptyClipMotion(1.0);
            graph.connect(graph.entryState, animState1);
            const transition = graph.connect(animState1, animState2);
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.1;
            transition.duration = 0.3;
            transition.relativeDuration = true;

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            const animState1Duration = animState1Clip.duration;
            graphEval.update(0.1 * animState1Duration + 0.1 * animState1Duration);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animState1Clip!,
                    weight: 0.666667,
                },
                transition: {
                    duration: 0.3 * animState1Duration,
                    time: 0.1 * animState1Duration,
                    next: {
                        clip: animState2Clip!,
                        weight: 0.33333,
                    },
                },
            });
        });
    });

    describe(`Any state`, () => {
        test('Could not transition to any node', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            expect(() => layerGraph.connect(layerGraph.addMotion(), layerGraph.anyState)).toThrowError(InvalidTransitionError);
        });

        test('Transition from any state node is a kind of anim transition', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            const animState = layerGraph.addMotion();
            const anyTransition = layerGraph.connect(layerGraph.anyState, animState);
            expect(isAnimationTransition(anyTransition)).toBe(true);
        });

        test('Any transition', () => {
            const graphEval = createAnimationGraphEval(createGraphFromDescription(gAnyTransition), new Node());
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node1' },
            });
        });

        test('Inheritance', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            const animState = layerGraph.addMotion();
            const animClip = animState.motion = createClipMotionPositionX(1.0, 0.5, 'AnimStateClip');

            const subStateMachine = layerGraph.addSubStateMachine();
            subStateMachine.name = 'Subgraph';
            const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
            const subStateMachineAnimStateClip = subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 0.7, 'SubgraphAnimStateClip');
            subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);

            layerGraph.connect(layerGraph.entryState, subStateMachine);
            const anyTransition = layerGraph.connect(layerGraph.anyState, animState) as AnimationTransition;
            anyTransition.duration = 0.3;
            anyTransition.exitConditionEnabled = true;
            anyTransition.exitCondition = 0.1;
            const [ triggerCondition ] = anyTransition.conditions = [new TriggerCondition()];
            triggerCondition.trigger = 'trigger';
            graph.addVariable('trigger', VariableType.TRIGGER, true);

            const graphEval = createAnimationGraphEval(graph, new Node());
            graphEval.update(0.2);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 0.666667,
                },
                transition: {
                    time: 0.1,
                    next: {
                        clip: animClip.clip!,
                        weight: 0.333333,
                    },
                },
            });

            graphEval.update(0.2);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animClip.clip!,
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

            private _getRecorder(newGenAnim: AnimationController): Recorder {
                const receiver = newGenAnim.node.getComponent(Recorder) as Recorder | null;
                expect(receiver).not.toBeNull();
                return receiver!;
            }
        }

        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        const layerGraph = layer.stateMachine;

        const animState = layerGraph.addMotion();
        const animStateStats = animState.addComponent(StatsComponent);
        animStateStats.id = 'AnimState';
        animState.motion = createClipMotionPositionX(1.0, 0.5, 'AnimStateClip');

        const animState2 = layerGraph.addMotion();
        const animState2Stats = animState2.addComponent(StatsComponent);
        animState2Stats.id = 'AnimState2';
        animState2.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState2Clip');

        const animState3 = layerGraph.addMotion();
        const animState3Stats = animState3.addComponent(StatsComponent);
        animState3Stats.id = 'AnimState3';
        animState3.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState3Clip');

        const subStateMachine = layerGraph.addSubStateMachine();
        const subgraphStats = subStateMachine.addComponent(StatsComponent);
        subgraphStats.id = 'Subgraph';
        const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
        const subgraphAnimStateStats = subStateMachineAnimState.addComponent(StatsComponent);
        subgraphAnimStateStats.id = 'SubgraphAnimState';
        subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 0.5, 'SubgraphAnimStateClip');
        subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);
        const subgraphTransition = subStateMachine.stateMachine.connect(subStateMachineAnimState, subStateMachine.stateMachine.exitState);
        subgraphTransition.duration = 0.3;
        subgraphTransition.exitConditionEnabled = true;
        subgraphTransition.exitCondition = 0.7;

        layerGraph.connect(layerGraph.entryState, animState);
        const transition = layerGraph.connect(animState, animState2);
        transition.duration = 0.3;
        transition.exitConditionEnabled = true;
        transition.exitCondition = 0.7;
        layerGraph.connect(animState2, subStateMachine);
        layerGraph.connect(subStateMachine, animState3);

        const node = new Node();
        const recorder = node.addComponent(Recorder) as Recorder;
        const { graphEval, newGenAnim } = createAnimationGraphEval2(graph, node);

        graphEval.update(0.1);
        expect(recorder.record).toHaveBeenCalledTimes(1);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'AnimState',
            args: [
                newGenAnim,
            ],
        });
        recorder.clear();

        graphEval.update(1.1);
        expect(recorder.record).toHaveBeenCalledTimes(2);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'AnimState2',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(2, {
            kind: 'onExit',
            id: 'AnimState',
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
            id: 'SubgraphAnimState',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(3, {
            kind: 'onExit',
            id: 'AnimState2',
            args: [
                newGenAnim,
            ],
        });
        recorder.clear();

        graphEval.update(1.0);
        expect(recorder.record).toHaveBeenCalledTimes(3);
        expect(recorder.record).toHaveBeenNthCalledWith(1, {
            kind: 'onEnter',
            id: 'AnimState3',
            args: [
                newGenAnim,
            ],
        });
        expect(recorder.record).toHaveBeenNthCalledWith(2, {
            kind: 'onExit',
            id: 'SubgraphAnimState',
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
                const graph = new AnimationGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.stateMachine;
                const animState = layerGraph.addMotion();
                animState.motion = createClipMotionPositionXLinear(1.0, 0.3, 1.7);
                animState.speed.value = 1.2;
                layerGraph.connect(layerGraph.entryState, animState);

                const node = new Node();
                const animationGraphEval = createAnimationGraphEval(graph, node);
                animationGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * (0.2 * 1.2 / 1.0),
                );
            });

            test(`Variable`, () => {
                const graph = new AnimationGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.stateMachine;
                const animState = layerGraph.addMotion();
                animState.motion = createClipMotionPositionXLinear(1.0, 0.3, 1.7);
                animState.speed.variable = 'speed';
                animState.speed.value = 1.2;
                graph.addVariable('speed', VariableType.NUMBER, 0.5);
                layerGraph.connect(layerGraph.entryState, animState);

                const node = new Node();
                const animationGraphEval = createAnimationGraphEval(graph, node);
                animationGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * (0.2 * 0.5 / 1.0),
                );

                animationGraphEval.setValue('speed', 1.2);
                animationGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * ((0.2 * 0.5 + 0.2 * 1.2) / 1.0),
                );
            });
        });
    });

    describe('Removing nodes', () => {
        test('Could not remove special nodes', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            layerGraph.remove(layerGraph.entryState);
            layerGraph.remove(layerGraph.exitState);
            layerGraph.remove(layerGraph.anyState);
            expect([...layerGraph.states()]).toEqual(expect.arrayContaining([
                layerGraph.entryState,
                layerGraph.exitState,
                layerGraph.anyState,
            ]));
        });

        test('Also erase referred transitions', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            const node1 = layerGraph.addMotion();
            const node2 = layerGraph.addMotion();
            const node3 = layerGraph.addMotion();
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
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            const node = layerGraph.addMotion();
            layerGraph.remove(node);
            expect(() => layerGraph.remove(node)).toThrow();
            expect(() => layerGraph.getIncomings(node)).toThrow();
            expect(() => layerGraph.connect(layerGraph.entryState, node)).toThrow();
        });

        test('Nodes in different layers are isolated', () => {
            const graph = new AnimationGraph();
            const layer1 = graph.addLayer();
            const layerGraph1 = layer1.stateMachine;
            const layer2 = graph.addLayer();
            const layerGraph2 = layer2.stateMachine;
            const node1 = layerGraph1.addMotion();
            const node2 = layerGraph2.addMotion();
            expect(() => layerGraph2.connect(node2, node1)).toThrow();
        });
    });

    describe('Blender 1D', () => {
        test('Thresholds should have been sorted', () => {
            const createBlend1DItemWithWeight = (threshold: number) => {
                const item = new AnimationBlend1D.Item();
                item.threshold = threshold;
                return item;
            };
            const blender1D = new AnimationBlend1D();
            blender1D.items = [createBlend1DItemWithWeight(0.3), createBlend1DItemWithWeight(0.2)];
            expect([...blender1D.items].map(({ threshold }) => threshold)).toStrictEqual([0.2, 0.3]);

            blender1D.items = [createBlend1DItemWithWeight(0.9), createBlend1DItemWithWeight(-0.2)];
            expect([...blender1D.items].map(({ threshold }) => threshold)).toStrictEqual([-0.2, 0.9]);
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
            expect(() => createAnimationGraphEval(createGraphFromDescription(gVariableNotFoundInCondition), new Node())).toThrowError(VariableNotDefinedError);
        });

        test('Missed in animation blend', () => {
            expect(() => createAnimationGraphEval(createGraphFromDescription(gVariableNotFoundInAnimationBlend), new Node())).toThrowError(VariableNotDefinedError);
        });
    });

    describe('Variable type mismatch error', () => {
        test('animation blend requires numbers', () => {
            expect(() => createAnimationGraphEval(createGraphFromDescription(gAnimationBlendRequiresNumbers), new Node())).toThrowError(VariableTypeMismatchedError);
        });
    });

    describe('Property binding', () => {
    });
});

function createEmptyClipMotion (duration: number, name = '') {
    const clip = new AnimationClip();
    clip.name = name;
    clip.enableTrsBlending = true;
    clip.duration = duration;
    const clipMotion = new ClipMotion();
    clipMotion.clip = clip;
    return clipMotion;
}

function createClipMotionPositionX(duration: number, value: number, name = '') {
    const clip = new AnimationClip();
    clip.name = name;
    clip.enableTrsBlending = true;
    clip.duration = duration;
    const track = new VectorTrack();
    track.componentsCount = 3;
    track.path.toProperty('position');
    track.channels()[0].curve.assignSorted([[0.0, value]]);
    clip.addTrack(track);
    const clipMotion = new ClipMotion();
    clipMotion.clip = clip;
    return clipMotion;
}

function createClipMotionPositionXLinear(duration: number, from: number, to: number, name = '') {
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
    const clipMotion = new ClipMotion();
    clipMotion.clip = clip;
    return clipMotion;
}

type MayBeArray<T> = T | T[];

function expectAnimationGraphEvalStatusLayer0 (graphEval: AnimationGraphEval, status: {
    currentNode?: Parameters<typeof expectStateStatus>[1];
    current?: Parameters<typeof expectClipStatuses>[1];
    transition?: {
        time?: number;
        duration?: number;
        nextNode?: Parameters<typeof expectStateStatus>[1];
        next?: Parameters<typeof expectClipStatuses>[1];
    };
}) {
    if (status.currentNode) {
        expectStateStatus(graphEval.getCurrentStateStatus(0), status.currentNode);
    }
    if (status.current) {
        const currentClipStatuses = Array.from(graphEval.getCurrentClipStatuses(0));
        expectClipStatuses(currentClipStatuses, status.current);
    }

    const currentTransition = graphEval.getCurrentTransition(0);
    if (!status.transition) {
        expect(currentTransition).toBeNull();
    } else {
        expect(currentTransition).not.toBeNull();
        if (typeof status.transition.time === 'number') {
            expect(currentTransition.time).toBeCloseTo(status.transition.time, 5);
        }
        if (typeof status.transition.duration === 'number') {
            expect(currentTransition.duration).toBeCloseTo(status.transition.duration, 5);
        }
        if (status.transition.nextNode) {
            expectStateStatus(graphEval.getNextStateStatus(0), status.transition.nextNode);
        }
        if (status.transition.next) {
            expectClipStatuses(Array.from(graphEval.getNextClipStatuses(0)), status.transition.next);
        }
    }
}

function expectStateStatus (stateStatus: Readonly<StateStatus> | null, expected: null | {
    __DEBUG_ID__?: string;
}) {
    if (!expected) {
        expect(stateStatus).toBeNull();
    } else {
        expect(stateStatus).not.toBeNull();
        expect(stateStatus.__DEBUG_ID__).toBe(expected.__DEBUG_ID__);
    }
}

function expectClipStatuses (clipStatuses: ClipStatus[], expected: MayBeArray<{
    clip?: AnimationClip;
    weight?: number;
}>) {
    const expects = Array.isArray(expected) ? expected : [expected];
    expect(clipStatuses).toHaveLength(expects.length);
    for (let i = 0; i < expects.length; ++i) {
        const { clip, weight = 1.0 } = expects[i];
        if (clip) {
            expect(clipStatuses[i].clip).toBe(clip);
        }
        expect(clipStatuses[i].weight).toBeCloseTo(weight, 5);
    }
}

function createAnimationGraphEval (animationGraph: AnimationGraph, node: Node): AnimationGraphEval {
    const newGenAnim = node.addComponent(AnimationController) as AnimationController;
    const graphEval = new AnimationGraphEval(
        animationGraph,
        node,
        newGenAnim,
    );
    // @ts-expect-error HACK
    newGenAnim._graphEval = graphEval;
    return graphEval;
}

function createAnimationGraphEval2 (animationGraph: AnimationGraph, node: Node) {
    const newGenAnim = node.addComponent(AnimationController) as AnimationController;
    const graphEval = new AnimationGraphEval(
        animationGraph,
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
