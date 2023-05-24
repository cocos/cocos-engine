import { createAnimationGraph } from '../../utils/factory';
import { AnimationGraphEvalMock } from '../../utils/eval-mock';
import { LinearRealValueAnimationFixture } from '../../utils/fixtures';
import { SingleRealValueObserver } from '../../utils/single-real-value-observer';
import { lerp } from '../../../../../cocos/core';

import './utils/factories/all';

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
