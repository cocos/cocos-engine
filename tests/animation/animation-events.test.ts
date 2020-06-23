import { Node, AnimationComponent, director, AnimationClip, math, AnimationState } from '../../cocos/core';

test('Animation events(general)', () => {
    const mockInstance = jest.spyOn((global as any).cc.director, 'getAnimationManager').mockImplementation(() => {
        return {
            addAnimation: () => { },
            removeAnimation: () => { },
            addCrossFade: () => { },
            removeCrossFade: () => { },
            pushDelayEvent: (fn: Function, thisArg: any, args: any[]) => {
                fn.apply(thisArg, args);
            },
        };
    });

    const clip = new AnimationClip('default');
    clip.duration = 2.0;
    const node = new Node();
    const animationComponent = node.addComponent(AnimationComponent);
    animationComponent.defaultClip = clip;
    const state = animationComponent.getState(clip.name);

    const testMagic = (() => {
        const bitMaskMap: Record<AnimationComponent.EventType, number> = {
            [AnimationComponent.EventType.PLAY]: 1 << 1,
            [AnimationComponent.EventType.RESUME]: 1 << 2,
            [AnimationComponent.EventType.PAUSE]: 1 << 3,
            [AnimationComponent.EventType.STOP]: 1 << 4,
            [AnimationComponent.EventType.LASTFRAME]: 1 << 5,
            [AnimationComponent.EventType.FINISHED]: 1 << 6,
        };
        let actual = 0;
        return {
            makeMockFunction(eventType: AnimationComponent.EventType) {
                const mask = bitMaskMap[eventType];
                return jest.fn(() => {
                    actual |= mask;
                });
            },

            clear() {
                actual = 0;
            },

            expectAndClear(eventTypes: AnimationComponent.EventType | AnimationComponent.EventType[]) {
                let expected = 0;
                if (Array.isArray(eventTypes)) {
                    for (const eventType of eventTypes) {
                        expected |= bitMaskMap[eventType];
                    }
                } else {
                    expected |= bitMaskMap[eventTypes]
                }
                expect(expected === actual).toBeTruthy();
                this.clear();
            },
        };
    })();

    [
        AnimationComponent.EventType.PLAY,
        AnimationComponent.EventType.RESUME,
        AnimationComponent.EventType.PAUSE,
        AnimationComponent.EventType.STOP,
        AnimationComponent.EventType.LASTFRAME,
        AnimationComponent.EventType.FINISHED,
    ].forEach((eventType) => {
        animationComponent.on(eventType, testMagic.makeMockFunction(eventType));
    });

    animationComponent.play();
    testMagic.expectAndClear(AnimationComponent.EventType.PLAY);

    animationComponent.pause();
    testMagic.expectAndClear(AnimationComponent.EventType.PAUSE);

    animationComponent.resume();
    testMagic.expectAndClear(AnimationComponent.EventType.RESUME);

    animationComponent.stop();
    testMagic.expectAndClear(AnimationComponent.EventType.STOP);

    // Naturally end-of-life should trigger finished event
    // and stopped.
    animationComponent.play();
    state.update(0);
    testMagic.clear();
    state.update(clip.duration);
    testMagic.expectAndClear([
        AnimationComponent.EventType.FINISHED,
        AnimationComponent.EventType.STOP,
    ]);

    // But in loop mode they won't be triggered.
    // Instead, the last frame event should be triggered.
    state.wrapMode = AnimationClip.WrapMode.Loop;
    animationComponent.play();
    state.update(0);
    state.update(clip.duration / 2);
    testMagic.clear();
    state.update(clip.duration / 2 + clip.duration / 4);
    testMagic.expectAndClear(AnimationComponent.EventType.LASTFRAME);

    mockInstance.mockRestore();
});

test('Animation event(last-frame event optimization)', () => {
    const animationComponent = createTestAnimationComponent();

    const clip0 = createTestClip('clip0');
    const clip1 = createTestClip('clip1');
    const initialClips = [ clip0, clip1 ];
    const defaultClip = initialClips[0];
    animationComponent.clips = initialClips;
    animationComponent.defaultClip = defaultClip;
    const initialStates = [clip0, clip0].map((clip) => animationComponent.getState(clip.name));

    const handler1 = () => {};
    const handler2 = () => {};

    const isLastFrameEventAllowed = (state: AnimationState) => (state as any)['_allowLastFrame'];

    expect(initialStates.every(state => !isLastFrameEventAllowed(state))).toBeTruthy();

    animationComponent.on(AnimationComponent.EventType.LASTFRAME, handler1);
    // After subscribe the last-frame event, all states should have `allowLastFrameEvent` set to `true`.
    expect(initialStates.every(isLastFrameEventAllowed)).toBeTruthy();

    animationComponent.on(AnimationComponent.EventType.LASTFRAME, handler2);
    // Should no problem.
    expect(initialStates.every(isLastFrameEventAllowed)).toBeTruthy();

    animationComponent.off(AnimationComponent.EventType.LASTFRAME, handler2);
    // Now we unsubscribe one, but this should still true.
    expect(initialStates.every(isLastFrameEventAllowed)).toBeTruthy();

    animationComponent.off(AnimationComponent.EventType.LASTFRAME, handler1);
    // All states should have `allowLastFrameEvent` set to `false`
    // if no any subscribe on 'last-frame' event.
    expect(initialStates.every(state => !isLastFrameEventAllowed(state))).toBeTruthy();

    animationComponent.on(AnimationComponent.EventType.LASTFRAME, handler1);
    // The newly added state should automatically have `allowLastFrameEvent` set to `true`.
    const newState = animationComponent.createState(createTestClip('clip-new'));
    // The newly added state should also have `allowLastFrameEvent` set to `true`.
    expect(isLastFrameEventAllowed(newState)).toBeTruthy();
});

function createTestAnimationComponent() {
    const node = new Node();
    const animationComponent = node.addComponent(AnimationComponent);
    return animationComponent;
}

function createTestClip(name: string, duration: number = math.randomRange(0, 1)) {
    const clip = new AnimationClip();
    clip.name = name;
    clip.duration = 0;
    return clip;
}