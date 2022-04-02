import { AnimationState } from '../../cocos/core/animation';
import { AnimationClip } from '../../cocos/core/animation/animation-clip';
import { Animation } from '../../cocos/core/animation/animation-component';
import { Node } from '../../cocos/core/scene-graph';

describe('Animation Component', () => {
    describe('Sync default clip into clips array(clip equivalence)', () => {
        test('Clips are keyed by non-empty UUID', () => {
            const component = new Animation();

            const clipFoo = new AnimationClip('foo');
            clipFoo._uuid = 'uuid';
            component.defaultClip = clipFoo;
            expect(component.clips).toHaveLength(1);
            expect(component.clips[0]).toBe(clipFoo);

            const anotherClipFoo = new AnimationClip();
            anotherClipFoo._uuid = 'uuid';
            component.defaultClip = anotherClipFoo;
            expect(component.clips).toHaveLength(1);
            expect(component.clips[0]).toBe(clipFoo);
        });

        test('Especially, clips are not keyed by their name', () => {
            const component = new Animation();

            const clipFoo = new AnimationClip('foo');
            component.defaultClip = clipFoo;
            expect(component.clips).toHaveLength(1);
            expect(component.clips[0]).toBe(clipFoo);

            const anotherClipFoo = new AnimationClip('foo');
            component.defaultClip = anotherClipFoo;
            expect(component.clips).toHaveLength(2);
            expect(component.clips[0]).toBe(clipFoo);
            expect(component.clips[1]).toBe(anotherClipFoo);
        });

        test('Animation updating', () => {
            const component = new Animation();
            const clip1 = new AnimationClip('foo');
            clip1.duration = 1.2;
            const clip2 = new AnimationClip('bar');
            clip1.duration = 1.3;
            component.clips = [clip1, clip2];
            const state1 = component.getState(clip1.name);
            const state2 = component.getState(clip2.name);

            component.play(clip1.name);
            scheduleUpdate(component, 0.999);
            expect(state1.time).toBeCloseTo(0.0); // The "perfect first frame"
            expect(state2.time).toBeCloseTo(0.0);

            scheduleUpdate(component, 0.2);
            expect(state1.time).toBeCloseTo(0.2);
            expect(state2.time).toBeCloseTo(0.0);
            scheduleUpdate(component, 0.1);
            expect(state1.time).toBeCloseTo(0.3);
            expect(state2.time).toBeCloseTo(0.0);

            component.play(clip2.name);
            scheduleUpdate(component, 3.1415);
            expect(state1.time).toBeCloseTo(0.3); // Not changed even stop
            expect(state2.time).toBeCloseTo(0.0); // The "perfect first frame"

            scheduleUpdate(component, 0.4);
            expect(state1.time).toBeCloseTo(0.3);
            expect(state2.time).toBeCloseTo(0.4);

            component.play(clip1.name);
            scheduleUpdate(component, 0.125);
            expect(state1.time).toBeCloseTo(0.0); // Recover from stop, and the "perfect first frame"

            scheduleUpdate(component, 0.126);
            expect(state1.time).toBeCloseTo(0.126);
        });

        test('Bugfix cocos/3d-tasks#11738 Destroying passive playing animation state', () => {
            const clip = new AnimationClip();
            const state = new AnimationState(clip);
            state.initialize(
                new Node(),
                undefined, // blend buffer
                undefined, // mask
                true, // passive
            );
            state.play();
            state.destroy();
        })
    });
});

function scheduleUpdate(component: Animation, deltaTime: number) {
    // @ts-expect-error HACK
    const update = component._onAnimationSystemUpdate;
    update.call(component, deltaTime);
}
