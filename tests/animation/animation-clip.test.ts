import { AnimationClip, js, AnimationState, Node, Component } from '../../cocos/core';
import { ComponentPath } from '../../cocos/core/animation/animation';
import { ccclass } from '../../cocos/core/data/class-decorator';

test('Common target', () => {
    interface X {
        x: number;
        y: number;
        z: number;
    }

    @ccclass('TestComponent')
    class TestComponent extends Component {
        set value (value: X) {
            this.c = Object.assign({}, value);
        }

        public c: X = {
            x: 0,
            y: 0,
            z: 0,
        };
    }

    const node = new Node();

    const testComponent = node.addComponent(TestComponent);
    const animationClip = new AnimationClip();
    animationClip.wrapMode = AnimationClip.WrapMode.Loop;
    animationClip.duration = 2;
    animationClip.keys = [
        [0, 1, 2],
    ];
    animationClip.commonTargets = [{
        modifiers: [
            new ComponentPath(js.getClassName(TestComponent)),
            'value',
        ],
        initialValue: {
            x: -1,
            y: -1,
            z: -1,
        },
    }];
    animationClip.curves = [
        {
            commonTarget: 0,
            modifiers: [ 'x' ],
            data: {
                keys: 0,
                values: [ 0, 0.5, 1 ],
            }
        },
        {
            commonTarget: 0,
            modifiers: [ 'z' ],
            data: {
                keys: 0,
                values: [ 0, 0.5, 1 ],
            }
        },
    ];
    
    const expects: Record<number, X> = {
        0: { x: 0, y: -1, z: 0 },
        1: { x: 0.5, y: -1, z: 0.5 },
        2: { x: 1, y: -1, z: 1 },
    };

    const animationState = new AnimationState(animationClip);
    animationState.initialize(node);
    for (const time of Object.keys(expects)) {
        const c = expects[time];
        animationState.setTime(parseInt(time));
        animationState.sample();
        expect(testComponent.c).toEqual(c);
    }
});
