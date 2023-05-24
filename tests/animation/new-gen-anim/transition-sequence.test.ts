import { AnimationController, VariableType } from "../../../cocos/animation/animation";
import { AnimationGraph, AnimationTransition, EmptyState, EmptyStateTransition, isAnimationTransition, Layer, State, SubStateMachine, Transition } from "../../../cocos/animation/marionette/animation-graph";
import { UnaryCondition } from "../../../cocos/animation/marionette/state-machine/condition";
import { MotionState } from "../../../cocos/animation/marionette/state-machine/motion-state";
import { assertIsTrue, lerp } from "../../../cocos/core";
import { AnimationGraphEvalMock } from "./utils/eval-mock";
import { ConstantRealValueAnimationFixture, LinearRealValueAnimationFixture } from "./utils/fixtures";
import { SingleRealValueObserver } from "./utils/single-real-value-observer";
import '../../utils/matchers/value-type-asymmetric-matchers';
import { createAnimationGraph, StateParams, TransitionParams } from "./utils/factory";
import { ApplyAnimationFixturePoseNode } from "./utils/apply-animation-fixture-pose-node";
import { MAX_TRANSITIONS_PER_FRAME } from "../../../cocos/animation/marionette/state-machine/state-machine-eval";

const DEFAULT_VALUE = 6.666;

// m: Motion | +: Entry | -: Exit
type SequenceString = string;

describe(`Transition sequence`, () => {
    describe(`At a moment`, () => {
        describe(`Zero transitions`, () => {
            const commonCheck = (mock: ReturnType<typeof mockTransitionSequence>) => {
                const { controller } = mock;
                expect(controller.getCurrentTransition(0)).toBeNull();
                expect(mock.controller.getNextStateStatus(0)).toBeNull();
            };
    
            test(`Head is a motion`, () => {
                const mock = mockTransitionSequence({
                    head: { type: 'motion', animation: { from: 1, to: 2 }, progress: 0.8 },
                    transitions: [],
                });
                commonCheck(mock);
                expect(mock.observer.value).toBeCloseTo(lerp(1, 2, 0.8));
                expect(mock.controller.getCurrentStateStatus(0)).toMatchObject({
                    progress: 0.8,
                });
            });
    
            test(`Head is an empty state`, () => {
                const mock = mockTransitionSequence({
                    head: { type: 'empty' },
                    transitions: [],
                });
                commonCheck(mock);
                expect(mock.observer.value).toBeCloseTo(DEFAULT_VALUE);
                expect(mock.controller.getCurrentStateStatus(0)).toBeNull();
            });
        });
    
        describe(`Tail transitions are routes`, () => {
            const routeTransitions: TransitionFixture[] = [
                { progress: 0.1, destination: { type: 'enter' } },
                { progress: 0.2, destination: { type: 'exit' } },
                { progress: 0.3, destination: { type: 'enter' } },
                { progress: 0.4, destination: { type: 'enter' } },
                { progress: 0.5, destination: { type: 'exit' } },
                { progress: 0.6, destination: { type: 'exit' } },
                { progress: 0.7, destination: { type: 'enter' } },
            ];
    
            test(`All transitions are route transitions`, () => {
                const mock = mockTransitionSequence({
                    head: { type: 'enter' },
                    transitions: [
                        ...routeTransitions,
                    ],
                });
    
                expect(mock.observer.value).toBeCloseTo(DEFAULT_VALUE);
                expect(mock.controller.getCurrentStateStatus(0)).toBeNull();
                expect(mock.controller.getCurrentTransition(0)).toBeNull();
                expect(mock.controller.getNextStateStatus(0)).toBeNull();
            });
    
            test(`Not all transitions are route transitions`, () => {
                const mock = mockTransitionSequence({
                    head: { type: 'motion', animation: { from: 0.1, to: 0.3 }, progress: 0.3 },
                    transitions: [
                        ...routeTransitions,
                    ],
                });
    
                expect(mock.observer.value).toBeCloseTo(lerp(0.1, 0.3, 0.3));
                expect(mock.controller.getCurrentStateStatus(0)).toMatchObject({
                    progress: 0.3,
                });
                expect(mock.controller.getCurrentTransition(0)).toBeNull();
                expect(mock.controller.getNextStateStatus(0)).toBeNull();
            });
        });
    
        describe(`Tail transitions are not routes`, () => {
            // Note: in this case head transitions can not be routes.
    
            test.each([
                'mm',
                'mmm',
                'mmmmm',
                'm+m',
                'm++m',
                'm++-m',
                'm+m++-m',
            ])(`%s`, (seq) => {
                const nStates = seq.length;
                expect(nStates).toBeGreaterThan(1);
    
                const { sequence, states, transitions } = generateTransitionSequence(
                    seq,
                    (stateIndex: number): MotionStateFixture => {
                        const t = stateIndex / nStates;
                        return {
                            type: 'motion',
                            animation: { from: lerp(0.4, 0.8, t), to: lerp(-6.666, 0.88, t) },
                            progress: 0.1 * (stateIndex + 1),
                        };
                    },
                    (transitionIndex: number) => {
                        const t = transitionIndex / (nStates - 1);
                        return lerp(0.1, 1, t);
                    },
                );
    
                const mock = mockTransitionSequence(sequence);
    
                const motions = states.filter((state) => state.type === 'motion') as MotionStateFixture[];
                expect(motions.length).toBeGreaterThan(1);
    
                let expectedValue = lerp(motions[0].animation.from, motions[0].animation.to, motions[0].progress);
                motions.slice(1).forEach((motion, motionIndex) => {
                    const lastMotion = motions[motionIndex]; // motions[motionIndex - 1 + 1]
                    const lastStateIndex = states.indexOf(lastMotion);
                    expect(lastStateIndex).toBeGreaterThanOrEqual(0);
                    const transitionIndex = lastStateIndex;
                    const motionTransition = transitions[transitionIndex];
                    
                    const motionValue = lerp(motion.animation.from, motion.animation.to, motion.progress);
                    expectedValue = lerp(expectedValue, motionValue, motionTransition.progress);
                });
    
                expect(mock.observer.value).toBeCloseTo(expectedValue);
            });
        });
    });

    test(`Exact same concurrent transitions`, () => {
        // A->B->C
        // `A->B` and `B->C` happened at same time and have same duration.

        const fixture = {
            initialValue: 0.1,
            a: new LinearRealValueAnimationFixture(1, 2, 3),
            b: new LinearRealValueAnimationFixture(4, 5, 6),
            c: new LinearRealValueAnimationFixture(7, 8, 9),
            transitionDuration: 0.5,
        };

        const observer = new SingleRealValueObserver(fixture.initialValue);
        const graph = new AnimationGraph();
        const layer = graph.addLayer();
        const [ mA, mB, mC ] = ([[fixture.a, 'A'], [fixture.b, 'B'], [fixture.c, 'C']] as const).map(([animation, name]) => {
            const s = layer.stateMachine.addMotion();
            s.name = name;
            s.motion = animation.createMotion(observer.getCreateMotionContext());
            return s;
        });
        layer.stateMachine.connect(layer.stateMachine.entryState, mA);
        ([
            [mA, mB],
            [mB, mC],
        ] as const).forEach(([from, to], transitionIndex) => {
            const transition = layer.stateMachine.connect(from, to);
            transition.exitConditionEnabled = false;
            transition.duration = fixture.transitionDuration;
            const [condition] = transition.conditions = [new UnaryCondition()];
            condition.operator = UnaryCondition.Operator.TRUTHY;
            condition.operand.variable = `${transitionIndex}`;
            graph.addVariable(condition.operand.variable, VariableType.BOOLEAN, true); // Trigger at start
        });

        const evalMock = new AnimationGraphEvalMock(observer.root, graph);

        evalMock.goto(fixture.transitionDuration * 0.3);
        expect(observer.value).toBeCloseTo(
            lerp(
                lerp(
                    fixture.a.getExpected(evalMock.current),
                    fixture.b.getExpected(evalMock.current),
                    0.3,
                ),
                fixture.c.getExpected(evalMock.current),
                0.3,
            ),
            6,
        );

        evalMock.goto(fixture.transitionDuration * 1.01);
        expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
            __DEBUG_ID__: 'C',
            progress: expect.toBeAround(evalMock.current / fixture.c.duration, 6),
        });
        expect(observer.value).toBeCloseTo(
            fixture.c.getExpected(evalMock.current),
            6,
        );
    });

    describe(`Transition dropping`, () => {
        test(`Later transition has longer duration than previous`, () => {
            /// ## Spec
            /// If later transition has longer duration than previous,
            /// previous transitions are dropped before the later transition.

            const { evalMock, getMotionID } = generate([1, 1.5, 6]);

            evalMock.goto(0.3);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(0),
                progress: expect.toBeAround(0.3, 6),
            });

            evalMock.goto(0.9);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(0),
                progress: expect.toBeAround(0.9, 6),
            });

            evalMock.goto(1.2);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(1),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });

            evalMock.goto(1.6);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(2),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });

            evalMock.goto(6.2);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(3),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });
            expect(evalMock.controller.getCurrentTransition(0)).toBeNull();
        });

        test(`Later transition has shorter duration than previous`, () => {
            /// ## Spec
            /// If later transition has shorter duration than previous,
            /// once the later transition is dropped, all previous transitions are dropped.

            const { evalMock, getMotionID } = generate([2, 6, 1.5]);

            evalMock.goto(0.3);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(0),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });

            evalMock.goto(1.4);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(0),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });

            evalMock.goto(1.6);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(3),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });
        });

        test(`Drop a middle transition`, () => {
            const { evalMock, getMotionID } = generate([6, 5, 8]);

            evalMock.goto(5.1);
            expect(evalMock.controller.getCurrentStateStatus(0)).toMatchObject({
                __DEBUG_ID__: getMotionID(2),
                progress: expect.toBeAround(evalMock.current - Math.trunc(evalMock.current), 6),
            });
            expect(evalMock.controller.getCurrentTransition(0)).toMatchObject({
                duration: 8.0,
                time: expect.toBeAround(evalMock.current, 6),
            });
        });

        function generate(
            transitionDurations: readonly number[],
        ) {
            const observer = new SingleRealValueObserver(0.0);
            const graph = new AnimationGraph();
            const layer = graph.addLayer();
            const states = Array.from({ length: transitionDurations.length + 1 }, (_, index) => {
                const s = layer.stateMachine.addMotion();
                s.name = `${index}`;
                s.motion = new ConstantRealValueAnimationFixture(index, 1.0).createMotion(observer.getCreateMotionContext());
                return s;
            });
            layer.stateMachine.connect(layer.stateMachine.entryState, states[0]);
            for (let transitionIndex = 0; transitionIndex < transitionDurations.length; ++transitionIndex) {
                const fromMotion = states[transitionIndex];
                const toMotion = states[transitionIndex + 1];
                const transition = layer.stateMachine.connect(fromMotion, toMotion);
                transition.exitConditionEnabled = false;
                transition.duration = transitionDurations[transitionIndex];
                const [condition] = transition.conditions = [new UnaryCondition()];
                condition.operator = UnaryCondition.Operator.TRUTHY;
                condition.operand.variable = `${transitionIndex}`;
                graph.addVariable(condition.operand.variable, VariableType.BOOLEAN, true); // Trigger at start
            }
            const evalMock = new AnimationGraphEvalMock(observer.root, graph);
            return {
                evalMock,
                observer,
                getMotionID(motionIndex: number) {
                    return `${motionIndex}`;
                },
            };
        }
    });

    test(`Transition to a state multiple times through different transitions`, () => {
        const fixture = {
            a_animation: new LinearRealValueAnimationFixture(1., 2., 3.),
            b_animation: new LinearRealValueAnimationFixture(4., 5., 6.),
            c_animation: new LinearRealValueAnimationFixture(7., 8., 9.),
        };

        const observer = new SingleRealValueObserver();

        enum TransitionId {
            A_B,
            B_C,
            C_B,
        }

        const uniformTransitionDuration = 0.3;

        const graph = createAnimationGraph({
            variableDeclarations: { 'transitionId': { type: 'int', value: TransitionId.A_B } },
            layers: [{
                stateMachine: {
                    states: {
                        'A': { type: 'motion', motion: fixture.a_animation.createMotion(observer.getCreateMotionContext()) },
                        'B': { type: 'motion', motion: fixture.b_animation.createMotion(observer.getCreateMotionContext()) },
                        'C': { type: 'motion', motion: fixture.c_animation.createMotion(observer.getCreateMotionContext()) },
                    },
                    entryTransitions: [{ to: 'A' }],
                    transitions: [{
                        from: 'A', to: 'B',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions: [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }, {
                        from: 'B', to: 'C',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions:  [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }, {
                        from: 'C', to: 'B',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions:  [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }],
                },
            }],
        });
        
        const evalMock = new AnimationGraphEvalMock(observer.root, graph);

        evalMock.step(uniformTransitionDuration * 0.1);
        evalMock.controller.setValue('transitionId', TransitionId.B_C);
        evalMock.step(uniformTransitionDuration * 0.1);
        evalMock.controller.setValue('transitionId', TransitionId.C_B);
        evalMock.step(uniformTransitionDuration * 0.1);
    });

    test(`A state repeatedly exists in a transition sequence`, () => {
        const fixture = {
            a_animation: new LinearRealValueAnimationFixture(1., 2., 3.),
            b_animation: new LinearRealValueAnimationFixture(4., 5., 6.),
        };

        const observer = new SingleRealValueObserver();

        enum TransitionId {
            A_B,
            B_A,
        }

        const uniformTransitionDuration = 0.3;

        const graph = createAnimationGraph({
            variableDeclarations: { 'transitionId': { type: 'int', value: TransitionId.A_B } },
            layers: [{
                stateMachine: {
                    states: {
                        'A': { type: 'motion', motion: fixture.a_animation.createMotion(observer.getCreateMotionContext()) },
                        'B': { type: 'motion', motion: fixture.b_animation.createMotion(observer.getCreateMotionContext()) },
                    },
                    entryTransitions: [{ to: 'A' }],
                    transitions: [{
                        from: 'A', to: 'B',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions: [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }, {
                        from: 'B', to: 'A',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions:  [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }],
                },
            }],
        });
        
        const evalMock = new AnimationGraphEvalMock(observer.root, graph);

        // A --> B
        evalMock.step(uniformTransitionDuration * 0.1);
        // A --> B --> A
        evalMock.controller.setValue('transitionId', TransitionId.B_A);
        evalMock.step(uniformTransitionDuration * 0.1);
        // A --> B --> A --> B
        evalMock.controller.setValue('transitionId', TransitionId.A_B);
        evalMock.step(uniformTransitionDuration * 0.1);
        // A --> B --> A --> B --> A
        evalMock.controller.setValue('transitionId', TransitionId.B_A);
        evalMock.step(uniformTransitionDuration * 0.1);

        // B --> A --> B --> A
        evalMock.goto(uniformTransitionDuration * (1 + 0.1 * 0 + 0.01));
        
        // A --> B --> A
        evalMock.goto(uniformTransitionDuration * (1 + 0.1 * 1 + 0.01));

        // B --> A
        evalMock.goto(uniformTransitionDuration * (1 + 0.1 * 2 + 0.01));

        // A
        evalMock.goto(uniformTransitionDuration * (1 + 0.1 * 3 + 0.01));
    });

    test(`Transition to a state multiple times through different transitions`, () => {
        const fixture = {
            a_animation: new LinearRealValueAnimationFixture(1., 2., 3.),
            b_animation: new LinearRealValueAnimationFixture(4., 5., 6.),
            c_animation: new LinearRealValueAnimationFixture(7., 8., 9.),
        };

        const observer = new SingleRealValueObserver();

        enum TransitionId {
            A_B,
            B_C,
            C_B,
        }

        const uniformTransitionDuration = 0.3;

        const graph = createAnimationGraph({
            variableDeclarations: { 'transitionId': { type: 'int', value: TransitionId.A_B } },
            layers: [{
                stateMachine: {
                    states: {
                        'A': { type: 'motion', motion: fixture.a_animation.createMotion(observer.getCreateMotionContext()) },
                        'B': { type: 'motion', motion: fixture.b_animation.createMotion(observer.getCreateMotionContext()) },
                        'C': { type: 'motion', motion: fixture.c_animation.createMotion(observer.getCreateMotionContext()) },
                    },
                    entryTransitions: [{ to: 'A' }],
                    transitions: [{
                        from: 'A', to: 'B',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions: [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }, {
                        from: 'B', to: 'C',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions:  [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }, {
                        from: 'C', to: 'B',
                        duration: uniformTransitionDuration,
                        exitTimeEnabled: false,
                        conditions:  [{ type: 'binary', 'operator': '==', 'lhsBinding': { type: 'variable', variableName: 'transitionId' }, rhs: TransitionId.A_B }],
                    }],
                },
            }],
        });
        
        const evalMock = new AnimationGraphEvalMock(observer.root, graph);

        evalMock.step(uniformTransitionDuration * 0.1);
        evalMock.controller.setValue('transitionId', TransitionId.B_C);
        evalMock.step(uniformTransitionDuration * 0.1);
        evalMock.controller.setValue('transitionId', TransitionId.C_B);
        evalMock.step(uniformTransitionDuration * 0.1);
    });
});

describe(`Circular transitions`, () => {
    describe(`Circular self transition A->A`, () => {
        test(`Motion state self transition A->A has special semantic`, () => {
            const fixture = {
                a_animation: new LinearRealValueAnimationFixture(1., 2., 3.),
            };

            const observer = new SingleRealValueObserver();

            const {
                graph, uniformTransitionDuration,
                enableTransition, disableTransition,
            } = createSelfTransitioningGraph({
                type: 'motion',
                motion: fixture.a_animation.createMotion(observer.getCreateMotionContext()),
            }); 

            const evalMock = new AnimationGraphEvalMock(observer.root, graph);
    
            // Run the state to 30%.
            const state_1_start_time = evalMock.current;
            evalMock.step(fixture.a_animation.duration * 0.3);
            expect(observer.value).toBeCloseTo(
                fixture.a_animation.getExpected(evalMock.current - state_1_start_time),
                5,
            );

            // Enable the transition, and step the duration for 20%.
            // This forms transition "State:1 --> State:2 --> State:1 --> State:2 --> ...."
            enableTransition(evalMock.controller);
            evalMock.step(uniformTransitionDuration * 0.2);
            expect(observer.value).toBeCloseTo(1.32, 5);

            // Once disabled, all things become normal.
            disableTransition(evalMock.controller);
            evalMock.step(uniformTransitionDuration * 1.0);
            evalMock.step(0.1);
            expect(evalMock.controller.getCurrentTransition(0)).toBeNull();
            expect(observer.value).toBeCloseTo(1.4533333333333334, 5);
        });

        test(`Non-motion-state self transition A->A is takes no effect`, () => {
            const fixture = {
                a_animation: new LinearRealValueAnimationFixture(1., 2., 3.),
            };

            const observer = new SingleRealValueObserver();

            const {
                graph, uniformTransitionDuration,
                enableTransition,
            } = createSelfTransitioningGraph({
                type: 'procedural',
                graph: { rootNode: new ApplyAnimationFixturePoseNode(fixture.a_animation, observer) },
            }); 

            const evalMock = new AnimationGraphEvalMock(observer.root, graph);

            // Run the state to 30%.
            evalMock.step(fixture.a_animation.duration * 0.3);
            expect(observer.value).toBeCloseTo(fixture.a_animation.getExpected(evalMock.current), 5);

            // Enable the transition, but the transition has no effect.
            enableTransition(evalMock.controller);
            evalMock.step(uniformTransitionDuration * 0.1);
            expect(observer.value).toBeCloseTo(fixture.a_animation.getExpected(evalMock.current), 5);
        });

        function createSelfTransitioningGraph(state: StateParams) {
            const uniformTransitionDuration = 0.3;
    
            const graph = createAnimationGraph({
                variableDeclarations: {
                    'A-->A': { type: 'boolean', value: false },
                },
                layers: [{
                    stateMachine: {
                        states: {
                            'A': state,
                        },
                        entryTransitions: [{ to: 'A' }],
                        transitions: [{
                            from: 'A', to: 'A',
                            duration: uniformTransitionDuration,
                            exitTimeEnabled: state.type === 'motion' ? false : undefined,
                            conditions: [{ type: 'unary', 'operator': 'to-be-true', 'operand': { type: 'variable', name: 'A-->A' } }],
                        }],
                    },
                }],
            });

            return {
                graph,
                uniformTransitionDuration,
                enableTransition: (controller: AnimationController) => controller.setValue('A-->A', true),
                disableTransition: (controller: AnimationController) => controller.setValue('A-->A', false),
            };
        }
    });

    test(`Rule: loop transition sequence having always-true conditions forms infinite loop`, () => {
        const fixtures = {
            first_state_animation: new LinearRealValueAnimationFixture(1, 2, 3),
            verbose_loop_prefix_length: 3,
        };

        const verboseLoopPrefixPathConfig = Array.from({ length: fixtures.verbose_loop_prefix_length }, (_, verboseIndex) => {
            const t = verboseIndex / fixtures.verbose_loop_prefix_length;
            return {
                stateName: `verbose-${verboseIndex}`,
                transitionDuration: lerp(0.1, 0.9, t) * fixtures.first_state_animation.duration,
                animation: new LinearRealValueAnimationFixture(
                    0.1 * verboseIndex,
                    0.2 * verboseIndex,
                    fixtures.first_state_animation.duration * lerp(1.2, 2, t),
                ),
            };
        });

        const lastLoopPathDuration = 0.95 * fixtures.first_state_animation.duration;

        const observer = new SingleRealValueObserver();

        const animationGraph = createAnimationGraph({
            layers: [{
                stateMachine: {
                    states: {
                        'first': { type: 'procedural', graph: { rootNode: new ApplyAnimationFixturePoseNode(fixtures.first_state_animation, observer) } },
                        ...verboseLoopPrefixPathConfig.reduce((result, { stateName, animation }, verboseIndex) => {
                            result[stateName] = { type: 'procedural', graph: { rootNode: new ApplyAnimationFixturePoseNode(animation, observer) } };
                            return result;
                        }, {} as Record<string, StateParams>),
                    },
                    entryTransitions: [{ to: 'first' }],
                    transitions: [
                        ...verboseLoopPrefixPathConfig.map(({ stateName, transitionDuration }, verboseIndex): TransitionParams => {
                            return {
                                from: verboseIndex === 0 ? 'first' : verboseLoopPrefixPathConfig[verboseIndex - 1].stateName,
                                to: stateName,
                                duration: transitionDuration,
                                conditions: [{ type: 'unary', operator: 'to-be-true', 'operand': { type: 'constant', value: true } }],
                            };
                        }),
                        {
                            from: verboseLoopPrefixPathConfig.length === 0 ? 'first' : verboseLoopPrefixPathConfig[verboseLoopPrefixPathConfig.length - 1].stateName,
                            to: 'first',
                            duration: lastLoopPathDuration,
                            conditions: [{ type: 'unary', operator: 'to-be-true', 'operand': { type: 'constant', value: true } }],
                        },
                    ],
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(observer.root, animationGraph);

        const stateCount = verboseLoopPrefixPathConfig.length + 1;

        const firstStateIndex = stateCount - 1;

        const getStateFixture = (stateIndex: number) => {
            expect(stateIndex).toBeGreaterThanOrEqual(0);
            expect(stateIndex).toBeLessThan(stateCount);
            if (stateIndex === stateCount - 1) {
                return {
                    animation: fixtures.first_state_animation,
                    incomingTransitionDuration: lastLoopPathDuration,
                };
            } else {
                return {
                    animation: verboseLoopPrefixPathConfig[stateIndex].animation,
                    incomingTransitionDuration: verboseLoopPrefixPathConfig[stateIndex].transitionDuration,
                };
            }
        };

        let ticked = false;
        const expectation = {
            stateElapsedTimes: new Array(stateCount).fill(0.0),
            headStateIndex: firstStateIndex,
            transitions: [] as Array<{
                destStateIndex: number;
                expectedElapsedTransitionTime: number;
                transitionDuration: number;
            }>,
        };

        const minTransitionDuration = Math.min(...Array.from({ length: stateCount }, (_, stateIndex) =>
            getStateFixture(stateIndex).incomingTransitionDuration));
        for (const minTransitionDurationRatio of [
            0.3,
            0.5,
            0.9,
        ]) {
            const tickDeltaTime = minTransitionDuration * minTransitionDurationRatio;
            // Tick.
            evalMock.goto(tickDeltaTime);
            // Check.
            calculateExpectedTickResult(evalMock.lastDeltaTime);
        }

        /**
         * Ticks the graph by specified time, then check the tick result.
         */
        function calculateExpectedTickResult(tickDeltaTime: number) {
            const isFirstTick = !ticked;
            ticked = true;

            // Every tick, upto `MAX_TRANSITIONS_PER_FRAME` transitions will be appended to transition.
            {
                const stateWeightsBeforeTick = new Array(stateCount).fill(0.0);
                if (!isFirstTick) {
                    const [lastStateWeight, destinationWeights] = computeExpectedWeightsOfTransitionSequence(
                        ...expectation.transitions.map(
                            ({ expectedElapsedTransitionTime, transitionDuration }): [number, number] => [expectedElapsedTransitionTime, transitionDuration])
                    );
                    expectation.transitions.forEach(({ destStateIndex }, transitionIndex) => {
                        stateWeightsBeforeTick[destStateIndex] += destinationWeights[transitionIndex];
                    });
                    stateWeightsBeforeTick[expectation.headStateIndex] += lastStateWeight;
                }

                const lastStateIndexBeforeTick = expectation.transitions.length === 0
                    ? expectation.headStateIndex
                    : expectation.transitions[expectation.transitions.length - 1].destStateIndex;
                const expectedNewTransitionsCount = isFirstTick
                    ? MAX_TRANSITIONS_PER_FRAME - 1 // The first tick will exclude Entry -> Head consume 1 iteration
                    : MAX_TRANSITIONS_PER_FRAME;
                for (let iteration = 0; iteration < expectedNewTransitionsCount; ++iteration) {
                    const destStateIndex = Math.floor((lastStateIndexBeforeTick + 1 + iteration) % stateCount);
                    expectation.transitions.push({
                        destStateIndex,
                        transitionDuration: (1.0 - stateWeightsBeforeTick[destStateIndex]) * getStateFixture(destStateIndex).incomingTransitionDuration,
                        expectedElapsedTransitionTime: 0.0,
                    });
                }
            }

            // Then all transitions update.
            for (let iTransition = expectation.transitions.length - 1; iTransition >= 0; --iTransition) {
                const transition = expectation.transitions[iTransition];
                transition.expectedElapsedTransitionTime += tickDeltaTime;
                const { destStateIndex, transitionDuration } = transition;
                if (transition.expectedElapsedTransitionTime > transitionDuration) {
                    expectation.transitions.splice(0, iTransition + 1);
                    expectation.headStateIndex = destStateIndex;
                    break;
                }
            }

            // Then all activated states update.
            const activatedStates = new Set<number>();
            for (const { destStateIndex } of expectation.transitions) {
                if (!activatedStates.has(destStateIndex)) {
                    activatedStates.add(destStateIndex);
                    expectation.stateElapsedTimes[destStateIndex] += tickDeltaTime;
                }
            }
            for (let iState = 0; iState < stateCount; ++iState) {
                if (!activatedStates.has(iState)) {
                    expectation.stateElapsedTimes[iState] = 0.0;
                }
            }

            // Check if the result matches.
            expect(observer.value).toBeCloseTo(computeExpectedTransitionSequenceResult(
                getStateFixture(expectation.headStateIndex).animation.getExpected(expectation.stateElapsedTimes[expectation.headStateIndex]),
                ...expectation.transitions.map(({ expectedElapsedTransitionTime, transitionDuration, destStateIndex }) => {
                    return [
                        getStateFixture(destStateIndex).animation.getExpected(expectation.stateElapsedTimes[destStateIndex]),
                        expectedElapsedTransitionTime,
                        transitionDuration,
                    ] as [number, number, number];
                }),
            ), 5);
        }
    });
});

function computeExpectedTransitionSequenceResult(
    headValue: number,
    ...tail: Array<[value: number, transitionTime: number, transitionDuration: number]>
): number {
    const [headWeight, destinationWeights] = computeExpectedWeightsOfTransitionSequence(
        ...tail.map(([_, ...transition]) => transition)
    );
    let result = headValue * headWeight;
    tail.forEach(([destinationValue], transitionIndex) => {
        result += destinationValue * destinationWeights[transitionIndex];
    });
    return result;
}

function computeExpectedWeightsOfTransitionSequence(
    ...transitions: Array<[transitionTime: number, transitionDuration: number]>
): [number, number[]] {
    let remainingWeight = 1.0;
    const destStateWeights = new Array(transitions.length).fill(0.0);
    for (let iTransition = transitions.length - 1; iTransition >= 0; --iTransition) {
        const [transitionTime, transitionDuration] = transitions[iTransition];
        expect(transitionTime).toBeGreaterThanOrEqual(0.0);
        expect(transitionTime).toBeLessThanOrEqual(transitionDuration);
        const transitionRatio = transitionTime / transitionDuration;
        destStateWeights[iTransition] = (remainingWeight * transitionRatio);
        remainingWeight = remainingWeight * (1.0 - transitionRatio);
    }
    return [
        remainingWeight,
        destStateWeights,
    ];
}

function generateTransitionSequence(
    sequenceString: SequenceString,
    generateMotion: (stateIndex: number) => MotionStateFixture,
    generateTransitionProgress: (transitionIndex: number) => number,
) {
    const states = [...sequenceString].map((s, stateIndex): StateFixture => {
        switch (s) {
            case 'm': return generateMotion(stateIndex);
            case '+': return { type: 'enter' };
            default: expect(false).toBeTruthy();
            case '-': return { type: 'exit' };
        }
    });

    const transitions = states.slice(1).map((motion, transitionIndex) => ({
        destination: motion,
        progress: states[transitionIndex].type === 'motion' ? generateTransitionProgress(transitionIndex) : 0.0,
    }));

    return {
        states,
        transitions,
        sequence: {
            head: states[0],
            transitions,
        },
    };
}

function mockTransitionSequence(sequenceFixture: TransitionSequenceFixture): {
    controller: AnimationController,
    observer: SingleRealValueObserver,
} {
    const observer = new SingleRealValueObserver(DEFAULT_VALUE);

    const {
        graph,
        updates,
    } = makeGraphByTransitionSequenceFixture(sequenceFixture, 1.0, observer);

    const evalMock = new AnimationGraphEvalMock(observer.root, graph);

    for (const update of updates) {
        for (const varName of update.variables) {
            evalMock.controller.setValue(varName, true);
        }
        evalMock.step(update.deltaTime);
    }

    return {
        controller: evalMock.controller,
        observer,
    };
}

function makeGraphByTransitionSequenceFixture(
    fixture: TransitionSequenceFixture,
    elapsedTime: number,
    observer: SingleRealValueObserver,
) {
    const graph = new AnimationGraph();
    const layer = graph.addLayer();

    const stateMachineStack: (Layer | SubStateMachine)[] = [layer];
    let fromState: State;
    const addState = (fixture: StateFixture): State => {
        if (stateMachineStack.length === 0) {
            throw new Error(`Bad transition sequence! Incorrect "exit" state occurrence.`);
        }
        const stateMachine = stateMachineStack[stateMachineStack.length - 1].stateMachine;
        if (fixture.type === 'enter') {
            const state = stateMachine.addSubStateMachine();
            state.name = `State machine ${stateMachineStack.length}`;
            stateMachineStack.push(state);
            fromState = state.stateMachine.entryState;
            return state;
        } else if (fixture.type === 'exit') {
            if (stateMachineStack.length === 1) {
                throw new Error(`Bad transition sequence! Incorrect "exit" state occurrence: attempt to exit the top level state machine.`);
            }
            fromState = stateMachineStack[stateMachineStack.length - 1] as SubStateMachine;
            stateMachineStack.pop();
            return stateMachine.exitState;
        } else if (fixture.type === 'empty') {
            const state = stateMachine.addEmpty();
            fromState = state;
            return state;
        } else {
            const state = stateMachine.addMotion();
            expect(fixture.progress).not.toBeCloseTo(0.0);
            const motionDuration = elapsedTime / fixture.progress;
            const animation = new LinearRealValueAnimationFixture(fixture.animation.from, fixture.animation.to, motionDuration);
            state.motion = animation.createMotion(observer.getCreateMotionContext());
            fromState = state;
            return state;
        }
    };

    const headState = addState(fixture.head);
    headState.name = 'Head';
    layer.stateMachine.connect(layer.stateMachine.entryState, headState);
    fromState = headState;

    type TrueState = MotionState | EmptyState;

    const transitionMockMap = new Map<Transition, TransitionFixture>();
    const transitionTriggerVarNameMap = new Map<Transition, string>();

    interface TransitionSequence {
        headRoutes: Transition[];
        tail?: {
            firstState: TrueState;
            firstStateFixture: MotionStateFixture;
            trueTransitions: Array<{
                firstTransition: EmptyStateTransition | AnimationTransition;
                routes: Transition[];
                to: MotionState | EmptyState;
            }>;
            tailRoutes: {
                firstTransition?: EmptyStateTransition | AnimationTransition;
                routes: Transition[],
            };
        };
    }

    const transitionSeq: TransitionSequence = {
        headRoutes: [],
    };

    const isTrueState = (state: State): state is (MotionState | EmptyState) => {
        return state instanceof MotionState || state instanceof EmptyState;
    };

    const isDurableTransition = (transition: Transition): transition is (AnimationTransition | EmptyStateTransition) => {
        return isAnimationTransition(transition) || transition instanceof EmptyStateTransition;
    };
    
    stateMachineStack.length = 0;
    stateMachineStack.push(layer);
    const transitions = fixture.transitions.map((transitionMock, transitionIndex) => {
        const stateMachine = stateMachineStack[stateMachineStack.length - 1].stateMachine;
        const fromStateBefore = fromState;

        const triggeringVarName = `Trigger ${transitionIndex}`;
        graph.addVariable(triggeringVarName, VariableType.BOOLEAN, true);

        const toState = addState(transitionMock.destination);
        toState.name = `TransitionDestination ${transitionIndex}`;
        const transition = stateMachine.connect(fromStateBefore, toState);
        if (isDurableTransition(transition)) {
            expect(transitionMock.progress).not.toBeCloseTo(0.0);
            const transitionDuration = elapsedTime / transitionMock.progress;
            transition.duration = transitionDuration;
        }
        if (isAnimationTransition(transition)) {
            transition.exitConditionEnabled = false;
        }

        const [condition] = transition.conditions = [new UnaryCondition()];
        condition.operator = UnaryCondition.Operator.TRUTHY;
        condition.operand.variable = triggeringVarName;

        transitionMockMap.set(transition, transitionMock);
        transitionTriggerVarNameMap.set(transition, triggeringVarName);

        return {
            transition,
            transitionMock,
        };
    });

    if (isTrueState(headState)) {
        transitionSeq.tail = {
            firstState: headState,
            firstStateFixture: fixture.head as MotionStateFixture,
            trueTransitions: [],
            tailRoutes: {
                routes: [],
            },
        };
    }
    transitions.forEach(({ transition, transitionMock, }, transitionIndex) => {
        const { to: toState } = transition;

        if (!transitionSeq.tail) {
            transitionSeq.headRoutes.push(transition);
        } else if (!transitionSeq.tail.tailRoutes.firstTransition) {
            expect(isDurableTransition(transition));
            assertIsTrue(isDurableTransition(transition));
            transitionSeq.tail.tailRoutes.firstTransition = transition;
        } else {
            transitionSeq.tail.tailRoutes.routes.push(transition);
        }

        if (isTrueState(toState)) {
            if (!transitionSeq.tail) {
                transitionSeq.tail = {
                    firstState: toState,
                    firstStateFixture: transitionMock.destination as MotionStateFixture,
                    trueTransitions: [],
                    tailRoutes: {
                        routes: [],
                    },
                };
            }
            if (transitionSeq.tail.tailRoutes.firstTransition) {
                transitionSeq.tail.trueTransitions.push({
                    firstTransition: transitionSeq.tail.tailRoutes.firstTransition,
                    routes: transitionSeq.tail.tailRoutes.routes,
                    to: toState,
                });
                transitionSeq.tail.tailRoutes.routes.length = 0;
                transitionSeq.tail.tailRoutes.firstTransition = undefined;
            }
            transitionSeq.tail.firstState = toState;
        }
    });

    const updates: {
        variables: string[];
        deltaTime: number;
    }[] = [];

    updates.push({
        variables: [],
        deltaTime: elapsedTime,
    });

    return {
        graph,
        updates,
        transitionSequence: transitionSeq,
    };
}

interface TransitionSequenceFixture {
    head: StateFixture;
    transitions: TransitionFixture[];
}

interface StateFixtureBase { }

type StateFixture = StateMachineEnterStateFixture | StateMachineExitStateFixture | MotionStateFixture | EmptyStateFixture;

interface StateMachineEnterStateFixture extends StateFixtureBase {
    type: 'enter';
};

interface StateMachineExitStateFixture extends StateFixtureBase {
    type: 'exit';
};

interface MotionStateFixture extends StateFixtureBase {
    type: 'motion';
    animation: { from: number; to: number; };
    progress: number;
};

interface EmptyStateFixture extends StateFixtureBase {
    type: 'empty';
};

interface TransitionFixture {
    destination: StateFixture;
    progress: number;
    motionTransition?: {
        duration: number;
    };
}
