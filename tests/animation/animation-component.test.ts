import { AnimationClip } from '../../cocos/animation/animation-clip';
import { Animation } from '../../cocos/animation/animation-component';
import { Node } from '../../cocos/scene-graph';

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

    test(`Bugfix cocos/cocos-engine#14352`, () => {
        const node = new Node();
        const component = node.addComponent(Animation) as Animation;

        const clip1 = new AnimationClip('clip1');
        const clip2 = new AnimationClip('clip2');

        component.addClip(clip1);
        expect(component.clips).toStrictEqual(expect.arrayContaining([
            clip1,
        ]));
        expect(component.getState('clip1')).toStrictEqual(expect.objectContaining({
            name: 'clip1',
            clip: clip1,
        }));

        component.addClip(clip2);
        expect(component.clips).toStrictEqual(expect.arrayContaining([
            clip1,
            clip2,
        ]));
        expect(component.getState('clip2')).toStrictEqual(expect.objectContaining({
            name: 'clip2',
            clip: clip2,
        }));
    });
});