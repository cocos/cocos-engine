import { createAnimationGraph } from '../../utils/factory';
import { AnimationGraphEvalMock } from '../../utils/eval-mock';
import { ConstantRealValueAnimationFixture, LinearRealValueAnimationFixture } from '../../utils/fixtures';
import { SingleRealValueObserver } from '../../utils/single-real-value-observer';
import { lerp } from '../../../../../cocos/core';
import './utils/factories/all';
import { PoseNodePlayMotion } from '../../../../../cocos/animation/marionette/pose-graph/pose-nodes/play-motion';
import { ClipMotion, Motion } from '../../../../../cocos/animation/marionette/motion';
import { repeat } from '../../../../../exports/base';
import { composeInputKeyInternally, createPoseGraph, createVariableGettingNode, getTheOnlyOutputKey2 } from '../utils/misc';
import { poseGraphOp } from '../../../../../cocos/animation/marionette/asset-creation';
import { PoseGraphType } from '../../../../../cocos/animation/marionette/pose-graph/foundation/type-system';
import { SimplePoseGraphRunner } from '../utils/simple-pose-graph-runner';

test(`Motion Sync`, () => {
    const WITH_SYNC: boolean = true;

    const fixture = {
        motion_f: new LinearRealValueAnimationFixture(1., 2., 3.),
        motion_r: new LinearRealValueAnimationFixture(4., 5., 7.),
        blend_proportion_f: 0.3,
        transition_duration: 0.3,
    };

    const observer = new SingleRealValueObserver();

    const graph = createAnimationGraph({
        variableDeclarations: { 'blend': { type: 'boolean', value: false } },
        layers: [{
            stashes: {
                'f': { graph: { rootNode: { type: 'motion', motion: fixture.motion_f.createMotion(observer.getCreateMotionContext()), syncInfo: WITH_SYNC ? { group: 'locomotion' } : undefined } } },
                'r': { graph: { rootNode: { type: 'motion', motion: fixture.motion_r.createMotion(observer.getCreateMotionContext()), syncInfo: WITH_SYNC ? { group: 'locomotion' } : undefined } } }
            },
            stateMachine: {
                states: {
                    'f': { type: 'procedural', graph: { rootNode: { type: 'use-stash', stashId: 'f' } } },
                    'fr': {
                        type: 'procedural',
                        graph: {
                            rootNode: {
                                type: 'blend-in-proportion',
                                items: [
                                    { pose: { type: 'use-stash', stashId: 'f' }, proportion: fixture.blend_proportion_f },
                                    { pose: { type: 'use-stash', stashId: 'r' }, proportion: 1.0 - fixture.blend_proportion_f },
                                ],
                            },
                        },
                    },
                },
                entryTransitions: [{ to: 'f' }],
                transitions: [{
                    from: 'f',
                    to: 'fr',
                    conditions: [{ type: 'unary', operator: 'to-be-true', operand: { type: 'variable', name: 'blend' } }],
                    duration: 0.3,
                }, {
                    from: 'fr',
                    to: 'f',
                    conditions: [{ type: 'unary', operator: 'to-be-false', operand: { type: 'variable', name: 'blend' } }],
                    duration: 0.3,
                }],
            },
        }],
    });

    const evalMock = new AnimationGraphEvalMock(observer.root, graph);

    // Play `f` to 20%.
    evalMock.step(fixture.motion_f.duration * 0.2);

    /**
     * Let: 
     *   - x = `transitionRatioLeaderBound`
     *   - a = `fixture.motion_f.duration`
     *   - $w_f$ as weight of f, $w_f = (1 - x) + (x * a)$
     *   - $w_r$ as weight of r, $w_r = x * (1 - a)$
     * 
     * If `w_f > w_r`, f is the leader. Otherwise r becomes the leader.
     * 
     * $$
     * w_f > w_r
     * (1 - x) + (x * a) > x * (1 - a)
     * 1 - x + ax - x + ax > 0
     * (2a - 2)x > -1
     * x < 1 / (2 - 2a)
     * $$
     */
    const transitionRatioLeaderBound = 1 / (2 - 2 * fixture.blend_proportion_f);

    // Trigger the transition.
    const transitionStartTime = evalMock.current;
    evalMock.controller.setValue('blend', true);

    let lastRTime = 0.0;

    // Within leader bound, the leader should be f.
    for (const transitionRatio of [
        transitionRatioLeaderBound * 0.2,
        transitionRatioLeaderBound * 0.8,
    ]) {
        evalMock.goto(transitionStartTime + fixture.transition_duration * transitionRatio);
        checkFToFRBlend(
            evalMock.current,
            evalMock.current / fixture.motion_f.duration * fixture.motion_r.duration,
            transitionRatio,
        );
        lastRTime = evalMock.current / fixture.motion_f.duration * fixture.motion_r.duration;
    }

    // Out of leader bound, the leader should become r.
    for (const transitionRatio of [
        transitionRatioLeaderBound + (1.0 - transitionRatioLeaderBound) * 0.2,
        transitionRatioLeaderBound + (1.0 - transitionRatioLeaderBound) * 0.8,
    ]) {
        evalMock.goto(transitionStartTime + fixture.transition_duration * transitionRatio);
        const rTime = lastRTime + evalMock.lastDeltaTime;
        const rRatio = rTime / fixture.motion_r.duration;
        const fTime = rRatio * fixture.motion_f.duration;
        checkFToFRBlend(
            fTime,
            rTime,
            transitionRatio,
        );
        lastRTime = rTime;
    }

    function checkFToFRBlend(fTime: number, rTime: number, transitionRatio: number) {
        expect(observer.value).toBeCloseTo(
            lerp(
                fixture.motion_f.getExpected(fTime),
                lerp(
                    fixture.motion_f.getExpected(fTime),
                    WITH_SYNC
                        ? fixture.motion_r.getExpected(rTime)
                        : fixture.motion_r.getExpected(fixture.transition_duration * transitionRatio),
                        (1.0 - fixture.blend_proportion_f),
                ),
                transitionRatio,
            ),
            5,
        );
    }
});

test(`Defaults`, () => {
    const poseGraph = createPoseGraph();
    const node = poseGraph.addNode(new PoseNodePlayMotion());

    expect(node.motion).toBeInstanceOf(ClipMotion);
    expect((node.motion as ClipMotion).clip).toBeNull();

    expect(node.startTime).toBe(0.0);
    expect(poseGraphOp.getInputMetadata(node, composeInputKeyInternally('startTime'))).toMatchObject({
        type: PoseGraphType.FLOAT,
    });

    expect(node.speedMultiplier).toBe(1.0);
    expect(poseGraphOp.getInputMetadata(node, composeInputKeyInternally('speedMultiplier'))).toMatchObject({
        type: PoseGraphType.FLOAT,
    });
});

describe(`Start time`, () => {
    test(`Non zero motion duration`, () => {
        const fixture = {
            motion: new LinearRealValueAnimationFixture(1.0, 2.0, 3.0, undefined, { loop: true }),
        };
    
        const observer = new SingleRealValueObserver();
    
        const runner = new PlayMotionRunner({
            root: observer.root,
            motion: fixture.motion.createMotion(observer.getCreateMotionContext()),
            startTime: fixture.motion.duration * 0.3,
        });
    
        let expectedNormalizedMotionTime = 0.3;
        const stepExpectedNormalizedMotionTimeAndCheck = (step: number) => {
            expectedNormalizedMotionTime = repeat(expectedNormalizedMotionTime + step, 1);
            expect(observer.value).toBeCloseTo(
                fixture.motion.getExpected(fixture.motion.duration * expectedNormalizedMotionTime),
                5,
            );
        };
    
        // The start time should take effects from the beginning.
        runner.enter();
        for (const interval of [
            0.4, // Not beyond
            0.2, // Not beyond
            0.6, // Beyond
        ]) {
            runner.evalMock.step(fixture.motion.duration * interval);
            stepExpectedNormalizedMotionTimeAndCheck(interval);
        }
    
        // After reenter(), the start time should still take effect.
        runner.reenter();
        expectedNormalizedMotionTime = 0.3;
        runner.evalMock.step(fixture.motion.duration * 0.1);
        stepExpectedNormalizedMotionTimeAndCheck(0.1);
    
        // As long the node is activating, change of start time won't affect nothing.
        runner.updateStartTime(0.25 * fixture.motion.duration);
        runner.evalMock.step(fixture.motion.duration * 0.1);
        stepExpectedNormalizedMotionTimeAndCheck(0.1); // Still step 0.1 despite of of the new start time!
    
        // The new start time would take effect at next reenter().
        runner.reenter();
        runner.evalMock.step(fixture.motion.duration * 0.1);
        expectedNormalizedMotionTime = 0.25;
        stepExpectedNormalizedMotionTimeAndCheck(0.1);
    
        // The start time would be clamped into [0, 1].
        runner.updateStartTime(-0.2 * fixture.motion.duration);
        runner.reenter();
        runner.evalMock.step(fixture.motion.duration * 0.1);
        expectedNormalizedMotionTime = 0.0;
        stepExpectedNormalizedMotionTimeAndCheck(0.1);
        runner.updateStartTime(1.2 * fixture.motion.duration);
        runner.reenter();
        runner.evalMock.step(fixture.motion.duration * 0.1);
        expectedNormalizedMotionTime = 0.0;
        stepExpectedNormalizedMotionTimeAndCheck(0.1);
    });

    test(`Zero motion duration`, () => {
        const fixture = {
            motion: new ConstantRealValueAnimationFixture(1.0, 0.0),
        };
    
        const observer = new SingleRealValueObserver();
    
        const runner = new PlayMotionRunner({
            root: observer.root,
            motion: fixture.motion.createMotion(observer.getCreateMotionContext()),
            startTime: fixture.motion.duration * 0.3,
        });

        const check = () => {
            expect(observer.value).toBeCloseTo(fixture.motion.value, 5);
        };

        // For zero duration motions, start time is meaningless.
        runner.enter();
        for (let i = 0; i < 3; ++i) {
            runner.evalMock.step(0.2);
            check();
        }
    });
});

class PlayMotionRunner extends SimplePoseGraphRunner {
    constructor({
        motion,
        startTime = 0.0,
        speedMultiplier = 1.0,
        ...baseOptions
    }: Omit<SimplePoseGraphRunner.Options, 'poseGraphInitializer'> & {
        motion: Motion,
        startTime?: number;
        speedMultiplier?: number;
    }) {
        super({
            ...baseOptions,
            variables: {
                'startTime': { type: 'float', value: startTime },
                'speedMultiplier': { type: 'float', value: speedMultiplier },
            },
            poseGraphInitializer: (poseGraph) => {
                const node = poseGraph.addNode(new PoseNodePlayMotion());
                node.motion = motion;
                poseGraphOp.connectNode(poseGraph,
                    node,
                    composeInputKeyInternally('startTime'),
                    ...getTheOnlyOutputKey2(poseGraph.addNode(createVariableGettingNode(PoseGraphType.FLOAT, 'startTime'))),
                );
                poseGraphOp.connectNode(poseGraph,
                    node,
                    composeInputKeyInternally('speedMultiplier'),
                    ...getTheOnlyOutputKey2(poseGraph.addNode(createVariableGettingNode(PoseGraphType.FLOAT, 'speedMultiplier'))),
                );
                poseGraphOp.connectOutputNode(poseGraph, node);
            },
        });
    }

    public updateStartTime(value: number) {
        this.evalMock.controller.setValue('startTime', value);
    }

    public updateSpeedMultiplier(value: number) {
        this.evalMock.controller.setValue('speedMultiplier', value);
    }
}
