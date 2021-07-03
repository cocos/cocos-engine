import { AnimationClip } from '../../cocos/core';
import { Animation } from '../../cocos/core/animation/animation-component';

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
    });
});