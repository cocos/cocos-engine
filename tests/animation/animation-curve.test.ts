
import { AnimCurve, RatioSampler, sampleAnimationCurve } from '../../cocos/core/animation/animation-curve';
import { ComponentPath, TargetPath, HierarchyPath } from '../../cocos/core/animation/target-path';
import { Node } from '../../cocos/core/scene-graph';
import { createBoundTarget } from '../../cocos/core/animation/bound-target';

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

test('Erroneous target path', () => {;
    expect(createBoundTarget(new Node("TestNode"), [new ComponentPath('cc.MeshRenderer'), 'position'])).toBeNull();
    expect(createBoundTarget(new Node("TestNode"), [new HierarchyPath('/absent'), 'position'])).toBeNull();
    expect(createBoundTarget(Object.create(null), ['property', 0])).toBeNull();
    expect(createBoundTarget([], [1, 0])).toBeNull();
});