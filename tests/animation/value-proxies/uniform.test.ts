import { Track, UniformProxyFactory, VectorTrack } from "../../../cocos/animation/animation";
import { AnimationClip } from "../../../cocos/animation/animation-clip";
import { AnimationState } from "../../../cocos/animation/animation-state";
import { Pass } from "../../../cocos/render-scene";
import { Component, Node } from "../../../cocos/scene-graph";
import { director, EffectAsset, js, Material, Vec3 } from "../../../exports/base";
import { captureWarnIDs } from "../../utils/log-capture";

describe(`Error sentences`, () => {
    beforeAll(() => js.setClassName('MaterialHost', MaterialHost));
    afterAll(() => js.unregisterClass(MaterialHost));

    test(`Warn if input target is not a material`, () => {
        const origin = new Node('SomeOrigin');
        const materialHost = origin.addComponent(MaterialHost) as MaterialHost;

        const track = new VectorTrack();
        track.channels()[0].curve.assignSorted([[0.0, 0.0]]);
        track.path.toComponent(MaterialHost);
        track.proxy = new UniformProxyFactory();

        bindThenAssertWarn(origin, track, [3940, materialHost]);
    });

    test(`Warn if recorded pass index is invalid`, () => {
        const origin = new Node('SomeOrigin');
        const materialHost = origin.addComponent(MaterialHost) as MaterialHost;
        const material = materialHost.material = mockMaterial([
            { uniforms: {} },
            { uniforms: {} },
            { uniforms: {} },
        ]);
        material.name = 'SomeMaterial';

        const track = new VectorTrack();
        track.channels()[0].curve.assignSorted([[0.0, 0.0]]);
        track.path.toComponent(MaterialHost).toProperty('material');

        const proxyFactory = track.proxy = new UniformProxyFactory();
        for (const passIndex of [-2, -1, 3, 4]) {
            proxyFactory.passIndex = passIndex;
            bindThenAssertWarn(origin, track, [3941, material.name, proxyFactory.passIndex]);
        }
    });

    test(`Warn if recorded uniform name is in invalid`, () => {
        const origin = new Node('SomeOrigin');
        const materialHost = origin.addComponent(MaterialHost) as MaterialHost;
        const material = materialHost.material = mockMaterial([
            { uniforms: { 'SomeUniform': { availableChannelCount: 3 } } },
            { uniforms: {} },
            { uniforms: {} },
        ]);
        material.name = 'SomeMaterial';

        const track = new VectorTrack();
        track.channels()[0].curve.assignSorted([[0.0, 0.0]]);
        track.path.toComponent(MaterialHost).toProperty('material');
        const proxyFactory = track.proxy = new UniformProxyFactory();
        proxyFactory.passIndex = 1;
        proxyFactory.uniformName = 'SomeUniform';
        proxyFactory.channelIndex = 4;

        bindThenAssertWarn(origin, track, [3942, material.name, proxyFactory.passIndex, proxyFactory.uniformName]);
    });

    test(`Warn if recorded channel index is invalid`, () => {
        const origin = new Node('SomeOrigin');
        const materialHost = origin.addComponent(MaterialHost) as MaterialHost;
        const material = materialHost.material = mockMaterial([
            { uniforms: {} },
            { uniforms: { 'SomeUniform': { availableChannelCount: 3 } } },
            { uniforms: {} },
        ]);
        material.name = 'SomeMaterial';

        const track = new VectorTrack();
        track.channels()[0].curve.assignSorted([[0.0, 0.0]]);
        track.path.toComponent(MaterialHost).toProperty('material');
        const proxyFactory = track.proxy = new UniformProxyFactory();
        proxyFactory.passIndex = 1;
        proxyFactory.uniformName = 'SomeUniform';

        for (const channelIndex of [-1, -2, 3, 4]) {
            proxyFactory.channelIndex = channelIndex;
            bindThenAssertWarn(origin, track, [3943, material.name, proxyFactory.passIndex, proxyFactory.uniformName, proxyFactory.channelIndex]);
        }
    });

    class MaterialHost extends Component {
        public declare material: Material;
    }

    function bindThenAssertWarn(
        root: Node,
        track: Track,
        expectedCapturedWarns: [warnId: number, ...optionalParams: any[]]
    ) {
        const animationClip = new AnimationClip();
        animationClip.name = 'Meow';
        animationClip.duration = 1.0;
        animationClip.addTrack(track);

        const warnWatcher = captureWarnIDs();

        const state = new AnimationState(animationClip);
        state.initialize(root);

        expect(warnWatcher.captured).toHaveLength(2);
        expect(warnWatcher.captured[0]).toStrictEqual(expectedCapturedWarns);
        expect(warnWatcher.captured[1]).toStrictEqual([3937, 'Meow', root.name]);
        warnWatcher.clear();
        warnWatcher.stop();
    }

    function mockMaterial(passMocks: Array<{
        uniforms: Record<string, { availableChannelCount: number }>;
    }>) {
        const passes = passMocks.map((passMock) => {
            const pass = new Pass(director.root!);
            jest.spyOn(pass, 'getHandle').mockImplementation((name, offset) => {
                const uniformMock = passMock.uniforms[name];
                if (!uniformMock) {
                    return 0;
                }
                if (typeof offset !== 'undefined' && (offset < 0 || offset >= uniformMock.availableChannelCount)) {
                    return 0;
                }
                return 1;
            });
            return pass;
        });

        const material = new Material();
        jest.spyOn(material, 'passes', 'get').mockReturnValue(passes);

        return material;
    }
});