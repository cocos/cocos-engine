import { v4, Vec4 } from '../../cocos/core/math/vec4';

test(`Normalization`, () => {
    const t = (input: Readonly<Vec4>) => {
        const result = new Vec4(NaN, NaN, NaN, NaN);
        expect(Vec4.normalize(result, input)).toBe(result);
        return result;
    };

    expect(t(v4(1., 2., 3., 4.))).toMatchObject({
        x: 0.18257418583505536,
        y: 0.3651483716701107,
        z: 0.5477225575051661,
        w: 0.7302967433402214,
    });

    // Normalize exactly zero vector gives zero vector.
    expect(t(v4(0., 0., 0., 0.))).toMatchObject({
        x: 0.,
        y: 0.,
        z: 0.,
        w: 0.,
    });

    // Even the input vector is very close to zero vector, the result is far from zero vector.
    expect(t(v4(1e-20, 0., 0., 0.))).toMatchObject({
        x: 1.,
        y: 0.,
        z: 0.,
        w: 0.,
    });

    // This once was a bug because the lack of assignment to result if the input vector is zero.
    expect(Vec4.normalize(v4(2., 4., 6., 8.), v4(0., 0., 0., 0.))).toMatchObject({
        x: 0.,
        y: 0.,
        z: 0.,
        w: 0.,
    });
});
