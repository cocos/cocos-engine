import { js, Node, Component, Vec3 } from '../../cocos/core';
import { AnimationClip, AnimationState, AnimationManager } from '../../cocos/core/animation';
import { ComponentPath, HierarchyPath } from '../../cocos/core/animation/animation';
import { ccclass } from 'cc.decorator';

test('Common target', () => {
    @ccclass('TestComponent')
    class TestComponent extends Component {
        get value () {
            return this.c;
        }

        set value (value: Vec3) {
            Vec3.copy(this.c, value);
        }

        public c: Vec3 = new Vec3(0, -1, 0);
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
    
    const expects: Record<number, Vec3> = {
        0: new Vec3(0, -1, 0),
        1: new Vec3(0.5, -1, 0.5),
        2: new Vec3(1, -1, 1),
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

test('Common targets that modify eulerAngles', () => {
    const animationManager = new AnimationManager();
    const mockInstance = jest.spyOn((global as any).cc.director, 'getAnimationManager').mockImplementation(() => {
        return animationManager;
    });

    const partialNodeName = 'partial';

    const clip = new AnimationClip('default');
    clip.duration = 2.0;
    const keys = [0, 0.1, 0.2];
    const eulerValues = [new Vec3(), new Vec3(1), new Vec3(2)];
    const eulerXValues = [0, 1, 2];
    clip.keys = [keys];
    clip.commonTargets = [{
        modifiers: [new HierarchyPath(partialNodeName), 'eulerAngles'],
    }];
    clip.curves = [{
        modifiers: ['eulerAngles'],
        data: {keys: 0, values: eulerValues},
    }, {
        commonTarget: 0, // euler angles
        modifiers: ['x'],
        data: {keys: 0, values: eulerXValues},
    }];

    const state = new AnimationState(clip, clip.name);
    state.weight = 1.0;
    
    const node = new Node();
    const partialNode = new Node(partialNodeName);
    node.addChild(partialNode);
    state.initialize(node);

    animationManager.update(0);
    state.play();
    state.pause();

    state.setTime(keys[1]);
    state.update(0);
    animationManager.update(0);
    
    expect(node.eulerAngles).toEqual(eulerValues[1]);
    expect(partialNode.eulerAngles.x).toEqual(eulerXValues[1]);

    mockInstance.mockRestore();
});

test('animation state', () => {
    const animationManager = new AnimationManager();
    const mockInstance = jest.spyOn((global as any).cc.director, 'getAnimationManager').mockImplementation(() => {
        return animationManager;
    });

    const clip = new AnimationClip('default');
    clip.duration = 2.0;
    const keys = [
        0,
        0.1,
        0.2,
    ];
    const values = [
        new Vec3(),
        new Vec3(1),
        new Vec3(2),
    ];
    clip.keys = [keys];
    clip.curves = [{
        modifiers: [
            'position',
        ],
        data: {
            keys: 0,
            values,
        },
    }];

    const state = new AnimationState(clip, clip.name);
    state.weight = 1.0;
    
    const node = new Node();
    state.initialize(node);

    animationManager.update(0);
    state.play();
    state.pause();

    state.setTime(keys[1]);
    state.update(0);
    animationManager.update(0);
    expect(node.getPosition()).toEqual(values[1]);

    mockInstance.mockRestore();
});

test('default animation clip validation', () => {
    const validClip = new AnimationClip('valid');
    expect(validClip.validate()).toEqual(true);
});
