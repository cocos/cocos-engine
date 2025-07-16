
import { lerp, Quat, Vec3, warnID } from '../../cocos/core';
import { AnimationBlend1D, AnimationBlend2D, Condition, InvalidTransitionError, VariableNotDefinedError, ClipMotion, AnimationBlendDirect, VariableType, AnimationMask, AnimationGraphVariant } from '../../cocos/animation/marionette/asset-creation';
import { AnimationGraph, StateMachine, Transition, isAnimationTransition, AnimationTransition, State, Layer } from '../../cocos/animation/marionette/animation-graph';
import { VariableTypeMismatchedError } from '../../cocos/animation/marionette/errors';
import { AnimationGraphEval } from '../../cocos/animation/marionette/graph-eval';
import { MotionStateStatus, ClipStatus, MAX_TRANSITIONS_PER_FRAME } from '../../cocos/animation/marionette/state-machine/state-machine-eval';
import { blend1D } from '../../cocos/animation/marionette/motion/blend-1d';
import '../utils/matcher-deep-close-to';
import { BinaryCondition, UnaryCondition, TriggerCondition } from '../../cocos/animation/marionette/state-machine/condition';
import { AnimationController } from '../../cocos/animation/marionette/animation-controller';
import { StateMachineComponent } from '../../cocos/animation/marionette/state-machine/state-machine-component';
import { RealTrack, VectorTrack } from '../../cocos/animation/animation';
import 'jest-extended';
import { assertIsTrue } from '../../cocos/core/data/utils/asserts';
import { additiveSettingsTag, AnimationClip } from '../../cocos/animation/animation-clip';
import { TriggerResetMode, Value } from '../../cocos/animation/marionette/variable';
import { MotionState } from '../../cocos/animation/marionette/state-machine/motion-state';
import { Node, Component } from '../../cocos/scene-graph';
import * as maskTestHelper from './new-gen-anim/utils/mask-test-helper';
import '../utils/matchers/value-type-asymmetric-matchers';
import { AnimationBlend1DFixture, LinearRealValueAnimationFixture, ConstantRealValueAnimationFixture, RealValueAnimationFixture, CreateMotionContext } from './new-gen-anim/utils/fixtures';
import { NodeTransformValueObserver } from './new-gen-anim/utils/node-transform-value-observer';
import { SingleRealValueObserver } from './new-gen-anim/utils/single-real-value-observer';
import { createAnimationGraph, StateParams, TransitionParams } from './new-gen-anim/utils/factory';
import { captureWarns } from '../utils/log-capture';
import { AnimationGraphEvalMock, generateIntervals } from './new-gen-anim/utils/eval-mock';
import { ccclass } from '../../cocos/core/data/class-decorator';

/**
 * Notable changes
 * 
 * #notable-change-3.8-exit-condition
 * 
 * 3.8 change how does state machine work with exit condition.
 * Before, the exit condition is implemented steadily.
 * Say there is a state `A` and a transition from `A` to `B` requiring the condition exit condition `e`.
 * If in some tick, `A`'s normalized time is `e - d_t / 2`, where `d_t` is the tick's delta time.
 * Then, `A --> B` will be triggered in this tick,
 * and `A` will be updated `d_t` time but `B` will be updated `d_t / 2` time.
 * In other words, prior to 3.8:
 * if an exit condition requires no more than tick's delta time to hold,
 * the exit condition will hold and the required time will be subtracted from the tick's delta time.
 * 
 * Even the behavior is steady, it makes the implementation much complex.
 * 
 * This behavior is changed in 3.8.
 * 
 * In above case, in this tick, no transition will be triggered:
 * if an exit condition does not hold before tick, that exit condition won't hold.
 */

const DEFAULT_AROUND_NUM_DIGITS = 5;

describe('NewGen Anim', () => {
    test('Defaults', () => {
        const graph = new AnimationGraph();
        expect(graph.layers).toHaveLength(0);
        const layer = graph.addLayer();
        expect(layer.mask).toBeNull();
        expect(layer.weight).toBe(1.0);
        const layerGraph = layer.stateMachine;
        testGraphDefaults(layerGraph);

        const animState = layerGraph.addMotion();
        expect(animState.name).toBe('');
        expect(animState.speed).toBe(1.0);
        expect(animState.speedMultiplierEnabled).toBe(false);
        expect(animState.speedMultiplier).toBe('');
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
        expect(animTransition.destinationStart).toBe(0.0);
        expect(animTransition.relativeDestinationStart).toBe(false);

        const emptyState = layerGraph.addEmpty();
        const emptyTransition = layerGraph.connect(emptyState, animState);
        expect(emptyTransition.duration).toBe(0.3);
        expect(emptyTransition.destinationStart).toBe(0.0);
        expect(emptyTransition.relativeDestinationStart).toBe(false);

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

    test('Variables', () => {
        const graph = new AnimationGraph();

        for (const [name, type, defaultValue, nonDefaultValue] of [
            ['f', VariableType.FLOAT, 0.0, 3.14],
            ['i', VariableType.INTEGER, 0, 3],
            ['b', VariableType.BOOLEAN, false, true],
        ] as const) {
            graph.addVariable(name, type);
            const variable = assertivelyGetGraphVariable(graph, name);
            expect(variable.type).toBe(type);
            expect(variable.value).toBe(defaultValue);
            variable.value = nonDefaultValue;
            expect(variable.value).toBe(nonDefaultValue);
            
            const name2 = `${name}-add-with-default`;
            graph.addVariable(name2, type, nonDefaultValue);
            const variable2 = assertivelyGetGraphVariable(graph, name2);
            expect(variable2.type).toBe(type);
            expect(variable2.value).toBe(nonDefaultValue);
        }

        {
            graph.addVariable('t', VariableType.TRIGGER);
            const trigger = assertivelyGetGraphVariable(graph, 't');
            expect(trigger.type).toBe(VariableType.TRIGGER);
            expect(trigger.value).toBe(false);
            assertIsTrue(trigger.type === VariableType.TRIGGER);
            expect(trigger.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);
            trigger.value = true;
            expect(trigger.value).toBe(true);
            trigger.resetMode = TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED;
            expect(trigger.resetMode).toBe(TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);

            graph.addVariable('t-with-default-specified', VariableType.TRIGGER, true);
            const triggerWithDefault = assertivelyGetGraphVariable(graph, 't-with-default-specified');
            expect(triggerWithDefault.type).toBe(VariableType.TRIGGER);
            expect(triggerWithDefault.value).toBe(true);
            assertIsTrue(triggerWithDefault.type === VariableType.TRIGGER);
            expect(triggerWithDefault.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);
        }

        graph.removeVariable('f');
        expect(Array.from(graph.variables).every(([name]) => name !== 'f')).toBeTrue();

        // addVariable() replace existing variable.
        graph.addVariable('b', VariableType.FLOAT, 2.0);
        const bVar = assertivelyGetGraphVariable(graph, 'b');
        expect(bVar.type).toBe(VariableType.FLOAT);
        expect(bVar.value).toBe(2.0);
    });

    test('Rename a variable', () => {
        const animationGraph = new AnimationGraph();
        animationGraph.addVariable('a', VariableType.FLOAT, 3.14);
        animationGraph.addVariable('b', VariableType.BOOLEAN, true);
        animationGraph.addVariable('c', VariableType.INTEGER, 66);
        animationGraph.addVariable('d', VariableType.TRIGGER, true);

        const layer = animationGraph.addLayer();
        const stateMachine = layer.stateMachine;
        const motion = stateMachine.addMotion();
        motion.speedMultiplier = 'a';

        const expectedSnapshot: Array<[string, { type: VariableType, value: any; }]> = [
            ['a', { type: VariableType.FLOAT, value: 3.14 }],
            ['b', { type: VariableType.BOOLEAN, value: true }],
            ['c', { type: VariableType.INTEGER, value: 66 }],
            ['d', { type: VariableType.TRIGGER, value: true }],
        ];
        const check = () => {
            // Type, value, order are all retained.
            expect([...animationGraph.variables].map(([s, w]) =>
                [s, { type: w.type, value: w.value }])).toStrictEqual(expectedSnapshot);
        };

        // Original name does not exist.
        animationGraph.renameVariable('x', 'y');
        check();

        // New name does exist.
        animationGraph.renameVariable('a', 'b');
        check();

        // Rename the first.
        animationGraph.renameVariable('a', 'A');
        expectedSnapshot[0][0] = 'A';
        check();

        // Rename the last.
        animationGraph.renameVariable('d', 'D');
        expectedSnapshot[3][0] = 'D';
        check();

        // The order is retained.
        animationGraph.renameVariable('b', 'B');
        expectedSnapshot[1][0] = 'B';
        check();

        // Renaming does not touch existing bindings.
        expect(motion.speedMultiplier).toBe('a');
    });

    test('Bugfix cocos/3d-tasks#11980: alter reset mode of trigger variable', () => {
        const animationGraph = new AnimationGraph();
        animationGraph.addVariable('t', VariableType.TRIGGER);
        const t = assertivelyGetGraphVariable(animationGraph, 't');
        expect(t.type).toBe(VariableType.TRIGGER);
        assertIsTrue(t.type === VariableType.TRIGGER);
        expect(t.value).toBe(false);
        expect(t.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);

        t.resetMode = TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED;
        expect(t.value).toBe(false);
        expect(t.resetMode).toBe(TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);
        t.value = true;
        expect(t.value).toBe(true);
        expect(t.resetMode).toBe(TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);

        t.resetMode = TriggerResetMode.AFTER_CONSUMED;
        expect(t.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);
        t.value = false;
        expect(t.value).toBe(false);
        expect(t.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);
    });

    describe('Asset transition API', () => {
        test('Connect', () => {
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
            expect([...layerGraph.getTransitionsBetween(n1, n2)]).toEqual(expect.arrayContaining([trans1, trans2]));
    
            // Self transitions are also allowed.
            const n3 = layerGraph.addMotion();
            const selfTransition = layerGraph.connect(n3, n3);
            expect([...layerGraph.getTransitionsBetween(n3, n3)]).toMatchObject([selfTransition]);
        });

        test('Remove transition by transition object', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            const n1 = layerGraph.addMotion();
            const n2 = layerGraph.addMotion();
            const n3 = layerGraph.addMotion();
            const n4 = layerGraph.addMotion();
            layerGraph.connect(n1, n3);
            const trans1 = layerGraph.connect(n1, n2);
            const trans2 = layerGraph.connect(n1, n2);
            const trans3 = layerGraph.connect(n1, n2);
            layerGraph.connect(n1, n4);

            layerGraph.removeTransition(trans2);
            {
                const transitions = Array.from(layerGraph.getTransitionsBetween(n1, n2));
                expect(transitions).toHaveLength(2);
                expect(transitions[0]).toBe(trans1);
                expect(transitions[1]).toBe(trans3);
            }

            layerGraph.removeTransition(trans1);
            {
                const transitions = Array.from(layerGraph.getTransitionsBetween(n1, n2));
                expect(transitions).toHaveLength(1);
                expect(transitions[0]).toBe(trans3);
            }

            layerGraph.removeTransition(trans3);
            {
                const transitions = Array.from(layerGraph.getTransitionsBetween(n1, n2));
                expect(transitions).toHaveLength(0);
            }
        });

        test('disconnect()', () => {
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const layerGraph = layer.stateMachine;
            const n1 = layerGraph.addMotion();
            const n2 = layerGraph.addMotion();
            const n3 = layerGraph.addMotion();
            const n4 = layerGraph.addMotion();

            layerGraph.connect(n1, n1);
            layerGraph.disconnect(n1, n1);
            expect(Array.from(layerGraph.getTransitionsBetween(n1, n1))).toBeArrayOfSize(0);
            layerGraph.connect(n1, n1);
            layerGraph.connect(n1, n1);
            layerGraph.disconnect(n1, n1);
            expect(Array.from(layerGraph.getTransitionsBetween(n1, n1))).toBeArrayOfSize(0);

            layerGraph.connect(n1, n2);
            layerGraph.disconnect(n1, n2);
            expect(Array.from(layerGraph.getTransitionsBetween(n1, n2))).toBeArrayOfSize(0);

            layerGraph.connect(n1, n3);
            layerGraph.connect(n1, n3);
            layerGraph.connect(n1, n3);
            layerGraph.disconnect(n1, n3);
            expect(Array.from(layerGraph.getTransitionsBetween(n1, n3))).toBeArrayOfSize(0);

            layerGraph.disconnect(n1, n4);
        });

        test('Adjust the transition priority', () => {
            const graph = new AnimationGraph();
            const mainLayer = graph.addLayer();
            const { stateMachine } = mainLayer;
            
            const m0 = stateMachine.addMotion();
            const m1 = stateMachine.addMotion();
            const m2 = stateMachine.addMotion();
            const m3 = stateMachine.addMotion();

            const t01_0 = stateMachine.connect(m0, m1);

            // 1 transition
            stateMachine.adjustTransitionPriority(t01_0, 0);

            const expectPriority = (transitions: Transition[]) => {
                const outgoings = Array.from(stateMachine.getOutgoings(m0));

                // Check the transition's order suggested by `stateMachine.getOutgoings()`.
                expect(outgoings).toStrictEqual(transitions);

                // Check the transition's order suggested by `stateMachine.transitions()`.
                const transitionsInStateMachineWide = [...stateMachine.transitions()].filter((transition) => {
                    return outgoings.includes(transition);
                });
                expect(transitionsInStateMachineWide).toStrictEqual(transitions);
            };

            expectPriority([
                t01_0,
            ]);

            // 4 transitions
            const t01_1 = stateMachine.connect(m0, m1);
            const t02_0 = stateMachine.connect(m0, m2);
            const t03_0 = stateMachine.connect(m0, m3);
            const t03_1 = stateMachine.connect(m0, m3);

            // By default, later-added transitions have lower priorities.
            expectPriority([
                t01_0,
                t01_1,
                t02_0,
                t03_0,
                t03_1,
            ]);

            // Do nothing if diff is zero
            stateMachine.adjustTransitionPriority(t01_1, 0);
            expectPriority([
                t01_0,
                t01_1,
                t02_0,
                t03_0,
                t03_1,
            ]);

            // Adjust 1 -> 3
            stateMachine.adjustTransitionPriority(t01_1, 2);
            expectPriority([
                t01_0,
                t02_0,
                t03_0,
                t01_1,
                t03_1,
            ]);

            // Adjust 1 -> 3 again
            stateMachine.adjustTransitionPriority(t02_0, 2);
            expectPriority([
                t01_0,
                t03_0,
                t01_1,
                t02_0,
                t03_1,
            ]);

            // Adjust 3 -> 1
            stateMachine.adjustTransitionPriority(t02_0, -2);
            expectPriority([
                t01_0,
                t02_0,
                t03_0,
                t01_1,
                t03_1,
            ]);

            // Adjust 3 -> 0
            stateMachine.adjustTransitionPriority(t01_1, -3);
            expectPriority([
                t01_1,
                t01_0,
                t02_0,
                t03_0,
                t03_1,
            ]);

            // Adjust 1 -> 4
            stateMachine.adjustTransitionPriority(t01_0, 3);
            expectPriority([
                t01_1,
                t02_0,
                t03_0,
                t03_1,
                t01_0,
            ]);

            // Adjust 1 -> 7(overflow)
            stateMachine.adjustTransitionPriority(t02_0, 6);
            expectPriority([
                t01_1,
                t03_0,
                t03_1,
                t01_0,
                t02_0,
            ]);

            // Adjust 3 -> -2(underflow)
            stateMachine.adjustTransitionPriority(t01_0, -6);
            expectPriority([
                t01_0,
                t01_1,
                t03_0,
                t03_1,
                t02_0,
            ]);
        });
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
            // since originally passed to `update()`.
            // The following updates at that time would still steadily proceed:
            // - The graph is in transition state and the transition specified 0 duration, then the switch will happened;
            // - The graph is in node state and a transition is judged to be happened, then the graph will run in transition state.
            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: {
                            'Node1': { type: 'motion' },
                            'Node2': {
                                type: 'sub-state-machine',
                                stateMachine: {
                                    states: { 'SubStateMachineNode1': { type: 'motion' } },
                                    entryTransitions: [{ to: 'SubStateMachineNode1' }],
                                    exitTransitions: [{ from: 'SubStateMachineNode1', exitTimeEnabled: true, exitTime: 0.0, duration: 0.0 }],
                                },
                            },
                        },
                        entryTransitions: [{ to: 'Node1' }],
                        exitTransitions: [{ from: 'Node2' }],
                        transitions: [{ from: 'Node1', to: 'Node2', exitTimeEnabled: true, exitTime: 0.0, duration: 0.0 }],
                    }
                }],
            }), new Node());
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
            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: { 'asd': { type: 'motion' } },
                        entryTransitions: [{ to: 'asd' }],
                    },
                }],
            }), new Node());
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
               currentNode: { __DEBUG_ID__: 'asd' },
            });
        });

        test('Condition not specified for non-entry node', () => {
            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: {
                            'Node1': { type: 'motion' },
                            'Node2': { type: 'motion' },
                        },
                        entryTransitions: [{ to: 'Node1' }],
                        transitions: [{ from: 'Node1', to: 'Node2', duration: 0.3, exitTimeEnabled: true, exitTime: 0.0 }],
                    },
                }],
            }), new Node());
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
            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: {
                            'Node1': { type: 'motion' },
                            'Node2': { type: 'motion' },
                        },
                        entryTransitions: [{ to: 'Node1' }],
                        transitions: [{ from: 'Node1', to: 'Node2', duration: 0.0, exitTimeEnabled: true, exitTime: 0.0 }],
                    },
                }],
            }), new Node());
            graphEval.update(0.0);
            
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Node2' },
            });
        });

        test('Warn in loop transition case', () => {
            const warnMockInstance = warnID as unknown as jest.MockInstance<ReturnType<typeof warnID>, Parameters<typeof warnID>>;
            warnMockInstance.mockClear();

            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: {
                            'Node1': { type: 'motion' },
                            'Node2': { type: 'motion' },
                        },
                        entryTransitions: [{ to: 'Node1' }],
                        transitions: [
                            { from: 'Node1', to: 'Node2', duration: 0.0, exitTimeEnabled: true, exitTime: 0.0 },
                            { from: 'Node2', to: 'Node1', duration: 0.0, exitTimeEnabled: true, exitTime: 0.0 }
                        ],
                    },
                }],
            }), new Node());
            graphEval.update(0.0);

            expect(warnMockInstance).toBeCalledTimes(1);
            expect(warnMockInstance.mock.calls[0]).toHaveLength(3);
            expect(warnMockInstance.mock.calls[0][0]).toStrictEqual(14000);
            expect(warnMockInstance.mock.calls[0][1]).toStrictEqual(MAX_TRANSITIONS_PER_FRAME);
            expect(warnMockInstance.mock.calls[0][2]).toStrictEqual(`Entry --> ... --> Node2 --> Node1 --> Node2`);
        });

        test('Warn in not loop but too long transition path case', () => {
            const warnMockInstance = warnID as unknown as jest.MockInstance<ReturnType<typeof warnID>, Parameters<typeof warnID>>;
            warnMockInstance.mockClear();

            const states: Record<string, StateParams> = {};
            const transitions: TransitionParams[] = [];

            const nStates = MAX_TRANSITIONS_PER_FRAME + 2;

            const getStateId = (stateIndex: number) => `State${stateIndex}`;

            for (let i = 0; i < nStates; ++i) {
                states[getStateId(i)] = { type: 'motion' };
            }
            for (let i = 0; i < nStates - 1; ++i) {
                transitions.push({
                    from: getStateId(i),
                    to: getStateId(i + 1),
                    exitTimeEnabled: false,
                    duration: 0.3,
                    conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'constant', value: true, } }],
                });
            }

            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: states,
                        entryTransitions: [{ to: getStateId(0) }],
                        transitions: transitions,
                    },
                }],
            }), new Node());
            graphEval.update(0.1);

            expect(warnMockInstance).toBeCalledTimes(1);
            expect(warnMockInstance.mock.calls[0]).toHaveLength(3);
            expect(warnMockInstance.mock.calls[0][0]).toStrictEqual(14000);
            expect(warnMockInstance.mock.calls[0][1]).toStrictEqual(MAX_TRANSITIONS_PER_FRAME);
            expect(warnMockInstance.mock.calls[0][2]).toStrictEqual(`Entry --> ... --> ${
                Array.from({ length: nStates }, (_, i) => getStateId(i))
                .slice(0, MAX_TRANSITIONS_PER_FRAME)
                .join(' --> ')
            }`);
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

            graphEval.update(0.2 + 1e-6); // Past the exit condition
            graphEval.update(0.05);
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
                // See #notable-change-3.8-exit-condition

                const graphEval = createAnimationGraphEval(animationGraph, new Node());

                graphEval.update(animState1Clip.clip!.duration);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: animState1Clip.clip!,
                        weight: 1.0,
                    },
                });

                graphEval.update(animState1Clip.clip!.duration * 0.01);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: animState2Clip.clip!,
                        weight: 1.0,
                    },
                });
            }

            {
                // See #notable-change-3.8-exit-condition

                const graphEval = createAnimationGraphEval(animationGraph, new Node());
                graphEval.update(animState1Clip.clip!.duration + 0.1);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: animState1Clip.clip!,
                        weight: 1.0,
                    },
                });

                graphEval.update(animState1Clip.clip!.duration * 0.01);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    current: {
                        clip: animState2Clip.clip!,
                        weight: 1.0,
                    },
                });
            }
        });

        test(`Exit time > 1`, () => {
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
            node1To2.duration = 0.3;
            node1To2.exitConditionEnabled = true;
            node1To2.exitCondition = 2.7;

            const graphEval = createAnimationGraphEval(animationGraph, new Node());
            graphEval.update(animState1Clip.clip!.duration * 1.1);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animState1Clip.clip!,
                    weight: 1.0,
                },
            });

            // See #notable-change-3.8-exit-condition
            graphEval.update(animState1Clip.clip!.duration * 1.71);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animState1Clip.clip!,
                    weight: 1.0,
                },
            });

            graphEval.update(animState1Clip.clip!.duration * 0.01);
            const lastTickDeltaTime = animState1Clip.clip!.duration * 0.01;
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animState1Clip.clip!,
                    weight: lerp(1.0, 0.0, lastTickDeltaTime / 0.3),
                },
                transition: {
                    time: lastTickDeltaTime,
                    next: {
                        clip: animState2Clip.clip!,
                        weight: lerp(0.0, 1.0, lastTickDeltaTime / 0.3),
                    },
                },
            });
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

            graphEval.update(subStateMachineAnimStateClip.clip!.duration - 0.3); // Past the exit condition
            graphEval.update(0.1);
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

            graphEval.update(subStateMachineAnimStateClip.clip!.duration); // Past the exit condition
            graphEval.update(0.2);
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

            graphEval.update(subgraph1AnimStateClip.clip!.duration); // Past the exit condition
            graphEval.update(0.2);
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
                    condition.lhs = lhs;
                    condition.rhs = rhs;
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

        describe('Triggers are only reset when a motion state arrived', () => {
            test('Triggers on exit transition', () => {
                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const graph = layer.stateMachine;
    
                const motionState = graph.addMotion();
                motionState.name = 'motionState';
                motionState.motion = createEmptyClipMotion(1.0);
    
                const sm0 = graph.addSubStateMachine();
                {
                    const sm1 = sm0.stateMachine.addSubStateMachine();
                    sm1.name = 'subStateMachine';
                    const subStateMachineMotionState = sm1.stateMachine.addMotion();
                    subStateMachineMotionState.name = 'subStateMachineMotionState';
                    subStateMachineMotionState.motion = createEmptyClipMotion(1.0);
    
                    sm1.stateMachine.connect(sm1.stateMachine.entryState, subStateMachineMotionState);
                    {
                        const subStateMachineExitTransition = sm1.stateMachine.connect(
                            subStateMachineMotionState, sm1.stateMachine.exitState);
                        subStateMachineExitTransition.duration = 0.3;
                        subStateMachineExitTransition.exitConditionEnabled = false;
                        const [subStateMachineExitTransitionTriggerCondition] = subStateMachineExitTransition.conditions = [new TriggerCondition()];
                        subStateMachineExitTransitionTriggerCondition.trigger = 't';
                    }
    
                    sm0.stateMachine.connect(sm0.stateMachine.entryState, sm1);
                    {
                        const [triggerCondition] = sm0.stateMachine.connect(sm1, sm0.stateMachine.exitState).conditions = [new TriggerCondition()];
                        triggerCondition.trigger = 't';
                    }
                }
    
                graph.connect(graph.entryState, sm0);
                {
                    const transition = graph.connect(sm0, motionState);
                    const [triggerCondition] = transition.conditions = [new TriggerCondition()];
                    triggerCondition.trigger = 't';
                }
    
                animationGraph.addVariable('t', VariableType.TRIGGER);
                
                const graphEval = createAnimationGraphEval(animationGraph, new Node());
    
                graphEval.update(0.4);
                expectAnimationGraphEvalStatusLayer0(graphEval, { currentNode: { __DEBUG_ID__: 'subStateMachineMotionState' } });
    
                graphEval.setValue('t', true);
                graphEval.update(0.31);
                expectAnimationGraphEvalStatusLayer0(graphEval, { currentNode: { __DEBUG_ID__: 'motionState' } });
            });

            test('Triggers on transition to sub-state machine', () => {
                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const graph = layer.stateMachine;
    
                const motionState = graph.addMotion();
                motionState.name = 'motionState';
                motionState.motion = createEmptyClipMotion(1.0);
    
                const sm0 = graph.addSubStateMachine();
                {
                    const subStateMachineMotionState = sm0.stateMachine.addMotion();
                    subStateMachineMotionState.name = 'subStateMachineMotionState';
                    subStateMachineMotionState.motion = createEmptyClipMotion(1.0);

                    const [triggerCondition] = sm0.stateMachine.connect(
                        sm0.stateMachine.entryState, subStateMachineMotionState).conditions = [new TriggerCondition()];
                    triggerCondition.trigger = 't';
                }

                graph.connect(graph.entryState, motionState);
                {
                    const transition = graph.connect(motionState, sm0);
                    transition.duration = 0.3;
                    transition.exitConditionEnabled = false;
                    const [triggerCondition] = transition.conditions = [new TriggerCondition()];
                    triggerCondition.trigger = 't';
                }
    
                animationGraph.addVariable('t', VariableType.TRIGGER);
                
                const graphEval = createAnimationGraphEval(animationGraph, new Node());
    
                graphEval.update(0.4);
                expectAnimationGraphEvalStatusLayer0(graphEval, { currentNode: { __DEBUG_ID__: 'motionState' } });
    
                graphEval.setValue('t', true);
                graphEval.update(0.31);
                expectAnimationGraphEvalStatusLayer0(graphEval, { currentNode: { __DEBUG_ID__: 'subStateMachineMotionState' } });
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

        test('Automatic triggers are reset once update ends', () => {
            const triggerName = 't';
            const helpVarName = 'b';

            const condition = new TriggerCondition();
            condition.trigger = triggerName;
            const helpCondition = new UnaryCondition();
            helpCondition.operator = UnaryCondition.Operator.TRUTHY;
            helpCondition.operand.variable = helpVarName;
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const sourceState = graph.addMotion();
            sourceState.name = 'Source';
            const targetState = graph.addMotion();
            targetState.name = 'Target';
            graph.connect(graph.entryState, sourceState);
            const transition = graph.connect(sourceState, targetState, [condition, helpCondition]);
            transition.duration = 0.0;
            transition.exitConditionEnabled = false;

            const triggerVar = animationGraph.addVariable(triggerName, VariableType.TRIGGER, false);
            assertIsTrue(triggerVar.type === VariableType.TRIGGER);
            triggerVar.resetMode = TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED;
            animationGraph.addVariable(helpVarName, VariableType.BOOLEAN);

            // Not set, no transition happened
            const graphEval = createAnimationGraphEval(animationGraph, new Node());
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Source' },
            });

            // Triggered, but other conditions are not satisfied.
            // Still reset since it's "automatic".
            graphEval.setValue(triggerName, true);
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Source' },
            });
            expect(graphEval.getValue(triggerName)).toBe(false);
            // Let's do verify again, and toggle another condition on.
            graphEval.setValue(helpVarName, true);
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Source' },
            });

            // Triggered, and the transition happened.
            graphEval.setValue(triggerName, true);
            graphEval.update(0.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: { __DEBUG_ID__: 'Target' },
            });
            expect(graphEval.getValue(triggerName)).toBe(false);
        });

        describe(`Transition priority`, () => {
            test('Transitions to different nodes', () => {
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
                    graphEval.update(0.8); // Past the exit condition
                    graphEval.update(0.1);
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
                    graphEval.update(0.8); // Past the exit condition
                    graphEval.update(0.1);
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

            test('Non-default priority', () => {
                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const graph = layer.stateMachine;
                const m0 = graph.addMotion();
                m0.motion = createEmptyClipMotion(0.5);
                m0.name = 'm0';
                const m1 = graph.addMotion();
                m1.name = 'm1';
                m1.motion = createEmptyClipMotion(0.6);
                const m2 = graph.addMotion();
                m2.name = 'm2';
                m2.motion = createEmptyClipMotion(0.7);
                const m3 = graph.addMotion();
                m3.name = 'm3';
                m3.motion = createEmptyClipMotion(0.8);

                animationGraph.addVariable('t', VariableType.TRIGGER);

                graph.connect(graph.entryState, m0);
                const t1 = graph.connect(m0, m1);
                t1.exitConditionEnabled = false;
                const [t1Condition] = t1.conditions = [new TriggerCondition()];
                t1Condition.trigger = 't';
                const t2 = graph.connect(m0, m2);
                t2.exitConditionEnabled = false;
                const [t2Condition] = t2.conditions = [new TriggerCondition()];
                t2Condition.trigger = 't';
                const t3 = graph.connect(m0, m3);
                t3.exitConditionEnabled = false;
                const [t3Condition] = t3.conditions = [new TriggerCondition()];
                t3Condition.trigger = 't';

                graph.adjustTransitionPriority(t2, -1);

                const graphEval = createAnimationGraphEval(animationGraph, new Node());
                const graphUpdater = new GraphUpdater(graphEval);

                graphUpdater.step(0.2);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    currentNode: {
                        __DEBUG_ID__: 'm0',
                    },
                });

                graphEval.setValue('t', true);
                graphUpdater.step(0.1);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    currentNode: {
                        __DEBUG_ID__: 'm0',
                    },
                    transition: {
                        nextNode: {
                            __DEBUG_ID__: 'm2',
                        },
                    },
                });
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

            graphEval.update(0.1 * animState1Clip.duration); // Past the exit condition
            graphEval.update(0.1);
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
            graphEval.update(0.1 * animState1Duration); // Past the exit condition
            graphEval.update(0.1 * animState1Duration);
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

        test(`Transition destination start: absolute`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const animState1 = graph.addMotion();
            animState1.name = 'Motion1';
            animState1.motion = createClipMotionPositionXLinear(4.0, 0.6, 0.8);
            const animState2 = graph.addMotion();
            animState2.name = 'Motion2';
            animState2.motion = createClipMotionPositionXLinear(2.2, 3.0, 0.1415);
            graph.connect(graph.entryState, animState1);
            const transition = graph.connect(animState1, animState2);
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.1;
            transition.duration = 0.3;
            transition.relativeDuration = false;
            const TRANSITION_DESTINATION_START = 0.17;
            transition.destinationStart = TRANSITION_DESTINATION_START * 2.2; // 2.2: duration of `animState2`
            transition.relativeDestinationStart = false;

            // Also test the attribute on empty transition
            const layer2 = animationGraph.addLayer();
            const emptyState = layer2.stateMachine.addEmpty();
            layer2.stateMachine.connect(layer2.stateMachine.entryState, emptyState);
            const animState3 = layer2.stateMachine.addMotion();
            animState3.name = 'Motion3';
            animState3.motion = createClipMotionPositionXLinear(6.0, 7.0, -1.9);
            const emptyTransition = layer2.stateMachine.connect(emptyState, animState3);
            emptyTransition.duration = 0.4;
            const EMPTY_TRANSITION_DESTINATION_START = 0.13;
            emptyTransition.destinationStart = EMPTY_TRANSITION_DESTINATION_START * 6.0; // 6.0: duration of `animState3`
            const [emptyTransitionCondition] = emptyTransition.conditions = [new UnaryCondition()];
            emptyTransitionCondition.operator = UnaryCondition.Operator.TRUTHY;
            const emptyTransitionEnablingVarName = emptyTransitionCondition.operand.variable = 'EmptyTransitionEnabling';
            animationGraph.addVariable(emptyTransitionEnablingVarName, VariableType.BOOLEAN);

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);

            const graphUpdater = new GraphUpdater(graphEval);
            graphUpdater.goto(4.0 * 0.1);  // Past the exit condition
            graphUpdater.step(0.2);

            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: 'Motion1',
                    progress: 0.1 + 0.2 / 4.0,
                },
                transition: {
                    nextNode: {
                        __DEBUG_ID__: 'Motion2',
                        progress: TRANSITION_DESTINATION_START + 0.2 / 2.2,
                    },
                },
            });

            expect(node.position.x).toBeCloseTo(
                lerp(
                    lerp(0.6, 0.8, 0.1 + 0.2 / 4.0),
                    lerp(3.0, 0.1415, TRANSITION_DESTINATION_START + 0.2 / 2.2),
                    0.2 / 0.3,
                ),
            );

            // Start the empty transition
            graphEval.setValue(emptyTransitionEnablingVarName, true);
            graphUpdater.step(0.16);
            expect(node.position.x).toBeCloseTo(
                lerp(
                    lerp( // Layer 1
                        3.0,
                        0.1415,
                        TRANSITION_DESTINATION_START + (0.2 + 0.16) / 2.2,
                    ),
                    lerp( // Layer 2
                        7.0,
                        -1.9,
                        EMPTY_TRANSITION_DESTINATION_START + 0.16 / 6.0,
                    ),
                    0.16 / 0.4, // Empty transition ratio
                ),
            );
        });

        test(`Transition destination start: relative`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const animState1 = graph.addMotion();
            animState1.name = 'Motion1';
            animState1.motion = createClipMotionPositionXLinear(4.0, 0.6, 0.8);
            const animState2 = graph.addMotion();
            animState2.name = 'Motion2';
            animState2.motion = createClipMotionPositionXLinear(2.2, 3.0, 0.1415);
            graph.connect(graph.entryState, animState1);
            const transition = graph.connect(animState1, animState2);
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.1;
            transition.duration = 0.3;
            transition.relativeDuration = false;
            const TRANSITION_DESTINATION_START = transition.destinationStart = 0.17;
            transition.relativeDestinationStart = true;

            // Also test the attribute on empty transition
            const layer2 = animationGraph.addLayer();
            const emptyState = layer2.stateMachine.addEmpty();
            layer2.stateMachine.connect(layer2.stateMachine.entryState, emptyState);
            const animState3 = layer2.stateMachine.addMotion();
            animState3.name = 'Motion3';
            animState3.motion = createClipMotionPositionXLinear(6.0, 7.0, -1.9);
            const emptyTransition = layer2.stateMachine.connect(emptyState, animState3);
            emptyTransition.duration = 0.4;
            const EMPTY_TRANSITION_DESTINATION_START = emptyTransition.destinationStart = 0.13;
            emptyTransition.relativeDestinationStart = true;
            const [emptyTransitionCondition] = emptyTransition.conditions = [new UnaryCondition()];
            emptyTransitionCondition.operator = UnaryCondition.Operator.TRUTHY;
            const emptyTransitionEnablingVarName = emptyTransitionCondition.operand.variable = 'EmptyTransitionEnabling';
            animationGraph.addVariable(emptyTransitionEnablingVarName, VariableType.BOOLEAN);

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);

            const graphUpdater = new GraphUpdater(graphEval);
            graphUpdater.goto(4.0 * 0.1); // Past the exit condition
            graphUpdater.step(0.2);

            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: 'Motion1',
                    progress: 0.1 + 0.2 / 4.0,
                },
                transition: {
                    nextNode: {
                        __DEBUG_ID__: 'Motion2',
                        progress: TRANSITION_DESTINATION_START + 0.2 / 2.2,
                    },
                },
            });

            expect(node.position.x).toBeCloseTo(
                lerp(
                    lerp(0.6, 0.8, 0.1 + 0.2 / 4.0),
                    lerp(3.0, 0.1415, TRANSITION_DESTINATION_START + 0.2 / 2.2),
                    0.2 / 0.3,
                ),
            );

            // Start the empty transition
            graphEval.setValue(emptyTransitionEnablingVarName, true);
            graphUpdater.step(0.16);
            expect(node.position.x).toBeCloseTo(
                lerp(
                    lerp( // Layer 1
                        3.0,
                        0.1415,
                        TRANSITION_DESTINATION_START + (0.2 + 0.16) / 2.2,
                    ),
                    lerp( // Layer 2
                        7.0,
                        -1.9,
                        EMPTY_TRANSITION_DESTINATION_START + 0.16 / 6.0,
                    ),
                    0.16 / 0.4, // Empty transition ratio
                ),
            );
        });

        test(`Ran into entry/exit node`, () => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;

            const animState = graph.addMotion();
            animState.name = 'AnimState';
            const animClip = animState.motion = createClipMotionPositionX(1.0, 2.0, 'AnimStateClip');

            const subStateMachine = graph.addSubStateMachine();
            subStateMachine.name = 'SubStateMachine';
            const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
            subStateMachineAnimState.name = 'SubStateMachineAnimState';
            const subStateMachineAnimStateClip = subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 3.0, 'SubStateMachineAnimStateClip');
            subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);
            const subStateMachineAnimStateToExit = subStateMachine.stateMachine.connect(
                subStateMachineAnimState, subStateMachine.stateMachine.exitState);
            subStateMachineAnimStateToExit.exitConditionEnabled = true;
            subStateMachineAnimStateToExit.exitCondition = 1.0;

            graph.connect(graph.entryState, subStateMachine);
            const subStateMachineToAnimState = graph.connect(subStateMachine, animState);
            const [ triggerCondition ] = subStateMachineToAnimState.conditions = [new TriggerCondition()];
            triggerCondition.trigger = 'trigger';

            animationGraph.addVariable('trigger', VariableType.TRIGGER);

            const graphEval = createAnimationGraphEval(animationGraph, new Node());

            graphEval.update(0.5);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 1.0,
                },
            });

            graphEval.update(0.6);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 1.0,
                },
            });

            // Still halt
            graphEval.update(5.0);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 1.0,
                },
            });

            graphEval.setValue('trigger', true);
            graphEval.update(0.1);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: subStateMachineAnimStateClip.clip!,
                    weight: 0.6666667,
                },
                transition: {
                    time: 0.1,
                    next: {
                        clip: animClip.clip!,
                        weight: 0.333333,
                    },
                },
            });
        });

        test(`Empty->Empty transition`, () => {
            // SPEC: if both the transition's start and destination are empty state,
            // the state machine's animation result is as if
            // the state machine is in a single empty state.

            const fixture = {
                initial_value: 0.3,
                layer1_animation_value: 0.8,
                layer1_weight: 0.8,
                layer2_weight: 0.6,
                transition_duration: 0.2,
            };

            const node = new Node();
            node.setPosition(fixture.initial_value, 0.0, 0.0);

            const animationGraph = new AnimationGraph();
            {
                const layer = animationGraph.addLayer();
                layer.weight = fixture.layer1_weight;
                const motionState = layer.stateMachine.addMotion();
                motionState.motion = createClipMotionPositionX(1.0, fixture.layer1_animation_value);
                layer.stateMachine.connect(layer.stateMachine.entryState, motionState);
            }
            {
                const layer = animationGraph.addLayer();
                layer.weight = fixture.layer2_weight;
                const empty1 = layer.stateMachine.addEmpty();
                const empty2 = layer.stateMachine.addEmpty();
                layer.stateMachine.connect(layer.stateMachine.entryState, empty1);
                const transition = layer.stateMachine.connect(empty1, empty2);
                transition.duration = fixture.transition_duration;
                const [condition] = transition.conditions = [new UnaryCondition()];
                condition.operator = UnaryCondition.Operator.TRUTHY;
                condition.operand.value = true;
            }

            const graphEval = createAnimationGraphEval(animationGraph, node);
            const graphUpdater = new GraphUpdater(graphEval);

            graphUpdater.step(fixture.transition_duration * 0.5);

            let expected = fixture.initial_value;
            expected = lerp( // Layer 1
                expected,
                fixture.layer1_animation_value,
                fixture.layer1_weight,
            );
            // Layer 2 has no effect

            expect(expected).toMatchSnapshot(`Expected result`);
            expect(node.position.x).toBeCloseTo(expected, DEFAULT_AROUND_NUM_DIGITS);
        })
    });

    describe('Wrap mode', () => {
        test.each([
            ['Normal', {
                wrapMode: AnimationClip.WrapMode.Normal,
                moments: [{
                    time: 0.0,
                    value: 0.1,
                }, {
                    time: 0.6,
                    value: 0.1 + (0.6 / 0.8) * (0.5 - 0.1),
                }, {
                    time: 0.81,
                    value: 0.5,
                }],
            }],
            ['Loop', {
                wrapMode: AnimationClip.WrapMode.Loop,
                moments: [{
                    time: 0.0,
                    value: 0.1,
                }, {
                    time: 0.6,
                    value: 0.1 + (0.6 / 0.8) * (0.5 - 0.1),
                }, {
                    time: 0.81,
                    value: 0.1 + (0.01 / 0.8) * (0.5 - 0.1),
                }],
            }],
            ['PingPong', {
                wrapMode: AnimationClip.WrapMode.PingPong,
                moments: [{
                    time: 0.0,
                    value: 0.1,
                }, {
                    time: 0.6,
                    value: 0.1 + (0.6 / 0.8) * (0.5 - 0.1),
                }, {
                    time: 0.81,
                    value: 0.5 - (0.01 / 0.8) * (0.5 - 0.1),
                }],
            }],
            ['Reverse', {
                wrapMode: AnimationClip.WrapMode.Reverse,
                moments: [{
                    time: 0.0,
                    value: 0.5,
                }, {
                    time: 0.6,
                    value: 0.5 - (0.6 / 0.8) * (0.5 - 0.1),
                }, {
                    time: 0.81,
                    value: 0.1,
                }],
            }],
        ] as Array<[string, {
            wrapMode: AnimationClip.WrapMode;
            moments: Array<{
                time: number;
                value: number;
            }>;
        }]>)('%s', (_, { wrapMode, moments }) => {
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const graph = layer.stateMachine;
            const animState1 = graph.addMotion();
            animState1.name = 'Node1';
            const { clip: animState1Clip } = animState1.motion = createClipMotionPositionXLinear(0.8, 0.1, 0.5);
            animState1Clip.wrapMode = wrapMode;
            graph.connect(graph.entryState, animState1);

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);

            let currentTime = 0.0;
            for (const { time: momentTime, value: expectedValue } of moments) {
                const delta = momentTime - currentTime;
                currentTime = momentTime;
                graphEval.update(delta);
                expect(node.position.x).toBeCloseTo(expectedValue);
            }
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

        test('Any transition shall only match motion states and procedural pose state', () => {
            const graphEval = createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: {  'Node1': { type: 'motion' } },
                        anyTransitions: [{ to: 'Node1', }],
                    },
                }],
            }), new Node());
            graphEval.update(0.0);
            expect(graphEval.getCurrentStateStatus(0)).toBeNull();
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
            graphEval.update(0.1); // Past the exit condition
            graphEval.update(0.1);
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

        test(`Any state and procedural pose state`, () => {
            const animationGraph = createAnimationGraph({
                variableDeclarations: { 'Transition': { type: 'trigger' } },
                layers: [{
                    stateMachine: {
                        states: {
                            'DestinationState': { type: 'motion', transitionInEventBinding: 'onDestinationStateEntered' },
                            'P': { type: 'procedural', graph: { } },
                        },
                        entryTransitions: [{ to: 'P' }],
                        anyTransitions: [{ to: 'DestinationState', conditions: [{ type: 'trigger', variableName: 'Transition' }], }],
                    },
                }],
            });

            const node = new Node();

            class Listener extends Component {
                onDestinationStateEntered = jest.fn();
            }

            const listener = node.addComponent(Listener) as Listener;

            const evalMock = new AnimationGraphEvalMock(node, animationGraph);

            evalMock.step(0.2);
            expect(listener.onDestinationStateEntered).not.toBeCalled();

            evalMock.controller.setValue('Transition', true);
            evalMock.step(0.2);
            expect(listener.onDestinationStateEntered).toBeCalled();
        });
    });

    describe(`Empty state`, () => {
        test('Single layer: Motion <-> Empty', () => {
            const NODE_DEFAULT_VALUE = 9.0;
            const FIRST_TIME_EMPTY_REST_TIME = 0.2;
            const MOTION_SAMPLE_RESULT_AT = (time: number) => lerp(0.4, 0.6, time / 1.0);
            const EMPTY_TO_MOTION_DURATION = 0.51;
            const MOTION_TO_EMPTY_DURATION = 0.49;
            const MOTION_EXIT_CONDITION = 0.7;

            const graph = new AnimationGraph();
            const clipMotion = createClipMotionPositionXLinear(1.0, 0.4, 0.6, 'AnimStateClip');
            { // Entry -> Empty <-> Motion
                const layer = graph.addLayer();
                const topLevelStateMachine = layer.stateMachine;
                const emptyState = topLevelStateMachine.addEmpty();

                const motionState = topLevelStateMachine.addMotion();
                motionState.motion = clipMotion;

                topLevelStateMachine.connect(topLevelStateMachine.entryState, emptyState);

                const emptyToMotion = topLevelStateMachine.connect(emptyState, motionState);
                emptyToMotion.duration = EMPTY_TO_MOTION_DURATION;
                const [ triggerCondition ] = emptyToMotion.conditions = [
                    new TriggerCondition(),
                ];
                triggerCondition.trigger = 't';
                graph.addVariable('t', VariableType.TRIGGER, false);

                const motionToEmpty = topLevelStateMachine.connect(motionState, emptyState);
                motionToEmpty.duration = MOTION_TO_EMPTY_DURATION;
                motionToEmpty.exitConditionEnabled = true;
                motionToEmpty.exitCondition = MOTION_EXIT_CONDITION;
            }

            const node = new Node();
            node.setPosition(NODE_DEFAULT_VALUE, 0.0, 0.0);

            const graphEval = createAnimationGraphEval(graph, node);

            const updater = new GraphUpdater(graphEval);

            // Empty
            updater.goto(FIRST_TIME_EMPTY_REST_TIME);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: [] },
            ]);
            expect(node.position.x).toBeCloseTo(NODE_DEFAULT_VALUE);

            // Trigger the transition.
            graphEval.setValue('t', true);

            // Start Empty -> Motion
            updater.step(0.15);
            expectAnimationGraphEvalStatus(graphEval, [
                { transition: { next: { clip: clipMotion!.clip, weight: 0.15 / EMPTY_TO_MOTION_DURATION } } },
            ]);
            expect(node.position.x).toBeCloseTo(lerp(
                NODE_DEFAULT_VALUE, // Default
                MOTION_SAMPLE_RESULT_AT(0.15), // Layer 0 result
                0.15 / EMPTY_TO_MOTION_DURATION,
            ));

            // Step for a little while
            updater.step(0.06);
            expectAnimationGraphEvalStatus(graphEval, [
                { transition: { next: { clip: clipMotion!.clip, weight: 0.21 / EMPTY_TO_MOTION_DURATION } } },
            ]);
            expect(node.position.x).toBeCloseTo(lerp(
                NODE_DEFAULT_VALUE, // Default
                MOTION_SAMPLE_RESULT_AT(0.21), // Layer 0 result
                0.21 / EMPTY_TO_MOTION_DURATION,
            ));

            // Step so the transition finished.
            // So as here there is only motion running, with full weight.
            updater.goto(FIRST_TIME_EMPTY_REST_TIME + EMPTY_TO_MOTION_DURATION + 0.02);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: clipMotion!.clip, weight: 1.0 } },
            ]);
            expect(node.position.x).toBeCloseTo(MOTION_SAMPLE_RESULT_AT(EMPTY_TO_MOTION_DURATION + 0.02));

            // Start Motion -> Empty
            updater.goto(FIRST_TIME_EMPTY_REST_TIME + MOTION_EXIT_CONDITION + 1e-6); // Past the exit condition
            updater.step(0.15);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: clipMotion!.clip, weight: 1.0 - 0.15 / MOTION_TO_EMPTY_DURATION }, transition: {} },
            ]);
            expect(node.position.x).toBeCloseTo(lerp(
                MOTION_SAMPLE_RESULT_AT(MOTION_EXIT_CONDITION + 0.15), // Layer 0 result
                NODE_DEFAULT_VALUE, // Default
                0.15 / MOTION_TO_EMPTY_DURATION,
            ));

            // Step for a little while
            updater.step(0.06);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: clipMotion!.clip, weight: 1.0 - 0.21 / MOTION_TO_EMPTY_DURATION }, transition: {} },
            ]);
            expect(node.position.x).toBeCloseTo(lerp(
                MOTION_SAMPLE_RESULT_AT(MOTION_EXIT_CONDITION + 0.21), // Layer 0 result
                NODE_DEFAULT_VALUE, // Default
                0.21 / MOTION_TO_EMPTY_DURATION,
            ));

            // Step so the transition finished.
            // So as here there is only empty state, with full weight.
            updater.goto(FIRST_TIME_EMPTY_REST_TIME + MOTION_EXIT_CONDITION + MOTION_TO_EMPTY_DURATION + 0.01);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: [] },
            ]);
            expect(node.position.x).toBeCloseTo(NODE_DEFAULT_VALUE);
        });

        test('Multiple layers', () => {
            const graph = new AnimationGraph();
            const layer0Clip = createClipMotionPositionX(1.0, 0.6, 'AnimStateClip');
            const layer1Clip = createClipMotionPositionX(1.0, 1.3, 'AnimStateClip');
            {
                const layer = graph.addLayer();
                const topLevelStateMachine = layer.stateMachine;
                const motionState = topLevelStateMachine.addMotion();
                motionState.motion = layer0Clip;
                topLevelStateMachine.connect(topLevelStateMachine.entryState, motionState);
            }
            {
                const layer = graph.addLayer();
                const topLevelStateMachine = layer.stateMachine;
                const emptyState = topLevelStateMachine.addEmpty();
                const motionState = topLevelStateMachine.addMotion();
                motionState.motion = layer1Clip;
                topLevelStateMachine.connect(topLevelStateMachine.entryState, motionState);
                const motionToEmpty = topLevelStateMachine.connect(motionState, emptyState);
                motionToEmpty.exitConditionEnabled = true;
                motionToEmpty.exitCondition = 0.3;
                motionToEmpty.duration = 0.5;
            }
            const node = new Node();

            const graphEval = createAnimationGraphEval(graph, node);

            const updater = new GraphUpdater(graphEval);

            updater.goto(0.2);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: layer0Clip!.clip, weight: 1.0 } },
                { current: { clip: layer1Clip.clip, weight: 1.0 } },
            ]);
            expect(node.position.x).toBeCloseTo(1.3);

            updater.goto(0.3 * 1.0); // Past the exit condition
            updater.step(0.12);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: layer0Clip!.clip, weight: 1.0 } },
                { current: { clip: layer1Clip.clip, weight: 1.0 - 0.12 / 0.5 }, transition: {} },
            ]);
            expect(node.position.x).toBeCloseTo(1.3 * (1.0 - 0.12 / 0.5) + 0.6 * (0.12 / 0.5));
        });
    });

    test('State events', () => {
        type Invocation = {
            kind: 'onMotionStateEnter',
            id: string,
            args: Parameters<StateMachineComponent['onMotionStateEnter']>;
        } | {
            kind: 'onMotionStateUpdate',
            id: string,
            args: Parameters<StateMachineComponent['onMotionStateUpdate']>;
        } | {
            kind: 'onMotionStateExit',
            id: string,
            args: Parameters<StateMachineComponent['onMotionStateExit']>;
        } | {
            kind: 'onStateMachineEnter',
            id: string,
            args: Parameters<StateMachineComponent['onStateMachineEnter']>;
        } | {
            kind: 'onStateMachineExit',
            id: string,
            args: Parameters<StateMachineComponent['onStateMachineExit']>;
        };

        type InvocationKind = Invocation['kind'];

        type MotionStateInvocationKind = 'onMotionStateEnter' | 'onMotionStateUpdate' | 'onMotionStateExit';

        type StateMachineInvocationKind = 'onStateMachineEnter' | 'onStateMachineExit';

        class Recorder extends Component {
            public record = jest.fn<void, [Invocation]>();

            public clear () {
                this.record.mockClear();
            }
        }

        class StatsComponent extends StateMachineComponent {
            public id: string = '';

            onMotionStateEnter (...args: Parameters<StateMachineComponent['onMotionStateEnter']>) {
                this._recordMotionStateInvocation('onMotionStateEnter', ...args);
            }

            onMotionStateUpdate (...args: Parameters<StateMachineComponent['onMotionStateUpdate']>) {
                this._recordMotionStateInvocation('onMotionStateUpdate', ...args);
            }

            onMotionStateExit (...args: Parameters<StateMachineComponent['onMotionStateExit']>) {
                this._recordMotionStateInvocation('onMotionStateExit', ...args);
            }

            onStateMachineEnter (...args: Parameters<StateMachineComponent['onStateMachineEnter']>) {
                this._recordStateMachineInvocation('onStateMachineEnter', ...args);
            }

            onStateMachineExit (...args: Parameters<StateMachineComponent['onStateMachineExit']>) {
                this._recordStateMachineInvocation('onStateMachineExit', ...args);
            }

            private _getRecorder(newGenAnim: AnimationController): Recorder {
                const receiver = newGenAnim.node.getComponent(Recorder) as Recorder | null;
                expect(receiver).not.toBeNull();
                return receiver!;
            }

            private _recordMotionStateInvocation<TKind extends MotionStateInvocationKind>(
                kind: TKind,
                ...args: Parameters<StateMachineComponent[TKind]>
            ) {
                this._getRecorder(args[0]).record({
                    kind: kind,
                    id: this.id,
                    args: this._saveMotionStateCallbackArgs(...args),
                });
            }

            private _saveMotionStateCallbackArgs<TKind extends MotionStateInvocationKind>(
                ...args: Parameters<StateMachineComponent[TKind]>
            ) {
                return [
                    args[0],
                    {
                        ...args[1],
                    },
                ] as Parameters<StateMachineComponent[TKind]>;
            }

            private _recordStateMachineInvocation<TKind extends StateMachineInvocationKind>(
                kind: TKind,
                ...args: Parameters<StateMachineComponent[TKind]>
            ) {
                this._getRecorder(args[0]).record({
                    kind: kind,
                    id: this.id,
                    args: args,
                });
            }
        }

        const fixture = {
            anim_state_1: {
                duration: 0.4,
            },
            anim_state_2: {
                duration: 1.0,
            },
        } as const;

        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        const layerGraph = layer.stateMachine;

        const animState = layerGraph.addMotion();
        const animStateStats = animState.addComponent(StatsComponent);
        animStateStats.id = 'AnimState';
        animState.motion = createClipMotionPositionX(fixture.anim_state_1.duration, 0.5, 'AnimStateClip');

        const animState2 = layerGraph.addMotion();
        const animState2Stats = animState2.addComponent(StatsComponent);
        animState2Stats.id = 'AnimState2';
        animState2.motion = createClipMotionPositionX(fixture.anim_state_2.duration, 0.5, 'AnimState2Clip');

        const animState2_1 = layerGraph.addMotion();
        {
            const animState2_1Stats = animState2_1.addComponent(StatsComponent);
            animState2_1Stats.id = 'AnimState2_1';
            animState2_1.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState2_1Clip');
        }

        const animState2_2 = layerGraph.addMotion();
        {
            const animState2_2Stats = animState2_2.addComponent(StatsComponent);
            animState2_2Stats.id = 'AnimState2_2';
            animState2_2.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState2_2Clip');
        }

        const animState2_3 = layerGraph.addMotion();
        {
            const animState2_3Stats = animState2_3.addComponent(StatsComponent);
            animState2_3Stats.id = 'AnimState2_3';
            animState2_3.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState2_3Clip');
        }

        const animState3 = layerGraph.addMotion();
        const animState3Stats = animState3.addComponent(StatsComponent);
        animState3Stats.id = 'AnimState3';
        animState3.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState3Clip');

        const subStateMachine = layerGraph.addSubStateMachine();
        const subgraphStats = subStateMachine.addComponent(StatsComponent);
        subgraphStats.id = 'SubSM';
        const subStateMachineAnimState = subStateMachine.stateMachine.addMotion();
        const subgraphAnimStateStats = subStateMachineAnimState.addComponent(StatsComponent);
        subgraphAnimStateStats.id = 'SubSMAnimState';
        subStateMachineAnimState.motion = createClipMotionPositionX(1.0, 0.5, 'SubSMAnimStateClip');
        subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, subStateMachineAnimState);
        const subgraphTransition = subStateMachine.stateMachine.connect(subStateMachineAnimState, subStateMachine.stateMachine.exitState);
        subgraphTransition.duration = 0.3;
        subgraphTransition.exitConditionEnabled = true;
        subgraphTransition.exitCondition = 0.7;

        layerGraph.connect(layerGraph.entryState, animState);

        {
            const transition = layerGraph.connect(animState, animState2);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.7;
        }

        {
            const transition = layerGraph.connect(animState2, animState2_1);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.7;
        }

        {
            const transition = layerGraph.connect(animState2_1, animState2_2);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.7;
        }

        {
            const transition = layerGraph.connect(animState2_2, animState2_3);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.7;
        }

        {
            const transition = layerGraph.connect(animState2_3, subStateMachine);
            transition.duration = 0.3;
            transition.exitConditionEnabled = true;
            transition.exitCondition = 0.7;
        }

        layerGraph.connect(subStateMachine, animState3);

        const node = new Node();
        const recorder = node.addComponent(Recorder) as Recorder;
        const { graphEval, newGenAnim } = createAnimationGraphEval2(graph, node);

        const graphUpdater = new GraphUpdater(graphEval);

        // Goto the AnimState, but does not trigger the transition
        graphUpdater.step(0.1);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState',
                status: { progress: 0.0, },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState',
                status: { progress: 0.1 / fixture.anim_state_1.duration, },
            }
        ]);
        recorder.clear();

        // Case: delta time is big than current requirement of exit condition.
        // See #notable-change-3.8-exit-condition
        graphUpdater.step(0.31);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current, fixture.anim_state_1.duration) },
            },
        ]);
        recorder.clear();

        // Next tick, the exit condition is satisfied. Even the delta time is small.
        // Transition begins.
        const TIME_MARK_ANIM_STATE2_ENTER = graphUpdater.current;
        graphUpdater.step(1e-2);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState2',
                status: { progress: 0.0, },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current, fixture.anim_state_1.duration) },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2',
                status: { progress: calculateExpectedMotionStatusProgress((graphUpdater.current - TIME_MARK_ANIM_STATE2_ENTER), fixture.anim_state_2.duration) },
            },
        ]);
        recorder.clear();

        // AnimState1 will exit in this tick.
        // When it trigger the exit hook, the "progress" would be the progress before tick start.
        const ANIM_STATE_1_ACTUAL_EXIT_TIME = graphUpdater.current;
        graphUpdater.step(
            (0.3 - (graphUpdater.current - TIME_MARK_ANIM_STATE2_ENTER)) + // Finish the transition
            0.1, // Update the AnimState2, but do not trigger next transition
        );
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateExit',
                id: 'AnimState',
                status: { progress: calculateExpectedMotionStatusProgress(ANIM_STATE_1_ACTUAL_EXIT_TIME, fixture.anim_state_1.duration), },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2',
                status: { progress: (0.3 + 0.1) / 1.0, },
            },
        ]);
        recorder.clear();

        // Edge case: delta time is big than requirement of exit condition + transition duration.
        graphUpdater.goto(TIME_MARK_ANIM_STATE2_ENTER + 1.0 * 0.7 + 0.3 + 1e-2);
        // Still: no transition is triggered.
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_ANIM_STATE2_ENTER, 1.0) },
            },
        ]);
        recorder.clear();

        // In next tick, the transition is triggered, but it won't be die until duration arrived.
        const TIME_MARK_ANIM_STATE2_1_ENTER = graphUpdater.current;
        graphUpdater.step(0.1);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState2_1',
                status: { progress: 0.0 },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_ANIM_STATE2_ENTER, 1.0), },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_1',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_ANIM_STATE2_1_ENTER, 1.0) },
            }
        ]);
        recorder.clear();

        // Goto the transition's complete point.
        const TIME_MARK_ANIM_STATE2_EXIT = graphUpdater.current;
        graphUpdater.goto(TIME_MARK_ANIM_STATE2_1_ENTER + 0.3 + 0.01);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateExit',
                id: 'AnimState2',
                status: { progress: calculateExpectedMotionStatusProgress(TIME_MARK_ANIM_STATE2_EXIT - TIME_MARK_ANIM_STATE2_ENTER, 1.0) },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_1',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_ANIM_STATE2_1_ENTER, 1.0) },
            }
        ]);
        recorder.clear();

        graphUpdater.goto(TIME_MARK_ANIM_STATE2_1_ENTER + 1.0 * 0.7 + 1e-6); // Past exit condition of AnimState2_1
        const TIME_MARK_ANIM_STATE2_2_ENTER = graphUpdater.current;
        graphUpdater.step(0.3 + 1e-6); // Finish AnimState2_1 -> AnimState2_2.
        graphUpdater.goto(TIME_MARK_ANIM_STATE2_2_ENTER + 1.0 * 0.7 + 1e-2); // Past exit condition of AnimState2_2
        const TIME_MARK_ANIM_STATE2_3_ENTER = graphUpdater.current;
        graphUpdater.step(0.3 + 1e-1); // Finish AnimState2_2 -> AnimState2_3
        expectMotionStateRecordCalls([
            // -----
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_1',
            },
            // ------
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState2_2',
                status: { },
            },
            {
                kind: 'onMotionStateExit',
                id: 'AnimState2_1',
                status: { },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_2',
            },
            // ------
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_2',
            },
            // ------
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState2_3',
                status: { },
            },
            {
                kind: 'onMotionStateExit',
                id: 'AnimState2_2',
                status: { },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_3',
                status: { },
            },
        ]);
        recorder.clear();

        // Test state machine start events
        graphUpdater.goto(TIME_MARK_ANIM_STATE2_3_ENTER + 1.0 * 0.7 + 1e-6); // Past exit condition of AnimState2_3
        recorder.clear();
        const TIME_MARK_SUB_SM_ANIM_STATE_ENTER = graphUpdater.current;
        graphUpdater.step(0.1); // Trigger AnimState2_3 -> SubSMAnimState and step for a little while, but don't finish the transition
        expectMotionStateRecordCalls([
            {
                kind: 'onStateMachineEnter',
                id: 'SubSM',
            },
            {
                kind: 'onMotionStateEnter',
                id: 'SubSMAnimState',
                status: { progress: 0.0 },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_3',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_ANIM_STATE2_3_ENTER, 1.0) },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'SubSMAnimState',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_SUB_SM_ANIM_STATE_ENTER, 1.0) },
            },
        ]);
        recorder.clear();

        // Prepare for testing state machine exit events
        // Finish [AnimState2_3 -> SubSMAnimState], also step the SubSMAnimState for a little while
        graphUpdater.goto(TIME_MARK_SUB_SM_ANIM_STATE_ENTER + 0.3 + 1e-1);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateExit',
                id: 'AnimState2_3',
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'SubSMAnimState',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_SUB_SM_ANIM_STATE_ENTER, 1.0) },
            },
        ]);
        recorder.clear();

        // Test state machine exit events
        graphUpdater.goto(TIME_MARK_SUB_SM_ANIM_STATE_ENTER + 1.0 * 0.7 + 1e-2); // SubSMAnimState reaches its exit condition
        recorder.clear();
        const TIME_MARK_ANIM_STATE3_ENTER = graphUpdater.current;
        graphUpdater.step(0.3 + 0.1); // Trigger [SubSMAnimState -> Exit -> AnimState3], and finish it.
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState3',
                status: { progress: 0.0 },
            },
            {
                kind: 'onMotionStateExit',
                id: 'SubSMAnimState',
                status: { },
            },
            {
                kind: 'onStateMachineExit',
                id: 'SubSM',
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState3',
                status: { progress: calculateExpectedMotionStatusProgress(graphUpdater.current - TIME_MARK_ANIM_STATE3_ENTER, 1.0) },
            },
        ]);
        recorder.clear();

        function expectMotionStateRecordCalls(expects: Parameters<typeof expectRecordCall>[1][]) {
            expect(recorder.record).toHaveBeenCalledTimes(expects.length);
            for (let i = 0; i < expects.length; ++i) {
                expectRecordCall(i, expects[i]);
            }
        }

        function expectRecordCall(nth: number, {
            id,
            kind,
            status,
        }: {
            id: string;
            kind: MotionStateInvocationKind;
            status?: Parameters<typeof expectMotionStateStatus>[1];
        } | {
            id: string;
            kind: StateMachineInvocationKind;
            status?: undefined,
        }) {
            const invocation = recorder.record.mock.calls[nth][0] as Invocation;
            expect(`${invocation.kind}@${invocation.id}`).toBe(`${kind}@${id}`);
            switch (kind) {
                case 'onStateMachineEnter':
                case 'onStateMachineExit':
                    expect(invocation.args).toHaveLength(1);
                    break;
                default:
                    expect(invocation.args).toHaveLength(2);
                    if (status) {
                        expectMotionStateStatus(invocation.args[1]!, status);
                    }
                    break;
            }
            expect(invocation.args[0]).toBe(newGenAnim);
        }
    });

    describe('Animation properties', () => {
        describe('Speed & Speed Multiplier', () => {
            test(`Constant`, () => {
                const graph = new AnimationGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.stateMachine;
                const animState = layerGraph.addMotion();
                animState.motion = createClipMotionPositionXLinear(1.0, 0.3, 1.7);
                animState.speed = 1.2;
                animState.speedMultiplierEnabled = false;
                animState.speedMultiplier = 'speed';
                graph.addVariable('speed', VariableType.FLOAT, 0.5);
                layerGraph.connect(layerGraph.entryState, animState);

                const node = new Node();
                const animationGraphEval = createAnimationGraphEval(graph, node);
                animationGraphEval.update(0.2);
                expect(node.position.x).toBeCloseTo(
                    0.3 + (1.7 - 0.3) * (0.2 * 1.2 / 1.0),
                );
            });

            test(`Negative constant`, () => {
                const graph = new AnimationGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.stateMachine;
                const animState = layerGraph.addMotion();
                animState.motion = createClipMotionPositionXLinear(1.0, 0.3, 1.7);
                animState.speed = -1.2;
                animState.speedMultiplierEnabled = false;
                animState.speedMultiplier = 'speed';
                graph.addVariable('speed', VariableType.FLOAT, 0.5);
                layerGraph.connect(layerGraph.entryState, animState);

                const node = new Node();
                const animationGraphEval = createAnimationGraphEval(graph, node);
                animationGraphEval.update(0.2);
                const elapsedTime = 0.2 * -1.2;
                const div = elapsedTime / 1.0;
                const frac = div - Math.trunc(div);
                const ratio = frac > 0 ? frac : 1.0 + frac;
                expectAnimationGraphEvalStatusLayer0(animationGraphEval, {
                    currentNode: {
                        progress: ratio,
                    },
                });
                expect(node.position.x).toBeCloseTo(
                    lerp(0.3, 1.7, ratio),
                );
            });

            test(`Variable`, () => {
                const FIXED_SPEED = 0.9;
                const MOTION_DURATION = 1.0;
                const MOTION_VALUE_FROM = 0.3;
                const MOTION_VALUE_TO = 1.7;

                const graph = new AnimationGraph();
                expect(graph.layers).toHaveLength(0);
                const layer = graph.addLayer();
                const layerGraph = layer.stateMachine;
                const animState = layerGraph.addMotion();
                animState.motion = createClipMotionPositionXLinear(MOTION_DURATION, MOTION_VALUE_FROM, MOTION_VALUE_TO);
                animState.speed = FIXED_SPEED;
                animState.speedMultiplierEnabled = true;
                animState.speedMultiplier = 'speed';
                graph.addVariable('speed', VariableType.FLOAT, 0.5);
                layerGraph.connect(layerGraph.entryState, animState);

                const node = new Node();
                const animationGraphEval = createAnimationGraphEval(graph, node);

                let MOTION_TIME_ELAPSED = 0.0;

                const check = () => {
                    const div = MOTION_TIME_ELAPSED / MOTION_DURATION;
                    const frac = div - Math.trunc(div);
                    const progress = frac > 0 ? frac : 1.0 + frac;
                    expectAnimationGraphEvalStatusLayer0(animationGraphEval, {
                        currentNode: {
                            progress,
                        },
                    });
                    expect(node.position.x).toBeCloseTo(
                        lerp(
                            MOTION_VALUE_FROM,
                            MOTION_VALUE_TO,
                            progress,
                        ),
                    );
                };

                // Default speed
                animationGraphEval.update(0.1);
                MOTION_TIME_ELAPSED += 0.1 * (0.5 * FIXED_SPEED);
                check();

                // Positive speed
                animationGraphEval.setValue('speed', 1.2);
                animationGraphEval.update(0.2);
                MOTION_TIME_ELAPSED += 0.2 * (0.9 * 1.2);
                check();

                // Zero speed
                animationGraphEval.setValue('speed', 0.0);
                animationGraphEval.update(0.3);
                MOTION_TIME_ELAPSED += 0.0;
                check();

                // Negative speed
                animationGraphEval.setValue('speed', -1.3);
                animationGraphEval.update(0.4);
                MOTION_TIME_ELAPSED += 0.4 * (-1.3 * FIXED_SPEED);
                check();
            });

            test(`Clip inherent speed`, () => {
                const fixture = {
                    clip_animation: new LinearRealValueAnimationFixture(1, 2, 0.5),
                    speed: 0.8,
                };

                const valueObserver = new SingleRealValueObserver();

                const animationGraph = new AnimationGraph();
                const layer = animationGraph.addLayer();
                const stateMachine = layer.stateMachine;
                const motionState = stateMachine.addMotion();
                const clipMotion = motionState.motion = fixture.clip_animation.createMotion(valueObserver.getCreateMotionContext());
                clipMotion.clip.speed = 0.8;
                stateMachine.connect(stateMachine.entryState, motionState);

                const graphEval = createAnimationGraphEval(animationGraph, valueObserver.root);
                const graphUpdater = new GraphUpdater(graphEval);

                graphUpdater.step(fixture.clip_animation.duration);
                expect(valueObserver.value).toBeCloseTo(
                    fixture.clip_animation.getExpected(fixture.clip_animation.duration * clipMotion.clip.speed),
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
            expect(() => createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: { 'Node1': { type: 'motion' }  },
                        entryTransitions: [{ to: 'Node1', conditions: [{
                            type: 'unary',
                            operator: 'to-be-true',
                            operand: { type: 'variable', name: 'asd' },
                        }] }],
                    },
                }],
            }), new Node())).toThrowError(VariableNotDefinedError);
        });

        test('Missed in animation blend', () => {
            expect(() => createAnimationGraphEval(createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: {
                            'Node1': {
                                type: 'motion',
                                motion: {
                                    type: 'animation-blend-1d',
                                    param: { type: 'variable', name: 'asd' },
                                    items: [{
                                        motion: { type: 'clip-motion' },
                                        threshold: 0.0,
                                    }, {
                                        motion: { type: 'clip-motion' },
                                        threshold: 1.0,
                                    }],
                                },
                            },
                        },
                    },
                }],
            }), new Node())).toThrowError(VariableNotDefinedError);
        });
    });

    describe('Variable type mismatch error', () => {
        test('animation blend requires numbers', () => {
            expect(() => createAnimationGraphEval(createAnimationGraph({
                variableDeclarations: { 'v': { type: 'boolean', value: false } },
                layers: [{
                    stateMachine: {
                        states: {
                            'Node1': {
                                type: 'motion',
                                motion: {
                                    type: 'animation-blend-1d',
                                    param: { type: 'variable', name: 'v' },
                                    items: [{
                                        motion: { type: 'clip-motion' },
                                        threshold: 0.0,
                                    }, {
                                        motion: { type: 'clip-motion' },
                                        threshold: 1.0,
                                    }],
                                },
                            },
                        },
                    },
                }],
            }), new Node())).toThrowError(VariableTypeMismatchedError);
        });
    });

    describe('Property binding', () => {
    });

    test(`Runtime variable manipulation`, () => {
        const animationGraph = new AnimationGraph();
        animationGraph.addVariable('i0', VariableType.INTEGER, 0);
        animationGraph.addVariable('i1', VariableType.INTEGER, 2);
        animationGraph.addVariable('f0', VariableType.FLOAT, 0.0);
        animationGraph.addVariable('f1', VariableType.FLOAT, 3.14);
        animationGraph.addVariable('b0', VariableType.BOOLEAN, true);
        animationGraph.addVariable('b1', VariableType.BOOLEAN, false);
        animationGraph.addVariable('t0', VariableType.TRIGGER, true);
        animationGraph.addVariable('t1', VariableType.TRIGGER, false);
        const node = new Node();
        const { newGenAnim: controller } = createAnimationGraphEval2(animationGraph, node);
        expect(Array.from(controller.getVariables()).map(
            ([name, { type }]) => [name, type, controller.getValue(name)] as const)).toIncludeAllMembers([
            ['i0', VariableType.INTEGER, 0],
            ['i1', VariableType.INTEGER, 2],
            ['f0', VariableType.FLOAT, 0.0],
            ['f1', VariableType.FLOAT, 3.14],
            ['b0', VariableType.BOOLEAN, true],
            ['b1', VariableType.BOOLEAN, false],
            ['t0', VariableType.TRIGGER, true],
            ['t1', VariableType.TRIGGER, false],
        ]);
        controller.setValue('i0', 3);
        controller.setValue('i1', 4);
        controller.setValue('f0', 1.0);
        controller.setValue('f1', 6.28);
        controller.setValue('b0', false);
        controller.setValue('b1', true);
        controller.setValue('t0', false);
        controller.setValue('t1', true);
        expect(Array.from(controller.getVariables()).map(
            ([name, { type }]) => [name, type, controller.getValue(name)] as const)).toIncludeAllMembers([
            ['i0', VariableType.INTEGER, 3],
            ['i1', VariableType.INTEGER, 4],
            ['f0', VariableType.FLOAT, 1.0],
            ['f1', VariableType.FLOAT, 6.28],
            ['b0', VariableType.BOOLEAN, false],
            ['b1', VariableType.BOOLEAN, true],
            ['t0', VariableType.TRIGGER, false],
            ['t1', VariableType.TRIGGER, true],
        ]);
    });

    test('Layer weight get/set, layer count', () => {
        const animationGraph = new AnimationGraph();
        const layer0 = animationGraph.addLayer();
        const layer1 = animationGraph.addLayer();
        layer1.weight = 0.4;
        const { newGenAnim: animationController } = createAnimationGraphEval2(animationGraph, new Node());

        expect(animationController.layerCount).toBe(2);

        expect(animationController.getLayerWeight(0)).toBe(1.0);
        expect(animationController.getLayerWeight(1)).toBe(0.4);
        animationController.setLayerWeight(0, 0.2);
        animationController.setLayerWeight(1, 0.3);
        expect(animationController.getLayerWeight(0)).toBe(0.2);
        expect(animationController.getLayerWeight(1)).toBe(0.3);
    });

    test('No graph is specified', () => {
        const node = new Node();
        const animationController = node.addComponent(AnimationController) as AnimationController;

        // SPEC: if no graph is specified, the layer count would be 0.
        expect(animationController.layerCount).toBe(0);
    });

    describe(`Status query methods`, () => {
        describe(`If no transition is being performed`, () => {
            /**
             * ### SPEC
             * 
             * If a layer ran into an state and there is no transition is performing:
             * 
             * - `getCurrentTransition` returns null.
             * - `getNextStateStatus` returns null.
             * - `getNextClipStatuses` yields nothing.
             * - If the state is a motion state:
             *     - `getCurrentStateStatus` returns the status of the state, where:
             *       - `.time` gives the transition time(absolute, in seconds).
             *       - `.duration` gives the transition duration.
             *     - `getCurrentClipStatuses` return the status of the clips containing in the state, where:
             *       - `.clip` gives the clip.
             *       - `.weight` gives the clip's contribution in whole layer.
             *  - Otherwise:
             *     - `getCurrentStateStatus` returns null.
             *     - `getCurrentClipStatuses` yields nothing.
             */
            const _SPEC = undefined;

            const commonCheck1 = (controller: AnimationController) => {
                expect(controller.getCurrentTransition(0)).toBeNull();
                expect(controller.getNextStateStatus(0)).toBeNull();
                expect([...controller.getNextClipStatuses(0)]).toHaveLength(0);
            };

            test(`Motion state`, () => {
                const fixture = {
                    motion_duration: 2.0,
                    state_time: 0.1,
                };

                const graph = new AnimationGraph();
                const mainLayer = graph.addLayer();
                const motionState = mainLayer.stateMachine.addMotion();
                const clipMotion = motionState.motion = createEmptyClipMotion(fixture.motion_duration);
                mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, motionState);

                const { newGenAnim, graphEval } = createAnimationGraphEval2(graph, new Node());
                const graphUpdater = new GraphUpdater(graphEval);

                graphUpdater.step(fixture.state_time);
                expect(newGenAnim.getCurrentStateStatus(0)).toMatchObject({
                    progress: expect.toBeAround(fixture.state_time / fixture.motion_duration, DEFAULT_AROUND_NUM_DIGITS),
                });
                expect([...newGenAnim.getCurrentClipStatuses(0)]).toMatchObject({
                    [0]: {
                        clip: clipMotion.clip,
                        weight: 1.0,
                    },
                });
                commonCheck1(newGenAnim);
            });

            test(`Empty state`, () => {
                const graph = new AnimationGraph();
                const mainLayer = graph.addLayer();
                const emptyState = mainLayer.stateMachine.addEmpty();
                mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, emptyState);

                const { newGenAnim, graphEval } = createAnimationGraphEval2(graph, new Node());
                const graphUpdater = new GraphUpdater(graphEval);

                graphUpdater.step(0.2);
                expect(newGenAnim.getCurrentStateStatus(0)).toBeNull();
                expect([...newGenAnim.getCurrentClipStatuses(0)]).toHaveLength(0);
                commonCheck1(newGenAnim);
            });

            test(`Top level entry state`, () => {
                const graph = new AnimationGraph();
                const mainLayer = graph.addLayer();
                const motionState = mainLayer.stateMachine.addMotion();
                motionState.motion = createEmptyClipMotion(1.23 /** ANY */);
                mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, motionState);
    
                const { newGenAnim: controller } = createAnimationGraphEval2(graph, new Node());
                
                // Before any evaluation

                expect(controller.getCurrentStateStatus(0)).toBe(null);
                expect([...controller.getCurrentClipStatuses(0)]).toHaveLength(0);
                expect(controller.getCurrentTransition(0)).toBe(null);
                expect(controller.getNextStateStatus(0)).toBe(null);
                expect([...controller.getNextClipStatuses(0)]).toHaveLength(0);
            });

            test(`Pose state`, () => {
                const graph = new AnimationGraph();
                const mainLayer = graph.addLayer();
                const state = mainLayer.stateMachine.addProceduralPoseState();
                state.name = `Hi Pose`;
                mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, state);

                const { newGenAnim, graphEval } = createAnimationGraphEval2(graph, new Node());
                const graphUpdater = new GraphUpdater(graphEval);

                for (const t of [0.2, 1.2, 2.3]) {
                    graphUpdater.goto(t);
                    expect(newGenAnim.getCurrentStateStatus(0)).toMatchObject({
                        __DEBUG_ID__: 'Hi Pose',
                        progress: t - Math.trunc(t),
                    });
                    expect([...newGenAnim.getCurrentClipStatuses(0)]).toHaveLength(0);
                    commonCheck1(newGenAnim);
                }
            });
        });

        describe(`If the layer is performing transition`, () => {
            /**
             * ### SPEC
             * 
             * If a layer is performing a transition:
             * 
             * - `getCurrentTransition` returns the status of the transition:
             *   - `.time` gives the transition time(absolute, in seconds).
             *   - `.duration` gives the transition duration.
             * 
             * - `getCurrentStateStatus`(`getNextStateStatus`) returns:
             *   - the status of transition source(destination), if the transition source(destination) is a motion state.
             *   - null otherwise.
             * 
             * - `getCurrentClipStatuses`(`getNextClipStatuses`) yields:
             *   - the status of clips containing in transition source(destination), if the transition source(destination) is a motion state.
             *   - nothing otherwise.
             */
            const _SPEC = undefined;

            test('Ran into a transition(Motion -> Empty)', () => {
                const fixture = {
                    motion_duration: 2.0,
                    transition_duration: 0.25,
                    eval_time: 0.1,
                };
    
                const graph = new AnimationGraph();
                const mainLayer = graph.addLayer();
                const motionState = mainLayer.stateMachine.addMotion();
                const clipMotion = motionState.motion = createEmptyClipMotion(fixture.motion_duration);
                const emptyState = mainLayer.stateMachine.addEmpty();
                mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, motionState);
                const m2e = mainLayer.stateMachine.connect(motionState, emptyState);
                m2e.duration = fixture.transition_duration;
                m2e.exitConditionEnabled = true;
                m2e.exitCondition = 0.0; // Immediately start the transition.
    
                const { newGenAnim: controller, graphEval } = createAnimationGraphEval2(graph, new Node());
                const graphUpdater = new GraphUpdater(graphEval);
    
                graphUpdater.step(fixture.eval_time);
                expect(controller.getCurrentStateStatus(0)).toMatchObject({
                    progress: expect.toBeAround(fixture.eval_time / fixture.motion_duration, DEFAULT_AROUND_NUM_DIGITS),
                });
                expect([...controller.getCurrentClipStatuses(0)]).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        clip: clipMotion.clip,
                        weight: expect.toBeAround(1.0 - fixture.eval_time / fixture.transition_duration, DEFAULT_AROUND_NUM_DIGITS),
                    }),
                ]));
                expect(controller.getCurrentTransition(0)).toMatchObject({
                    time: expect.toBeAround(fixture.eval_time, DEFAULT_AROUND_NUM_DIGITS),
                    duration: fixture.transition_duration,
                });
                expect(controller.getNextStateStatus(0)).toBeNull();
                expect([...controller.getNextClipStatuses(0)]).toHaveLength(0);
            });
    
            test('Ran into a transition(Empty -> Motion)', () => {
                const fixture = {
                    motion_duration: 2.0,
                    transition_duration: 0.25,
                    eval_time: 0.1,
                };

                const graph = new AnimationGraph();
                const mainLayer = graph.addLayer();
                const motionState = mainLayer.stateMachine.addMotion();
                const clipMotion = motionState.motion = createEmptyClipMotion(fixture.motion_duration);
                const emptyState = mainLayer.stateMachine.addEmpty();
                mainLayer.stateMachine.connect(mainLayer.stateMachine.entryState, emptyState);
                const transition = mainLayer.stateMachine.connect(emptyState, motionState);
                transition.duration = fixture.transition_duration;
                const [transitionCondition] = transition.conditions = [new UnaryCondition()];
                transitionCondition.operator = UnaryCondition.Operator.TRUTHY;
                transitionCondition.operand.value = true;
    
                const { newGenAnim: controller, graphEval } = createAnimationGraphEval2(graph, new Node());
                const graphUpdater = new GraphUpdater(graphEval);
    
                graphUpdater.step(fixture.eval_time);
                expect(controller.getCurrentStateStatus(0)).toBeNull();
                expect([...controller.getCurrentClipStatuses(0)]).toHaveLength(0);
                expect(controller.getCurrentTransition(0)).toMatchObject({
                    time: expect.toBeAround(fixture.eval_time, DEFAULT_AROUND_NUM_DIGITS),
                    duration: fixture.transition_duration,
                });
                expect([...controller.getNextClipStatuses(0)]).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        clip: clipMotion.clip,
                        weight: expect.toBeAround(fixture.eval_time / fixture.transition_duration, DEFAULT_AROUND_NUM_DIGITS),
                    }),
                ]));
            });
        });
    });

    describe('Animation mask', () => {
        const {
            _1, _1_1, _1_1_1, _1_2,
        } = maskTestHelper.NodeName;
        describe(`Single layer`, () => {
            test(`Root is masked`, () => {
                checkMask([
                    [_1, false],
                    [_1_1, true], // No effect at all
                ], _1);
            });

            test(`Middle is masked`, () => {
                checkMask([
                    [_1_1, false],
                    [_1_2, true], // No effect at all
                ], _1_1);
            });
            
            test(`Leaf is masked`, () => {
                checkMask([
                    [_1_1_1, false],
                    [_1_1, true], // No effect at all
                ], _1_1_1);
            });

            test(`Root and leaf are masked`, () => {
                checkMask([
                    ['', false],
                    [_1_1, true], // No effect at all
                    [_1_1_1, false],
                ], _1, _1_1_1);
            });

            function checkMask(inputMaskItems: maskTestHelper.MaskItem[], ...expectedFilteredNodeNames: readonly maskTestHelper.NodeName[]) {
                const {
                    rootNode,
                    nodeFixtures,
                    getActualNodeValues,
                    layerFixtures,
                } = maskTestHelper.generateTestData(1);

                // Create the animation graph and evaluate.
                const g = new AnimationGraph();
                generateLayer(g, 0.8, inputMaskItems, layerFixtures[0].clip);
                const graphEval = createAnimationGraphEval(g, rootNode);
                graphEval.update(0.2 /* CAN BE ANY */);

                // Compute the expected node values.
                const expectedNodeValues = nodeFixtures.reduce((result, { name, defaultValue, animationValues }) => {
                    // If a node is filtered, its value should remain default in single layer case.
                    result[name] = (expectedFilteredNodeNames as string[]).includes(name)
                        ? defaultValue
                        : lerp(defaultValue, animationValues[0], 0.8);
                    return result;
                }, {} as Record<string, number>);

                // Snapshot the node values so we can manually check.
                expect(expectedNodeValues).toMatchSnapshot();

                // Check if the result matches.
                expect(getActualNodeValues()).toBeDeepCloseTo(expectedNodeValues);
            }
        });

        describe(`Multiple layers`, () => {
            test(`_`, () => {
                checkMasks(
                    [
                        { weight: 0.4, maskItems: null },
                        { weight: 0.6, maskItems: [[_1_2, false]] }, // The mask at non-last layer takes no effect
                        { weight: 0.8, maskItems: [[_1_1, false]] },
                    ],
                    {
                        [_1_1]: [false, false, true],
                        [_1_2]: [false, true, false],
                    },
                );
            });

            function checkMasks(
                inputLayerConfigs: {
                    weight: number;
                    maskItems: (maskTestHelper.MaskItem[] | null);
                }[],
                expectedMaskEffects: Record<string, boolean[]>,
            ) {
                for (const state of Object.values(expectedMaskEffects)) {
                    expect(state).toHaveLength(inputLayerConfigs.length);
                }

                const {
                    rootNode,
                    nodeFixtures,
                    getActualNodeValues,
                    layerFixtures,
                } = maskTestHelper.generateTestData(inputLayerConfigs.length);

                // Create the animation graph and evaluate.
                const g = new AnimationGraph();
                for (let i = 0; i < inputLayerConfigs.length; ++i) {
                    generateLayer(g, inputLayerConfigs[i].weight, inputLayerConfigs[i].maskItems, layerFixtures[i].clip);
                }
                const graphEval = createAnimationGraphEval(g, rootNode);
                graphEval.update(0.2 /* CAN BE ANY */);

                // Compute the expected node values.
                const expectedNodeValues = nodeFixtures.reduce((result, { name, defaultValue, animationValues }) => {
                    const expectedMaskEffect = expectedMaskEffects[name];
                    let expectedValue = defaultValue;
                    layerFixtures.forEach((_, layerIndex) => {
                        if (!expectedMaskEffect || !expectedMaskEffect[layerIndex]) {
                            // If the node has no mask at this layer, it will take effect.
                            expectedValue = lerp(expectedValue, animationValues[layerIndex], inputLayerConfigs[layerIndex].weight);
                        }
                        // Otherwise, the value is not changed.
                    });
                    result[name] = expectedValue;
                    return result;
                }, {} as Record<string, number>);

                // Snapshot the node values so we can manually check.
                expect(expectedNodeValues).toMatchSnapshot();

                // Check if the result matches.
                expect(getActualNodeValues()).toBeDeepCloseTo(expectedNodeValues);
            }
        });

        test('Cooperate with empty state', () => {
            const {
                rootNode,
                nodeFixtures,
                getActualNodeValues,
                layerFixtures,
            } = maskTestHelper.generateTestData(2);

            const animationGraph = new AnimationGraph();
            // Layer 0
            generateLayer(animationGraph, 0.4, null, layerFixtures[0].clip);
            // Layer 1
            {
                const l = animationGraph.addLayer();
                l.weight = 0.6;
                l.mask = maskTestHelper.createMask([[_1_1, false]]);

                const motion = l.stateMachine.addMotion();
                const clipMotion = motion.motion = new ClipMotion();
                const clip = clipMotion.clip = layerFixtures[1].clip;
                clip.enableTrsBlending = true; // 👀

                const emptyState = l.stateMachine.addEmpty();

                // Entry -> Empty
                l.stateMachine.connect(l.stateMachine.entryState, emptyState);

                // Boolean variable b. Which make Empty->Motion if true, make Motion->Empty otherwise.
                animationGraph.addVariable('b', VariableType.BOOLEAN, false);

                // Empty -> Motion
                const tEmptyToMotion = l.stateMachine.connect(emptyState, motion);
                {
                    tEmptyToMotion.duration = 0.2;
                    const [condition] = tEmptyToMotion.conditions = [new UnaryCondition()];
                    condition.operator = UnaryCondition.Operator.TRUTHY;
                    condition.operand.variable = 'b';
                }

                // Motion -> Empty
                const tMotionToEmpty = l.stateMachine.connect(motion, emptyState);
                {
                    tMotionToEmpty.duration = 0.2;
                    tMotionToEmpty.exitConditionEnabled = false;
                    const [condition] = tMotionToEmpty.conditions = [new UnaryCondition()];
                    condition.operator = UnaryCondition.Operator.FALSY;
                    condition.operand.variable = 'b';
                }
            }

            const graphEval = createAnimationGraphEval(animationGraph, rootNode);
            const graphUpdater = new GraphUpdater(graphEval);

            // Initially, since layer1 is in empty state, it is as if only layer 0 is running.
            // The mask takes no effect at all.
            graphUpdater.step(0.2);
            {
                const expectedNodeValues = nodeFixtures.reduce((result, { name, defaultValue, animationValues }) => {
                    result[name] = lerp(defaultValue, animationValues[0], 0.4);
                    return result;
                }, {} as Record<string, number>);
                expect(getActualNodeValues()).toBeDeepCloseTo(expectedNodeValues);
            }

            // Then we trigger Empty->Motion, during the transition, mask shall take effect.
            graphEval.setValue('b', true);
            graphUpdater.step(0.15);
            {
                const expectedNodeValues = nodeFixtures.reduce((result, { name, defaultValue, animationValues }) => {
                    let expectedValue = result[name] = lerp(defaultValue, animationValues[0], 0.4);
                    if (name === _1_1) { // Masked
                        ;
                    } else {
                        const layer1Result = lerp(
                            expectedValue, // Empty state
                            animationValues[1], // Motion state
                            0.15 / 0.2,
                        );
                        expectedValue = lerp(expectedValue, layer1Result, 0.6);
                    }
                    result[name] = expectedValue;
                    return result;
                }, {} as Record<string, number>);
                expect(getActualNodeValues()).toBeDeepCloseTo(expectedNodeValues);
            }

            // Finish the transition. Skip check on this easy case.
            graphUpdater.step(0.1);

            // Trigger Motion->Empty, during the transition, mask shall take effect.
            graphEval.setValue('b', false);
            graphUpdater.step(0.15);
            {
                const expectedNodeValues = nodeFixtures.reduce((result, { name, defaultValue, animationValues }) => {
                    let expectedValue = result[name] = lerp(defaultValue, animationValues[0], 0.4);
                    if (name === _1_1) { // Masked
                        ;
                    } else {
                        const layer1Result = lerp(
                            animationValues[1], // Motion state
                            expectedValue, // Empty state
                            0.15 / 0.2,
                        );
                        expectedValue = lerp(expectedValue, layer1Result, 0.6);
                    }
                    result[name] = expectedValue;
                    return result;
                }, {} as Record<string, number>);
                expect(getActualNodeValues()).toBeDeepCloseTo(expectedNodeValues);
            }
        });

        function generateLayer(
            graph: AnimationGraph,
            weight: number,
            maskItems: maskTestHelper.MaskItem[] | null,
            clip: AnimationClip,
        ) {
            const l = graph.addLayer();
            l.weight = weight;
            l.mask = maskItems ? maskTestHelper.createMask(maskItems) : null;
            const motion = l.stateMachine.addMotion();
            const clipMotion = motion.motion = new ClipMotion();
            clipMotion.clip = clip;
            clip.enableTrsBlending = true; // 👀
            l.stateMachine.connect(l.stateMachine.entryState, motion);
        }
    });

    describe('Clip overriding', () => {
        test('Through animation graph variant', () => {
            const DEFAULT_VALUE = 0.9;

            // -----------------------------------------------------
            // | Layer0:
            // |   Entry -> Motion1 -> Motion2 -> SubStateMachine
            // |                                    Entry->Motion3
            // | Layer1:
            // |   Entry -> Empty -> Motion1
            // -----------------------------------------------------
            // Where:
            // - Motion1 tests the relative duration, exit times as well as multiple replacements(it also occurs in layer 1)
            // - Motion2 tests the destination start time.
            // - Motion3 tests if the motion in sub state machine was correctly overridden.
            //
            const LAYER_1_WEIGHT = 0.5;
            // Original clips. The data do not matter.
            const MOTION1_ORIGINAL_CLIP_SHEET = createClipSheet(0.0001, 0.0, 0.0);
            const MOTION2_ORIGINAL_CLIP_SHEET = createClipSheet(0.002, 0.0, 0.0);
            const MOTION3_ORIGINAL_CLIP_SHEET = createClipSheet(0.03, 0.0, 0.0);
            // Overriding clips.
            const MOTION1_OVERRIDING_CLIP_SHEET = createClipSheet(1.2, 3, 4);
            const MOTION2_OVERRIDING_CLIP_SHEET = createClipSheet(2.3, 5, 6);
            const MOTION3_OVERRIDING_CLIP_SHEET = createClipSheet(3.4, 8.8, 6.666);
            // Transition configurations.
            const T_1_2_EXIT_TIMES = 0.8; // relative
            const T_1_2_DURATION = 0.5; // relative
            const T_1_2_DESTINATION_START = 0.6; // relative

            const animationGraph = new AnimationGraph();
            { // Layer 0
                const layer = animationGraph.addLayer();
                const { stateMachine } = layer;

                const motionState1 = stateMachine.addMotion();
                motionState1.motion = MOTION1_ORIGINAL_CLIP_SHEET.createMotion();

                const motionState2 = stateMachine.addMotion();
                motionState2.motion = MOTION2_ORIGINAL_CLIP_SHEET.createMotion();

                const subStateMachine = stateMachine.addSubStateMachine();
                const motionState3 = subStateMachine.stateMachine.addMotion();
                motionState3.motion = MOTION3_ORIGINAL_CLIP_SHEET.createMotion();
                subStateMachine.stateMachine.connect(subStateMachine.stateMachine.entryState, motionState3);

                stateMachine.connect(stateMachine.entryState, motionState1);

                const t_1_2 = stateMachine.connect(motionState1, motionState2);
                t_1_2.exitConditionEnabled = true;
                t_1_2.exitCondition = T_1_2_EXIT_TIMES;
                t_1_2.relativeDuration = true;
                t_1_2.duration = T_1_2_DURATION;
                t_1_2.relativeDestinationStart = true;
                t_1_2.destinationStart = T_1_2_DESTINATION_START;
                
                const t_2_3 = stateMachine.connect(motionState2, subStateMachine);
                t_2_3.duration = 0.0;
                t_2_3.exitConditionEnabled = false;
                const [t_2_3_condition] = t_2_3.conditions = [new UnaryCondition()];
                t_2_3_condition.operator = UnaryCondition.Operator.TRUTHY;
                t_2_3_condition.operand.variable = '2_3';
                animationGraph.addVariable('2_3', VariableType.BOOLEAN);
            }
            { // Layer 1
                const layer = animationGraph.addLayer();
                layer.weight = LAYER_1_WEIGHT;
                const { stateMachine } = layer;

                const motionState1 = stateMachine.addMotion();
                motionState1.motion = MOTION1_ORIGINAL_CLIP_SHEET.createMotion();

                const empty = stateMachine.addEmpty();

                stateMachine.connect(stateMachine.entryState, empty);

                const t_layer1 = stateMachine.connect(empty, motionState1);
                t_layer1.duration = 0.0;
                const [t_layer1_condition] = t_layer1.conditions = [new UnaryCondition()];
                t_layer1_condition.operator = UnaryCondition.Operator.TRUTHY;
                t_layer1_condition.operand.variable = 'layer1';
                animationGraph.addVariable('layer1', VariableType.BOOLEAN);
            }

            const animationGraphVariant = new AnimationGraphVariant();
            animationGraphVariant.original = animationGraph;
            const clipOverrides = animationGraphVariant.clipOverrides;
            clipOverrides.set(MOTION1_ORIGINAL_CLIP_SHEET.clip, MOTION1_OVERRIDING_CLIP_SHEET.clip);
            clipOverrides.set(MOTION2_ORIGINAL_CLIP_SHEET.clip, MOTION2_OVERRIDING_CLIP_SHEET.clip);
            clipOverrides.set(MOTION3_ORIGINAL_CLIP_SHEET.clip, MOTION3_OVERRIDING_CLIP_SHEET.clip);

            const node = new Node();
            node.position = new Vec3(DEFAULT_VALUE);
            const graphEval = createAnimationGraphEval(animationGraphVariant, node);
            const graphUpdater = new GraphUpdater(graphEval);

            // Motion1 should be overridden.
            graphUpdater.goto(0.12);
            expect(graphEval.getCurrentTransition(0)).toBeNull();
            expect(node.position.x).toBeCloseTo(
                MOTION1_OVERRIDING_CLIP_SHEET.sampleAtTime(0.12),
            );

            // Go to the place where motion1 is about to start transition.
            graphUpdater.goto(T_1_2_EXIT_TIMES * MOTION1_OVERRIDING_CLIP_SHEET.duration - 0.02);
            expect(graphEval.getCurrentTransition(0)).toBeNull();
            expect(node.position.x).toBeCloseTo(
                MOTION1_OVERRIDING_CLIP_SHEET.sampleAtTime(T_1_2_EXIT_TIMES * MOTION1_OVERRIDING_CLIP_SHEET.duration - 0.02),
            );

            // Go to the place where motion1 just started transition
            // to make sure the exit times property takes correctly effect.
            graphUpdater.goto(T_1_2_EXIT_TIMES * MOTION1_OVERRIDING_CLIP_SHEET.duration); // Past the transition duration
            graphUpdater.step(0.03);
            expect(graphEval.getCurrentTransition(0)).not.toBeNull();
            expect(node.position.x).toBeCloseTo(
                lerp(
                    MOTION1_OVERRIDING_CLIP_SHEET.sampleAtTime(T_1_2_EXIT_TIMES * MOTION1_OVERRIDING_CLIP_SHEET.duration + 0.03),
                    MOTION2_OVERRIDING_CLIP_SHEET.sampleAtTime(0.03 + (T_1_2_DESTINATION_START * MOTION2_OVERRIDING_CLIP_SHEET.duration)),
                    0.03 / (T_1_2_DURATION * MOTION1_OVERRIDING_CLIP_SHEET.duration),
                ),
            );

            // This time step further more...
            // Here we're also confirming the effective of `duration` and `destination start`.
            graphUpdater.goto(T_1_2_EXIT_TIMES * MOTION1_OVERRIDING_CLIP_SHEET.duration); // Past the transition duration
            graphUpdater.step(0.2);
            expect(graphEval.getCurrentTransition(0)).not.toBeNull();
            expect(node.position.x).toBeCloseTo(
                lerp(
                    MOTION1_OVERRIDING_CLIP_SHEET.sampleAtTime(T_1_2_EXIT_TIMES * MOTION1_OVERRIDING_CLIP_SHEET.duration + 0.2),
                    MOTION2_OVERRIDING_CLIP_SHEET.sampleAtTime(0.2 + (T_1_2_DESTINATION_START * MOTION2_OVERRIDING_CLIP_SHEET.duration)),
                    0.2 / (T_1_2_DURATION * MOTION1_OVERRIDING_CLIP_SHEET.duration),
                ),
            );

            // Then let's go into the sub state machine
            // to verify the overriding in sub state machine.
            graphUpdater.goto((T_1_2_EXIT_TIMES + T_1_2_DURATION) * MOTION1_OVERRIDING_CLIP_SHEET.duration + 0.1);
            graphEval.setValue('2_3', true);
            graphUpdater.step(0.3);
            expect(graphEval.getCurrentTransition(0)).toBeNull();
            expect(node.position.x).toBeCloseTo(
                MOTION3_OVERRIDING_CLIP_SHEET.sampleAtTime(0.3),
            );

            // Also verify in different layer!
            graphEval.setValue('layer1', true);
            graphUpdater.step(0.1);
            expect(graphEval.getCurrentTransition(0)).toBeNull();
            expect(node.position.x).toBeCloseTo(
                lerp(
                    MOTION3_OVERRIDING_CLIP_SHEET.sampleAtTime(0.4), // Layer 0
                    MOTION1_OVERRIDING_CLIP_SHEET.sampleAtTime(0.1), // Layer 1
                    LAYER_1_WEIGHT,
                ),
            );
        });

        test('Through API', () => {
            const DEFAULT_VALUE = 0.9;
            const MOTION2_FIXED_VALUE = 6.66;
            const MOTION1_EXIT_TIME_RELATIVE = 0.8;
            const MOTION1_TO_MOTION2_RELATIVE_DURATION = 0.2;
            const MOTION1_ORIGINAL_CLIP_SHEET = createClipSheet(1.2, 0.3, 0.3);

            const animationGraph = new AnimationGraph();
            { // Layer 0
                const layer = animationGraph.addLayer();
                const { stateMachine } = layer;
                const motionState = stateMachine.addMotion();
                motionState.motion = MOTION1_ORIGINAL_CLIP_SHEET.createMotion();
                const motionState2 = stateMachine.addMotion();
                motionState2.motion = createClipMotionPositionX(2.6, MOTION2_FIXED_VALUE);
                stateMachine.connect(stateMachine.entryState, motionState);
                const t = stateMachine.connect(motionState, motionState2);
                t.exitConditionEnabled = true;
                t.exitCondition = MOTION1_EXIT_TIME_RELATIVE;
                t.duration = MOTION1_TO_MOTION2_RELATIVE_DURATION;
                t.relativeDuration = true;
            }

            const node = new Node();
            node.position = new Vec3(DEFAULT_VALUE);
            const graphEval = createAnimationGraphEval(animationGraph, node);
            const graphUpdater = new GraphUpdater(graphEval);

            graphUpdater.goto(0.1);
            expect(node.position.x).toBeCloseTo(MOTION1_ORIGINAL_CLIP_SHEET.sample(0.1 / MOTION1_ORIGINAL_CLIP_SHEET.duration));

            /**
             * Trace the normalized time of "current from state" of layer 0.
             */
            let TRACE_MOTION1_NORMALIZED_TIME = 0.0;

            /**
             * Trace the normalized time of "current transition" of layer 0.
             */
            let TRACE_TRANSITION_NORMALIZED_TIME = 0.0;

            // Overriding with same clips is easy.
            // We only need to ensure the motion starts from previous normalized location.
            {
                const MOTION1_SAME_DURATION_OVERRIDE_CLIP_SHEET = createClipSheet(MOTION1_ORIGINAL_CLIP_SHEET.duration, 0.4, 0.7);
                graphEval.overrideClips(new Map([[MOTION1_ORIGINAL_CLIP_SHEET.clip, MOTION1_SAME_DURATION_OVERRIDE_CLIP_SHEET.clip]]));
                graphUpdater.goto(0.2);
                expect(node.position.x).toBeCloseTo(
                    MOTION1_SAME_DURATION_OVERRIDE_CLIP_SHEET.sample(
                        TRACE_MOTION1_NORMALIZED_TIME += 0.2 / MOTION1_SAME_DURATION_OVERRIDE_CLIP_SHEET.duration,
                    ),
                );
            }

            // Different(Shorter) duration override.
            // After overrode, the motion starts from previous normalized location.
            const MOTION1_SHORTER_OVERRIDE_CLIP_SHEET = createClipSheet(0.5, 0.6, 0.7);
            graphEval.overrideClips(new Map([[MOTION1_ORIGINAL_CLIP_SHEET.clip, MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.clip]]));
            graphUpdater.goto(0.35);
            expect(node.position.x).toBeCloseTo(MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.sample(
                TRACE_MOTION1_NORMALIZED_TIME += (0.15 / MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.duration)
            ));

            const EXIT_TIME =
                graphUpdater.current +
                (MOTION1_EXIT_TIME_RELATIVE - TRACE_MOTION1_NORMALIZED_TIME) * MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.duration;
            // The following updates ensures that
            // the `exitCondition` respects to the new duration.
            // -----
            {
                // Go ahead, util the motion state 1 is about to start transition.
                const AHEAD_EXIT_TIME_A_LITTLE = EXIT_TIME - 0.01;
                graphUpdater.goto(AHEAD_EXIT_TIME_A_LITTLE);
                expect(graphEval.getCurrentTransition(0)).toBeNull();
                expect(node.position.x).toBeCloseTo(
                    MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.sample(
                        TRACE_MOTION1_NORMALIZED_TIME += graphUpdater.lastDeltaTime / MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.duration,
                    ),
                );
                // Go ahead, to the place where the motion state 1 just start the transition.
                graphUpdater.goto(EXIT_TIME + 1e-6); // Past the exit condition
                TRACE_MOTION1_NORMALIZED_TIME += graphUpdater.lastDeltaTime / MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.duration;
                graphUpdater.step(0.005);
                TRACE_MOTION1_NORMALIZED_TIME += graphUpdater.lastDeltaTime / MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.duration;
                expect(graphEval.getCurrentTransition(0)).not.toBeNull();
                expect(node.position.x).toBeCloseTo(lerp(
                    MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.sample(
                        TRACE_MOTION1_NORMALIZED_TIME,
                    ),
                    MOTION2_FIXED_VALUE,
                    // Note here: the transition duration also respects to the new duration.
                    TRACE_TRANSITION_NORMALIZED_TIME =
                        (graphUpdater.current - EXIT_TIME) / (MOTION1_SHORTER_OVERRIDE_CLIP_SHEET.duration * MOTION1_TO_MOTION2_RELATIVE_DURATION),
                ));
            }

            // The following updates ensures that
            // the `transition duration` respects to the new duration.
            // However this time we test it with a longer-duration override.
            // -----
            {
                // Longer duration override
                const MOTION1_LONGER_OVERRIDE_CLIP_SHEET = createClipSheet(3.5, 1.6, 1.8);
                graphEval.overrideClips(new Map([[MOTION1_ORIGINAL_CLIP_SHEET.clip, MOTION1_LONGER_OVERRIDE_CLIP_SHEET.clip]]));

                graphUpdater.step(0.1);
                expect(node.position.x).toBeCloseTo(
                    lerp(
                        MOTION1_LONGER_OVERRIDE_CLIP_SHEET.sample(
                            TRACE_MOTION1_NORMALIZED_TIME += 0.1 / MOTION1_LONGER_OVERRIDE_CLIP_SHEET.duration),
                        MOTION2_FIXED_VALUE,
                        TRACE_TRANSITION_NORMALIZED_TIME += 0.1 / (MOTION1_LONGER_OVERRIDE_CLIP_SHEET.duration * MOTION1_TO_MOTION2_RELATIVE_DURATION),
                    ),
                );
                expect(graphEval.getCurrentTransition(0)!.time).toBeCloseTo(
                    TRACE_TRANSITION_NORMALIZED_TIME * (MOTION1_LONGER_OVERRIDE_CLIP_SHEET.duration * MOTION1_TO_MOTION2_RELATIVE_DURATION));
            }
        });

        test(`How clip overriding affect the set of animated node`, () => {
            /**
             * ## Spec
             * 
             * For `AnimationController.overrideClips` invocation, the following can happen without surprise:
             * 
             * 1. The original and substitution clip have animation on same set of nodes.
             * 
             * 2. The substitution clip introduce new nodes to be animated
             *   since it has animation on formerly-not-animated nodes.
             * 
             * 3. The original clip uniquely has animation on some nodes.
             *   Overriding causes there's no longer animation on those nodes.
             *   This leads to those nodes no longer to be animated by controller.
             * 
             * 4. The invocation can remove partial animation effect(or it decreases the number of animation reference on some nodes).
             * 
             * ## About the test
             * 
             * In the following, we're going to construct a simple animation graph which blends two clip motions.
             * The two clip motions are (clip0, clip1) at initial and will be overridden as (clip2, clip3) in later.
             * 
             * The fixture is designed so that:
             * 
             * - All clips have animation on node1.
             *   This simulates case 1.
             *   This should be the commonest case in real world.
             * 
             * - Both (clip0, clip1) do have animation on node2, but both (clip2, clip3) have NO animation on node2.
             *   This simulates case 2.
             * 
             * - Both (clip0, clip1) have NO animation on node3, but both (clip2, clip3) do have animation on node3.
             *   This simulates case 3.
             * 
             * - Both (clip0, clip1) do have animation on node4, but either of  (clip2, clip3) have animation on node4. 
             *   This simulates case 4.
             */
            const fixture = {
                initialValues: [
                    6.,
                    5.,
                    -2.6,
                    10.,
                ],

                /** Each matrix element E describe the animation value of node(row) at clip(column). */
                animations: [
                    /* ---------------------------------------------------------------- */
                    /*           clip0     |  clip1     |   clip2      |  clip3         */
                    /* node0 */  [7.,          8.,           8.8,         9.0           ],
                    /* node1 */  [3.3,         -2.3,         undefined,   undefined     ],
                    /* node2 */  [undefined,   undefined,    -2.4,        -3.1          ],
                    /* node3 */  [9.,          -2.,          6.6,         undefined     ],
                ] as const,

                blendRate: 0.4,

                manualValue: 0.3,
            };

            // Construct the nodes. Initialize them with initial values.
            const root = new Node();
            const nodes = Array.from({ length: fixture.animations.length }, (_, nodeIndex) => {
                const node = new Node(`Node${nodeIndex}`);
                node.parent = root;
                node.setPosition(fixture.initialValues[nodeIndex], 0.0, 0.0);
                return node;
            });
            const getCurrentValue = () => nodes.reduce((result, node, nodeIndex) => {
                result[`node${nodeIndex}`] = node.position.x;
                return result;
            }, {} as Record<string, number>);

            // Construct the clips.
            const clips = Array.from({ length: fixture.animations[0].length }, (_, clipIndex) => {
                const clip = new AnimationClip();
                clip.enableTrsBlending = true;
                clip.duration = 1.0;
                for (let iNodeIndex = 0; iNodeIndex < nodes.length; ++iNodeIndex) {
                    const animationValue = fixture.animations[iNodeIndex][clipIndex];
                    if (typeof animationValue !== 'undefined') {
                        addConstantAnimation(clip, nodes[iNodeIndex].name, animationValue);
                    }
                }
                return clip;
            });

            // Construct a simple graph which blend two clips motion at fixed rate.
            // The two clips are initially the [clip0, clip1].
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const motionState = layer.stateMachine.addMotion();
            const blend = motionState.motion = new AnimationBlend1D();
            blend.param.variable = 't';
            animationGraph.addVariable(blend.param.variable, VariableType.FLOAT, fixture.blendRate);
            blend.items = [
                (() => {
                    const item = new AnimationBlend1D.Item();
                    item.threshold = 0.0;
                    const clipMotion = new ClipMotion(); clipMotion.clip = clips[0];
                    item.motion = clipMotion;
                    return item;
                })(),
                (() => {
                    const item = new AnimationBlend1D.Item();
                    item.threshold = 1.0;
                    const clipMotion = new ClipMotion(); clipMotion.clip = clips[1];
                    item.motion = clipMotion;
                    return item;
                })(),
            ];
            layer.stateMachine.connect(layer.stateMachine.entryState, motionState);

            const { graphEval, newGenAnim: animationController } = createAnimationGraphEval2(animationGraph, root);
            const graphUpdater = new GraphUpdater(graphEval);

            const toBeAround = (value: number) =>
                expect.toBeAround(value, DEFAULT_AROUND_NUM_DIGITS);

            // Before override.
            graphUpdater.step(0.2);
            expect(getCurrentValue()).toMatchObject({
                node0: toBeAround(lerp(fixture.animations[0][0], fixture.animations[0][1], fixture.blendRate)),
                node1: toBeAround(lerp(fixture.animations[1][0], fixture.animations[1][1], fixture.blendRate)),
                node2: toBeAround(fixture.initialValues[2]),
                node3: toBeAround(lerp(fixture.animations[3][0], fixture.animations[3][1], fixture.blendRate)),
            });

            // Apply override.
            const node1CurrentValue = getCurrentValue().node1;
            animationController.overrideClips_experimental(new Map([
                [clips[0], clips[2]],
                [clips[1], clips[3]],
            ]));
            graphUpdater.step(0.3);
            expect(getCurrentValue()).toMatchObject({
                node0: toBeAround(lerp(fixture.animations[0][2], fixture.animations[0][3], fixture.blendRate)),

                // node1's animation is fully dropped.
                // NOTICE here: node1 keeps its current value.
                node1: node1CurrentValue,

                // The override brings animation on node3.
                node2: toBeAround(lerp(fixture.animations[2][2], fixture.animations[2][3], fixture.blendRate)),

                // Node4's animation does not exists on blend src, but exists on blend target.
                node3: toBeAround(lerp(fixture.animations[3][2], fixture.initialValues[3], fixture.blendRate)),
            });

            // To further ensure that the node1 is not animated after override, let's manually change its value and step again.
            nodes[1].setPosition(fixture.manualValue, nodes[2].position.y, nodes[2].position.z);
            graphUpdater.step(0.325);
            expect(getCurrentValue()).toMatchObject({
                node0: toBeAround(lerp(fixture.animations[0][2], fixture.animations[0][3], fixture.blendRate)),

                // NOTICE here: node2 keeps the manual value.
                node1: fixture.manualValue,

                // The override brings animation on node3.
                node2: toBeAround(lerp(fixture.animations[2][2], fixture.animations[2][3], fixture.blendRate)),

                // Node4's animation does not exists on blend src, but exists on blend target.
                node3: toBeAround(lerp(fixture.animations[3][2], fixture.initialValues[3], fixture.blendRate)),
            });

            function addConstantAnimation(clip: AnimationClip, path: string, value: number) {
                const track = new VectorTrack();
                track.componentsCount = 3;
                track.path.toHierarchy(path).toProperty('position');
                track.channels()[0].curve.assignSorted([[0.0, value]]);
                clip.addTrack(track);
            }
        });

        test(`Bugfix: clip overriding only introduce new nodes`, () => {
            // This was a bug found during development which is not covered by
            // "How clip overriding affect the set of animated node"...
            const fixture = {
                initialValues: [
                    6.,
                    5.,
                    -2.6,
                    10.,
                ],

                /** Each matrix element E describe the animation value of node(row) at clip(column). */
                animations: [
                    /* ---------------------------------------------------------------- */
                    /*           clip0     |  clip1     |   clip2      |  clip3         */
                    /* node0 */  [7.,          8.,           8.8,         9.0           ],
                    /* node1 */  [3.3,         -2.3,         5.,          6.            ],
                    /* node2 */  [undefined,   undefined,    -2.4,        -3.1          ],
                    /* node3 */  [9.,          -2.,          6.6,         7.            ],
                ] as const,

                blendRate: 0.4,

                manualValue: 0.3,
            };

            // Construct the nodes. Initialize them with initial values.
            const root = new Node();
            const nodes = Array.from({ length: fixture.animations.length }, (_, nodeIndex) => {
                const node = new Node(`Node${nodeIndex}`);
                node.parent = root;
                node.setPosition(fixture.initialValues[nodeIndex], 0.0, 0.0);
                return node;
            });
            const getCurrentValue = () => nodes.reduce((result, node, nodeIndex) => {
                result[`node${nodeIndex}`] = node.position.x;
                return result;
            }, {} as Record<string, number>);

            // Construct the clips.
            const clips = Array.from({ length: fixture.animations[0].length }, (_, clipIndex) => {
                const clip = new AnimationClip();
                clip.enableTrsBlending = true;
                clip.duration = 1.0;
                for (let iNodeIndex = 0; iNodeIndex < nodes.length; ++iNodeIndex) {
                    const animationValue = fixture.animations[iNodeIndex][clipIndex];
                    if (typeof animationValue !== 'undefined') {
                        addConstantAnimation(clip, nodes[iNodeIndex].name, animationValue);
                    }
                }
                return clip;
            });

            // Construct a simple graph which blend two clips motion at fixed rate.
            // The two clips are initially the [clip0, clip1].
            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const motionState = layer.stateMachine.addMotion();
            const blend = motionState.motion = new AnimationBlend1D();
            blend.param.variable = 't';
            animationGraph.addVariable(blend.param.variable, VariableType.FLOAT, fixture.blendRate);
            blend.items = [
                (() => {
                    const item = new AnimationBlend1D.Item();
                    item.threshold = 0.0;
                    const clipMotion = new ClipMotion(); clipMotion.clip = clips[0];
                    item.motion = clipMotion;
                    return item;
                })(),
                (() => {
                    const item = new AnimationBlend1D.Item();
                    item.threshold = 1.0;
                    const clipMotion = new ClipMotion(); clipMotion.clip = clips[1];
                    item.motion = clipMotion;
                    return item;
                })(),
            ];
            layer.stateMachine.connect(layer.stateMachine.entryState, motionState);

            const { graphEval, newGenAnim: animationController } = createAnimationGraphEval2(animationGraph, root);
            const graphUpdater = new GraphUpdater(graphEval);

            const toBeAround = (value: number) =>
                expect.toBeAround(value, DEFAULT_AROUND_NUM_DIGITS);

            // Before override.
            graphUpdater.step(0.2);
            expect(getCurrentValue()).toMatchObject({
                node0: toBeAround(lerp(fixture.animations[0][0], fixture.animations[0][1], fixture.blendRate)),
                node1: toBeAround(lerp(fixture.animations[1][0], fixture.animations[1][1], fixture.blendRate)),
                node2: toBeAround(fixture.initialValues[2]),
                node3: toBeAround(lerp(fixture.animations[3][0], fixture.animations[3][1], fixture.blendRate)),
            });

            // Apply override.
            animationController.overrideClips_experimental(new Map([
                [clips[0], clips[2]],
                [clips[1], clips[3]],
            ]));
            graphUpdater.step(0.3);
            expect(getCurrentValue()).toMatchObject({
                node0: toBeAround(lerp(fixture.animations[0][2], fixture.animations[0][3], fixture.blendRate)),
                node1: toBeAround(lerp(fixture.animations[1][2], fixture.animations[1][3], fixture.blendRate)),
                node2: toBeAround(lerp(fixture.animations[2][2], fixture.animations[2][3], fixture.blendRate)),
                node3: toBeAround(lerp(fixture.animations[3][2], fixture.animations[3][3], fixture.blendRate)),
            });

            function addConstantAnimation(clip: AnimationClip, path: string, value: number) {
                const track = new VectorTrack();
                track.componentsCount = 3;
                track.path.toHierarchy(path).toProperty('position');
                track.channels()[0].curve.assignSorted([[0.0, value]]);
                clip.addTrack(track);
            }
        });
    });

    describe(`Additive layers`, () => {
        const DEFAULT_CLOSE_TO_NUM_DIGITS = 6;

        /**
         * We want to test:
         * 
         * - The semantic of additive animation on following kinds of properties:
         *   - real number
         *   - position
         *   - scale
         *   - quaternion rotation
         *   - euler angle rotation
         * 
         * - The semantic of additive animation in following states:
         *   - clip motion case;
         *   - animation blend case.
         *   - empty case.
         *   - transitions between these cases.
         * 
         * - How does an additive layer interop with other layers:
         *   - Non-additive then additive.
         *   - Additive then non-additive.
         *   - Additive then additive.
         * 
         * - Additive layer should effected by mask.
         */
        const _note = undefined;

        describe(`Additive properties`, () => {
            test(`Node trs`, () => {
                const fixture = {
                    non_additive_layer_animation: new ConstantRealValueAnimationFixture(6.0),
                    non_additive_layer_weight: 0.8,
                    additive_layer_fixture: new LinearRealValueAnimationFixture(0.8, -3.5, 2.0, true),
                    additive_layer_weight: 0.6,
                    time: 0.2,
                    initial_position: 3.,
                    initial_rotation: 4.,
                    initial_scale: 5.,
                    initial_eulerAngles: 6.,
                };

                const valueObserver = new NodeTransformValueObserver({
                    position: fixture.initial_position,
                    rotation: fixture.initial_rotation,
                    scale: fixture.initial_scale,
                    eulerAngles: fixture.initial_eulerAngles,
                });

                run();

                const actualValue = valueObserver.value;

                const getDesired = (initialValue: number) => {
                    let desired = initialValue;
                    desired = lerp(desired, fixture.non_additive_layer_animation.getExpected(), fixture.non_additive_layer_weight);
                    desired += lerp(0.0, fixture.additive_layer_fixture.getExpected(fixture.time), fixture.additive_layer_weight);
                    return desired;
                };
                
                { // position
                    const desired = getDesired(fixture.initial_position);
                    expect(desired).toMatchSnapshot('Desired position');
                    expect(actualValue.position).toBeCloseTo(desired);
                }

                { // scale
                    const desired = getDesired(fixture.initial_scale);
                    expect(desired).toMatchSnapshot('Desired scale');
                    expect(actualValue.scale).toBeCloseTo(desired);
                }

                { // quaternion rotation
                    const desired = getDesired(fixture.initial_rotation);
                    expect(desired).toMatchSnapshot('Desired rotation');
                    expect(actualValue.rotation).toBeCloseTo(desired);
                }

                { // euler angles rotation
                    const desired = getDesired(fixture.initial_eulerAngles);
                    expect(desired).toMatchSnapshot('Desired rotation(euler angles)');
                    expect(actualValue.eulerAngles).toBeCloseTo(desired);
                }

                function run() {
                    const animationGraph = new AnimationGraph();

                    {
                        const layer = animationGraph.addLayer();
                        layer.weight = fixture.non_additive_layer_weight;
                        layer.additive = false;
                        const motionState = layer.stateMachine.addMotion();
                        motionState.motion = fixture.non_additive_layer_animation.createMotion(valueObserver.getCreateMotionContext());
                        layer.stateMachine.connect(layer.stateMachine.entryState, motionState);
                    }
        
                    {
                        const layer = animationGraph.addLayer();
                        layer.weight = fixture.additive_layer_weight;
                        layer.additive = true;
                        const motionState = layer.stateMachine.addMotion();
                        motionState.motion = fixture.additive_layer_fixture.createMotion(valueObserver.getCreateMotionContext());
                        layer.stateMachine.connect(layer.stateMachine.entryState, motionState);
                    }

                    const graphEval = createAnimationGraphEval(animationGraph, valueObserver.root);

                    const graphUpdater = new GraphUpdater(graphEval);

                    graphUpdater.step(fixture.time);
                }
            });
        });
        
        test(`Additive state`, () => {
            // Constructs a two layers animation graph.
            // First is non-additive and additive(this is the most common case).
            // The non-additive layer outputs a fixed value,
            // the additive layer has
            // - an empty state _E_,
            // - a clip motion state _C_,
            // - a animation blend state _B_,
            // - transitions _E->C_, _C->E_, _E->B_.
            const fixture = {
                non_additive_layer_animation_fixture: new ConstantRealValueAnimationFixture(6.0),
                non_additive_layer_weight: 0.8,
                additive_layer_weight: 0.6,
                clip_motion_fixture: new LinearRealValueAnimationFixture(4.0, 5.0, 3.0, true),
                animation_blend_fixture: new AnimationBlend1DFixture(
                    { fixture: new LinearRealValueAnimationFixture(2.4, 3.2, 1.5, true), threshold: 0.0 },
                    { fixture: new LinearRealValueAnimationFixture(4.8, -2.2, 1.6, true), threshold: 1.0 },
                ),
                animation_blend_input: 0.7,
                e_to_c_transition_duration: 0.3,
                c_to_e_transition_duration: 0.4,
                initial_value: 9.0,
            };

            const valueObserver = new SingleRealValueObserver(fixture.initial_value);

            const RESULT_AFTER_FIXED_LAYER = lerp(
                fixture.initial_value, fixture.non_additive_layer_animation_fixture.getExpected(), fixture.non_additive_layer_weight);

            const animationGraph = new AnimationGraph();

            // The fixed, upper, non-additive layer.
            addNonAdditiveConstantLayer();

            // The additive layer.
            addAdditiveLayer();

            const graphEval = createAnimationGraphEval(animationGraph, valueObserver.root);
            const graphUpdater = new GraphUpdater(graphEval);

            // The empty state.
            graphUpdater.step(0.2);
            {
                // SPEC: If a additive layer run into an empty state.
                // It's as if this layer doesn't exists.
                expect(valueObserver.value).toBeCloseTo(
                    RESULT_AFTER_FIXED_LAYER,
                    DEFAULT_CLOSE_TO_NUM_DIGITS,
                );
            }

            // Empty -> ClipMotion
            graphEval.setValue('e2c', true);
            graphUpdater.step(fixture.e_to_c_transition_duration * 0.3);
            {
                // SPEC: the transition should work correctly.
                expect(valueObserver.value).toBeCloseTo(
                    RESULT_AFTER_FIXED_LAYER + fixture.additive_layer_weight * (
                        // The result of the additive layer is so that:
                        lerp(
                            0, // Empty generates 0 in additive layer
                            fixture.clip_motion_fixture.getExpected(fixture.e_to_c_transition_duration * 0.3), // Clip motion generates an additive value.
                            0.3, // The transition ratio
                        )
                    ),
                    DEFAULT_CLOSE_TO_NUM_DIGITS,
                );
            }

            // The clip motion state.
            graphUpdater.step(fixture.e_to_c_transition_duration * 0.7 + 0.6);
            {
                // SPEC: If a additive layer run into an clip motion state.
                // the clip motion generates an additive value.
                expect(valueObserver.value).toBeCloseTo(
                    RESULT_AFTER_FIXED_LAYER + fixture.additive_layer_weight * (
                        // The result of the additive layer is so that:
                        fixture.clip_motion_fixture.getExpected(fixture.e_to_c_transition_duration + 0.6) // Clip motion generates an additive value.
                    ),
                    DEFAULT_CLOSE_TO_NUM_DIGITS,
                );
            }

            // ClipMotion -> Empty
            graphEval.setValue('c2e', true);
            graphUpdater.step(fixture.c_to_e_transition_duration * 0.4);
            {
                // SPEC: the transition should work correctly.
                expect(valueObserver.value).toBeCloseTo(
                    RESULT_AFTER_FIXED_LAYER + fixture.additive_layer_weight * (
                        // The result of the additive layer is so that:
                        lerp(
                            fixture.clip_motion_fixture.getExpected(
                                fixture.e_to_c_transition_duration + 0.6 + fixture.c_to_e_transition_duration * 0.4), // Clip motion generates an additive value.
                            0, // Empty generates 0 in additive layer.
                            0.4, // The transition ratio
                        )
                    ),
                    DEFAULT_CLOSE_TO_NUM_DIGITS,
                );
            }

            // Goto Empty again.
            graphUpdater.step(6.6);

            // The animation blend state.
            graphEval.setValue('e2b', true);
            graphUpdater.step(0.2);
            {
                // SPEC: If a additive layer run into an animation blend state,
                // its recursive clip motion should generate additive animations then blend together.
                expect(valueObserver.value).toBeCloseTo(
                    RESULT_AFTER_FIXED_LAYER + fixture.additive_layer_weight * (
                        // The result of the additive layer is so that:
                        fixture.animation_blend_fixture.getExpected(0.2, fixture.animation_blend_input) // Clip motion generates an additive value.
                    ),
                    DEFAULT_CLOSE_TO_NUM_DIGITS,
                );
            }

            function addNonAdditiveConstantLayer() {
                const layer = animationGraph.addLayer();
                layer.weight = fixture.non_additive_layer_weight;
                layer.additive = false;
                const motionState = layer.stateMachine.addMotion();
                motionState.motion = fixture.non_additive_layer_animation_fixture.createMotion(valueObserver.getCreateMotionContext());
                layer.stateMachine.connect(layer.stateMachine.entryState, motionState);
            }

            function addAdditiveLayer() {
                const layer = animationGraph.addLayer();
                layer.weight = fixture.additive_layer_weight;
                layer.additive = true;

                const { stateMachine } = layer;

                const empty = stateMachine.addEmpty();
                stateMachine.connect(stateMachine.entryState, empty);

                const clipMotionState = stateMachine.addMotion();
                clipMotionState.motion = fixture.clip_motion_fixture.createMotion(valueObserver.getCreateMotionContext());

                const animationBlendState = stateMachine.addMotion();
                const animationBlend = animationBlendState.motion =
                fixture.animation_blend_fixture.createMotion(valueObserver.getCreateMotionContext());
                animationBlend.param.value = fixture.animation_blend_input;

                {
                    const e2c = stateMachine.connect(empty, clipMotionState);
                    e2c.duration = fixture.e_to_c_transition_duration;
                    const [condition] = e2c.conditions = [new TriggerCondition()];
                    condition.trigger = 'e2c';
                    animationGraph.addVariable('e2c', VariableType.TRIGGER);
                }

                {
                    const c2e = stateMachine.connect(clipMotionState, empty);
                    c2e.duration = fixture.c_to_e_transition_duration;
                    c2e.exitConditionEnabled = false;
                    const [condition] = c2e.conditions = [new TriggerCondition()];
                    condition.trigger = 'c2e';
                    animationGraph.addVariable('c2e', VariableType.TRIGGER);
                }

                {
                    const e2b = stateMachine.connect(empty, animationBlendState);
                    e2b.duration = 0.0;
                    const [condition] = e2b.conditions = [new TriggerCondition()];
                    condition.trigger = 'e2b';
                    animationGraph.addVariable('e2b', VariableType.TRIGGER);
                }
            }
        });

        describe(`Additive transition`, () => {
            test(`Empty -> Empty`, () => {
                const fixture = {
                    initial_value: 0.3,
                    non_additive_layer_animation: new ConstantRealValueAnimationFixture(0.8),
                    non_additive_layer_weight: 0.6,
                    additive_layer_weight: 0.8,
                    transition_duration: 0.2,
                };

                const observer = new NodeTransformValueObserver({
                    position: fixture.initial_value,
                    rotation: fixture.initial_value,
                    scale: fixture.initial_value,
                    eulerAngles: fixture.initial_value,
                });

                const animationGraph = new AnimationGraph();
                {
                    const layer = animationGraph.addLayer();
                    layer.additive = false;
                    layer.weight = fixture.non_additive_layer_weight;
                    const motionState = layer.stateMachine.addMotion();
                    motionState.motion = fixture.non_additive_layer_animation.createMotion(observer.getCreateMotionContext());
                    layer.stateMachine.connect(layer.stateMachine.entryState, motionState);
                }
                {
                    const layer = animationGraph.addLayer();
                    layer.additive = true;
                    layer.weight = fixture.additive_layer_weight;
                    const empty1 = layer.stateMachine.addEmpty();
                    const empty2 = layer.stateMachine.addEmpty();
                    layer.stateMachine.connect(layer.stateMachine.entryState, empty1);
                    const transition = layer.stateMachine.connect(empty1, empty2);
                    transition.duration = fixture.transition_duration;
                    const [condition] = transition.conditions = [new UnaryCondition()];
                    condition.operator = UnaryCondition.Operator.TRUTHY;
                    condition.operand.value = true;
                }

                const graphEval = createAnimationGraphEval(animationGraph, observer.root);
                const graphUpdater = new GraphUpdater(graphEval);

                graphUpdater.step(fixture.transition_duration * 0.5);

                let expected = fixture.initial_value;
                expected = lerp( // Layer 1
                    expected,
                    fixture.non_additive_layer_animation.getExpected(),
                    fixture.non_additive_layer_weight,
                );
                // Layer 2 takes no effect
                expect(expected).toMatchSnapshot(`Expected result`);

                expect(observer.value).toMatchObject({
                    position: expect.toBeAround(expected),
                    rotation: expect.toBeAround(expected),
                    scale: expect.toBeAround(expected),
                    eulerAngles: expect.toBeAround(expected),
                });
            });
        });

        describe(`Layer composition`, () => {
            /**
             * ## SPEC
             * 
             * The layers are evaluated sequentially, from first to last:
             * - The initial value is the target's default value.
             * 
             * - If the layer is a non-additive layer,
             *   current value is interpolated to the layer's animation value,
             *   according to the layer's weight.
             * 
             * - If the layer is an additive layer,
             *   the interpolated value from "zero" to the layer's additive animation value according to the layer's weight,
             *   will be added to current value.
             *   > Here "zero" means:
             *   >   - 0 for numeric property,
             *   >   - zero vector for vector properties,
             *   >   - identity quaternion for quaternion property.
             */
            const _note = undefined;

            const fixture = {
                non_additive_layer_animation_fixture: new LinearRealValueAnimationFixture(6.0, 8.0, 1.0),
                non_additive_layer_weight: 0.314,
                additive_layer_1_animation_fixture: new LinearRealValueAnimationFixture(-2.8, 6.6, 1.5, true),
                additive_layer_1_weight: 0.456,
                additive_layer_2_animation_fixture: new LinearRealValueAnimationFixture(1.2, -1.0, 2.0, true),
                additive_layer_2_weight: 0.618,
                initial_value: 3.0,
                time: 0.2,
            };

            test(`Non-additive | Additive`, () => {
                const {
                    valueObserver,
                } = run(fixture.initial_value, [
                    { fixture: fixture.non_additive_layer_animation_fixture, weight: fixture.non_additive_layer_weight, additive: false },
                    { fixture: fixture.additive_layer_1_animation_fixture, weight: fixture.additive_layer_1_weight, additive: true },
                ], fixture.time);

                let expectedValue = fixture.initial_value;
                expectedValue = lerp(
                    expectedValue,
                    fixture.non_additive_layer_animation_fixture.getExpected(fixture.time),
                    fixture.non_additive_layer_weight,
                );
                expectedValue += lerp(
                    0,
                    fixture.additive_layer_1_animation_fixture.getExpected(fixture.time),
                    fixture.additive_layer_1_weight,
                );

                // Snapshot our expected value.
                expect(expectedValue).toMatchSnapshot('Expected value');
                expect(valueObserver.value).toBeCloseTo(expectedValue, DEFAULT_CLOSE_TO_NUM_DIGITS);
            });

            test(`Additive | Non-additive`, () => {
                const {
                    valueObserver,
                } = run(fixture.initial_value, [
                    { fixture: fixture.additive_layer_1_animation_fixture, weight: fixture.additive_layer_1_weight, additive: true },
                    { fixture: fixture.non_additive_layer_animation_fixture, weight: fixture.non_additive_layer_weight, additive: false },
                ], fixture.time);

                let expectedValue = fixture.initial_value;
                expectedValue += lerp(
                    0,
                    fixture.additive_layer_1_animation_fixture.getExpected(fixture.time),
                    fixture.additive_layer_1_weight,
                );
                expectedValue = lerp(
                    expectedValue,
                    fixture.non_additive_layer_animation_fixture.getExpected(fixture.time),
                    fixture.non_additive_layer_weight,
                );

                // Snapshot our expected value.
                expect(expectedValue).toMatchSnapshot('Expected value');
                expect(valueObserver.value).toBeCloseTo(expectedValue, DEFAULT_CLOSE_TO_NUM_DIGITS);
            });

            test(`Non-additive | Non-additive`, () => {
                const {
                    valueObserver,
                } = run(fixture.initial_value, [
                    { fixture: fixture.additive_layer_1_animation_fixture, weight: fixture.additive_layer_1_weight, additive: true },
                    { fixture: fixture.additive_layer_2_animation_fixture, weight: fixture.additive_layer_2_weight, additive: true },
                ], fixture.time);

                let expectedValue = fixture.initial_value;
                expectedValue += lerp(
                    0,
                    fixture.additive_layer_1_animation_fixture.getExpected(fixture.time),
                    fixture.additive_layer_1_weight,
                );
                expectedValue += lerp(
                    0,
                    fixture.additive_layer_2_animation_fixture.getExpected(fixture.time),
                    fixture.additive_layer_2_weight,
                );

                // Snapshot our expected value.
                expect(expectedValue).toMatchSnapshot('Expected value');
                expect(valueObserver.value).toBeCloseTo(expectedValue, DEFAULT_CLOSE_TO_NUM_DIGITS);
            });

            function run(
                initialValue: number,
                layerConfigs: ReadonlyArray<{
                    fixture: RealValueAnimationFixture;
                    weight: number;
                    additive: boolean;
                }>,
                time: number,
            ) {
                const valueObserver = new SingleRealValueObserver(initialValue);

                const animationGraph = new AnimationGraph();
                for (const {
                    fixture,
                    weight,
                    additive,
                } of layerConfigs) {
                    const layer = animationGraph.addLayer();
                    layer.weight = weight;
                    layer.additive = additive;
    
                    const { stateMachine } = layer;
    
                    const clipMotionState = stateMachine.addMotion();
                    clipMotionState.motion = fixture.createMotion(valueObserver.getCreateMotionContext());

                    stateMachine.connect(stateMachine.entryState, clipMotionState);
                }

                const graphEval = createAnimationGraphEval(animationGraph, valueObserver.root);
                const graphUpdater = new GraphUpdater(graphEval);
                
                graphUpdater.step(time);

                return {
                    valueObserver,
                };
            }
        });

        test(`Additive layer should be affected by mask`, () => {
            const fixture = {
                clip_duration: 0.3,
                node1_initial_value: 6.,
                node1_animation: new LinearRealValueAnimationFixture(3., 4., 0.3, true),
                node2_initial_value: 7.,
                node2_animation: new LinearRealValueAnimationFixture(-2., -6.6, 0.3, true),
                time: 0.2,
            };

            const root = new Node('Root');
            const node1 = new Node('Node1');
            node1.parent = root;
            node1.setPosition(fixture.node1_initial_value, 0.0, 0.0);
            const node2 = new Node('Node2');
            node2.parent = root;
            node2.setPosition(fixture.node2_initial_value, 0.0, 0.0);

            const clipMotion = new ClipMotion();
            const clip = clipMotion.clip = new AnimationClip();
            clip[additiveSettingsTag].enabled = true;
            clip.duration = fixture.clip_duration;
            addTrack(node1.name, fixture.node1_animation);
            addTrack(node2.name, fixture.node2_animation);

            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            layer.additive = true;
            const animationMask = layer.mask = new AnimationMask();
            animationMask.addJoint(node1.name, true);
            animationMask.addJoint(node2.name, false);
            const motionState = layer.stateMachine.addMotion();
            motionState.motion = clipMotion;
            layer.stateMachine.connect(layer.stateMachine.entryState, motionState);

            const graphEval = createAnimationGraphEval(animationGraph, root);
            graphEval.update(fixture.time);

            // Node1
            {
                let desired = fixture.node1_initial_value;
                desired += fixture.node1_animation.getExpected(fixture.time);
                expect(desired).toMatchSnapshot('Expected value of node1');
                expect(node1.position.x).toBeCloseTo(desired, DEFAULT_CLOSE_TO_NUM_DIGITS);
            }

            // Node2
            {
                const desired = fixture.node2_initial_value; // Since the node is masked, the layer has no effect.
                expect(desired).toMatchSnapshot('Expected value of node2');
                expect(node2.position.x).toBeCloseTo(desired, DEFAULT_CLOSE_TO_NUM_DIGITS);
            }

            function addTrack(path: string, fixture: LinearRealValueAnimationFixture) {
                const track = new VectorTrack();
                track.path.toHierarchy(path).toProperty('position')
                track.componentsCount = 3;
                track.channels()[0].curve.assignSorted([
                    [0, fixture.from],
                    [fixture.duration, fixture.to],
                ]);
                clip.addTrack(track);
            }
        });

        describe(`Additive nullish motion`, () => {
            /**
             * 
             * ### Spec
             * 
             * In everywhere of an additive layer, if a motion is required but it is not specified,
             * it's as if there is a "nullish motion" specified at that place.
             * The nullish motion yields "zero delta pose", that's, it takes no any animation effect when applying additive operation.
             * 
             * Besides, if the layer is not in a motion state, the layer yields "zero delta pose" too.
             */
            const _spec = undefined;

            test(`The whole additive layer is nullish`, () => {
                const observer = new SingleRealValueObserver(6.);
                const graph = new AnimationGraph();
                const layer = graph.addLayer();
                layer.additive = true;

                // Adds a motion to "hold the pose" but don't connect to it.
                const holderState = layer.stateMachine.addMotion();
                holderState.motion = new ConstantRealValueAnimationFixture(2.).createMotion(observer.getCreateMotionContext());

                const graphEval = createAnimationGraphEval(graph, observer.root);
                const graphUpdater = new GraphUpdater(graphEval);
                graphUpdater.step(0.2);
                expect(observer.value).toBeCloseTo(6.);
            });

            test(`Run into a nullish motion state`, () => {
                const observer = new SingleRealValueObserver(6.);
                const graph = new AnimationGraph();
                const layer = graph.addLayer();
                layer.additive = true;

                // Adds a motion to "hold the pose" but don't connect to it.
                const holderState = layer.stateMachine.addMotion();
                holderState.motion = new ConstantRealValueAnimationFixture(2.).createMotion(observer.getCreateMotionContext());

                const nullMotionState = layer.stateMachine.addMotion();
                layer.stateMachine.connect(layer.stateMachine.entryState, nullMotionState);

                const graphEval = createAnimationGraphEval(graph, observer.root);
                const graphUpdater = new GraphUpdater(graphEval);
                graphUpdater.step(0.2);
                expect(observer.value).toBeCloseTo(6.);
            });

            describe(`States of transition yield nullish`, () => {
                test.each([
                    ['Source state yields nullish', true, false],
                    ['Destination state yields nullish', false, true],
                    [`Both yields nullish`, true, true],
                ] as [title: string, isSourceYieldingNullish: boolean, isDestinationYieldingNullish: boolean][]
                )(`%s`, (_title, isSourceYieldingNullish, isDestinationYieldingNullish) => {
                    const fixture = {
                        initial_value: 6.,
                        non_nullish_source_animation: new LinearRealValueAnimationFixture(1., 2., 3., true),
                        transition_duration: 0.3,
                    };
    
                    const observer = new SingleRealValueObserver(fixture.initial_value);
                    const graph = new AnimationGraph();
                    const layer = graph.addLayer();
                    layer.additive = true;

                    const addState = (yieldingNullish: boolean) => {
                        const state = layer.stateMachine.addMotion();
                        if (!yieldingNullish) {
                            state.motion = fixture.non_nullish_source_animation.createMotion(observer.getCreateMotionContext());
                        }
                        return state;
                    };
    
                    // Adds a motion to "hold the pose" but don't connect to it.
                    const holderState = layer.stateMachine.addMotion();
                    holderState.motion = new ConstantRealValueAnimationFixture(2.).createMotion(observer.getCreateMotionContext());
    
                    const sourceState = addState(isSourceYieldingNullish);
                    const destinationState = addState(isDestinationYieldingNullish);
                    layer.stateMachine.connect(layer.stateMachine.entryState, sourceState);
    
                    const transition = layer.stateMachine.connect(sourceState, destinationState);
                    transition.duration = fixture.transition_duration;
                    transition.exitConditionEnabled = true;
                    transition.exitCondition = 0.0;
    
                    const graphEval = createAnimationGraphEval(graph, observer.root);
                    const graphUpdater = new GraphUpdater(graphEval);
                    graphUpdater.step(0.2);
    
                    expect(observer.value).toBeCloseTo(fixture.initial_value +
                        lerp(
                            isSourceYieldingNullish ? 0.0 : fixture.non_nullish_source_animation.getExpected(0.2),
                            isDestinationYieldingNullish ? 0.0 : fixture.non_nullish_source_animation.getExpected(0.2),
                            0.2 / fixture.transition_duration,
                        ),
                    );
                });
            });
        });
    });

    describe(`Animation blend`, () => {
        interface BlendItemFixture {
            animation: RealValueAnimationFixture;
            weight: number;
        }

        test(`Blend non zero motions`, () => {
            /**
             * ### Spec
             * 
             * When blending child motions,
             * the result motion has the duration weighted from all motion's duration.
             * 
             * For example, when blending motion `A`(duration: 4s) and `B`(duration: 3s) and their weights are `0.3`, `0.7` respectively.
             * The result motion has duration $(4 * 0.3 + 3 * 0.7)s = 3.3s$.
             * As 0.1 second elapsed,
             * both `A` and `B` are sampled at their $((0.1 / 3.3) * 100)% ≈ 3%$ and then are blended together according to weight again.
             */
            const fixture = {
                child1: {
                    animation: new LinearRealValueAnimationFixture(2., 3., 4.),
                    weight: 0.3,
                },
                
                child2: {
                    animation: new ConstantRealValueAnimationFixture(5., 0.),
                    weight: 0.7,
                }
            };

            const evaluate = createAnimationBlend(fixture.child1, fixture.child2);

            const expectedDuration = fixture.child1.animation.duration * fixture.child1.weight
                +
                fixture.child2.animation.duration * fixture.child2.weight;

            const stepRatio = 0.3;
            expect(evaluate(expectedDuration * stepRatio)).toBeCloseTo(
                fixture.child1.animation.getExpected(fixture.child1.animation.duration * stepRatio) * fixture.child1.weight
                +
                fixture.child2.animation.getExpected(fixture.child2.animation.duration * stepRatio) * fixture.child2.weight,
            );
        });

        test(`Blend with zero duration children`, () => {
            const fixture = {
                non_zero_child: {
                    animation: new LinearRealValueAnimationFixture(2., 3., 4.),
                    weight: 0.3,
                },
                
                zero_child: {
                    animation: new ConstantRealValueAnimationFixture(5., 0.),
                    weight: 0.7,
                }
            };

            const evaluate = createAnimationBlend(fixture.non_zero_child, fixture.zero_child);

            const stepTime = fixture.non_zero_child.animation.duration * 0.2;
            const ratio = stepTime /
                (fixture.non_zero_child.animation.duration * fixture.non_zero_child.weight);
            expect(evaluate(stepTime)).toBeCloseTo(
                fixture.non_zero_child.animation.getExpected(fixture.non_zero_child.animation.duration * ratio) * fixture.non_zero_child.weight
                +
                fixture.zero_child.animation.getExpected() * fixture.zero_child.weight,
            );
        });

        test(`When blending, only zero duration children take weights`, () => {
            const fixture = {
                non_zero_child: {
                    animation: new LinearRealValueAnimationFixture(2., 3., 4.),
                    weight: 0.0,
                },
                
                zero_child: {
                    animation: new ConstantRealValueAnimationFixture(5., 0.),
                    weight: 1.0,
                }
            };

            const evaluate = createAnimationBlend(fixture.non_zero_child, fixture.zero_child);

            expect(evaluate(100.86 /* CAN BE ANY */)).toBeCloseTo(
                fixture.zero_child.animation.getExpected() * fixture.zero_child.weight,
            );
        });

        function createAnimationBlend(...itemFixtures: readonly BlendItemFixture[]) {
            const valueObserver = new SingleRealValueObserver();

            const animationBlend = new AnimationBlendDirect();
            animationBlend.items = itemFixtures.map((itemFixture) => {
                const item = new AnimationBlendDirect.Item();
                item.motion = itemFixture.animation.createMotion(valueObserver.getCreateMotionContext());
                item.weight.value = itemFixture.weight;
                return item;
            });

            const animationGraph = new AnimationGraph();
            const layer = animationGraph.addLayer();
            const motionState = layer.stateMachine.addMotion();
            motionState.motion = animationBlend;
            layer.stateMachine.connect(layer.stateMachine.entryState, motionState);

            const graphEval = createAnimationGraphEval(animationGraph, valueObserver.root);
            const graphUpdater = new GraphUpdater(graphEval);

            return (time: number) => {
                graphUpdater.goto(time);
                return valueObserver.value; 
            };
        }
    });

    test(`Variables of experimental types`, () => {
        test<Vec3>(
            (animationGraph: AnimationGraph, name: string, defaultValue?: Readonly<Vec3>) => animationGraph.addVariable(name, VariableType.VEC3_experimental, defaultValue),
            VariableType.VEC3_experimental,
            Vec3.ZERO,
            Vec3,
            (hint) => new Vec3(hint),
        );

        test<Quat>(
            (animationGraph: AnimationGraph, name: string, defaultValue?: Readonly<Quat>) => animationGraph.addVariable(name, VariableType.QUAT_experimental, defaultValue),
            VariableType.QUAT_experimental,
            Quat.IDENTITY,
            Quat,
            (hint) => new Quat(hint),
        );


        function test<T extends Vec3 | Quat>(
            add: (animationGraph: AnimationGraph, name: string, defaultValue?: Readonly<T>) => void,
            expectedType: VariableType,
            expectedDefaultValue: Readonly<T>,
            expectedConstructor: (new () => T) & {
                equals: (a: Readonly<T>, b: Readonly<T>) => boolean;
                strictEquals: (a: Readonly<T>, b: Readonly<T>, epsilon?: number) => boolean;
            },
            generate: (hint: number) => T,
        ) {
            const animationGraph = new AnimationGraph();

            // Add a variable, with no default value specified.
            add(animationGraph, 'v1');
            const v1 = animationGraph.getVariable('v1');
            // Should successfully added.
            expect(v1).not.toBeUndefined();
            // Should have corresponding variable type.
            expect(v1!.type).toBe(expectedType);
            // Its value should be the corresponding default value.
            expect(v1!.value).toBeInstanceOf(expectedConstructor);
            // Its value should be strictly compared equal to the default value.
            expect(expectedConstructor.strictEquals(v1!.value as T, expectedDefaultValue)).toBe(true);

            // Add a variable, with default value specified.
            const v2DefaultValue = generate(1);
            add(animationGraph, 'v2', v2DefaultValue as T);
            const v2 = animationGraph.getVariable('v2');
            // Should successfully added.
            expect(v2).not.toBeUndefined();
            // Should have corresponding variable type.
            expect(v2!.type).toBe(expectedType);
            // Its value should be of corresponding type,
            // and should be strictly compared equal to the default value,
            // and should not be the passed default value itself.
            expect(v2!.value).toBeInstanceOf(expectedConstructor);
            expect(expectedConstructor.strictEquals(v2!.value as T, v2DefaultValue as T)).toBe(true);
            expect(v2!.value).not.toBe(v2DefaultValue);

            const { newGenAnim: animationController } = createAnimationGraphEval2(animationGraph, new Node());
            
            // v1 should have its instance created, initialized.
            const v1InstanceValue = animationController.getValue_experimental('v1');
            expect(v1InstanceValue).not.toBeUndefined();
            expect(v1InstanceValue!).toBeInstanceOf(expectedConstructor);
            expect(expectedConstructor.strictEquals(v1InstanceValue as T, expectedDefaultValue)).toBe(true);

            // v2, too
            const v2InstanceValue = animationController.getValue_experimental('v2');
            expect(v2InstanceValue).not.toBeUndefined();
            expect(v2InstanceValue!).toBeInstanceOf(expectedConstructor);
            expect(expectedConstructor.strictEquals(v2InstanceValue as T, v2DefaultValue as T)).toBe(true);

            // Set a value.
            const vv = generate(2.5);
            animationController.setValue_experimental('v1', vv);
            {
                const valueAfterSet = animationController.getValue_experimental('v1') as T;
                // The semantic is "copy".
                expect(valueAfterSet).not.toBe(vv);
                expect(valueAfterSet).toBeInstanceOf(expectedConstructor);
                expect(expectedConstructor.strictEquals(valueAfterSet as T, vv as T)).toBe(true);
            }

            // There should be warn if `.getValue()` is used to obtain an experimental variable.
            const warnWatcher = captureWarns();
            const getValue_returned = animationController.getValue('v1');
            expect(getValue_returned).toBeUndefined();
            expect(warnWatcher.captured).toHaveLength(1);
            expect(warnWatcher.captured[0]).toStrictEqual([`Obtaining variable "v1" is not of primitive type, `
                + `which is currently supported experimentally and should be explicitly obtained through this.getValue_experimental()`]);
            warnWatcher.stop();
        }
    });

    describe(`Animation involvement specification`, () => {
        describe(`Node transform involvement`, () => {
            test(`If any part of transform is involved in animation, the whole transition is involved`, () => {
                /** Unique number generator. */
                const genN = (() => {
                    function* g(): Generator<number, number> { for (let v = 1.2; ; v += 0.2 ) yield v; }
                    const generator = g();
                    return () => generator.next().value;
                })();

                const fixture = {
                    initial: {
                        position: new Vec3(genN(), genN(), genN()),
                        rotation: Quat.fromEuler(new Quat(), genN(), genN(), genN()),
                        scale: Vec3.multiplyScalar(new Vec3(), Vec3.ONE, genN()), // Note we currently require uniform scale
                    },
                    manually_set: {
                        position: new Vec3(genN(), genN(), genN()),
                        rotation: Quat.fromEuler(new Quat(), genN(), genN(), genN()),
                        scale: Vec3.multiplyScalar(new Vec3(), Vec3.ONE, genN()), // Note we currently require uniform scale
                    },
                    animation: {
                        position: new ConstantRealValueAnimationFixture(genN()),
                    },
                };

                // Create a clip motion which animates only the `position.x`.
                const motion = fixture.animation.position.createMotion({
                    createClipMotion(keyframes, options) {
                        const clip = new AnimationClip();
                        if (options.name) { clip.name = options.name; }
                        clip.duration = options.duration;
                        const track = new VectorTrack();
                        track.componentsCount = 3;
                        track.path.toProperty('position');
                        track.channels()[0].curve.assignSorted(keyframes);
                        clip.addTrack(track);
                        const motion = new ClipMotion();
                        motion.clip = clip;
                        return motion as NonNullableClipMotion;
                    },
                });

                const origin = new Node();
                origin.setPosition(fixture.initial.position);
                origin.setRotation(fixture.initial.rotation);
                origin.setScale(fixture.initial.scale);

                const evalMock = new AnimationGraphEvalMock(origin, createAnimationGraphRunningMotion(motion));

                /**
                 * Checks:
                 * - Node's position is animated.
                 * - Node's scale,rotation keeps initial value.
                 */
                const check = () => {
                    expect(Vec3.equals(origin.position, {
                        x: fixture.animation.position.getExpected(evalMock.current),
                        y: fixture.initial.position.y,
                        z: fixture.initial.position.z,
                    })).toBeTrue();
                    expect(Quat.equals(origin.rotation, fixture.initial.rotation)).toBeTrue();
                    expect(Vec3.equals(origin.scale, fixture.initial.scale)).toBeTrue();
                };

                evalMock.goto(0.3 * fixture.animation.position.duration);
                check();

                // Even after manually changed, animation will write the properties back.
                origin.setPosition(fixture.manually_set.position);
                origin.setRotation(fixture.manually_set.rotation);
                origin.setScale(fixture.manually_set.scale);
                evalMock.goto(0.7 * fixture.animation.position.duration);
                check();
            });

            describe(`If a node is involved in animation, its ancestors until origin will also be involved`, () => {
                test.each([
                    [`The node is a direct child of origin`, 0],
                    [`1 ancestor`, 1],
                    [`2 ancestors`, 2],
                    [`3 ancestors`, 3],
                ])(`%s`, (_title, ancestorCount) => {
                    const fixture = {
                        origin_initial_value: 0.5,
                        origin_manually_set_value: 0.6,
                        descendant_animation_value: new ConstantRealValueAnimationFixture(6.6),
                        ancestor_count: ancestorCount,
                    };
    
                    // Set up the hierarchy.
                    const origin = new Node(`Origin`);
                    origin.setPosition(fixture.origin_initial_value, 0.0, 0.0);
                    const descendantNode = new Node(`Descendant`);
                    const ancestors = Array.from({ length: fixture.ancestor_count }, (_, i) => {
                        const initialValue = 1.0 + lerp(0.0, 1.0, i / fixture.ancestor_count);
                        const manuallySetValue = 2.0 + lerp(0.0, 1.0, i / fixture.ancestor_count);
                        const node = new Node(`Ancestor ${i}`);
                        node.setPosition(initialValue, 0.0, 0.0);
                        return {
                            node: node,
                            getValue() {
                                return node.position.x;
                            },
                            initialValue,
                            manuallySetValue,
                            setManually() {
                                node.setPosition(manuallySetValue, 0.0, 0.0);
                            },
                        };
                    });
                    origin.addChild(ancestors.length === 0 ? descendantNode : ancestors[ancestors.length - 1].node);
                    ancestors.forEach((ancestor, i) => {
                        if (i === 0) {
                            ancestor.node.addChild(descendantNode);
                        } else {
                            ancestor.node.addChild(ancestors[i - 1].node);
                        }
                    });
    
                    // Create a clip motion which animates only the descendant.
                    const descendantMotion = fixture.descendant_animation_value.createMotion({
                        createClipMotion(keyframes, options) {
                            const clip = new AnimationClip();
                            if (options.name) { clip.name = options.name; }
                            clip.duration = options.duration;
                            const track = new VectorTrack();
                            track.componentsCount = 3;
                            for (let iAncestor = fixture.ancestor_count - 1; iAncestor >= 0; --iAncestor) {
                                track.path.toHierarchy(ancestors[iAncestor].node.name)
                            }
                            track.path.toHierarchy(descendantNode.name).toProperty('position');
                            track.channels()[0].curve.assignSorted(keyframes);
                            clip.addTrack(track);
                            const motion = new ClipMotion();
                            motion.clip = clip;
                            return motion as NonNullableClipMotion;
                        },
                    });

    
                    const evalMock = new AnimationGraphEvalMock(origin, createAnimationGraphRunningMotion(descendantMotion));
    
                    // Tick.
                    evalMock.goto(0.3 * fixture.descendant_animation_value.duration);
                    // The animation should take effect.
                    expect(descendantNode.position.x).toBeCloseTo(fixture.descendant_animation_value.getExpected(evalMock.current), 5);
                    // Ancestor nodes should keep its initial value.
                    expect(ancestors.map((ancestor) => ancestor.getValue())).toStrictEqual(
                        ancestors.map((ancestor) => ancestor.initialValue));
                    // The origin should keep its initial value.
                    expect(origin.position.x).toBe(fixture.origin_initial_value);
                    
                    // Manually change the origin's value.
                    origin.setPosition(fixture.origin_manually_set_value, 0.0, 0.0);
                    for (const ancestor of ancestors) { ancestor.setManually(); }
                    // Verify the manually set values have been set.
                    expect(ancestors.map((ancestor) => ancestor.getValue())).toStrictEqual(
                        ancestors.map((ancestor) => ancestor.manuallySetValue));
                    // Tick.
                    evalMock.goto(0.6 * fixture.descendant_animation_value.duration);
                    // The animation should take effect.
                    expect(descendantNode.position.x).toBeCloseTo(fixture.descendant_animation_value.getExpected(evalMock.current), 5);
                    // Ancestor nodes should have its initial value write back.
                    expect(ancestors.map((ancestor) => ancestor.getValue())).toStrictEqual(
                        ancestors.map((ancestor) => ancestor.initialValue));
                    // But the origin should keep its initial value, since it's not involved.
                    expect(origin.position.x).toBe(fixture.origin_manually_set_value);
                });
            });
        });

        function createAnimationGraphRunningMotion(motion: ClipMotion) {
            const animationGraph = createAnimationGraph({
                layers: [{
                    stateMachine: {
                        states: { 's': { type: 'motion', motion: motion } },
                        entryTransitions: [{ to: 's' }],
                    },
                }],
            });
            return animationGraph;
        }
    });

    describe(`Non-transform animation`, () => {
        test(`Behavior in state machine`, () => {
            /// In below:
            /// - "tp" means "target property".

            const fixture = {
                common_tp_default_value: 9,
                animation_1: ((duration: number) => ({
                    duration,
                    exclusive_tp_default_value: 3.,
                    exclusive_animation: new LinearRealValueAnimationFixture(1, 2, duration),
                    common_animation: new LinearRealValueAnimationFixture(3, 4, duration),
                }))(2.0),
                animation_2: ((duration: number) => ({
                    duration,
                    exclusive_tp_default_value: 2.,
                    exclusive_animation: new LinearRealValueAnimationFixture(5, 6, duration),
                    common_animation: new LinearRealValueAnimationFixture(7, 8, duration),
                }))(1.5),
                transitionDuration: 0.3,
            };

            @ccclass('TargetObject')
            class TargetObject extends Component {
                tp_common = fixture.common_tp_default_value;
                tp_anim_1_only = fixture.animation_1.exclusive_tp_default_value;
                tp_anim_2_only = fixture.animation_2.exclusive_tp_default_value;
            }

            const createMotion = (params: typeof fixture.animation_1, exclusive_tp_key: keyof TargetObject) => {
                const clip = new AnimationClip();
                clip.duration = params.duration;
                {
                    const track = new RealTrack();
                    track.path.toComponent(TargetObject).toProperty('tp_common' as keyof TargetObject);
                    params.common_animation.setupCurve(track.channel.curve);
                    clip.addTrack(track);
                }
                {
                    const track = new RealTrack();
                    track.path.toComponent(TargetObject).toProperty(exclusive_tp_key);
                    params.exclusive_animation.setupCurve(track.channel.curve);
                    clip.addTrack(track);
                }
                const clipMotion = new ClipMotion();
                clipMotion.clip = clip;
                return clipMotion as NonNullableClipMotion;
            };

            const clipMotion1 = createMotion(fixture.animation_1, 'tp_anim_1_only');
            const clipMotion2 = createMotion(fixture.animation_2, 'tp_anim_2_only');
            const animationGraph = createAnimationGraph({
                variableDeclarations: { 'EnableTransition': { type: 'boolean' } },
                layers: [{
                    stateMachine: {
                        entryTransitions: [{ to: 'motion1' }],
                        transitions: [{
                            from: 'motion1', to: 'motion2', exitTimeEnabled: false, duration: fixture.transitionDuration,
                            conditions: [{ type: 'unary', operand: { type: 'variable', name: 'EnableTransition' }, operator: 'to-be-true' }],
                        }],
                        states: {
                            'motion1': { type: 'motion', motion: clipMotion1, },
                            'motion2': { type: 'motion', motion: clipMotion2 },
                        },
                    },
                }],
            });

            const origin = new Node();

            const targetObject = origin.addComponent(TargetObject) as TargetObject;

            const check = (() => {
                let expected_common = fixture.common_tp_default_value;
                let expected_anim_1_only = fixture.animation_1.exclusive_tp_default_value;
                let expected_anim_2_only = fixture.animation_2.exclusive_tp_default_value;

                return ({
                    common,
                    anim_1_only: anim_1_exclusive,
                    anim_2_only: anim_2_exclusive,
                }: Partial<{
                    common: number,
                    anim_1_only: number,
                    anim_2_only: number,
                }>) => {
                    expected_common = common ?? expected_common;
                    expected_anim_1_only = anim_1_exclusive ?? expected_anim_1_only;
                    expected_anim_2_only = anim_2_exclusive ?? expected_anim_2_only;
                    expect(targetObject.tp_common).toBeCloseTo(expected_common, 5);
                    expect(targetObject.tp_anim_1_only).toBeCloseTo(expected_anim_1_only, 5);
                    expect(targetObject.tp_anim_2_only).toBeCloseTo(expected_anim_2_only, 5);
                };
            })();

            const evalMock = new AnimationGraphEvalMock(origin, animationGraph);

            check({});

            // If no transition, the animation is normally sampled.
            for (const [t] of generateIntervals(0.2, 0.7, 0.9)) {
                evalMock.step(fixture.animation_1.duration * t);

                const tAnim = Math.min(evalMock.current, fixture.animation_1.duration);
                check({
                    anim_1_only: fixture.animation_1.exclusive_animation.getExpected(tAnim),

                    common: fixture.animation_1.common_animation.getExpected(tAnim),

                    // Not changed since anim2 is not playing.
                    anim_2_only: undefined,
                });
            }

            // During transition or after transition finished.
            evalMock.controller.setValue('EnableTransition', true);
            const start_time_of_motion2_state = evalMock.current;
            for (const [t] of generateIntervals(0.15, 0.88)) {
                evalMock.step(fixture.transitionDuration * t);
                
                const tAnim = Math.min(evalMock.current - start_time_of_motion2_state, fixture.animation_1.duration);
                check({
                    // Anim1's exclusive property is not affected.
                    anim_1_only: fixture.animation_1.exclusive_animation.getExpected(Math.min(evalMock.current, fixture.animation_1.duration)),

                    // But the common property is fully governed by anim2 instead.
                    common: fixture.animation_2.common_animation.getExpected(tAnim),

                    anim_2_only: fixture.animation_2.exclusive_animation.getExpected(tAnim),
                });
            }

            // After transition finished, only motion2 plays.
            for (const [t] of generateIntervals(1.2, 1.5)) {
                evalMock.step(fixture.transitionDuration * t);

                const tAnim = Math.min(evalMock.current - start_time_of_motion2_state, fixture.animation_1.duration);
                check({
                    // Not changed since anim2 is not playing.
                    anim_1_only: undefined,

                    // But the common property is fully governed by anim2 instead.
                    common: fixture.animation_2.common_animation.getExpected(tAnim),

                    anim_2_only: fixture.animation_2.exclusive_animation.getExpected(tAnim),
                });
            }
        });
    });
});

function assertivelyGetGraphVariable(graph: AnimationGraph, name: string) {
    const value = graph.getVariable(name);
    expect(value).not.toBeUndefined();
    return value!;
}

type NonNullableClipMotion = Omit<ClipMotion, 'clip'> & { 'clip': NonNullable<ClipMotion['clip']> };

function createEmptyClipMotion (duration: number, name = ''): NonNullableClipMotion  {
    const clip = new AnimationClip();
    clip.name = name;
    clip.enableTrsBlending = true;
    clip.duration = duration;
    const clipMotion = new ClipMotion();
    clipMotion.clip = clip;
    return clipMotion as NonNullableClipMotion;
}

function createClipMotionPositionX(duration: number, value: number, name = ''): NonNullableClipMotion {
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
    return clipMotion as NonNullableClipMotion;
}

function createClipMotionPositionXLinear(duration: number, from: number, to: number, name = ''): NonNullableClipMotion {
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
    return clipMotion as NonNullableClipMotion;
}

/**
 * A clip sheet contains a well-created animation clip object
 * and provide utilities to verify sample result.
 */
function createClipSheet(duration: number, from: number, to: number, name = '') {
    const clip = createClipMotionPositionXLinear(duration, from, to, name).clip;
    return {
        clip,

        from,

        to,

        duration,

        /**
         * Creates a clip motion referencing to the created clip.
         * @returns 
         */
        createMotion() {
            const clipMotion = new ClipMotion();
            clipMotion.clip = clip;
            return clipMotion as NonNullableClipMotion;
        },

        /**
         * Returns what the result would be when sample from such a clip.
         * @param ratio Normalized time of this clip.
         */
        sample(ratio: number) {
            return lerp(
                from,
                to,
                ratio,
            );
        },

        /**
         * Returns what the result would be when sample from such a clip.
         */
        sampleAtTime(time: number) {
            expect(time).toBeLessThanOrEqual(duration);
            expect(time).toBeGreaterThan(0.0);
            return lerp(
                from,
                to,
                time / duration,
            );
        },
    };
}

type MayBeArray<T> = T | T[];

function calculateExpectedMotionStatusProgress (expectedStateTime: number, expectedStateDuration: number) {
    const iterations = expectedStateTime / expectedStateDuration;
    return iterations - Math.trunc(iterations);
}

interface LayerStatusExpectation {
    currentNode?: Parameters<typeof expectMotionStateStatus>[1];
    current?: Parameters<typeof expectClipStatuses>[1];
    transition?: {
        time?: number;
        duration?: number;
        nextNode?: Parameters<typeof expectMotionStateStatus>[1];
        next?: Parameters<typeof expectClipStatuses>[1];
    };
}

function expectAnimationGraphEvalStatus(graphEval: AnimationGraphEval, layerStatus: LayerStatusExpectation[]) {
    const nLayers = layerStatus.length;
    for (let iLayer = 0; iLayer < nLayers; ++iLayer) {
        expectAnimationGraphEvalStatusAtLayer(graphEval, iLayer, layerStatus[iLayer]);
    }
}

function expectAnimationGraphEvalStatusLayer0 (graphEval: AnimationGraphEval, status: LayerStatusExpectation) {
    expectAnimationGraphEvalStatusAtLayer(graphEval, 0, status);
}

function expectAnimationGraphEvalStatusAtLayer (graphEval: AnimationGraphEval, layerIndex: number, status: LayerStatusExpectation) {
    if (status.currentNode) {
        expectMotionStateStatus(graphEval.getCurrentStateStatus(layerIndex), status.currentNode);
    }
    if (status.current) {
        const currentClipStatuses = Array.from(graphEval.getCurrentClipStatuses(layerIndex));
        expectClipStatuses(currentClipStatuses, status.current);
    }

    const currentTransition = graphEval.getCurrentTransition(layerIndex);
    if (!status.transition) {
        expect(currentTransition).toBeNull();
    } else {
        expect(currentTransition).not.toBeNull();
        if (typeof status.transition.time === 'number') {
            expect(currentTransition!.time).toBeCloseTo(status.transition.time, 5);
        }
        if (typeof status.transition.duration === 'number') {
            expect(currentTransition!.duration).toBeCloseTo(status.transition.duration, 5);
        }
        if (status.transition.nextNode) {
            expectMotionStateStatus(graphEval.getNextStateStatus(layerIndex), status.transition.nextNode);
        }
        if (status.transition.next) {
            expectClipStatuses(Array.from(graphEval.getNextClipStatuses(layerIndex)), status.transition.next);
        }
    }
}

function expectMotionStateStatus (motionStateStatus: Readonly<MotionStateStatus> | null, expected: null | {
    __DEBUG_ID__?: string;
    progress?: number;
}) {
    if (!expected) {
        expect(motionStateStatus).toBeNull();
    } else {
        expect(motionStateStatus).not.toBeNull();
        if (typeof expected.__DEBUG_ID__ !== 'undefined') {
            expect(motionStateStatus!.__DEBUG_ID__).toBe(expected.__DEBUG_ID__);
        }
        if (typeof expected.progress !== 'undefined') {
            expect(motionStateStatus!.progress).toBeCloseTo(expected.progress, 5);
        }
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

function createAnimationGraphEval (animationGraph: AnimationGraph | AnimationGraphVariant, node: Node): AnimationGraphEval {
    const newGenAnim = node.addComponent(AnimationController) as AnimationController;
    const graphEval = new AnimationGraphEval(
        (animationGraph instanceof AnimationGraph) ? animationGraph : animationGraph.original!,
        node,
        newGenAnim,
        (animationGraph instanceof AnimationGraph) ? null : animationGraph.clipOverrides,
    );
    // @ts-expect-error HACK
    newGenAnim._graphEval = graphEval;
    return graphEval;
}

function createAnimationGraphEval2 (animationGraph: AnimationGraph | AnimationGraphVariant, node: Node) {
    const newGenAnim = node.addComponent(AnimationController) as AnimationController;
    const graphEval = new AnimationGraphEval(
        (animationGraph instanceof AnimationGraph) ? animationGraph : animationGraph.original!,
        node,
        newGenAnim,
        (animationGraph instanceof AnimationGraph) ? null : animationGraph.clipOverrides,
    );
    // @ts-expect-error HACK
    newGenAnim._graphEval = graphEval;
    return {
        graphEval,
        newGenAnim,
    };
}

class GraphUpdater {
    constructor (private _graphEval: AnimationGraphEval) {

    }

    get current() {
        return this._current;
    }

    get lastDeltaTime() {
        return this._lastDeltaTime;
    }

    public step(deltaTime: number) {
        this._current += deltaTime;
        this._graphEval.update(deltaTime);
        this._lastDeltaTime = deltaTime;
    }

    public goto(time: number) {
        const deltaTime = time - this._current;
        this._current = time;
        this._graphEval.update(deltaTime);
        this._lastDeltaTime = deltaTime;
    }

    private _current = 0.0;

    private _lastDeltaTime = 0.0;
}
