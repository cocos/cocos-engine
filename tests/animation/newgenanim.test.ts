
import { Component, lerp, Node, Vec2, Vec3, warnID } from '../../cocos/core';
import { AnimationBlend1D, AnimationBlend2D, Condition, InvalidTransitionError, VariableNotDefinedError, ClipMotion, AnimationBlendDirect, VariableType } from '../../cocos/core/animation/marionette/asset-creation';
import { AnimationGraph, StateMachine, Transition, isAnimationTransition, AnimationTransition, TransitionInterruptionSource } from '../../cocos/core/animation/marionette/animation-graph';
import { createEval } from '../../cocos/core/animation/marionette/create-eval';
import { VariableTypeMismatchedError } from '../../cocos/core/animation/marionette/errors';
import { AnimationGraphEval, MotionStateStatus, ClipStatus } from '../../cocos/core/animation/marionette/graph-eval';
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
import { VectorTrack } from '../../cocos/core/animation/animation';
import 'jest-extended';
import { assertIsTrue } from '../../cocos/core/data/utils/asserts';
import { AnimationClip } from '../../cocos/core/animation/animation-clip';
import { TriggerResetMode } from '../../cocos/core/animation/marionette/variable';
import { MotionState } from '../../cocos/core/animation/marionette/motion-state';

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
        expect(animTransition.interruptionSource).toBe(TransitionInterruptionSource.NONE);
        expect(animTransition.interruptible).toBe(false);

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

        for (const [name, kind, type, defaultValue, nonDefaultValue] of [
            ['f', 'float', VariableType.FLOAT, 0.0, 3.14],
            ['i', 'integer', VariableType.INTEGER, 0, 3],
            ['b', 'boolean', VariableType.BOOLEAN, false, true],
        ] as const) {
            switch (kind) {
                case 'float':
                    graph.addFloat(name);
                    break;
                case 'integer':
                    graph.addInteger(name);
                    break;
                case 'boolean':
                    graph.addBoolean(name);
                    break;
            }
            const variable = assertivelyGetGraphVariable(graph, name);
            expect(variable.type).toBe(type);
            expect(variable.value).toBe(defaultValue);
            variable.value = nonDefaultValue;
            expect(variable.value).toBe(nonDefaultValue);
            
            const name2 = `${name}-add-with-default`;
            switch (kind) {
                case 'float':
                    graph.addFloat(name2, nonDefaultValue);
                    break;
                case 'integer':
                    graph.addInteger(name2, nonDefaultValue);
                    break;
                case 'boolean':
                    graph.addBoolean(name2, nonDefaultValue);
                    break;
            }
            const variable2 = assertivelyGetGraphVariable(graph, name2);
            expect(variable2.type).toBe(type);
            expect(variable2.value).toBe(nonDefaultValue);
        }

        {
            graph.addTrigger('t');
            const trigger = assertivelyGetGraphVariable(graph, 't');
            expect(trigger.type).toBe(VariableType.TRIGGER);
            expect(trigger.value).toBe(false);
            assertIsTrue(trigger.type === VariableType.TRIGGER);
            expect(trigger.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);
            trigger.value = true;
            expect(trigger.value).toBe(true);
            trigger.resetMode = TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED;
            expect(trigger.resetMode).toBe(TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);

            graph.addTrigger('t-with-default-specified', true);
            const triggerWithDefault = assertivelyGetGraphVariable(graph, 't-with-default-specified');
            expect(triggerWithDefault.type).toBe(VariableType.TRIGGER);
            expect(triggerWithDefault.value).toBe(true);
            assertIsTrue(triggerWithDefault.type === VariableType.TRIGGER);
            expect(triggerWithDefault.resetMode).toBe(TriggerResetMode.AFTER_CONSUMED);

            graph.addTrigger('t-with-default-and-reset-mode-specified', true, TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);
            const triggerWithDefaultAndResetModeSpecified = assertivelyGetGraphVariable(graph, 't-with-default-and-reset-mode-specified');
            expect(triggerWithDefaultAndResetModeSpecified.type).toBe(VariableType.TRIGGER);
            expect(triggerWithDefaultAndResetModeSpecified.value).toBe(true);
            assertIsTrue(triggerWithDefaultAndResetModeSpecified.type === VariableType.TRIGGER);
            expect(triggerWithDefaultAndResetModeSpecified.resetMode).toBe(TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);
        }

        graph.removeVariable('f');
        expect(Array.from(graph.variables).every(([name]) => name !== 'f')).toBeTrue();

        // addVariable() replace existing variable.
        graph.addFloat('b', 2.0);
        const bVar = assertivelyGetGraphVariable(graph, 'b');
        expect(bVar.type).toBe(VariableType.FLOAT);
        expect(bVar.value).toBe(2.0);
    });

    test('Rename a variable', () => {
        const animationGraph = new AnimationGraph();
        animationGraph.addFloat('a', 3.14);
        animationGraph.addBoolean('b', true);
        animationGraph.addInteger('c', 66);
        animationGraph.addTrigger('d', true);

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
        animationGraph.addTrigger('t');
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

            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_0,
            ]);

            // 4 transitions
            const t01_1 = stateMachine.connect(m0, m1);
            const t02_0 = stateMachine.connect(m0, m2);
            const t03_0 = stateMachine.connect(m0, m3);
            const t03_1 = stateMachine.connect(m0, m3);

            // By default, later-added transitions have lower priorities.
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_0,
                t01_1,
                t02_0,
                t03_0,
                t03_1,
            ]);

            // Do nothing if diff is zero
            stateMachine.adjustTransitionPriority(t01_1, 0);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_0,
                t01_1,
                t02_0,
                t03_0,
                t03_1,
            ]);

            // Adjust 1 -> 3
            stateMachine.adjustTransitionPriority(t01_1, 2);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_0,
                t02_0,
                t03_0,
                t01_1,
                t03_1,
            ]);

            // Adjust 1 -> 3 again
            stateMachine.adjustTransitionPriority(t02_0, 2);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_0,
                t03_0,
                t01_1,
                t02_0,
                t03_1,
            ]);

            // Adjust 3 -> 1
            stateMachine.adjustTransitionPriority(t02_0, -2);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_0,
                t02_0,
                t03_0,
                t01_1,
                t03_1,
            ]);

            // Adjust 3 -> 0
            stateMachine.adjustTransitionPriority(t01_1, -3);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_1,
                t01_0,
                t02_0,
                t03_0,
                t03_1,
            ]);

            // Adjust 1 -> 4
            stateMachine.adjustTransitionPriority(t01_0, 3);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_1,
                t02_0,
                t03_0,
                t03_1,
                t01_0,
            ]);

            // Adjust 1 -> 7(overflow)
            stateMachine.adjustTransitionPriority(t02_0, 6);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
                t01_1,
                t03_0,
                t03_1,
                t01_0,
                t02_0,
            ]);

            // Adjust 3 -> -2(underflow)
            stateMachine.adjustTransitionPriority(t01_0, -6);
            expect(Array.from(stateMachine.getOutgoings(m0))).toStrictEqual([
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
            animationGraph.addTrigger('subgraphExitTrigger', false);
            subgraphEntryToExitCondition.trigger = 'subgraphExitTrigger';

            graph.connect(graph.entryState, subStateMachine);
            const node = graph.addMotion();
            node.name = 'Node';
            const subgraphToNode = graph.connect(subStateMachine, node);
            const [triggerCondition] = subgraphToNode.conditions = [new TriggerCondition()];

            animationGraph.addTrigger('trigger',);
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

            graphEval.update(animState1Clip.clip!.duration * 1.8);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                current: {
                    clip: animState1Clip.clip!,
                    weight: 0.333333,
                },
                transition: {
                    time: 0.2,
                    next: {
                        clip: animState2Clip.clip!,
                        weight: 0.666667,
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

                animationGraph.addTrigger('theTrigger');

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
    
                animationGraph.addTrigger('t');
                
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
    
                animationGraph.addTrigger('t');
                
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
                animationGraph.addTrigger(`trigger${nTriggers}`);
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

            animationGraph.addTrigger(triggerName, false, TriggerResetMode.NEXT_FRAME_OR_AFTER_CONSUMED);
            animationGraph.addBoolean(helpVarName);

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
                animationGraph.addBoolean('switch1', false);
                animationGraph.addBoolean('switch2', false);

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

                animationGraph.addTrigger('t');

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
            animationGraph.addBoolean(emptyTransitionEnablingVarName);

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);

            const graphUpdater = new GraphUpdater(graphEval);
            graphUpdater.goto(4.0 * 0.1 + 0.2);

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
            animationGraph.addBoolean(emptyTransitionEnablingVarName);

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);

            const graphUpdater = new GraphUpdater(graphEval);
            graphUpdater.goto(4.0 * 0.1 + 0.2);

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

            animationGraph.addTrigger('trigger');

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
            graph.addTrigger('trigger', true);

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
                graph.addTrigger('t', false);

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
            updater.goto(FIRST_TIME_EMPTY_REST_TIME + MOTION_EXIT_CONDITION + 0.15);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: clipMotion!.clip, weight: 1.0 - 0.15 / MOTION_TO_EMPTY_DURATION } },
            ]);
            expect(node.position.x).toBeCloseTo(lerp(
                MOTION_SAMPLE_RESULT_AT(MOTION_EXIT_CONDITION + 0.15), // Layer 0 result
                NODE_DEFAULT_VALUE, // Default
                0.15 / MOTION_TO_EMPTY_DURATION,
            ));

            // Step for a little while
            updater.step(0.06);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: clipMotion!.clip, weight: 1.0 - 0.21 / MOTION_TO_EMPTY_DURATION } },
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

            updater.goto(0.3 * 1.0 + 0.12);
            expectAnimationGraphEvalStatus(graphEval, [
                { current: { clip: layer0Clip!.clip, weight: 1.0 } },
                { current: { clip: layer1Clip.clip, weight: 1.0 - 0.12 / 0.5 } },
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

        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        const layerGraph = layer.stateMachine;

        const animState = layerGraph.addMotion();
        const animStateStats = animState.addComponent(StatsComponent);
        animStateStats.id = 'AnimState';
        animState.motion = createClipMotionPositionX(0.4, 0.5, 'AnimStateClip');

        const animState2 = layerGraph.addMotion();
        const animState2Stats = animState2.addComponent(StatsComponent);
        animState2Stats.id = 'AnimState2';
        animState2.motion = createClipMotionPositionX(1.0, 0.5, 'AnimState2Clip');

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

        // Goto the AnimState, but does not trigger the transition
        graphEval.update(0.1);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState',
                status: { progress: 0.0, },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState',
                status: { progress: 0.1 / 0.4, },
            }
        ]);
        recorder.clear();

        // Trigger AnimState -> AnimState2, and step the transition for (0.1 + 0.31 - 0.4 * 0.7) = 0.13
        graphEval.update(0.31);
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState2',
                status: { progress: 0.0, },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState',
                status: { progress: 0.01 / 0.4, },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2',
                status: { progress: 0.13 / 1.0, },
            },
        ]);
        recorder.clear();

        graphEval.update(
            (0.3 - 0.13) + // Finish the transition
            0.1, // Update the AnimState2, but do not trigger next transition
        );
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateExit',
                id: 'AnimState',
                status: { progress: getPositionFromLoopedIterations((0.4 * 0.7 + 0.3) / 0.4), },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2',
                status: { progress: (0.3 + 0.1) / 1.0, },
            },
        ]);
        recorder.clear();

        // Now let's test an edge case: delta time is so big, the transition is directly passed.
        graphEval.update(
            (1.0 * 0.7 - 0.4) + // AnimState2 reaches its exit condition
            0.3 + // Submerges the transition [AnimState2 -> AnimState2_1]
            0.1, // To avoid precision problem, also step the AnimState2_1 for a little while
        );
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateEnter',
                id: 'AnimState2_1',
                status: { progress: 0.0, },
            },
            {
                kind: 'onMotionStateExit',
                id: 'AnimState2',
                status: { progress: getPositionFromLoopedIterations((1.0 * 0.7 + 0.3) / 1.0), },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'AnimState2_1',
                status: { progress: (0.3 + 0.1) / 1.0, },
            },
        ]);
        recorder.clear();

        const animState2_1CurrentProgress = graphEval.getCurrentStateStatus(0)!.progress;
        // Another edge case: delta time is so big, the motion is directly passed.
        graphEval.update(
            (1.0 * 0.7 - animState2_1CurrentProgress * 1.0) + // AnimState2_1 reaches its exit condition
            0.3 + // Submerges the transition [AnimState2_1 -> AnimState2_2]
            (1.0 * 0.7 - 0.3) + // AnimState2_2 reaches its exit condition
            0.3 + // Submerges the transition [AnimState2_2 -> AnimState2_3]
            0.1, // To avoid precision problem, also step the AnimState2_3 for a little while
        );
        expectMotionStateRecordCalls([
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
        const animState2_3CurrentProgress = graphEval.getCurrentStateStatus(0)!.progress;
        graphEval.update(
            (1.0 * 0.7 - animState2_3CurrentProgress * 1.0) + // AnimState2_3 reaches its exit condition
            + 0.1 // To avoid precision problem, also step the [AnimState2_3 -> SubSMAnimState] for a little while
        );
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
                status: { progress: (1.0 * 0.7 + 0.1) / 1.0 },
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'SubSMAnimState',
                status: { progress: 0.1 },
            },
        ]);
        recorder.clear();

        // Prepare for testing state machine exit events
        graphEval.update(
            0.2 + // Finish [AnimState2_3 -> SubSMAnimState]
            0.1 // To avoid precision problem, also step the SubSMAnimState for a little while
        );
        expectMotionStateRecordCalls([
            {
                kind: 'onMotionStateExit',
                id: 'AnimState2_3',
            },
            {
                kind: 'onMotionStateUpdate',
                id: 'SubSMAnimState',
                status: { progress: (0.1 + 0.3) / 1.0, },
            },
        ]);
        recorder.clear();

        // Test state machine exit events
        const subSMAnimStateCurrentProgress = graphEval.getCurrentStateStatus(0)!.progress;
        graphEval.update(
            (1.0 * 0.7 - subSMAnimStateCurrentProgress * 1.0) + // SubSMAnimState reaches its exit condition
            0.3 + // Submerges the [SubSMAnimState -> Exit -> AnimState3]
            + 0.1 // To avoid precision problem, also step the AnimState3 for a little while
        );
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
                status: { progress: 0.4 / 1.0 },
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
                graph.addFloat('speed', 0.5);
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
                graph.addFloat('speed', 0.5);
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
                graph.addFloat('speed', 0.5);
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

    test(`Runtime variable manipulation`, () => {
        const animationGraph = new AnimationGraph();
        animationGraph.addInteger('i0', 0);
        animationGraph.addInteger('i1', 2);
        animationGraph.addFloat('f0', 0.0);
        animationGraph.addFloat('f1', 3.14);
        animationGraph.addBoolean('b0', true);
        animationGraph.addBoolean('b1', false);
        animationGraph.addTrigger('t0', true);
        animationGraph.addTrigger('t1', false);
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

    test('Layer weight get/set', () => {
        const animationGraph = new AnimationGraph();
        const layer0 = animationGraph.addLayer();
        const layer1 = animationGraph.addLayer();
        layer1.weight = 0.4;
        const { newGenAnim: animationController } = createAnimationGraphEval2(animationGraph, new Node());
        expect(animationController.getLayerWeight(0)).toBe(1.0);
        expect(animationController.getLayerWeight(1)).toBe(0.4);
        animationController.setLayerWeight(0, 0.2);
        animationController.setLayerWeight(1, 0.3);
        expect(animationController.getLayerWeight(0)).toBe(0.2);
        expect(animationController.getLayerWeight(1)).toBe(0.3);
    });

    describe('Interruption', () => {
        test('Interruptible', () => {
            const animationGraph = new AnimationGraph();
            const stateMachine = animationGraph.addLayer().stateMachine;
            const m1 = stateMachine.addMotion();
            const m2 = stateMachine.addMotion();
            const t = stateMachine.connect(m1, m2);
            t.interruptible = true;
            expect(t.interruptionSource).toBe(TransitionInterruptionSource.CURRENT_STATE_THEN_NEXT_STATE);
            t.interruptible = false;
            expect(t.interruptionSource).toBe(TransitionInterruptionSource.NONE);
        });

        test.each([
            ['Interrupted by transition from current state', 'interrupted-by-source'],
            ['Interrupted by transition from destination state', 'interrupted-by-destination'],
            ['Interrupted by transition from "any" state', 'interrupted-by-any'],
        ] as const)(`%s`, (_title, kind) => {
            const M0_MOTION_CLIP_DURATION = 0.8;
            const M0_MOTION_CLIP_FROM = 0.1;
            const M0_MOTION_CLIP_TO = 0.2;
            const M1_MOTION_CLIP_DURATION = 0.9;
            const M1_MOTION_CLIP_FROM = 0.3;
            const M1_MOTION_CLIP_TO = 0.4;
            const M2_MOTION_CLIP_DURATION = 1.2;
            const M2_MOTION_CLIP_FROM = 0.5;
            const M2_MOTION_CLIP_TO = 0.6;
            const ORIGINAL_TRANSITION_DURATION = 0.2;
            const ORIGINAL_TRANSITION_EXIT_CONDITION = 0.7;
            const INTERRUPTING_TRANSITION_DURATION = 0.3;
            const INTERRUPTION_HAPPEN_TIME_FROM_ORIGINAL_TRANSITION_START = 0.03;

            const animationGraph = new AnimationGraph();
            const { stateMachine } = animationGraph.addLayer();
            const m0 = stateMachine.addMotion();
            m0.name = 'm0';
            const m0Motion = m0.motion = createClipMotionPositionXLinear(
                M0_MOTION_CLIP_DURATION, M0_MOTION_CLIP_FROM, M0_MOTION_CLIP_TO);
            const m1 = stateMachine.addMotion();
            m1.name = 'm1';
            m1.motion = createClipMotionPositionXLinear(
                M1_MOTION_CLIP_DURATION, M1_MOTION_CLIP_FROM, M1_MOTION_CLIP_TO);
            const m2 = stateMachine.addMotion();
            m2.name = 'm2';
            m2.motion = createClipMotionPositionXLinear(
                M2_MOTION_CLIP_DURATION, M2_MOTION_CLIP_FROM, M2_MOTION_CLIP_TO);
            stateMachine.connect(stateMachine.entryState, m0);
            const t0 = stateMachine.connect(m0, m1);
            t0.duration = ORIGINAL_TRANSITION_DURATION;
            if (kind === 'interrupted-by-source') {
                t0.interruptionSource = TransitionInterruptionSource.CURRENT_STATE;
            } else {
                t0.interruptionSource = TransitionInterruptionSource.NEXT_STATE;
            }
            t0.exitConditionEnabled = true;
            t0.exitCondition = ORIGINAL_TRANSITION_EXIT_CONDITION;
            const t1 = stateMachine.connect(
                kind === 'interrupted-by-source'
                    ? m0
                    : kind === 'interrupted-by-destination'
                        ? m1
                        : stateMachine.anyState, 
                m2,
            ) as AnimationTransition;
            // Using relative duration is intentional.
            // If not, we can not tell the correctness
            // from "interrupted by source" and "interrupted by destination":
            // For A->B, either B->C or A->C that interrupts it
            // yields same (A->B)->C if B->C and A->C have same duration.
            if (kind === 'interrupted-by-source') {
                t1.duration = INTERRUPTING_TRANSITION_DURATION / M0_MOTION_CLIP_DURATION;
                t1.relativeDuration = true;
            } else if (kind === 'interrupted-by-destination') {
                t1.duration = INTERRUPTING_TRANSITION_DURATION;
                t1.relativeDuration = false; // TODO!!: use relative duration too
            } else {
                t1.duration = INTERRUPTING_TRANSITION_DURATION;
                t1.relativeDuration = false;
            }
            t1.exitConditionEnabled = false;
            const [t1Condition] = t1.conditions = [new TriggerCondition()];
            t1Condition.trigger = 't';
            animationGraph.addTrigger('t');

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);
            const graphUpdater = new GraphUpdater(graphEval);
            
            graphUpdater.goto(
                M0_MOTION_CLIP_DURATION * ORIGINAL_TRANSITION_EXIT_CONDITION
                + INTERRUPTION_HAPPEN_TIME_FROM_ORIGINAL_TRANSITION_START
            );
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: m0.name,
                },
                transition: {
                    time: INTERRUPTION_HAPPEN_TIME_FROM_ORIGINAL_TRANSITION_START,
                    duration: ORIGINAL_TRANSITION_DURATION,
                    nextNode: {
                        __DEBUG_ID__: m1.name,
                    },
                },
            });

            const INTERRUPTION_REMAIN = 0.2;
            graphEval.setValue('t', true);
            graphUpdater.step(INTERRUPTION_REMAIN);
            expectAnimationGraphEvalStatusLayer0(graphEval, {
                currentNode: {
                    __DEBUG_ID__: m0.name,
                },
                current: {
                    clip: m0Motion.clip!,
                    weight: 1.0 - INTERRUPTION_REMAIN / INTERRUPTING_TRANSITION_DURATION,
                },
                transition: {
                    time: INTERRUPTION_REMAIN,
                    duration: INTERRUPTING_TRANSITION_DURATION,
                    nextNode: {
                        __DEBUG_ID__: m2.name,
                    },
                },
            });
            expect(node.position.x).toBeCloseTo(
                lerp(
                    lerp(
                        lerp(
                            M0_MOTION_CLIP_FROM,
                            M0_MOTION_CLIP_TO,
                            ORIGINAL_TRANSITION_EXIT_CONDITION + INTERRUPTION_HAPPEN_TIME_FROM_ORIGINAL_TRANSITION_START / M0_MOTION_CLIP_DURATION,
                        ),
                        lerp(
                            M1_MOTION_CLIP_FROM,
                            M1_MOTION_CLIP_TO,
                            INTERRUPTION_HAPPEN_TIME_FROM_ORIGINAL_TRANSITION_START / M1_MOTION_CLIP_DURATION,
                        ),
                        INTERRUPTION_HAPPEN_TIME_FROM_ORIGINAL_TRANSITION_START / ORIGINAL_TRANSITION_DURATION,
                    ),
                    lerp(M2_MOTION_CLIP_FROM, M2_MOTION_CLIP_TO, INTERRUPTION_REMAIN / M2_MOTION_CLIP_DURATION),
                    INTERRUPTION_REMAIN / INTERRUPTING_TRANSITION_DURATION,
                ),
            );
        });

        describe('Nested interruption', () => {
            const motionConstants: Record<'A' | 'B' | 'C' | 'D', {
                duration: number;
                from: number;
                to: number;
            }> = {
                A: { duration: 0.8, from: -0.1, to: 1.2 },
                B: { duration: 0.7, from: 0.3, to: 2.1 },
                C: { duration: 0.6, from: 0.618, to: 0.13 },
                D: { duration: 0.5, from: 0.512, to: -0.77 },
            };

            type MotionName = keyof typeof motionConstants;

            const animationGraph = new AnimationGraph();
            const { stateMachine } = animationGraph.addLayer();
            const motionStates = (Object.keys(motionConstants) as MotionName[])
                .reduce((result, name) => {
                    const motionState = stateMachine.addMotion();
                    motionState.name = name;
                    motionState.motion = createClipMotionPositionXLinear(
                        motionConstants[name].duration,
                        motionConstants[name].from,
                        motionConstants[name].to,
                    );
                    result[name] = motionState;
                    return result;
                }, {} as Record<MotionName, MotionState>);

            enum TransitionId {
                AB,
                AC,
                AD,
                BC,
                BD,
                CD,
            }

            const MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST = 0.5;

            const transitionConstants: Record<TransitionId, {
                duration: number;
            }> = {
                [TransitionId.AB]: { duration: MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST + 0.35 },
                [TransitionId.AC]: { duration: MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST + 0.45 },
                [TransitionId.AD]: { duration: MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST + 0.55 },
                [TransitionId.BC]: { duration: MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST + 0.32 },
                [TransitionId.BD]: { duration: MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST + 0.4 },
                [TransitionId.CD]: { duration: MIN_TRANSITION_DURATION_REQUIRED_FOR_TEST + 0.37 },
            };

            stateMachine.connect(stateMachine.entryState, motionStates.A);

            const transitions = Object.keys(transitionConstants)
                .map((k) => Number(k) as TransitionId)
                .reduce((result, transitionId) => {
                    const transitionName = TransitionId[transitionId];
                    const triggerName = transitionName;
                    const [fromMotionName, toMotionName] = transitionName;
                    const transition = stateMachine.connect(motionStates[fromMotionName], motionStates[toMotionName]);

                    const [triggerCondition] = transition.conditions = [new TriggerCondition()];
                    triggerCondition.trigger = triggerName;
                    animationGraph.addTrigger(triggerName);
                    transition.exitConditionEnabled = false;

                    transition.duration = transitionConstants[transitionId].duration;

                    // All transitions can be interrupted
                    transition.interruptionSource = TransitionInterruptionSource.CURRENT_STATE_THEN_NEXT_STATE;

                    result[transitionId] = transition;
                    return result;
                }, {} as Record<TransitionId, Transition>);

            test.each([
                ['AB x BC x CD', TransitionId.BC, TransitionId.CD],
                ['AB x BC x AD', TransitionId.BC, TransitionId.AD],
                // We also tested 'AB x BC x BD' in next test

                ['AB x AC x AD', TransitionId.AC, TransitionId.AD],
                ['AB x AC x CD', TransitionId.AC, TransitionId.CD],
            ] as const)(`%s`, (
                _title, firstInterruption, secondInterruption
            ) => {
                const node = new Node();
                const graphEval = createAnimationGraphEval(animationGraph, node);
                const graphUpdater = new GraphUpdater(graphEval);

                // A runs standalone
                graphUpdater.goto(0.2);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    currentNode: {
                        __DEBUG_ID__: 'A',
                    },
                });

                // The original transition
                graphEval.setValue(TransitionId[TransitionId.AB], true);
                graphUpdater.step(0.1);
                expectAnimationGraphEvalStatusLayer0(graphEval, {
                    currentNode: {
                        __DEBUG_ID__: 'A',
                    },
                    transition: {
                        nextNode: {
                            __DEBUG_ID__: 'B',
                        },
                        time: 0.1,
                    },
                });
                const SNAPSHOT_BEFORE_FIRST_INTERRUPTION = lerp(
                    lerp(motionConstants['A'].from, motionConstants['A'].to, (0.1 + 0.2) / motionConstants['A'].duration),
                    lerp(motionConstants['B'].from, motionConstants['B'].to, 0.1 / motionConstants['B'].duration),
                    0.1 / transitionConstants[TransitionId.AB].duration,
                );
                expect(node.position.x).toBeCloseTo(SNAPSHOT_BEFORE_FIRST_INTERRUPTION);

                const interruption1ToName = TransitionId[firstInterruption][1] as MotionName;
                const interruption2ToName = TransitionId[secondInterruption][1] as MotionName;

                // Now comes the first interruption
                graphEval.setValue(TransitionId[firstInterruption], true);
                graphUpdater.step(0.15);
                expect(node.position.x).toBeCloseTo(lerp(
                    SNAPSHOT_BEFORE_FIRST_INTERRUPTION,
                    lerp(
                        motionConstants[interruption1ToName].from,
                        motionConstants[interruption1ToName].to,
                        0.15 / motionConstants[interruption1ToName].duration,
                    ),
                    0.15 / transitionConstants[firstInterruption].duration,
                ));

                // Again: A and B are still
                graphUpdater.step(0.07);
                const SNAPSHOT_BEFORE_SECOND_INTERRUPTION = lerp(
                    SNAPSHOT_BEFORE_FIRST_INTERRUPTION,
                    lerp(
                        motionConstants[interruption1ToName].from,
                        motionConstants[interruption1ToName].to,
                        0.22 / motionConstants[interruption1ToName].duration,
                    ),
                    0.22 / transitionConstants[firstInterruption].duration,
                );
                expect(node.position.x).toBeCloseTo(SNAPSHOT_BEFORE_SECOND_INTERRUPTION);

                // Now comes the second interruption
                graphEval.setValue(TransitionId[secondInterruption], true);
                graphUpdater.step(0.23);
                expect(node.position.x).toBeCloseTo(lerp(
                    SNAPSHOT_BEFORE_SECOND_INTERRUPTION,
                    lerp(
                        motionConstants[interruption2ToName].from,
                        motionConstants[interruption2ToName].to,
                        0.23 / motionConstants[interruption2ToName].duration,
                    ),
                    0.23 / transitionConstants[secondInterruption].duration,
                ));

                // Again: A, B and third in-coming state are still
                graphUpdater.step(0.02);
                expect(node.position.x).toBeCloseTo(lerp(
                    SNAPSHOT_BEFORE_SECOND_INTERRUPTION,
                    lerp(
                        motionConstants[interruption2ToName].from,
                        motionConstants[interruption2ToName].to,
                        0.25 / motionConstants[interruption2ToName].duration,
                    ),
                    0.25 / transitionConstants[secondInterruption].duration,
                ));
            });

            test('Interruption can not be further interrupted by transitions from intermediate states(AB x BC x BD)', () => {
                const firstInterruption = TransitionId.BC;
                const secondInterruption = TransitionId.BD;

                const node = new Node();
                const graphEval = createAnimationGraphEval(animationGraph, node);
                const graphUpdater = new GraphUpdater(graphEval);

                // A runs standalone
                graphUpdater.goto(0.2);

                // A->B
                graphEval.setValue(TransitionId[TransitionId.AB], true);
                graphUpdater.step(0.1);
                const SNAPSHOT_BEFORE_FIRST_INTERRUPTION = lerp(
                    lerp(motionConstants['A'].from, motionConstants['A'].to, (0.1 + 0.2) / motionConstants['A'].duration),
                    lerp(motionConstants['B'].from, motionConstants['B'].to, 0.1 / motionConstants['B'].duration),
                    0.1 / transitionConstants[TransitionId.AB].duration,
                );
                expect(node.position.x).toBeCloseTo(SNAPSHOT_BEFORE_FIRST_INTERRUPTION);

                const interruption1ToName = TransitionId[firstInterruption][1] as MotionName;

                // Now comes the first interruption
                graphEval.setValue(TransitionId[firstInterruption], true);
                graphUpdater.step(0.15);
                expect(node.position.x).toBeCloseTo(lerp(
                    SNAPSHOT_BEFORE_FIRST_INTERRUPTION,
                    lerp(
                        motionConstants[interruption1ToName].from,
                        motionConstants[interruption1ToName].to,
                        0.15 / motionConstants[interruption1ToName].duration,
                    ),
                    0.15 / transitionConstants[firstInterruption].duration,
                ));

                // The second interruption is not happened
                // since _B_ is an intermediate state.
                graphEval.setValue(TransitionId[secondInterruption], true);
                graphUpdater.step(0.23);
                expect(node.position.x).toBeCloseTo(lerp(
                    SNAPSHOT_BEFORE_FIRST_INTERRUPTION,
                    lerp(
                        motionConstants[interruption1ToName].from,
                        motionConstants[interruption1ToName].to,
                        0.38 / motionConstants[interruption1ToName].duration,
                    ),
                    0.38 / transitionConstants[firstInterruption].duration,
                ));
            });
        });

        test('Interruption chain contains motion more than once(AB x BA)', () => {
            const M0_MOTION_CLIP_DURATION = 0.8;
            const M0_MOTION_CLIP_FROM = 0.1;
            const M0_MOTION_CLIP_TO = 0.2;
            const M1_MOTION_CLIP_DURATION = 0.9;
            const M1_MOTION_CLIP_FROM = 0.3;
            const M1_MOTION_CLIP_TO = 0.4;
            const ORIGINAL_TRANSITION_DURATION = 0.2;
            const INTERRUPTING_TRANSITION_DURATION = 0.3;

            const animationGraph = new AnimationGraph();
            const { stateMachine } = animationGraph.addLayer();
            const m0 = stateMachine.addMotion();
            m0.name = 'm0';
            const m0Motion = m0.motion = createClipMotionPositionXLinear(
                M0_MOTION_CLIP_DURATION, M0_MOTION_CLIP_FROM, M0_MOTION_CLIP_TO);
            const m1 = stateMachine.addMotion();
            m1.name = 'm1';
            m1.motion = createClipMotionPositionXLinear(
                M1_MOTION_CLIP_DURATION, M1_MOTION_CLIP_FROM, M1_MOTION_CLIP_TO);

            stateMachine.connect(stateMachine.entryState, m0);

            const t0 = stateMachine.connect(m0, m1);
            t0.duration = ORIGINAL_TRANSITION_DURATION;
            t0.interruptionSource = TransitionInterruptionSource.NEXT_STATE;
            t0.exitConditionEnabled = false;
            const [t0Condition] = t0.conditions = [new TriggerCondition()];
            t0Condition.trigger = 't0';
            animationGraph.addTrigger('t0');

            const t1 = stateMachine.connect(m1, m0);
            t1.duration = INTERRUPTING_TRANSITION_DURATION;
            t1.exitConditionEnabled = false;
            const [t1Condition] = t1.conditions = [new TriggerCondition()];
            t1Condition.trigger = 't1';
            animationGraph.addTrigger('t1');

            const node = new Node();
            const graphEval = createAnimationGraphEval(animationGraph, node);
            const graphUpdater = new GraphUpdater(graphEval);
            
            graphUpdater.goto(0.1);
            
            graphEval.setValue('t0', true);
            graphUpdater.goto(0.24);

            graphEval.setValue('t1', true);
            graphUpdater.step(0.17);
            expect(node.position.x).toBeCloseTo(
                lerp(
                    lerp(
                        lerp(
                            M0_MOTION_CLIP_FROM,
                            M0_MOTION_CLIP_TO,
                            0.24 / M0_MOTION_CLIP_DURATION,
                        ),
                        lerp(
                            M1_MOTION_CLIP_FROM,
                            M1_MOTION_CLIP_TO,
                            (0.24 - 0.1) / M1_MOTION_CLIP_DURATION,
                        ),
                        (0.24 - 0.1) / ORIGINAL_TRANSITION_DURATION,
                    ),
                    lerp(M0_MOTION_CLIP_FROM, M0_MOTION_CLIP_TO, 0.17 / M0_MOTION_CLIP_DURATION),
                    0.17 / INTERRUPTING_TRANSITION_DURATION,
                ),
            );
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

type MayBeArray<T> = T | T[];

function getPositionFromLoopedIterations (iterations: number) {
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

class GraphUpdater {
    constructor (private _graphEval: AnimationGraphEval) {

    }

    public step(deltaTime: number) {
        this._current += deltaTime;
        this._graphEval.update(deltaTime);
    }

    public goto(time: number) {
        const deltaTime = time - this._current;
        this._current = time;
        this._graphEval.update(deltaTime);
    }

    private _current = 0.0;
}
