import { Color, js, lerp, Quat, Rect, Size, Vec2, Vec3, Vec4 } from '../../cocos/core';
import { AnimationClip, AnimationState, AnimationManager } from '../../cocos/animation';
import { AnimationController, ColorTrack, ComponentPath, HierarchyPath, IValueProxyFactory, RealTrack, SizeTrack, Track, VectorTrack } from '../../cocos/animation/animation';
import { ccclass } from 'cc.decorator';
import { captureErrorIDs, captureWarnIDs } from '../utils/log-capture';
import { Node,Component } from '../../cocos/scene-graph';
import { LegacyBlendStateBuffer } from '../../cocos/3d/skeletal-animation/skeletal-animation-blending';
import { AnimationGraph } from '../../cocos/animation/marionette/animation-graph';
import { ClipMotion } from '../../cocos/animation/marionette/motion';
import { AnimationGraphEvalMock } from './new-gen-anim/utils/eval-mock';

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

describe('Custom track setter', () => {
    class Target {
        public setValue(value: Target['_value']) { Vec3.copy(this._value, value); }
        public getValue() { return this._value; }
        private _value = { x: 0, y: 0, z: 0 };
    }

    const valueProxyWithOnlySet: IValueProxyFactory = {
        forTarget: (target: Target) => {
            return {
                set: (value: Target['_value']) => { target.setValue(value) },
            };
        },
    };

    const valueProxyWithGetSet: IValueProxyFactory = {
        forTarget: (target: Target) => {
            return {
                set: (value: Target['_value']) => { target.setValue(value) },
                get: () => target.getValue(),
            };
        },
    };

    test('get() got not called if non of channels is empty', () => {
        const target = new Target();
        const mockGetValue = target.getValue = jest.fn(target.getValue);
        const mockSetValue = target.setValue = jest.fn(target.setValue);
    
        const track = new VectorTrack();
        track.proxy = valueProxyWithGetSet;
        track.channels().forEach(({ curve }) => {
            curve.assignSorted([[0.0, ({ value: 0.0 })]]);
        });

        const clip = new AnimationClip();
        clip.addTrack(track);
        const clipEval = clip.createEvaluator({
            target,
        });
        clipEval.evaluate(0.0);
        expect(mockGetValue).not.toBeCalled();
        expect(mockSetValue).toBeCalled();
    });

    test('If get() is not defined, the default channel value would be used', () => {
        const target = new Target();
        const mockSetValue = target.setValue = jest.fn(target.setValue);
    
        const track = new VectorTrack();
        track.proxy = valueProxyWithOnlySet;
        track.channels().forEach(({ curve }) => {
            curve.assignSorted([[0.0, ({ value: 2.0 })]]);
        });
        const clip = new AnimationClip();
        clip.addTrack(track);
        const clipEval = clip.createEvaluator({
            target,
        });
        clipEval.evaluate(0.0);
        expect(mockSetValue).toBeCalled();
    });
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

test('Warn on track binding failure', () => {
    const clip = new AnimationClip();
    clip.name = 'AnyClip';
    const track = new RealTrack();
    track.path.toHierarchy('meow');
    // Ensure the track is not empty otherwise its instantiation will be skipped.
    track.channel.curve.assignSorted([0.0], [1.0]);
    clip.addTrack(track);
    const node = new Node('AnyRoot');

    const warnIDWatcher = captureWarnIDs();
    const errorIDWatcher = captureErrorIDs(); // To silence the hierarchy binding error which we don't care.
    void clip.createEvaluator({
        target: node,
    });
    expect(errorIDWatcher.captured.length).toBe(1); // No further verification -- it doesn't concern.
    errorIDWatcher.stop();
    expect(warnIDWatcher.captured.length).toBeGreaterThan(0);
    const [lastId, ...lastArgs] = warnIDWatcher.captured[warnIDWatcher.captured.length - 1];
    expect(lastId).toBe(3937);
    expect(lastArgs).toStrictEqual([
        clip.name,
        node.name,
    ]);
    warnIDWatcher.stop();
});

describe(`Component-wise animation`, () => {
    /**
     * This test the component-wise animation capability of animation clips.
     * Both traditional environment(animation state) and marionette environment(animation graph) are tested.
     * 
     * Our test goal includes `Vec2`, `Vec3`, `Vec4`, `Color`, `Size` objects.
     * For animation graph environment, we only tested `Vec3` since animation graph only interests on `Vec3`.
     * Other types of track have no such component-wise animation capabilities.
     */
    const _note = undefined;

    const newVecXTrack = (x: 2 | 3 | 4) => { const track = new VectorTrack(); track.componentsCount = x; return track; };

    /** The specs for each value type. See `Spec` for description. */
    const SPECS = [
        { // vec2
            constructor: Vec2,
            defaultKeys: [['x', 0]] as const,
            animatedKeys: [['y', 1]] as const,
            createTrack: () => newVecXTrack(2),
        } as Spec<Vec2>,
        { // vec3
            constructor: Vec3,
            defaultKeys: [['y', 1]] as const,
            animatedKeys: [['x', 0], ['z', 2]] as const,
            createTrack: () => newVecXTrack(3),
        } as Spec<Vec3>,
        { // vec4
            constructor: Vec4,
            defaultKeys: [['y', 1], ['z', 2]] as const,
            animatedKeys: [['x', 0], ['w', 3]] as const,
            createTrack: () => newVecXTrack(4),
        } as Spec<Vec4>,
        { // color
            constructor: Color,
            range: [0, 255],
            defaultKeys: [['g', 1], ['b', 2]] as const,
            animatedKeys: [['r', 0], ['a', 3]] as const,
            createTrack: () => new ColorTrack(),
        } as Spec<Color>,
        { // size
            constructor: Size,
            defaultKeys: [['height', 1]] as const,
            animatedKeys: [['width', 0]] as const,
            createTrack: () => new SizeTrack()
        } as Spec<Size>,
    ];

    test(`Traditional`, () => {
        check(evaluateClipSingleFrameTraditional, SPECS);
    });

    test(`Animation graph`, () => {
        // For animation graph we only check vec3 since currently we don't want to support other type of value types.
        check(
            evaluateClipSingleFrameMarionette,
            SPECS.filter((spec) => spec.constructor === Vec3),
        );
    });

    function check(evaluate: EvaluateClipSingleFrame, specs: typeof SPECS) {
        const node = new Node();
        
        @ccclass('DummyComponent')
        class DummyComponent extends Component { }
        const component = node.addComponent(DummyComponent);

        const clip = new AnimationClip();
        clip.duration = 1.0;

        const TIME = 0.2;

        // Generate test data.
        const expects = specs.map(({ constructor, defaultKeys, animatedKeys, range, createTrack }) => {
            /** Generates a fixed value at [tMin, tMax) according to array index and array length. */
            const gen = (keyIndex: number, keyCount: number, tMin: number, tMax: number) => {
                const t = tMin + (tMax - tMin) * (keyIndex / keyCount);
                return range ? lerp(range[0], range[1], t) : t;
            };

            // Generate default value for each key at [0.1, 0.5).
            const defaultValue = new constructor();
            const defaultProperties: Record<string, number> = {};
            [...defaultKeys, ...animatedKeys].sort().forEach(([propertyKey, _], keyIndex, keys) => {
                const propertyValue = gen(keyIndex, keys.length, 0.1, 0.5);
                defaultValue[propertyKey] = propertyValue;
                defaultProperties[propertyKey] = defaultValue[propertyKey]; // Don't use `= propertyValue` here since for example, color matters
            });

            // Register the value to the dummy component so animation system can animate it.
            if (constructor === Vec3) { // Specially handle `Vec3`
                node.position = (defaultValue as Vec3).clone();
            } else {
                Object.defineProperty(component, constructor.name, { value: defaultValue.clone(), writable: true });
            }

            // Create the track and generate some animation values at [0.5, 1.0) for animated keys.
            const track = createTrack();
            if (constructor === Vec3) {
                track.path.toProperty('position');
            } else {
                track.path.toComponent(DummyComponent).toProperty(constructor.name);
            }
            const expectedAnimatedProperties: Record<string, number> = {};
            [...animatedKeys].forEach(([propertyKey, channelIndex], keyIndex, keys) => {
                const propertyAnimationValue = gen(keyIndex, keys.length, 0.5, 1.0);
                [...track.channels()][channelIndex].curve.addKeyFrame(0.0, propertyAnimationValue);
                const o = new constructor();
                o[propertyKey] = propertyAnimationValue;
                expectedAnimatedProperties[propertyKey] = o[propertyKey];
            });
            clip.addTrack(track);

            return {
                specName: constructor.name, // To showup in snapshot
                defaultProperties,
                expectedAnimatedProperties,
            };
        });

        // Let's inline the expectation so we can check manually 👀.
        expect(expects).toMatchSnapshot();

        // Evaluate.
        evaluate(clip, node, TIME);

        // Check test data.
        specs.forEach(({ constructor, defaultKeys, animatedKeys }, specIndex) => {
            const {
                defaultProperties,
                expectedAnimatedProperties,
            } = expects[specIndex];
            const object = constructor === Vec3
                ? node.position
                : component[constructor.name];
            // These properties should keep default.
            for (const [propertyKey] of defaultKeys) {
                expect(object[propertyKey]).toBe(defaultProperties[propertyKey]);
            }
            // These properties should be animated.
            for (const [propertyKey] of animatedKeys) {
                expect(object[propertyKey]).toBeCloseTo(expectedAnimatedProperties[propertyKey]);
            }
        });

        js.unregisterClass(DummyComponent);
    }

    type PropertyKeyAndChannelIndex<T> = [
        /** The property key we're going to observe. */
        propertyKey: keyof T,

        /** The corresponding channel index in created track. */
        channelIndex: number,
    ];

    /** Describes a spec to test "component-wise animation". */
    interface Spec<T extends { clone(): T }> {
        /** The value's constructor. */
        constructor: new () => T;

        /** These keys of the value will be checked to remain default. */
        defaultKeys: readonly Readonly<PropertyKeyAndChannelIndex<T>>[];

        /** These keys of the value will be checked to be corresponding animation values. */
        animatedKeys: readonly Readonly<PropertyKeyAndChannelIndex<T>>[];

        /** Creates a track which yields such a value. */
        createTrack: () => Track;

        /** By default, the test routine generates values at (0, 1). Use this field to map the value into specified range. */
        range?: [min: number, max:number];
    }
});

type EvaluateClipSingleFrame = (clip: AnimationClip, node: Node, time: number) => void;

function evaluateClipSingleFrameTraditional(clip: AnimationClip, node: Node, time: number) {
    const blendStateBuffer = new LegacyBlendStateBuffer();
    const animationState = new AnimationState(clip);
    animationState.initialize(node, blendStateBuffer);
    animationState.time = time;
    animationState.sample();
}

function evaluateClipSingleFrameMarionette (clip: AnimationClip, node: Node, time: number) {
    const animationGraph = new AnimationGraph();
    const layer = animationGraph.addLayer();
    const motion = layer.stateMachine.addMotion();
    const clipMotion = motion.motion = new ClipMotion();
    clipMotion.clip = clip;
    layer.stateMachine.connect(layer.stateMachine.entryState, motion);
    const graphEval = new AnimationGraphEvalMock(node, animationGraph);
    graphEval.step(time);
}