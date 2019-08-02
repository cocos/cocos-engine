
import { AnimCurve, IPropertyCurveData, RatioSampler, sampleAnimationCurve } from '../../cocos/animation/animation-curve';

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