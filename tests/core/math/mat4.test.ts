import { Mat4, Quat, Vec3 } from "../../../cocos/core";

test('Conversion between TRS', () => {
    const t = new Vec3(1., 2., 3.);
    const r = new Quat(4., 5., 6., 7.);
    Quat.normalize(r, r);
    const s = new Vec3(8., 9., 10.);

    const mat4 = new Mat4();
    expect(Mat4.fromRTS(
        mat4,
        r,
        t,
        s,
    )).toBe(mat4);
    const t2 = new Vec3();
    const r2 = new Quat();
    const s2 = new Vec3();
    Mat4.toRTS(mat4, r2, t2, s2);
    expect(Vec3.equals(t2, t)).toBe(true);
    expect(Vec3.equals(s2, s)).toBe(true);
    expect(Quat.equals(r2, r)).toBe(true);
    expect(Vec3.equals(mat4.getTranslation(new Vec3()), t)).toBe(true);
    expect(Vec3.equals(mat4.getScale(new Vec3()), s)).toBe(true);
    expect(Quat.equals(mat4.getRotation(new Quat()), r)).toBe(true);
});