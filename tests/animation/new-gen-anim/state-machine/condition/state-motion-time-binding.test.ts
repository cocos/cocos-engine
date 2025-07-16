import { AnimationController } from "../../../../../cocos/animation/animation";
import { AnimationGraphEvalMock } from "../../utils/eval-mock";
import { createAnimationGraph, StateMachineParams, StateParams, TransitionParams, VariableDeclarationParams } from "../../utils/factory";
import { LinearRealValueAnimationFixture } from "../../utils/fixtures";
import { SingleRealValueObserver } from "../../utils/single-real-value-observer";
import '../../pose-graph/pose-nodes/utils/factories/all';
import { Component, Node } from "../../../../../exports/base";

describe(`State motion time binding behavior on different source state type`, () => {
    describe(`State motion time of the motion states`, () => {
        test(`The motion state has motion configured`, () => {
            // If a motion state has motion configured,
            // its state motion time should be its normalized play time.

            const fixture = {
                motion: new LinearRealValueAnimationFixture(1, 2, 3),
            };
    
            const observer = new SingleRealValueObserver();
    
            run(
                { type: 'motion', motion: fixture.motion.createMotion(observer.getCreateMotionContext()) },
                (stateTime) => stateTime / fixture.motion.duration,
                fixture.motion.duration,
                observer,
            );
        });

        test(`The motion state has no motion configured`, () => {
            // If a motion state has no motion configured,
            // its state motion time should always be zero.
            run(
                { type: 'motion' },
                () => 0.0, // Always zero.
            );
        });
    });

    describe(`On procedural state`, () => {
        test(`The pose graph contains no motion player`, () => {
            // If the pose graph has no any motion player node,
            // its state motion time is always zero.

            run(
                { type: 'procedural', graph: {} },
                () => 0.0, // Always zero.
            );
        });

        test(`The pose graph contains only one motion player`, () => {
            // If the pose has exactly one motion player,
            // its state motion time is the motion player's normalized play time.

            const fixture = {
                motion: new LinearRealValueAnimationFixture(1, 2, 3),
            };

            const observer = new SingleRealValueObserver();

            run(
                {
                    type: 'procedural',
                    graph: {
                        rootNode: { type: 'motion', motion: fixture.motion.createMotion(observer.getCreateMotionContext()) },
                    },
                },
                (stateTime) => stateTime / fixture.motion.duration,
                fixture.motion.duration,
                observer,
            );
        });

        test(`The pose graph contains more than one motion player`, () => {
            // If the pose has more than one motion players,
            // its state motion time is the normalized play time of motion player with max absolute weight.

            const fixture = {
                bigger_weight_motion: new LinearRealValueAnimationFixture(1, 2, 3),
                bigger_weight_motion_weight: 0.52,
                smaller_weight_motion: new LinearRealValueAnimationFixture(1, 2, 1.0),
            };

            run1(false);
            run1(true); // Swap and do again

            function run1(swapWeight: boolean) {
                const observer = new SingleRealValueObserver();
                const proportions = [fixture.bigger_weight_motion_weight, 1.0 - fixture.bigger_weight_motion_weight];
                if (swapWeight) {
                    const temp = proportions[0]; proportions[0] = proportions[1]; proportions[1] = temp;
                }
                run(
                    {
                        type: 'procedural',
                        graph: {
                            rootNode: {
                                type: 'blend-in-proportion',
                                items: [{
                                    // Bigger.
                                    pose: { type: 'motion', motion: fixture.bigger_weight_motion.createMotion(observer.getCreateMotionContext())},
                                    proportion: proportions[0],
                                }, {
                                    // Smaller.
                                    pose: { type: 'motion', motion: fixture.smaller_weight_motion.createMotion(observer.getCreateMotionContext())},
                                    proportion: proportions[1],
                                }],
                            },
                        },
                    },
                    (stateTime) => stateTime / (!swapWeight ? fixture.bigger_weight_motion.duration : fixture.smaller_weight_motion.duration),
                    (!swapWeight ? fixture.bigger_weight_motion.duration : fixture.smaller_weight_motion.duration),
                    observer,
                );
            }
        });
    });

    test(`On any state`, () => {
        run(
            'any',
            () => 0.0,
        );
    });

    test(`State motion time binding is only defined on activated motion states, pose states`, () => {
        // Attempt to use the binding on transitions from empty states throws.
        expectEvaluationOfStateMachineToThrows({
            states: {
                'empty': { type: 'empty' },
                'destination-state': { type: 'empty' },
            },
            entryTransitions: [{ to: 'empty' }],
            // The violation.
            transitions: [{ from: 'empty', to: 'destination-state', conditions: [createConditionUsingStateMotionTimeBinding()] }],
        });

        // Attempt to use the binding on transitions from sub-state-machine throws.
        expectEvaluationOfStateMachineToThrows({
            states: {
                'destination-state': { type: 'empty' },
                'sub-sm': {
                    type: 'sub-state-machine', stateMachine: {
                        states: { 'empty': { type: 'empty' } },
                        entryTransitions: [{ to: 'empty' }],
                        exitTransitions: [{ from: 'empty', conditions: [createAlwaysTrueCondition()] }],
                    },
                },
            },
            entryTransitions: [{ to: 'sub-sm' }],
            // The violation.
            transitions: [{ from: 'sub-sm', to: 'destination-state', conditions: [createConditionUsingStateMotionTimeBinding()] }],
        });

        // Attempt to use the binding on transitions from top-level entry state throws.
        expectEvaluationOfStateMachineToThrows({
            states: { 'destination-state': { type: 'empty' } },
            // The violation.
            entryTransitions: [{ to: 'destination-state', conditions: [createConditionUsingStateMotionTimeBinding()] }],
        });

        // Attempt to use the binding on transitions from sub-state-machine entry states throws.
        expectEvaluationOfStateMachineToThrows({
            states: {
                'source-state': { type: 'empty' },
                'sub-sm': {
                    type: 'sub-state-machine',
                    stateMachine: {
                        states: { 'destination-state': { type: 'empty' } },
                        // The violation.
                        entryTransitions: [{ to: 'destination-state', conditions: [createConditionUsingStateMotionTimeBinding()] }],
                    },
                },
            },
            entryTransitions: [{ to: 'source-state' }],
            transitions: [{ from: 'source-state', to: 'sub-sm', conditions: [createAlwaysTrueCondition()] }],
        });

        function expectEvaluationOfStateMachineToThrows(stateMachineParams: StateMachineParams) {
            const animationGraph = createAnimationGraph({
                layers: [{ stateMachine: stateMachineParams }],
            });

            const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);

            expect(() => evalMock.step(0.1)).toThrowError(
                'State motion time is only defined on activated motion states and procedural pose states.',
            );
        }

        function createConditionUsingStateMotionTimeBinding() {
            return { type: 'binary', lhsBinding: { type: 'state-motion-time' }, operator: '==', rhs: 0.0 } as const;
        }

        function createAlwaysTrueCondition() {
            return { type: 'unary', operand: { type: 'constant', value: true } } as const;
        }
    });
});

function run(
    sourceStateParams: StateParams | 'any',
    expectedFormula: (stateTime: number) => number,
    thresholdMultiplier: number = 1.0,
    observer: SingleRealValueObserver = new SingleRealValueObserver(),
) {
    const multiWayTransitionObserver = new MultiWayTransitionObserver(0.4, 0.8, 1.0, 1.2);

    let stateMachineParams: StateMachineParams;
    if (sourceStateParams === 'any') {
        stateMachineParams = {
            states: {
                'source-state': { type: 'motion' },
                ...multiWayTransitionObserver.createDestinationStates(),
            },
            entryTransitions: [{ to: 'source-state' }],
            anyTransitions: multiWayTransitionObserver.createTransitions(),
        };
    } else {
        stateMachineParams = {
            states: {
                'source-state': sourceStateParams,
                ...multiWayTransitionObserver.createDestinationStates(),
            },
            entryTransitions: [{ to: 'source-state' }],
            transitions: multiWayTransitionObserver.createTransitions().map((tr) => {
                return {
                    from: 'source-state',
                    exitTimeEnabled: sourceStateParams.type === 'motion' ? false : undefined,
                    ...tr,
                };
            }),
        };
    }

    const animationGraph = createAnimationGraph({
        variableDeclarations: { ...multiWayTransitionObserver.createVariables() },
        layers: [{
            stateMachine: stateMachineParams,
        }],
    });

    multiWayTransitionObserver.listenToTransitionInEvents(observer.root);
    for (let iThreshold = 0; iThreshold < multiWayTransitionObserver.thresholds.length; ++iThreshold) {
        const minThreshold = multiWayTransitionObserver.thresholds[iThreshold];

        const evalMock = new AnimationGraphEvalMock(observer.root, animationGraph);

        let expectedStateMotionTimeOfNextTick = 0.0;

        // Step to source node, but disable transition.
        evalMock.goto(thresholdMultiplier * (minThreshold * 0.1));
        expectedStateMotionTimeOfNextTick = expectedFormula(evalMock.current);

        // Enable all transitions from `iThreshold`.
        multiWayTransitionObserver.enableTransitionsAfter(iThreshold, evalMock.controller);

        const checkAt = (at: number) => {
            evalMock.goto(thresholdMultiplier * (minThreshold * at));
            // This is our expected state motion time.

            const expectedActivatedIndex = multiWayTransitionObserver.thresholds.findIndex((threshold, index) =>
                index >= iThreshold && expectedStateMotionTimeOfNextTick > threshold);
            multiWayTransitionObserver.checkIfOnlySpecifiedStateHasBeenActivated(expectedActivatedIndex);

            multiWayTransitionObserver.clear();
            expectedStateMotionTimeOfNextTick = expectedFormula(evalMock.current);
        };

        checkAt(0.99); // Not triggered.
        checkAt(1.01); // Not triggered, but should triggered at next tick.
        checkAt(1.02); // Should triggered.
    }
}

class MultiWayTransitionObserver {
    constructor(
        ...thresholds: number[]
    ) {
        expect(thresholds.every((v, i, arr) => i === 0 || v > arr[i - 1])).toBe(true);
        this._thresholds = [...thresholds];
        this._transitionInFlags = new Array(thresholds.length).fill(false);
    }

    get thresholds() {
        return this._thresholds;
    }

    public enableTransitionsAfter(index: number, controller: AnimationController) {
        controller.setValue('MinEnabledTransitionIndex', index);
    }

    public clear() {
        this._transitionInFlags.fill(false);
    }

    public checkIfOnlySpecifiedStateHasBeenActivated(stateIndex: number) {
        expect(this._transitionInFlags).toStrictEqual(
            Array.from({ length: this.thresholds.length }, (_, i) => i === stateIndex ? true : false),
        );
    }

    public createVariables(): Record<string, VariableDeclarationParams> {
        return { 'MinEnabledTransitionIndex': { type: 'int', value: this.thresholds.length } };
    }

    public createDestinationStates() {
        return Object.fromEntries(this.thresholds.map((threshold, thresholdIndex) => {
            return [
                `dest-state-${thresholdIndex}`, {
                    type: 'motion',
                    transitionInEventBinding: `transition-in-dest-state-${thresholdIndex}`,
                } as StateParams,
            ];
        }));
    }

    public createTransitions() {
        return this.thresholds.map((threshold, thresholdIndex): Omit<TransitionParams, 'from'> => {
            return {
                to: `dest-state-${thresholdIndex}`,
                conditions: [{
                    type: 'binary', lhsBinding: { type: 'variable', variableName: 'MinEnabledTransitionIndex' }, operator: '<=', rhs: thresholdIndex,
                } as const, {
                    type: 'binary', lhsBinding: { type: 'state-motion-time' }, operator: '>=', rhs: threshold,
                } as const],
            };
        });
    }

    public listenToTransitionInEvents(node: Node) {
        class Comp extends Component {}
        for (let i = 0; i < this.thresholds.length; ++i) {
            Comp.prototype[`transition-in-dest-state-${i}`] = () => {
                expect(this._transitionInFlags[i]).toBe(false);
                this._transitionInFlags[i] = true;
            };
        }
        node.addComponent(Comp);
    }

    private _thresholds: readonly number[];
    private _transitionInFlags: boolean[];
}