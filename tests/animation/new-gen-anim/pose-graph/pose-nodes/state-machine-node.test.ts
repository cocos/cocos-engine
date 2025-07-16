import { AnimationController } from "../../../../../cocos/animation/animation";
import { AnimationGraphVariant } from "../../../../../cocos/animation/marionette/animation-graph-variant";
import { lerp } from "../../../../../exports/base";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { createAnimationGraph, StateMachineParams, VariableDeclarationParams } from "../../utils/factory";
import { ConstantRealValueAnimationFixture, LinearRealValueAnimationFixture } from "../../utils/fixtures";
import { SingleRealValueObserver } from "../../utils/single-real-value-observer";
import './utils/factories/state-machine-node-factory';

describe(`Reentering`, () => {
    test(`Reentering should reset the motion's play time`, () => {
        const fixture = {
            motion: new LinearRealValueAnimationFixture(1., 2., 1.),
        };

        const valueObserver = new SingleRealValueObserver();

        const {
            animationGraph,
            triggerStateMachineReenter,
            triggerStateMachineExit,
        } = createReenteringTestEssentials({
            states: {
                'motion': { type: 'motion', motion: fixture.motion.createMotion(valueObserver.getCreateMotionContext()) },
            },
            entryTransitions: [{ to: 'motion' }],
        });

        const evalMock = new AnimationGraphEvalMock(valueObserver.root, animationGraph);

        evalMock.step(0.2);
        expect(valueObserver.value).toBeCloseTo(fixture.motion.getExpected(0.2));

        triggerStateMachineExit(evalMock.controller);
        evalMock.step(0.3);
        expect(valueObserver.value).toBeCloseTo(0.0);

        triggerStateMachineReenter(evalMock.controller);
        evalMock.step(0.4);
        expect(valueObserver.value).toBeCloseTo(fixture.motion.getExpected(0.4));
    });

    describe(`Reentering should reset the state's transition role`, () => {
        test(`Bugfix: reentering cause wrong state weight condition`, () => {
            const fixture = {
                transition_source_animation: new ConstantRealValueAnimationFixture(1.),
                transition_destination_animation: new ConstantRealValueAnimationFixture(2.),
                interruption_destination_animation: new ConstantRealValueAnimationFixture(4.),
                transition_duration: 1.0,
                interruption_duration: 1.0,
                interruption_state_weight_threshold: 0.5,
            };
            expect(fixture.interruption_state_weight_threshold).toBeGreaterThan(0.0);
            expect(fixture.interruption_state_weight_threshold).toBeLessThan(1.0);

            const tInterruptionBegin =
                fixture.transition_duration * fixture.interruption_state_weight_threshold;
            const tInterruptionBeginBiased1 =
                tInterruptionBegin * 1.01;
            const tInterruptionBeginBiased2 =
                tInterruptionBegin * 1.02;
    
            const valueObserver = new SingleRealValueObserver();

            const {
                animationGraph,
                triggerStateMachineExit,
                triggerStateMachineReenter,
            } = createReenteringTestEssentials({
                states: {
                    'transition-source': {
                        type: 'motion',
                        motion: fixture.transition_source_animation.createMotion(
                            valueObserver.getCreateMotionContext()),
                    },
                    'transition-destination': {
                        type: 'motion',
                        motion: fixture.transition_destination_animation.createMotion(
                            valueObserver.getCreateMotionContext()),
                    },
                    'interruption-destination': {
                        type: 'motion',
                        motion: fixture.interruption_destination_animation.createMotion(
                            valueObserver.getCreateMotionContext()),
                    },
                },
                entryTransitions: [{ to: 'transition-source' }],
                transitions: [{
                    from: 'transition-source', to: 'transition-destination',
                    duration: fixture.transition_duration,
                    exitTimeEnabled: false,
                    conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'constant', value: true } }],
                }, {
                    from: 'transition-destination', to: 'interruption-destination',
                    duration: fixture.interruption_duration,
                    exitTimeEnabled: false,
                    conditions: [{
                        type: 'binary', operator: '>=',
                        lhsBinding: { type: 'state-weight' },
                        rhs: fixture.interruption_state_weight_threshold,
                    }],
                }],
            });
    
            const evalMock = new AnimationGraphEvalMock(valueObserver.root, animationGraph);
    
            // About to trigger the interruption.
            evalMock.goto(tInterruptionBeginBiased1);

            // Trigger the interruption.
            evalMock.goto(tInterruptionBeginBiased2);
            expect(valueObserver.value).toBeCloseTo(
                lerp(
                    lerp(
                        fixture.transition_source_animation.getExpected(evalMock.current),
                        fixture.transition_destination_animation.getExpected(evalMock.current),
                        evalMock.current / fixture.transition_duration,
                    ),
                    fixture.interruption_destination_animation.getExpected(evalMock.lastDeltaTime),
                    evalMock.lastDeltaTime / fixture.interruption_duration,
                ),
                5,
            );

            // This should leave the state machine unused.
            triggerStateMachineExit(evalMock.controller);
            evalMock.step(0.0 /* Any time. */);
            expect(valueObserver.value).toBeCloseTo(0.0, 5);

            // Reenter the state machine.
            // The transition should again be triggered. But go before the interruption can happen.
            triggerStateMachineReenter(evalMock.controller);
            evalMock.step(tInterruptionBegin * 0.5);
            expect(valueObserver.value).toBeCloseTo(
                lerp(
                    fixture.transition_source_animation.getExpected(evalMock.lastDeltaTime),
                    fixture.transition_destination_animation.getExpected(evalMock.lastDeltaTime),
                    evalMock.lastDeltaTime / fixture.transition_duration,
                ),
                5,
            );
        });
    });

    function createReenteringTestEssentials(
        stateMachineParams: StateMachineParams,
        variableDeclarations: Record<string, VariableDeclarationParams> = {},
    ) {
        const animationGraph = createAnimationGraph({
            variableDeclarations: { 'paused': { type: 'boolean', value: false }, ...variableDeclarations },
            layers: [{
                // Outer SM.
                stateMachine: {
                    states: {
                        'innerSM': {
                            type: 'procedural',
                            graph: {
                                rootNode: {
                                    'type': 'state-machine',
                                    // Inner SM.
                                    stateMachine: stateMachineParams,
                                },
                            },
                        },
                        'pause': { type: 'empty' },
                    },
                    entryTransitions: [{ to: 'innerSM' }],
                    transitions: [{
                        from: 'innerSM', to: 'pause',
                        duration: 0.0,
                        conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'variable', name: 'paused' } }],
                    }, {
                        from: 'pause', to: 'innerSM',
                        duration: 0.0,
                        conditions: [{ type: 'unary', operator: 'to-be-false', operand: { type: 'variable', name: 'paused' } }],
                    }],
                },
            }],
        });

        return {
            animationGraph,
            triggerStateMachineExit: (controller: AnimationController) => {
                controller.setValue('paused', true);
            },
            triggerStateMachineReenter: (controller: AnimationController) => {
                controller.setValue('paused', false);
            },
        };
    }
});

test(`Clip overriding in state machine node`, () => {
    const fixture = {
        animation_1: new LinearRealValueAnimationFixture(1., 2., 3.),
        animation_2: new LinearRealValueAnimationFixture(-0.5, -3, 1),
    };

    const valueObserver = new SingleRealValueObserver();

    const motion1 = fixture.animation_1.createMotion(valueObserver.getCreateMotionContext());
    const motion2 = fixture.animation_2.createMotion(valueObserver.getCreateMotionContext());

    const animationGraph = createAnimationGraph({
        layers: [{
            // Outer SM.
            stateMachine: {
                entryTransitions: [{ to: 'innerSM' }],
                states: {
                    'innerSM': {
                        type: 'procedural',
                        graph: {
                            rootNode: {
                                'type': 'state-machine',
                                // Inner SM.
                                stateMachine: {
                                    entryTransitions: [{ to: 'm' }],
                                    states: { 'm': { type: 'motion', motion: motion1 } },
                                },
                            },
                        },
                    },
                },
            },
        }],
    });

    const animationGraphVariant = new AnimationGraphVariant();
    animationGraphVariant.original = animationGraph;
    animationGraphVariant.clipOverrides.set(motion1.clip, motion2.clip);

    const evalMock = new AnimationGraphEvalMock(valueObserver.root, animationGraphVariant);

    evalMock.step(fixture.animation_2.duration * 0.3);
    expect(valueObserver.value).toBeCloseTo(fixture.animation_2.getExpected(evalMock.current), 5);
});