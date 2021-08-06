import { AnimationClip, AnimationState, Node } from '../../cocos/core';
import { CrossFade } from '../../cocos/core/animation/cross-fade';
import { Playable } from '../../cocos/core/animation/playable';
import { assertIsTrue } from '../../cocos/core/data/utils/asserts';
import { remove } from '../../cocos/core/utils/array';

type CrossFadeScheduler = NonNullable<ConstructorParameters<typeof CrossFade>[0]>;

class Scheduler implements NonNullable<CrossFadeScheduler> {
    public addCrossFade(crossFade: CrossFade): void {
        this._crossFades.push(crossFade);
    }

    public removeCrossFade(crossFade: CrossFade): void {
        remove(this._crossFades, crossFade);
    }

    public update (deltaTime = 1.0 / 30.0) {
        for (const crossFade of this._crossFades) {
            crossFade.update(deltaTime);
        }
    }

    private _crossFades: CrossFade[] = [];
}

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
        const scheduler = new Scheduler();
        const crossFade = new CrossFade(scheduler);
        crossFade.play();
        crossFade.crossFade(state, 0.3);
        scheduler.update(0.1);
        expect(state.weight).toBeCloseTo(1.0);
    });

    test('Simple Fading', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        
        const scheduler = new Scheduler();
        const crossFade = new CrossFade(scheduler);
        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.3);

        scheduler.update(0.1);
        expect(state1.weight).toBeCloseTo(1.0);
        expect(state2.weight).toBeCloseTo(1.0);

        crossFade.play();

        scheduler.update(0.1);
        expect(state1.weight).toBeCloseTo(0.2 / 0.3);
        expect(state2.weight).toBeCloseTo(0.1 / 0.3);
    });

    test('New fading before previous fadings got finished', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        const state3 = createDummyState();

        const scheduler = new Scheduler();
        const crossFade = new CrossFade(scheduler);
        crossFade.play();

        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.7);
        scheduler.update(0.2);

        crossFade.crossFade(state3, 0.5);
        scheduler.update(0.1);

        expect(state3.weight).toBeCloseTo(0.1 / 0.5);
        expect(state2.weight).toBeCloseTo((1.0 - 0.1 / 0.5) * ((0.1 + 0.2) / 0.7));
        expect(state1.weight).toBeCloseTo((1.0 - 0.1 / 0.5) * (1.0 - (0.1 + 0.2) / 0.7));
    });

    test('Fading again', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();

        const scheduler = new Scheduler();
        const crossFade = new CrossFade(scheduler);
        crossFade.play();
        
        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.7);
        scheduler.update(0.2);

        crossFade.crossFade(state1, 0.5);
        scheduler.update(0.1);

        expect(state2.weight).toBeCloseTo((1.0 - 0.1 / 0.5) * ((0.1 + 0.2) / 0.7));
        expect(state1.weight).toBeCloseTo(
            0.1 / 0.5 + // New fading weight
            (1.0 - 0.1 / 0.5) * (1.0 - (0.1 + 0.2) / 0.7)
        );
    });

    test('State playback management', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        const scheduler = new Scheduler();
        const crossFade = new CrossFade(scheduler);

        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.3);
        crossFade.play();
        expect(!state1.isPaused && state1.isPlaying).toBe(true);
        expect(!state2.isPaused && state2.isPlaying).toBe(true);

        crossFade.pause();
        expect(state1.isPaused && state1.isPlaying).toBe(true);
        expect(state2.isPaused && state2.isPlaying).toBe(true);

        crossFade.resume();
        expect(!state1.isPaused && state1.isPlaying).toBe(true);
        expect(!state2.isPaused && state2.isPlaying).toBe(true);

        crossFade.stop();
        expect(!state1.isPaused && !state1.isPlaying).toBe(true);
        expect(!state2.isPaused && !state2.isPlaying).toBe(true);
    });

    test('Self-driven(internal test)', () => {
        const state1 = createDummyState();
        const state2 = createDummyState();
        const scheduler = new Scheduler();

        const crossFade = new CrossFade(scheduler);
        crossFade.play();

        const crossFadeUpdateMock = jest.spyOn(crossFade, 'update');

        const resetAsInitialState = (state: AnimationState) => {
            crossFade.crossFade(state1, 0.0);
            scheduler.update(0.0);
            crossFadeUpdateMock.mockClear();
        };

        resetAsInitialState(state1);
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(0);

        crossFade.crossFade(state2, 0.3);
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(1);
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(2);
        scheduler.update(0.3);
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(3);
        // And then, self-unscheduled
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(3);
        crossFadeUpdateMock.mockReset();

        // A new cross fade call re-schedule itself
        crossFade.crossFade(state1, 0.1);
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(1);
        crossFade.clear();
        crossFadeUpdateMock.mockReset();

        // Paused? Won't do any work
        crossFade.crossFade(state1, 0.0);
        crossFade.crossFade(state2, 0.2);
        crossFade.pause();
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(0);

        // Let's resume it
        crossFade.resume();
        scheduler.update();
        expect(crossFadeUpdateMock).toHaveBeenCalledTimes(1);
    });
});