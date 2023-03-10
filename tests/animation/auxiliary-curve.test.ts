import { AnimationClip, AnimationState } from "../../cocos/animation";
import { RealTrack, Track, TrackPath } from "../../cocos/animation/animation";
import { ClipMotion } from "../../cocos/animation/marionette/clip-motion";
import { Node } from "../../cocos/scene-graph";
import { createAnimationGraph } from './new-gen-anim/utils/factory';
import { LinearRealValueAnimationFixture } from "./new-gen-anim/utils/fixtures";
import { AnimationGraphEvalMock } from './new-gen-anim/utils/eval-mock';

test(`Auxiliary curve path`, () => {
    const correctlyFormed = new TrackPath();
    expect(correctlyFormed.toAuxiliaryCurve('curveNameABC')).toBe(correctlyFormed);
    expect(correctlyFormed.length).toBe(1);
    expect(correctlyFormed.isAuxiliaryCurve()).toBe(true);
    expect(correctlyFormed.parseAuxiliaryCurve()).toBe('curveNameABC');

    // These throw since: the auxiliaryCurve curve path shall be the only subpath in a track path.
    expect(() => correctlyFormed.toAuxiliaryCurve('anotherAuxCurve')).toThrowError();
    expect(() => correctlyFormed.toProperty('propertyABC')).toThrowError();
    expect(() => correctlyFormed.toElement(1)).toThrowError();
    expect(() => correctlyFormed.toHierarchy('h')).toThrowError();
    expect(() => correctlyFormed.toComponent('c')).toThrowError();
    expect(() => correctlyFormed.toCustomized({ get() {  } })).toThrowError();
    expect(() => new TrackPath().toHierarchy('h').toAuxiliaryCurve('xyz')).toThrowError();
    expect(() => new TrackPath().append(
        new TrackPath().toProperty('position'),
        new TrackPath().toAuxiliaryCurve('666'),
        new TrackPath(),
    )).toThrowError();
    expect(() => new TrackPath().append(
        new TrackPath().toAuxiliaryCurve('666'),
        new TrackPath().toProperty('position'),
        new TrackPath(),
    )).toThrowError();

    // This should be OK.
    expect(new TrackPath().append(
        new TrackPath(),
        new TrackPath().toAuxiliaryCurve('666'),
        new TrackPath(),
    ).parseAuxiliaryCurve()).toBe('666');
});

test(`Shall be ignored in legacy animation system`, () => {
    const clip = new AnimationClip();
    clip.duration = 1.0;
    const realTrack = new RealTrack();
    realTrack.path.toAuxiliaryCurve('xyz');
    clip.addTrack(realTrack);

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
        const track = new RealTrack();
        track.path.toAuxiliaryCurve('SomeCurve');
        track.channel.curve.assignSorted([
            [0.0, fixture.animation.from],
            [fixture.animation.duration, fixture.animation.to],
        ]);
        clip.addTrack(track);

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
        expect(evalMock.controller.getAuxiliaryCurveValue(fixture.curveName)).toBeCloseTo(fixture.animation.getExpected(0.2));
    });
});