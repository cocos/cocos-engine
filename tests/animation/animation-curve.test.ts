
import { AnimCurve, RatioSampler, sampleAnimationCurve } from '../../cocos/core/animation/animation-curve';
import { BoundTarget, ComponentPath, TargetPath, HierarchyPath } from '../../cocos/core/animation/target-path';
import { Node } from '../../cocos/core/scene-graph';

test('sample from animation curve', () => {
    const curve = new AnimCurve({
        values: [0, 1, 2, 3],
    }, 1);
    const sampler = new RatioSampler([
        0, 0.3, 0.6, 1.0
    ]);

    expect(sampleAnimationCurve(curve, sampler, 0)).toBe(0);
    expect(sampleAnimationCurve(curve, sampler, 0.3)).toBe(1);
    expect(sampleAnimationCurve(curve, sampler, 0.6)).toBe(2);
    expect(sampleAnimationCurve(curve, sampler, 1.0)).toBe(3);
});

test('Erroneous target path', () => {
    const fx = (target: any, modifier: TargetPath | TargetPath[]) => {
        return () => {
            new BoundTarget(target, Array.isArray(modifier) ? modifier : [ modifier ]);
        };
    };

    expect(fx(new Node("TestNode"), new ComponentPath('cc.ModelComponent'))).toThrow(
        `Node "TestNode" has no component "cc.ModelComponent"`);

    expect(fx(new Node("TestNode"), new HierarchyPath('/absent'))).toThrow(
        `Node "TestNode" has no path "/absent"`);

    expect(fx(Object.create(null), ['property', 0])).toThrow(
        `Target object has no property "property"`);
    
    expect(fx([], [1, 0])).toThrow(
        `Target object has no property "1"`);
});