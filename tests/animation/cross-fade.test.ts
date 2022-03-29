import { AnimationClip, AnimationState } from '../../cocos/core/animation';
import { CrossFade } from '../../cocos/core/animation/cross-fade';
import { Playable } from '../../cocos/core/animation/playable';

class DummyState extends Playable {
    constructor (public duration = 1.0) { super(); }

    public weight = 1.0;
}

function createDummyState ({ duration = 1.0 } = {}) {
    return new DummyState(duration) as unknown as AnimationState;
}

describe('Cross fade', () => {
    test('Fade from initial state', () => {
        const state = createDummyState();
        const crossFade = new CrossFade();
        crossFade.crossFade(state, 0.3);
        crossFade.update(0.1);
        expect(state.weight).toBeCloseTo(1.0);
    });

    test('Simple Fading', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        
        const crossFade = new CrossFade();
        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.3);

        crossFade.update(0.1);
        expect(state1.weight).toBeCloseTo(0.2 / 0.3);
        expect(state2.weight).toBeCloseTo(0.1 / 0.3);

        crossFade.update(0.1);
        expect(state1.weight).toBeCloseTo(0.1 / 0.3);
        expect(state2.weight).toBeCloseTo(0.2 / 0.3);
    });

    test('New fading before previous fadings got finished', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        const state3 = createDummyState();

        const crossFade = new CrossFade();

        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.7);
        crossFade.update(0.2);

        crossFade.crossFade(state3, 0.5);
        crossFade.update(0.1);

        expect(state3.weight).toBeCloseTo(0.1 / 0.5);
        expect(state2.weight).toBeCloseTo((1.0 - 0.1 / 0.5) * ((0.1 + 0.2) / 0.7));
        expect(state1.weight).toBeCloseTo((1.0 - 0.1 / 0.5) * (1.0 - (0.1 + 0.2) / 0.7));
    });

    test('Fading again', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();

        const crossFade = new CrossFade();
        
        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.7);
        crossFade.update(0.2);

        crossFade.crossFade(state1, 0.5);
        crossFade.update(0.1);

        expect(state2.weight).toBeCloseTo((1.0 - 0.1 / 0.5) * ((0.1 + 0.2) / 0.7));
        expect(state1.weight).toBeCloseTo(
            0.1 / 0.5 + // New fading weight
            (1.0 - 0.1 / 0.5) * (1.0 - (0.1 + 0.2) / 0.7)
        );
    });

    test('State playback management', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        const crossFade = new CrossFade();

        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.3);
        expect(!state1.isPaused && state1.isPlaying).toBe(true);
        expect(!state2.isPaused && state2.isPlaying).toBe(true);

        crossFade.pause();
        expect(state1.isPaused && state1.isPlaying).toBe(true);
        expect(state2.isPaused && state2.isPlaying).toBe(true);

        crossFade.resume();
        expect(!state1.isPaused && state1.isPlaying).toBe(true);
        expect(!state2.isPaused && state2.isPlaying).toBe(true);

        crossFade.clear();
        expect(!state1.isPaused && !state1.isPlaying).toBe(true);
        expect(!state2.isPaused && !state2.isPlaying).toBe(true);
        expect(state1.weight).toBeCloseTo(1.0);
        expect(state2.weight).toBeCloseTo(1.0);
    });

    test('Bugfix cocos/3d-tasks#11781 Whenever cross fade releasing a state, its weight is restored to 1.0', () => {
        const crossFade = new CrossFade();
        const clipFoo = new AnimationClip();
        clipFoo.duration = 0.5;
        const clipBar = new AnimationClip();
        clipBar.duration = 0.4;
        const foo = new AnimationState(clipFoo, 'foo');
        foo.weight = 0.64;
        const fooInitialWeight = foo.weight;
        const bar = new AnimationState(clipBar, 'bar');
        bar.weight = 0.37;
        const barInitialWeight = bar.weight;

        crossFade.crossFade(foo, 0.3);
        expect(foo.weight).toBeCloseTo(fooInitialWeight);
        expect(bar.weight).toBeCloseTo(barInitialWeight);
        crossFade.update(0.1);
        expect(foo.weight).toBeCloseTo(1.0);
        expect(bar.weight).toBeCloseTo(barInitialWeight);

        crossFade.crossFade(bar, 0.3);
        crossFade.update(0.1);
        expect(foo.weight).toBeCloseTo(0.2 / 0.3);
        expect(bar.weight).toBeCloseTo(0.1 / 0.3);
        crossFade.update(0.31);
        expect(foo.weight).toBeCloseTo(1.0);
        expect(!foo.isPaused && !foo.isPlaying);
        expect(bar.weight).toBeCloseTo(1.0);

        crossFade.crossFade(foo, 0.0);
        crossFade.update(0.1);
        expect(foo.weight).toBeCloseTo(1.0);
        expect(bar.weight).toBeCloseTo(1.0);
        expect(!bar.isPaused && !bar.isPlaying);
    });
});