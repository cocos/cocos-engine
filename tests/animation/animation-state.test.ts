import { LegacyBlendStateBuffer } from "../../cocos/3d/skeletal-animation/skeletal-animation-blending";
import { Node } from "../../cocos/core";
import { AnimationClip, AnimationState } from "../../cocos/core/animation";
import { VectorTrack } from "../../cocos/core/animation/animation";
import { WrappedInfo } from "../../cocos/core/animation/types";

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
        // Zero duration states won't do sample even there are curves in zero time.
        expectState(state);
        expectWrappedInfo(state.sample());
        blendStateBuffer.apply();
        expect(node.position.x).toBeCloseTo(0.0);
        state.time = 0.618;
        expectState(state);
        expectWrappedInfo(state.sample());
        blendStateBuffer.apply();
        expect(node.position.x).toBeCloseTo(0.0);

        // Zero duration animation states are stopped once it updated in despite the update interval.
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
});
