import { toRadian } from '../../cocos/core/math/utils';
import { Vec3 } from '../../cocos/core/math/vec3';

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

test('Angle', () => {
    expect(Vec3.angle(
        Vec3.UNIT_X,
        new Vec3(1.0, Math.tan(toRadian(30.0))),
    )).toBeCloseTo(toRadian(30.0));

    expect(Vec3.angle(
        Vec3.UNIT_X,
        Vec3.UNIT_Z,
    )).toBeCloseTo(toRadian(90.0));

    expect(Vec3.angle(
        Vec3.UNIT_X,
        new Vec3(1.0, Math.tan(toRadian(30.0))),
        false, // Assume normalized
    )).toBeCloseTo(toRadian(30.0));

    expect(Vec3.angle(
        Vec3.UNIT_X,
        Vec3.normalize(new Vec3(), new Vec3(1.0, Math.tan(toRadian(30.0)))),
        true, // Assume normalized
    )).toBeCloseTo(toRadian(30.0));

    // TODO:
    
    // expect(Vec3.angle(
    //     Vec3.ZERO,
    //     new Vec3(1.0, Math.tan(toRadian(30.0))),
    // )).toBeCloseTo(Math.PI);

    // expect(Vec3.angle(
    //     Vec3.ZERO,
    //     Vec3.ZERO,
    // )).toBeCloseTo(Math.PI);
});