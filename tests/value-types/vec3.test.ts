import { Vec3 } from '../../cocos/core/math/vec3';
import { clampf } from '../../cocos/core/utils/misc';

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