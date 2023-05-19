import { Transform } from "../../../cocos/animation/core/transform";
import { Mat4, Quat, toRadian, Vec3 } from "../../../cocos/core";

test('Constructor/Well-known transforms', () => {
    const transform = new Transform();
    expect(Vec3.strictEquals(transform.position, Vec3.ZERO)).toBe(true);
    expect(Quat.strictEquals(transform.rotation, Quat.IDENTITY)).toBe(true);
    expect(Vec3.strictEquals(transform.scale, Vec3.ONE)).toBe(true);

    expect(Vec3.strictEquals(Transform.IDENTITY.position, Vec3.ZERO)).toBe(true);
    expect(Quat.strictEquals(Transform.IDENTITY.rotation, Quat.IDENTITY)).toBe(true);
    expect(Vec3.strictEquals(Transform.IDENTITY.scale, Vec3.ONE)).toBe(true);

    expect(Vec3.strictEquals(Transform.ZERO.position, Vec3.ZERO)).toBe(true);
    expect(Quat.strictEquals(Transform.ZERO.rotation, new Quat(0.0, 0.0, 0.0, 0.0))).toBe(true);
    expect(Vec3.strictEquals(Transform.ZERO.scale, Vec3.ZERO)).toBe(true);
});

test('Component access', () => {
    const transform = new Transform();
    const p = transform.position = new Vec3(1., 2., 3.);
    const r = transform.rotation = new Quat(4., 5., 6., 7.);
    const s = transform.scale = new Vec3(8., 9., 10.);
    expect(Vec3.strictEquals(transform.position, p)).toBe(true);
    expect(Quat.strictEquals(transform.rotation, r)).toBe(true);
    expect(Vec3.strictEquals(transform.scale, s)).toBe(true);
});

test('Equality', () => {
    const a = new Transform();
    a.position = new Vec3(1., 2., 3.);
    a.rotation = new Quat(4., 5., 6., 7.);
    a.scale = new Vec3(8., 9., 10.);

    const b = new Transform();
    b.position = new Vec3(1., 2., 3.);
    b.rotation = new Quat(4., 5., 6., 7.);
    b.scale = new Vec3(8., 9., 10.);
    expect(Transform.strictEquals(a, b)).toBe(true);
    expect(Transform.equals(a, b)).toBe(true);

    const c = new Transform();
    c.position = new Vec3(1., 2. + 1e-9, 3.);
    c.rotation = new Quat(4., 5., 6., 7.);
    c.scale = new Vec3(8., 9., 10.);
    expect(Transform.strictEquals(a, c)).toBe(false);
    expect(Transform.equals(a, c)).toBe(true);
    expect(Transform.equals(a, c, 1e-9)).toBe(true);
    expect(Transform.equals(a, c, 1e-10)).toBe(false);
});

test('Clone/Copy', () => {
    const src = new Transform();
    src.position = new Vec3(1., 2., 3.);
    src.rotation = new Quat(4., 5., 6., 7.);
    src.scale = new Vec3(8., 9., 10.);

    const cloned = Transform.clone(src);
    expect(Transform.strictEquals(src, cloned)).toBe(true);

    const target = Transform.clone(Transform.ZERO);
    expect(Transform.copy(target, src)).toBe(target);
    expect(Transform.strictEquals(src, target)).toBe(true);
});

test('setIdentity', () => {
    const transform = new Transform();
    transform.position = new Vec3(1., 2., 3.);
    transform.rotation = new Quat(4., 5., 6., 7.);
    transform.scale = new Vec3(8., 9., 10.);
    expect(Transform.setIdentity(transform)).toBe(transform);
    expect(Transform.strictEquals(transform, Transform.IDENTITY)).toBe(true);
});

test('Lerp', () => {
    const a = new Transform();
    a.position = new Vec3(1., 2., 3.);
    a.rotation = new Quat(4., 5., 6., 7.);
    a.scale = new Vec3(8., 9., 10.);
    const b = new Transform();
    b.position = new Vec3(3.14, 15., 9.26);
    b.rotation = new Quat(6., 7., 8.);
    b.scale = new Vec3(0.618, 0.619, 666.);
    const t = 0.6;
    const out = new Transform();
    expect(Transform.lerp(out, a, b, t)).toBe(out);
    expect(Vec3.equals(out.position, Vec3.lerp(new Vec3(), a.position, b.position, t))).toBe(true);
    expect(Quat.equals(out.rotation, Quat.slerp(new Quat(), a.rotation, b.rotation, t))).toBe(true);
    expect(Vec3.equals(out.scale, Vec3.lerp(new Vec3(), a.scale, b.scale, t))).toBe(true);
});

test('Multiply/Calculate relative', () => {
    // Scale contains zero
    {
        const parentGlobal = new Transform();
        parentGlobal.position = new Vec3(1., 2., 3.);
        parentGlobal.rotation = Quat.rotateY(new Quat(), Quat.IDENTITY, toRadian(30.));
        parentGlobal.scale = new Vec3(0.0, 5., 6.);

        const childLocal = new Transform();
        childLocal.position = new Vec3(0.3, 0.2, 0.1);
        childLocal.rotation = Quat.rotateX(new Quat(), Quat.IDENTITY, toRadian(20.0));
        childLocal.scale = new Vec3(0.6, 0.5, 0.0);

        const childGlobal = new Transform();
        expect(Transform.multiply(childGlobal, parentGlobal, childLocal)).toBe(childGlobal);
        expect(Vec3.equals(
            childGlobal.scale,
            new Vec3(0.0, 2.5, 0.0),
        )).toBe(true);
        expect(Quat.equals(
            childGlobal.rotation,
            Quat.multiply(new Quat(), parentGlobal.rotation, childLocal.rotation),
        )).toBe(true);
        expect(Vec3.equals(childGlobal.position,
            new Vec3(1.3, 3, 3.5196152422706635),
        )).toBe(true);

        const childLocal2 = new Transform();
        expect(Transform.calculateRelative(childLocal2, childGlobal, parentGlobal)).toBe(childLocal2);
        // For scale: x,z can not be revertible since they were 0. y can be revertible.
        expect(Vec3.equals(
            childLocal2.scale,
            new Vec3(0.0, childLocal.scale.y, 0.0),
        )).toBe(true);
        // Rotation can be revertible.
        expect(Quat.equals(
            childLocal2.rotation,
            childLocal.rotation,
        )).toBe(true);
        // For position thing even get complicated.
        expect(Vec3.equals(childLocal2.position,
            new Vec3(0.0, 0.2, 0.1),
        )).toBe(true);
        // const relativeInMat = relativeInFormOfMatrix(new Transform(), childGlobal, parentGlobal);
        // expect(Transform.equals(childLocal2, relativeInMat)).toBe(true);

        // Let's verify the multiply again.
        const childGlobal2 = new Transform();
        expect(Transform.multiply(childGlobal2, parentGlobal, childLocal2)).toBe(childGlobal2);
        expect(Transform.equals(childGlobal, childGlobal2)).toBe(true);
    }

    // Regular
    {
        const parentGlobal = new Transform();
        parentGlobal.position = new Vec3(1., 2., 3.);
        parentGlobal.rotation = Quat.rotateY(new Quat(), Quat.IDENTITY, toRadian(30.));
        parentGlobal.scale = new Vec3(4., 4., 4.);

        const childLocal = new Transform();
        const MAGIC = 'COCOS with you';
        childLocal.position = new Vec3(MAGIC.charCodeAt(0), MAGIC.charCodeAt(1), MAGIC.charCodeAt(2));
        childLocal.rotation = Quat.rotateX(new Quat(), Quat.IDENTITY, toRadian(MAGIC.charCodeAt(3)));
        childLocal.scale = new Vec3(MAGIC.charCodeAt(4), MAGIC.charCodeAt(4), MAGIC.charCodeAt(4));

        const childGlobal = new Transform();
        expect(Transform.multiply(childGlobal, parentGlobal, childLocal)).toBe(childGlobal);
        expect(Transform.equals(childGlobal, multiplyInFormOfMatrix(new Transform(), childLocal, parentGlobal))).toBe(true);
        expect(Vec3.equals(
            childGlobal.scale,
            Vec3.multiply(
                new Vec3(),
                parentGlobal.scale,
                childLocal.scale,
            ),
        )).toBe(true);
        expect(Quat.equals(
            childGlobal.rotation,
            Quat.multiply(
                new Quat(),
                parentGlobal.rotation,
                childLocal.rotation,
            ),
        )).toBe(true);
        expect(Vec3.equals(
            childGlobal.position,
            new Vec3(367.0948082142296, 318, 101.09480821422956),
        )).toBe(true);

        const childLocal2 = new Transform();
        expect(Transform.calculateRelative(childLocal2, childGlobal, parentGlobal)).toBe(childLocal2);
        expect(Transform.equals(childLocal, childLocal2)).toBe(true);
    }

    function multiplyInFormOfMatrix(out: Transform, a: Readonly<Transform>, b: Readonly<Transform>) {
        const aMat = Transform.toMatrix(new Mat4(), a as Transform);
        const bMat = Transform.toMatrix(new Mat4(), b as Transform);
        const outMat = new Mat4();
        Mat4.multiply(outMat, bMat, aMat);
        return Transform.fromMatrix(out, outMat);
    }
});

test('Invert', () => {
    const a = new Transform();
    a.position = new Vec3(1., 2., 3.);
    a.rotation = Quat.normalize(new Quat(), new Quat(4., 5., 6., 7.));
    a.scale = new Vec3(8., 8., 8.);

    const aMat = Transform.toMatrix(new Mat4(), a);
    const aInvMat = Mat4.invert(new Mat4(), aMat);

    const inv = new Transform();
    expect(Transform.invert(inv, a)).toBe(inv);
    expect(
        Transform.equals(inv, Transform.fromMatrix(new Transform(), aInvMat)),
    ).toBe(true);
});

test('Conversion between matrix', () => {
    const transform = new Transform();
    transform.position = new Vec3(1., 2., 3.);
    const q = new Quat(4., 5., 6., 7.);
    transform.rotation = Quat.normalize(q, q);
    transform.scale = new Vec3(8., 9., 10.);

    const matrix = new Mat4();
    expect(Transform.toMatrix(matrix, transform)).toBe(matrix);
    {
        const t = new Vec3();
        const r = new Quat();
        const s = new Vec3();
        Mat4.toRTS(matrix, r, t, s);
        expect(Vec3.equals(t, transform.position)).toBe(true);
        expect(Quat.equals(r, transform.rotation)).toBe(true);
        expect(Vec3.equals(s, transform.scale)).toBe(true);
    }

    const transform2 = new Transform();
    expect(Transform.fromMatrix(transform2, matrix)).toBe(transform2);
    expect(Transform.equals(transform, transform2)).toBe(true);
});
