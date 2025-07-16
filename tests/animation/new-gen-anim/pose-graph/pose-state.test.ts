
import { Pose } from '../../../../cocos/animation/core/pose';
import { AnimationGraphBindingContext, AnimationGraphSettleContext, AnimationGraphUpdateContext, AnimationGraphEvaluationContext } from '../../../../cocos/animation/marionette/animation-graph-context';
import { PoseNode } from '../../../../cocos/animation/marionette/pose-graph/pose-node';
import { createAnimationGraph } from '../utils/factory';
import { AnimationGraphEvalMock, generateIntervals } from '../utils/eval-mock';
import { SingleRealValueObserver } from '../utils/single-real-value-observer';
import { TransformHandle } from '../../../../cocos/animation/core/animation-handle';
import { lerp, Vec3 } from '../../../../exports/base';
import '../../../utils/matchers/value-type-asymmetric-matchers';

describe(`Pose state evaluation behaviors`, () => {
    test(`Transition between pose state and empty state`, () => {
        const fixture = {
            incoming_transition_duration: 2.0,
            outgoing_transition_duration: 3.0,
            pose_value: 6.789,
            another_state_value: 1.23,
        };

        const observer = new SingleRealValueObserver(fixture.another_state_value);

        const poseNodeFooInstances: PoseNodeFoo[] = [];

        class PoseNodeFoo extends PoseNode {
            constructor(...args: ConstructorParameters<typeof PoseNode>) {
                super(...args);
                poseNodeFooInstances.push(this);
            }

            public bind = jest.fn<void, Parameters<PoseNode['bind']>>((context) => {
                this._boundTransform = context.bindTransform('') ?? undefined;
            });
            public settle = jest.fn();
            public reenter = jest.fn<void, Parameters<PoseNode['reenter']>>();
            public doUpdateMock = jest.fn<void, Parameters<PoseNode['doUpdate']>>();
            public doEvaluateMock = jest.fn<ReturnType<PoseNode['doEvaluate']>, Parameters<PoseNode['doEvaluate']>>((context) => {
                expect(this._boundTransform).not.toBeUndefined();
                const pose = context.pushDefaultedPose();
                pose.transforms.setPosition(this._boundTransform!.index, new Vec3(fixture.pose_value));
                return pose;
            });

            public zeroCheck() {
                expect(this.bind).not.toBeCalled();
                expect(this.settle).not.toBeCalled();
                expect(this.reenter).not.toBeCalled();
                expect(this.doUpdateMock).not.toBeCalled();
                expect(this.doEvaluateMock).not.toBeCalled();
            }

            protected doUpdate(context: AnimationGraphUpdateContext): void {
                return this.doUpdateMock.call(this, { ...context });
            }

            protected doEvaluate(context: AnimationGraphEvaluationContext): Pose {
                return this.doEvaluateMock.call(this, context);
            }

            private _boundTransform: TransformHandle | undefined = undefined;
        }

        const poseNodeFoo = new PoseNodeFoo();
        expect(poseNodeFooInstances).toStrictEqual([poseNodeFoo]);
        poseNodeFooInstances.length = 0;

        const animationGraph = createAnimationGraph({
            variableDeclarations: {
                'StartIncomingTransition': { type: 'trigger', value: false },
                'StartOutgoingTransition': { type: 'trigger', value: false },
            },
            layers: [{
                stateMachine: {
                    states: {
                        'Empty': { type: 'empty' },
                        'ProceduralPoseStateFoo': { type: 'procedural', graph: { rootNode: poseNodeFoo } },
                    },
                    entryTransitions: [{ to: 'Empty' }],
                    transitions: [{
                        from: 'Empty', to: 'ProceduralPoseStateFoo', duration: fixture.incoming_transition_duration, destinationStart: 0.5,
                        conditions: [{ type: 'trigger', variableName: 'StartIncomingTransition' }],
                    }, {
                        from: 'ProceduralPoseStateFoo', to: 'Empty', duration: fixture.outgoing_transition_duration,
                        conditions: [{ type: 'trigger', variableName: 'StartOutgoingTransition' }],
                    }],
                },
            }],
        });

        const evalMock = new AnimationGraphEvalMock(observer.root, animationGraph);

        // Firstly, the pose node is instantiated.
        expect(poseNodeFooInstances).toHaveLength(1);
        expect(poseNodeFooInstances[0]).not.toBe(poseNodeFoo);
        const [instantiatedPoseNodeFoo] = poseNodeFooInstances;

        // The bind should have been called.
        expect(instantiatedPoseNodeFoo.bind).toHaveBeenCalledTimes(1);
        // Then the settle should have been called.
        expect(instantiatedPoseNodeFoo.settle).toHaveBeenCalledTimes(1);
        expect(instantiatedPoseNodeFoo.bind.mock.invocationCallOrder[0]).toBeLessThan(instantiatedPoseNodeFoo.settle.mock.invocationCallOrder[0]);
        instantiatedPoseNodeFoo.bind.mockClear();
        instantiatedPoseNodeFoo.settle.mockClear();
        instantiatedPoseNodeFoo.zeroCheck();

        // First tick. The pose node has not been activated.
        for (let i = 0; i < 2; ++i) {
            evalMock.step(0.1);
            instantiatedPoseNodeFoo.zeroCheck();
        }

        /**
         * Checks if the `instantiatedPoseNodeFoo` acts correctly after a tick:
         * - If `reenter` is true, the reenter() should have been called.
         * - Then, the doUpdate() should have been called with context matched with specified.
         * - Then, the doEvaluate() should have been called.
         * - The evaluation result should be matched with expected pose state weight.
         */
        const checkPoseNodeEvaluationActivity = (
            reenter: boolean,
            expectedUpdateContext: { deltaTime: number; indicativeWeight: number; },
            expectedPoseStateWeight: number,
        ) => {
            // First update, then evaluate.
            expect(instantiatedPoseNodeFoo.doUpdateMock).toHaveBeenCalledTimes(1);
            expect(instantiatedPoseNodeFoo.doUpdateMock.mock.calls[0]).toEqual([expect.objectContaining({
                deltaTime: expect.toBeAround(expectedUpdateContext.deltaTime, 5),
                indicativeWeight: expect.toBeAround(expectedUpdateContext.indicativeWeight, 5),
            })]);
            expect(instantiatedPoseNodeFoo.doEvaluateMock).toHaveBeenCalledTimes(1);
            expect(instantiatedPoseNodeFoo.doUpdateMock.mock.invocationCallOrder[0]).toBeLessThan(
                instantiatedPoseNodeFoo.doEvaluateMock.mock.invocationCallOrder[0]);
            // The reenter happens when state is activated.
            if (reenter) {
                // First reenter, then update.
                expect(instantiatedPoseNodeFoo.reenter).toHaveBeenCalledTimes(1);
                expect(instantiatedPoseNodeFoo.reenter.mock.invocationCallOrder[0]).toBeLessThan(
                    instantiatedPoseNodeFoo.doUpdateMock.mock.invocationCallOrder[0]);
                instantiatedPoseNodeFoo.reenter.mockClear();
            } else {
                expect(instantiatedPoseNodeFoo.reenter).not.toHaveBeenCalled();
            }
            instantiatedPoseNodeFoo.doUpdateMock.mockClear();
            instantiatedPoseNodeFoo.doEvaluateMock.mockClear();
            instantiatedPoseNodeFoo.zeroCheck();

            expect(observer.value).toBeCloseTo(
                lerp(fixture.another_state_value, fixture.pose_value, expectedPoseStateWeight),
                5,
            );
        };

        // Trigger the incoming transition.
        evalMock.controller.setValue(`StartIncomingTransition`, true);
        // The following tick will all invoke update then evaluate.
        // The first tick of the following should firstly invoke reenter.
        for (const [interval, tickIndex, timePoint] of generateIntervals(0.3, 0.5, 0.9)) {
            evalMock.step(interval * fixture.incoming_transition_duration);
            checkPoseNodeEvaluationActivity(tickIndex === 0, {
                deltaTime: evalMock.lastDeltaTime,
                indicativeWeight: timePoint,
            }, timePoint);
        }

        // Then run standalone for a while.
        for (const interval of [
            fixture.incoming_transition_duration * 0.2, // Exhaust the transition
            0.5,
            1.2,
        ]) {
            evalMock.step(interval);
            checkPoseNodeEvaluationActivity(false, {
                deltaTime: evalMock.lastDeltaTime,
                indicativeWeight: 1.0,
            }, 1.0);
        }

        // Trigger the outgoing transition.
        evalMock.controller.setValue(`StartOutgoingTransition`, true);
        for (const [interval, _, timePoint] of generateIntervals(0.3, 0.5, 0.9)) {
            evalMock.step(interval * fixture.outgoing_transition_duration);
            checkPoseNodeEvaluationActivity(false, {
                deltaTime: evalMock.lastDeltaTime,
                indicativeWeight: 1.0 - timePoint,
            }, 1.0 - timePoint);
        }

        // Now check what if the transition finished.
        for (const interval of [
            fixture.outgoing_transition_duration * 0.2, // Exhaust the transition
            0.5,
            1.2,
        ]) {
            evalMock.step(interval);
            instantiatedPoseNodeFoo.zeroCheck(); // No surprise!
        }

        // Extra check: if we activates the pose state again, the reenter should have been triggered again.
        evalMock.controller.setValue(`StartIncomingTransition`, true);
        evalMock.step(0.3 * fixture.incoming_transition_duration);
        checkPoseNodeEvaluationActivity(true, {
            deltaTime: evalMock.lastDeltaTime,
            indicativeWeight: 0.3,
        }, 0.3);
    });
});