import { LegacyBlendStateBuffer } from "../../cocos/3d/skeletal-animation/skeletal-animation-blending";
import { lerp, Vec3 } from "../../cocos/core";
import { AnimationClip, AnimationManager, AnimationState } from "../../cocos/animation";
import { VectorTrack } from "../../cocos/animation/animation";
import { WrappedInfo } from "../../cocos/animation/types";
import { Component, Node } from "../../cocos/scene-graph";
import { Director, director } from "../../cocos/game";

describe('Animation state', () => {
    test('Zero duration animation clip', () => {
        const animationClip = new AnimationClip();
        const track = new VectorTrack();
        track.componentsCount = 3;
        track.path.toProperty('position');
        track.channels()[0].curve.assignSorted([[0.0, 2.0]]);
        animationClip.addTrack(track);
        expect(animationClip.duration).toBe(0.0);

        const state = new AnimationState(animationClip);
        const blendStateBuffer = new LegacyBlendStateBuffer();
        const node = new Node();
        state.initialize(node, blendStateBuffer);

        expect(state.duration).toBe(0.0);

        // For zero duration animation states,
        // `.ratio` and `.current` keep 0.0 in despite of elapsed time.
        // If `wrapped info` is inspected, its properties keep constant as well:
        // - `ratio` - 0.0
        // - `time`  - 0.0
        // - `iteration` - 1.0(starting point of first iteration)
        // - `direction` - 1.0(forwarding iteration)
        // - `stopped` - true if `.repeatCount` is finite false otherwise
        // Zero duration states won't do sample even there are curves in zero time.
        expectState(state);
        expectWrappedInfo(state.sample());
        blendStateBuffer.apply();
        expect(node.position.x).toBeCloseTo(2.0);

        node.position = new Vec3(0.0, 0.0, 0.0);
        state.time = 0.618;
        expectState(state);
        expectWrappedInfo(state.sample());
        blendStateBuffer.apply();
        expect(node.position.x).toBeCloseTo(2.0);

        // Zero duration animation states that repeat for finite times
        // are stopped once it updated in despite the update interval.
        state.play();
        state.update(0.0);
        expect(!state.isPlaying && !state.isPaused);

        function expectState(state: AnimationState) {
            expect(state.current).toBe(0.0);
            expect(state.ratio).toBe(0.0);
        }

        function expectWrappedInfo(wrapInfo: WrappedInfo) {
            expect(wrapInfo.time).toBe(0.0);
            expect(wrapInfo.ratio).toBe(0.0);
            expect(wrapInfo.iterations).toBe(0.0);
            expect(wrapInfo.direction).toBe(1);
            expect(wrapInfo.stopped).toBe(true);
        }
    });

    test('Zero duration infinitely looped animation clip', () => {
        const animationClip = new AnimationClip();
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;
        const track = new VectorTrack();
        track.componentsCount = 3;
        track.path.toProperty('position');
        track.channels()[0].curve.assignSorted([[0.0, 2.0]]);
        animationClip.addTrack(track);
        expect(animationClip.duration).toBe(0.0);

        const state = new AnimationState(animationClip);
        const blendStateBuffer = new LegacyBlendStateBuffer();
        const node = new Node();
        state.initialize(node, blendStateBuffer);

        expect(state.duration).toBe(0.0);
        
        for (let i = 0; i < 3; ++i) {
            state.update(i * 0.1);
            blendStateBuffer.apply();
            expect(node.position.x).toBeCloseTo(2.0);
            node.position = new Vec3(1.0);
        }

        // Won't stop
        expect(state.isPlaying && !state.isPaused);
    });

    test('Zero extent playback range', () => {
        /**
         * ### Spec
         * 
         * The playback range of animation state can be "zero-extent", i.e `.min === .max`.
         * In this case, the animation state acts if the duration is 0 and always samples at `min`(or `max`).
         */
        const fixture = {
            clip_duration: 0.3,
            playback_range_start: 0.1,
        };

        const animationClip = new AnimationClip();
        animationClip.wrapMode = AnimationClip.WrapMode.Loop;
        animationClip.duration = fixture.clip_duration;
        const track = new VectorTrack();
        track.componentsCount = 3;
        track.path.toProperty('position');
        track.channels()[0].curve.assignSorted([[0.0, 2.0], [1.0, 5.0]]);
        animationClip.addTrack(track);

        const state = new AnimationState(animationClip);
        const blendStateBuffer = new LegacyBlendStateBuffer();
        const node = new Node();
        state.initialize(node, blendStateBuffer);

        expect(state.duration).toBe(fixture.clip_duration);

        state.playbackRange = { min: fixture.playback_range_start, max: fixture.playback_range_start };
        expect(state.duration).toBe(fixture.clip_duration);

        for (let j = 0; j < 2; ++j) {
            for (let i = 0; i < 3; ++i) {
                state.update((j + i / 3) * animationClip.duration);
                blendStateBuffer.apply();
                expect(node.position.x).toBeCloseTo(lerp(2.0, 5.0, fixture.playback_range_start));
                node.position = new Vec3(1.0);
            }
        }
    });

    test(`Frame event`, () => {
        const clip = new AnimationClip();
        clip.duration = 1.0;
        clip.events = [{
            frame: 0.2,
            func: 'method1',
            params: ['3.14', 'str666', 'true'],
        }];

        class FrameEventReceiver extends Component {
            method1 = jest.fn();
        }

        const state = new AnimationState(clip);
        const blendStateBuffer = new LegacyBlendStateBuffer();
        const node = new Node();
        const frameEventReceiver = node.addComponent(FrameEventReceiver) as FrameEventReceiver;
        state.initialize(node, blendStateBuffer);

        state.play();

        const update = (dt: number) => {
            director.getSystem(AnimationManager.ID)?.update(dt);
        };

        update(0.0); // Perfect first frame.
        update(0.1);
        expect(frameEventReceiver.method1).not.toBeCalled();
        update(0.11);
        expect(frameEventReceiver.method1.mock.calls[0]).toEqual(clip.events[0].params);
    });
});
