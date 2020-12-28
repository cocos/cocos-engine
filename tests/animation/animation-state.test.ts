

import { Component, Node } from '../../cocos/core';
import { AnimationClip } from '../../cocos/core/animation/animation-clip';
import { AnimationState, EventType } from '../../cocos/core/animation/animation-state';
import { WrapMode } from '../../cocos/core/animation/types';

const partialContextNoUpdates: Pick<AnimationState.Context, 'enqueue' | 'dequeue'> = {
    enqueue: () => {},
    dequeue: () => {},
};

describe('Animation State', () => {
    const animationClip = new AnimationClip();

    const empty1sClip = new AnimationClip();
    empty1sClip.duration = 1.0;

    const precision = 5;

    const createStateWithWrapMode = (wrapMode: WrapMode) => {
        const state = new AnimationState(empty1sClip);
        state.wrapMode = wrapMode;
        return state;
    };

    const createStateWithWrapModeAndDoBaseTest = (wrapMode: WrapMode) => {
        const state = createStateWithWrapMode(wrapMode);
        expect(state.time).toStrictEqual(0); // Initial state
        return state;
    }

    test('Wrap mode: Normal', () => {
        const state = createStateWithWrapModeAndDoBaseTest(WrapMode.Normal);
        state.time = 0.2;
        expect(state.current).toBeCloseTo(0.2, precision);
        state.time = state.clip.duration; // The duration
        expect(state.current).toStrictEqual(state.clip.duration);
        state.time = -0.2; // Negative
        expect(state.current).toBeCloseTo(0.8, precision);
        state.time = 1.1; // Exceeds the duration
        expect(state.current).toBeCloseTo(state.clip.duration, precision);
    });

    test('Wrap mode: Reverse', () => {
        const state = createStateWithWrapModeAndDoBaseTest(WrapMode.Reverse);
        state.time = 0.2;
        expect(state.current).toBeCloseTo(0.8, precision);
        state.time = state.clip.duration; // The duration
        expect(state.current).toStrictEqual(0.0);
        state.time = -0.2; // Negative
        expect(state.current).toBeCloseTo(0.2, precision);
        state.time = 1.1; // Exceeds the duration
        expect(state.current).toBeCloseTo(0, precision);
    });

    test('Wrap mode: Loop', () => {
        const state = createStateWithWrapModeAndDoBaseTest(WrapMode.Loop);
        state.time = 0.2;
        expect(state.current).toBeCloseTo(0.2, precision);
        state.time = state.clip.duration; // The duration
        expect(state.current).toBeCloseTo(state.clip.duration, precision);
        state.time = -0.2; // Negative
        expect(state.current).toBeCloseTo(0.8, precision);
        state.time = 1.1; // Exceeds the duration
        expect(state.current).toBeCloseTo(0.1, precision);
    });

    test('Wrap mode: PingPong', () => {
        const state = createStateWithWrapModeAndDoBaseTest(WrapMode.PingPong);
        state.time = 0.2;
        expect(state.current).toBeCloseTo(0.2, precision);
        state.time = state.clip.duration; // The duration
        expect(state.current).toBeCloseTo(state.clip.duration, precision);
        state.time = -0.2; // Negative
        expect(state.current).toBeCloseTo(0.8, precision);
        state.time = 1.1; // Exceeds the duration
        expect(state.current).toBeCloseTo(0.9, precision);
        state.time = 2.1; // Exceeds the duration(x2)
        expect(state.current).toBeCloseTo(0.1, precision);
    });

    test('Reset time while changing wrap mode', () => {
        const state = new AnimationState(animationClip);
        state.time = 0.5;
        // eslint-disable-next-line no-self-assign
        state.wrapMode = state.wrapMode; // Even if its value is not going to be changed
        expect(state.time).toStrictEqual(0.0);
    });

    test('Wrap mode implies repeat count', () => {
        expect(createStateWithWrapMode(WrapMode.Loop).repeatCount).toEqual(Infinity);
        expect(createStateWithWrapMode(WrapMode.Normal).repeatCount).toEqual(1);
    });

    test('"Perfect first frame"', () => {
        const state = new AnimationState(empty1sClip);
        state.update(99.99);
        expect(state.time).toBeCloseTo(0.0, precision);
    });

    test('Avoid "perfect first frame"', () => {
        const state = new AnimationState(empty1sClip);
        state.sample();
        state.update(99.99);
        expect(state.time).toBeCloseTo(99.99, precision);
    });
});

describe('Animation state frame events', () => {
    const fn = jest.fn((...args: unknown[]) => {});

    const node = new Node();
    node.addComponent(class extends Component { frameEvent(...args: unknown[]) { fn(...args) } });

    const clip = new AnimationClip();
    clip.wrapMode = WrapMode.Loop;
    clip.duration = 1.0;
    clip.events = [
        { frame: 0.2, func: 'frameEvent', params: [0] },
        { frame: 0.3, func: 'frameEvent', params: [1] },
    ];

    const state = new AnimationState({
        ...partialContextNoUpdates,
        emitFrameEvent: (fn, thisArg, args) => {
            fn.apply(thisArg, args);
        },
    }, clip);
    state.initialize(node);

    beforeEach(() => {
        state.time = 0.0;
        skipPerfectFirstFrame(state);
        fn.mockClear();
    });

    test('Triggered during update()', () => {
        state.update(0.2);
        expect(fn).toBeCalledTimes(1);
        expect(fn.mock.calls[0][0]).toBe(0);
    });

    test('Could never been triggered by sample()', () => {
        state.time = 0.3;
        state.sample();
        expect(fn).toBeCalledTimes(0);
    });

    test('Manually set time clear last event trigger position(first perfect frame)', () => {
        state.time = 0.25;
        state.update(0.1);
        expect(fn).toBeCalledTimes(0);
    });

    test('Just hit the marker time', () => {
        state.update(0.2);
        expect(fn).toBeCalledTimes(1);
        expect(fn.mock.calls[0][0]).toBe(0);
        fn.mockClear();

        state.update(0.01);
        expect(fn).toBeCalledTimes(0);
    });

    test('Move time to the marker', () => {
        state.time = 0.2;
        state.sample();
        expect(fn).toBeCalledTimes(0);

        state.update(0.1);
        expect(fn).toBeCalledTimes(1);
        expect(fn.mock.calls[0][0]).toBe(1);
    });

    test('Frame event at ratio 0', () => {
        const clip = new AnimationClip();
        clip.wrapMode = WrapMode.Loop;
        clip.duration = 1.0;
        clip.events = [
            { frame: 0.0, func: 'frameEvent', params: [0] },
        ];

        const state = new AnimationState({
            ...partialContextNoUpdates,
            emitFrameEvent: (fn, thisArg, args) => {
                fn.apply(thisArg, args);
            },
        }, clip);
        state.initialize(node);
        skipPerfectFirstFrame(state);

        expect(fn).toBeCalledTimes(0);

        // TODO:?
        // state.update(0.0);
        // expect(fn).toBeCalledTimes(1);
        // expect(fn.mock.calls[0][0]).toBe(0);
        // fn.mockClear();

        state.time = 0.0;
        state.sample();
        expect(fn).toBeCalledTimes(0);

        state.time = 0.0;
        state.update(0.1);
        expect(fn).toBeCalledTimes(1);
        expect(fn.mock.calls[0][0]).toBe(0);
        fn.mockClear();

        state.update(state.duration);
        expect(fn).toBeCalledTimes(0);
        // expect(fn.mock.calls[0][0]).toBe(0);
    });

    test('Frame event at duration', () => {
        const clip = new AnimationClip();
        clip.wrapMode = WrapMode.Loop;
        clip.duration = 1.0;
        clip.events = [
            { frame: 1.0, func: 'frameEvent', params: [0] },
        ];

        const state = new AnimationState({
            ...partialContextNoUpdates,
            emitFrameEvent: (fn, thisArg, args) => {
                fn.apply(thisArg, args);
            },
        }, clip);
        state.initialize(node);
        skipPerfectFirstFrame(state);

        expect(fn).toBeCalledTimes(0);

        // TODO:?
        state.update(0.0);
        expect(fn).toBeCalledTimes(0);
        fn.mockClear();

        state.time = 0.0;
        skipPerfectFirstFrame(state);
        expect(fn).toBeCalledTimes(0);

        state.update(state.duration);
        expect(fn).toBeCalledTimes(1);
        expect(fn.mock.calls[0][0]).toBe(0);
    });

    test('Dangling time: the duration', () => {
        state.update(state.duration);
        expect(fn).toBeCalledTimes(2);
        expect(fn.mock.calls[0][0]).toBe(0);
        expect(fn.mock.calls[1][0]).toBe(1);
    });

    test('Can be triggered multi times within a single frame', () => {
        state.update(2.25);
        expect(fn).toBeCalledTimes(5);
        expect(fn.mock.calls[0][0]).toBe(0);
        expect(fn.mock.calls[1][0]).toBe(1);
        expect(fn.mock.calls[2][0]).toBe(0);
        expect(fn.mock.calls[3][0]).toBe(1);
        expect(fn.mock.calls[4][0]).toBe(0);
        fn.mockClear();
    });
});

describe('Animation state last frame event', () => {
    const clip = new AnimationClip();
    clip.duration = 1.0;

    test('Last frame event triggered only if repeat count greater than 1', () => {
        const fn = jest.fn((...args: unknown[]) => {});
        const state = new AnimationState({
            ...partialContextNoUpdates,
            emit: fn,
            lastFrameEvent: true,
        }, clip);
        skipPerfectFirstFrame(state);

        state.repeatCount = 1;
        state.update(1.0);
        expect(fn).toBeCalledTimes(1);
        expect(fn.mock.calls[0][0]).toBe(EventType.FINISHED);
        fn.mockClear();

        state.repeatCount = 3;
        state.update(1.0);
        expect(fn).toBeCalledTimes(2);
        expect(fn.mock.calls[0][0]).toBe(EventType.ITERATION_END); // The 1.0
        expect(fn.mock.calls[1][0]).toBe(EventType.ITERATION_END);
        fn.mockClear();

        state.update(1.0);
        expect(fn).toBeCalledTimes(2);
        expect(fn.mock.calls[0][0]).toBe(EventType.ITERATION_END);
        expect(fn.mock.calls[1][0]).toBe(EventType.FINISHED);
    });

    test('Can be triggered multi times within a single frame', () => {
        const fn = jest.fn((...args: unknown[]) => {});
        const state = new AnimationState({
            ...partialContextNoUpdates,
            emit: fn,
            lastFrameEvent: true,
        }, clip);
        skipPerfectFirstFrame(state);

        state.repeatCount = 3;

        state.update(2.0);
        expect(fn).toBeCalledTimes(2);
        expect(fn.mock.calls[0][0]).toBe(EventType.ITERATION_END);
        expect(fn.mock.calls[1][0]).toBe(EventType.ITERATION_END);
    });
});

describe('Animation state event order', () => {
    test('Frame events and last frame events', () => {
        const callSeq: Array<'frame-event' | 'last-frame-event'> = [];
    
        const node = new Node();
        node.addComponent(class extends Component { frameEvent(...args: unknown[]) { callSeq.push('frame-event') } });
    
        const clip = new AnimationClip();
        clip.wrapMode = WrapMode.Loop;
        clip.duration = 1.0;
        clip.events = [
            { frame: 0.2, func: 'frameEvent', params: [] },
        ];
    
        const state = new AnimationState({
            ...partialContextNoUpdates,
            lastFrameEvent: true,
            emitFrameEvent: (fn, thisArg, args) => {
                fn.apply(thisArg, args);
            },
            emit: () => {
                callSeq.push('last-frame-event');
            },
        }, clip);
        state.initialize(node);
        skipPerfectFirstFrame(state);
    
        state.update(2.0);
        expect(callSeq).toStrictEqual([
            'frame-event',
            'last-frame-event',
            'frame-event',
            'last-frame-event',
        ]);
    });
});

/**
 * Skip the "perfect first frame" mechanism.
 * @param state The animation state.
 */
function skipPerfectFirstFrame(state: AnimationState) {
    state.sample();
}
