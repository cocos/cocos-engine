import { AnimationClip, AnimationState } from "../../cocos/animation";
import { ClipMotion } from "../../cocos/animation/marionette/clip-motion";
import { Node } from "../../cocos/scene-graph";
import { createAnimationGraph } from './new-gen-anim/utils/factory';
import { LinearRealValueAnimationFixture } from "./new-gen-anim/utils/fixtures";
import { AnimationGraphEvalMock } from './new-gen-anim/utils/eval-mock';
import { AuxiliaryCurveInfo } from "../../cocos/animation/auxiliary-curve";

test(`Shall be ignored in legacy animation system`, () => {
    const curveInfo = new AuxiliaryCurveInfo();
    curveInfo.name = 'xyz';
    const clip = new AnimationClip();
    clip.duration = 1.0;
    clip.auxiliaryCurveInfos_experimental = [curveInfo];

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
        const curveInfo = new AuxiliaryCurveInfo();
        curveInfo.name = 'SomeCurve';
        curveInfo.curve.assignSorted([
            [0.0, fixture.animation.from],
            [fixture.animation.duration, fixture.animation.to],
        ]);
        clip.auxiliaryCurveInfos_experimental = [curveInfo];

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