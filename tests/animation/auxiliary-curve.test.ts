import { AnimationClip, AnimationState } from "../../cocos/animation";
import { ClipMotion } from "../../cocos/animation/marionette/motion";
import { Node } from "../../cocos/scene-graph";
import { createAnimationGraph } from './new-gen-anim/utils/factory';
import { LinearRealValueAnimationFixture } from "./new-gen-anim/utils/fixtures";
import { AnimationGraphEvalMock } from './new-gen-anim/utils/eval-mock';
import { RealCurve } from "../../exports/base";

test(`Authoring in animation clip`, () => {
    const clip = new AnimationClip();

    expect(clip.auxiliaryCurveCount_experimental).toBe(0);
    expect(clip.getAuxiliaryCurveNames_experimental()).toHaveLength(0);

    const comparisonTable = Array.from({ length: 3 }, (_, i) => ({
        name: `Curve${i}`,
        expectedExistence: false,
        expectedCurve: undefined as undefined | RealCurve,
    }));

    const check = () => {
        expect(clip.auxiliaryCurveCount_experimental).toBe(comparisonTable.filter((entry) => entry.expectedExistence).length);
        expect(clip.getAuxiliaryCurveNames_experimental()).toStrictEqual(expect.arrayContaining(
            comparisonTable
                .filter((entry) => entry.expectedExistence)
                .map((entry) => entry.name)),
        );
        for (const { name, expectedExistence, expectedCurve } of comparisonTable) {
            if (!expectedExistence) {
                expect(clip.hasAuxiliaryCurve_experimental(name)).toBe(false);
            } else {
                expect(clip.hasAuxiliaryCurve_experimental(name)).toBe(true);
                expect(clip.getAuxiliaryCurve_experimental(name)).toBe(expectedCurve);
            }
        }
    };

    // Add curves one by one.
    for (const entry of comparisonTable) {
        entry.expectedCurve = clip.addAuxiliaryCurve_experimental(entry.name);
        entry.expectedExistence = true;
        check();
    }

    // Remove curves at middle/tail/beginning.
    for (const index of [1, 1, 0]) {
        const entry = comparisonTable[index];
        clip.removeAuxiliaryCurve_experimental(entry.name);
        entry.expectedExistence = false;
        check();
    }
});

test(`Shall be ignored in legacy animation system`, () => {
    const clip = new AnimationClip();
    clip.duration = 1.0;
    clip.addAuxiliaryCurve_experimental('xyz');

    const state = new AnimationState(clip);
    const node = new Node();
    state.initialize(node);
});

describe(`Behavior in marionette`, () => {
    test(`In clip motion`, () => {
        const fixture = {
            curveName: 'SomeCurve',
            animation: new LinearRealValueAnimationFixture(0.3, 0.4, 0.5),
        };
    
        const clip = new AnimationClip();
        clip.duration = fixture.animation.duration;
        const curve = clip.addAuxiliaryCurve_experimental('SomeCurve');
        curve.assignSorted([
            [0.0, fixture.animation.from],
            [fixture.animation.duration, fixture.animation.to],
        ]);

        const motion = new ClipMotion();
        motion.clip = clip;
    
        const animationGraph = createAnimationGraph({
            layers: [{
                stateMachine: {
                    states: { 'motion': { type: 'motion', motion } },
                    entryTransitions: [{ to: 'motion' }],
                },
            }],
        });
    
        const evalMock = new AnimationGraphEvalMock(new Node(), animationGraph);
    
        evalMock.goto(0.2);
        expect(evalMock.controller.getAuxiliaryCurveValue_experimental(fixture.curveName)).toBeCloseTo(fixture.animation.getExpected(0.2));
    });
});