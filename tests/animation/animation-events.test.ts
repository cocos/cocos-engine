import { Node, AnimationComponent, director, AnimationClip, math } from '../../cocos/core';


test('Animation events(general)', () => {

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

    expect(initialStates.every((state) => !state.allowLastFrameEvent)).toBeTruthy();

    animationComponent.on(AnimationComponent.EventType.LASTFRAME, handler1);
    // After subscribe the last-frame event, all states should have `allowLastFrameEvent` set to `true`.
    expect(initialStates.every((state) => state.allowLastFrameEvent)).toBeTruthy();

    animationComponent.on(AnimationComponent.EventType.LASTFRAME, handler2);
    // Should no problem.
    expect(initialStates.every((state) => state.allowLastFrameEvent)).toBeTruthy();

    animationComponent.off(AnimationComponent.EventType.LASTFRAME, handler2);
    // Now we unsubscribe one, but this should still true.
    expect(initialStates.every((state) => state.allowLastFrameEvent)).toBeTruthy();

    animationComponent.off(AnimationComponent.EventType.LASTFRAME, handler1);
    // All states should have `allowLastFrameEvent` set to `false`
    // if no any subscribe on 'last-frame' event.
    expect(initialStates.every((state) => !state.allowLastFrameEvent)).toBeTruthy();

    animationComponent.on(AnimationComponent.EventType.LASTFRAME, handler1);
    // The newly added state should automatically have `allowLastFrameEvent` set to `true`.
    const newState = animationComponent.createState(createTestClip('clip-new'));
    // The newly added state should also have `allowLastFrameEvent` set to `true`.
    expect(newState.allowLastFrameEvent).toBeTruthy();
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