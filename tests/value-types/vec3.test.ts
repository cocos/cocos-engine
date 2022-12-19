import { lerp, toRadian } from '../../cocos/core/math/utils';
import { v3, Vec3 } from '../../cocos/core/math/vec3';
import { clampf } from '../../cocos/core/utils/misc';
import '../utils/matchers/value-type-asymmetric-matchers';

test('basic test', function () {
    const vec3 = new Vec3(1, 2, 3);
    expect(vec3 instanceof Vec3);
    expect(vec3.x).toBe(1);
    expect(vec3.y).toBe(2);
    expect(vec3.z).toBe(3);
    vec3.x = -1;
    vec3.y = -2;
    vec3.z = -3;
    expect(vec3.x).toBe(-1);
    expect(vec3.y).toBe(-2);
    expect(vec3.z).toBe(-3);
    const another = vec3.clone();
    expect(another).toEqual(vec3);
});

test('multiplication test', function () {
    var vec = new Vec3(4, 5, 6);
    vec.multiply(new Vec3(1, 2, 3));
    expect(vec).toEqual(new Vec3(4, 10, 18));
    vec.multiplyScalar(0);
    expect(vec).toEqual(new Vec3(0, 0, 0));
});

test('misc', function () {
    let vector = new Vec3(3, 7, 11);
    let vec1 = new Vec3(2, 11, -42);
    expect(vec1.dot(vector)).toBe(-379);
    expect(Vec3.cross(new Vec3(), vec1, vector)).toEqual(new Vec3(415, -148, -19));
    expect(vec1.lengthSqr()).toBe(1889);

    vec1.normalize();
    let mag = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z);
    let compare = new Vec3(vec1.x / mag, vec1.y / mag, vec1.z / mag);
    expect(vec1).toEqual(compare);

    vector.set(5, 5, 5);
    vec1.set(5, 0, 5);
    let vec2 = new Vec3(10, 10, 10);

    let magSqr1 = vec1.lengthSqr();
    let magSqr2 = vector.lengthSqr();
    let dot = vec1.dot(vector);
    let theta = dot / (Math.sqrt(magSqr1 * magSqr2));
    theta = clampf(theta, -1.0, 1.0);

    expect(Vec3.angle(vec1, vector)).toBeCloseTo(Math.acos(theta));
    expect(Vec3.project(new Vec3(), vec2, vector)).toEqual(new Vec3(10, 10, 10));

    // Relating the vec2 angle features
    vector.set(12, 3, -10);
    vec1.set(-2, -4, -11);
});

test('Slerp', () => {
    const expectToBeCloseToVec3 = (actual: Readonly<Vec3>, expected: Readonly<Vec3>) => {
        expect(Vec3.equals(actual, expected)).toBe(true);
    };

    // If either start vector or destination vector close to zero,
    // slerp changed to use lerp.
    {
        const expectFallbackToLerp = (from: Readonly<Vec3>, to: Readonly<Vec3>, t: number) => {
            expectToBeCloseToVec3(
                Vec3.slerp(new Vec3(), from, to, t),
                Vec3.lerp(new Vec3(), from, to, t),
            );
        };
        expectFallbackToLerp(Vec3.ZERO, new Vec3(1.0, 2.0, 3.0), 0.2);
        expectFallbackToLerp(new Vec3(-1.0, -2.0, 3.0), new Vec3(1e-7, 1e-7, 0.0), 0.3);
        expectFallbackToLerp(new Vec3(1e-9, 1e-7, 1e-8), Vec3.ZERO, 0.3);
    }

    // Almost same directions.
    {
        expectToBeCloseToVec3(
            Vec3.slerp(new Vec3(), new Vec3(1.5, 1.5, 1.5), new Vec3(1.2, 1.2, 1.2 + 1e-8), 0.6),
            new Vec3(1.32, 1.32, 1.32),
        );
    }

    // Almost opposite directions.
    {
        const from = new Vec3(1.5, 1.5, 1.5);
        const toScale = 1.2;
        const t = 0.6;

        const to = new Vec3(-from.x, -from.y + 1e-7, -from.z + 1e-8);
        Vec3.multiplyScalar(to, to, toScale);
        const result = Vec3.slerp(new Vec3(), from, to, t);
        // In such case, we don't care about the value but:
        // - Length should be lerped;
        expect(Vec3.len(result)).toBeCloseTo(lerp(Vec3.len(from), Vec3.len(to), t));
        // - Angle should be lerped.
        expect(Vec3.angle(from, result) / Math.PI).toBeCloseTo(t);
    }

    { // Regular slerp.
        const from = createSphericalCoordinate(30, 20, 1);
        const to = createSphericalCoordinate(100, 60, 2.2);
        
        expectToBeCloseToVec3(
            Vec3.slerp(new Vec3(), from, to, 0.0),
            from,
        );

        expectToBeCloseToVec3(
            Vec3.slerp(new Vec3(), from, to, 0.2),
            new Vec3(0.268105, 1.133066, 0.426475),
        );

        expectToBeCloseToVec3(
            Vec3.slerp(new Vec3(), from, to, 0.6),
            new Vec3(0.06108944712193978, 1.3119492440010865, 1.1106112103771124),
        );

        expectToBeCloseToVec3(
            Vec3.slerp(new Vec3(), from, to, 1.0),
            to,
        );
    }

    function createSphericalCoordinate(yawDegrees: number, pitchDegrees: number, radius: number) {
        const theta = toRadian(pitchDegrees);
        const phi = toRadian(yawDegrees);
        return new Vec3(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.cos(theta),
            radius * Math.sin(theta) * Math.sin(phi),
        );
    }
});
