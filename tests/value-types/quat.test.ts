import { quat, Quat } from '../../cocos/core/math/quat';

test(`Normalization`, () => {
    const t = (input: Readonly<Quat>) => {
        const result = new Quat(NaN, NaN, NaN, NaN);
        expect(Quat.normalize(result, input)).toBe(result);
        return result;
    };

    expect(t(quat(1., 2., 3., 4.))).toMatchObject({
        x: 0.18257418583505536,
        y: 0.3651483716701107,
        z: 0.5477225575051661,
        w: 0.7302967433402214,
    });

    // Normalize exactly zero quaternion gives **identity** quaternion.
    expect(t(quat(0., 0., 0., 0.))).toMatchObject({
        x: 0.,
        y: 0.,
        z: 0.,
        w: 1.,
    });

    // Even the input quaternion is very close to zero quaternion, the result is far from zero quaternion.
    expect(t(quat(1e-20, 0., 0., 0.))).toMatchObject({
        x: 1.,
        y: 0.,
        z: 0.,
        w: 0.,
    });

    // This once was a bug because the lack of assignment to result if the input quaternion is zero.
    expect(Quat.normalize(quat(2., 4., 6., 8.), quat(0., 0., 0., 0.))).toMatchObject({
        x: 0.,
        y: 0.,
        z: 0.,
        w: 1.,
    });
});
