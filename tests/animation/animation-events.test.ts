import { math } from '../../cocos/core';
import { Animation, AnimationState, AnimationClip } from '../../cocos/animation';
import { Node } from "../../cocos/scene-graph";

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
    const animation = node.addComponent(Animation);
    animation.defaultClip = clip;
    const state = animation.getState(clip.name);

    const testMagic = (() => {
        const bitMaskMap: Record<Animation.EventType, number> = {
            [Animation.EventType.PLAY]: 1 << 1,
            [Animation.EventType.RESUME]: 1 << 2,
            [Animation.EventType.PAUSE]: 1 << 3,
            [Animation.EventType.STOP]: 1 << 4,
            [Animation.EventType.LASTFRAME]: 1 << 5,
            [Animation.EventType.FINISHED]: 1 << 6,
        };
        let actual = 0;
        return {
            makeMockFunction(eventType: Animation.EventType) {
                const mask = bitMaskMap[eventType];
                return jest.fn(() => {
                    actual |= mask;
                });
            },

            clear() {
                actual = 0;
            },

            expectAndClear(eventTypes: Animation.EventType | Animation.EventType[]) {
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
        Animation.EventType.PLAY,
        Animation.EventType.RESUME,
        Animation.EventType.PAUSE,
        Animation.EventType.STOP,
        Animation.EventType.LASTFRAME,
        Animation.EventType.FINISHED,
    ].forEach((eventType) => {
        animation.on(eventType, testMagic.makeMockFunction(eventType));
    });

    animation.play();
    testMagic.expectAndClear(Animation.EventType.PLAY);

    animation.pause();
    testMagic.expectAndClear(Animation.EventType.PAUSE);

    animation.resume();
    testMagic.expectAndClear(Animation.EventType.RESUME);

    animation.stop();
    testMagic.expectAndClear(Animation.EventType.STOP);

    // Naturally end-of-life should trigger finished event
    // and stopped.
    animation.play();
    state.update(0);
    testMagic.clear();
    state.update(clip.duration);
    testMagic.expectAndClear([
        Animation.EventType.FINISHED,
        Animation.EventType.STOP,
    ]);

    // But in loop mode they won't be triggered.
    // Instead, the last frame event should be triggered.
    state.wrapMode = AnimationClip.WrapMode.Loop;
    animation.play();
    state.update(0);
    state.update(clip.duration / 2);
    testMagic.clear();
    state.update(clip.duration / 2 + clip.duration / 4);
    testMagic.expectAndClear(Animation.EventType.LASTFRAME);

    mockInstance.mockRestore();
});

test('Animation event(last-frame event optimization)', () => {
    const animation = createTestAnimation();

    const clip0 = createTestClip('clip0');
    const clip1 = createTestClip('clip1');
    const initialClips = [ clip0, clip1 ];
    const defaultClip = initialClips[0];
    animation.clips = initialClips;
    animation.defaultClip = defaultClip;
    const initialStates = [clip0, clip0].map((clip) => animation.getState(clip.name));

    const handler1 = () => {};
    const handler2 = () => {};

    const isLastFrameEventAllowed = (state: AnimationState) => (state as any)['_allowLastFrame'];

    expect(initialStates.every(state => !isLastFrameEventAllowed(state))).toBeTruthy();

    animation.on(Animation.EventType.LASTFRAME, handler1);
    // After subscribe the last-frame event, all states should have `allowLastFrameEvent` set to `true`.
    expect(initialStates.every(isLastFrameEventAllowed)).toBeTruthy();

    animation.on(Animation.EventType.LASTFRAME, handler2);
    // Should no problem.
    expect(initialStates.every(isLastFrameEventAllowed)).toBeTruthy();

    animation.off(Animation.EventType.LASTFRAME, handler2);
    // Now we unsubscribe one, but this should still true.
    expect(initialStates.every(isLastFrameEventAllowed)).toBeTruthy();

    animation.off(Animation.EventType.LASTFRAME, handler1);
    // All states should have `allowLastFrameEvent` set to `false`
    // if no any subscribe on 'last-frame' event.
    expect(initialStates.every(state => !isLastFrameEventAllowed(state))).toBeTruthy();

    animation.on(Animation.EventType.LASTFRAME, handler1);
    // The newly added state should automatically have `allowLastFrameEvent` set to `true`.
    const newState = animation.createState(createTestClip('clip-new'));
    // The newly added state should also have `allowLastFrameEvent` set to `true`.
    expect(isLastFrameEventAllowed(newState)).toBeTruthy();
});

function createTestAnimation() {
    const node = new Node();
    const animation = node.addComponent(Animation);
    return animation;
}

function createTestClip(name: string, duration: number = math.randomRange(0, 1)) {
    const clip = new AnimationClip();
    clip.name = name;
    clip.duration = 0;
    return clip;
}