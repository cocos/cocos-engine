module('Vec3');

var v3 = cc.v3;

test('basic test', function () {
    var vec1 = new cc.Vec3(1, 2, 3);
    ok(vec1 instanceof cc.Vec3, 'is instanceof Vec3');
    strictEqual(vec1.x, 1, 'can get x');
    strictEqual(vec1.y, 2, 'can get y');
    strictEqual(vec1.z, 3, 'can get z');
    vec1.x = -1;
    vec1.y = -2;
    vec1.z = -3;
    strictEqual(vec1.x, -1, 'can set x');
    strictEqual(vec1.y, -2, 'can set y');
    strictEqual(vec1.z, -3, 'can set z');
    var vec3 = vec1.clone();
    deepEqual(vec1, vec3, 'can clone');
});

test('scale test', function () {
    var vec1 = new cc.Vec3(4, 5, 6);
    deepEqual(vec1.scale(v3(1, 2, 3)), v3(4, 10, 18), 'can scale');
    deepEqual(vec1, v3(4, 5, 6), 'ensure vec1 not being changed after scale');
    deepEqual(vec1.scaleSelf(v3(1, 2, 3)), v3(4, 10, 18), 'can scaleSelf');
    deepEqual(vec1, v3(4, 10, 18), 'ensure vec1 being changed after scale');
});

test('misc', function(){
    var vector = v3(3, 7, 11);
    var vec1 = new cc.Vec3(2, 11, -42);
    strictEqual(vec1.dot(vector), -379, 'vec1 test');
    deepEqual(vec1.cross(vector), v3(415, -148, -19), 'corss test');
    strictEqual(vec1.magSqr(vector), 1889, 'magSqr test');

    var normalizeSelf = vec1.normalizeSelf();
    var mag = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y + vec1.z * vec1.z);
    var expect = v3(vec1.x / mag, vec1.y / mag, vec1.z / mag);
    deepEqual(normalizeSelf, expect, 'normalizeSelf test');
});

test('compatible', function () {
    var vector = v3(5, 5, 5);
    var vec1 = new cc.Vec3(5, 0, 5);
    var vec2 = new cc.Vec3(10, 10, 10);

    var magSqr1 = vec1.magSqr();
    var magSqr2 = vector.magSqr();
    var dot = vec1.dot(vector);
    var theta = dot / (Math.sqrt(magSqr1 * magSqr2));
    theta = cc.misc.clampf(theta, -1.0, 1.0);

    deepClose(vec1.angle(vector), Math.acos(theta), 0.01, 'angle test');
    deepEqual(vec2.project(vector), v3(10, 10, 10), 'project test');

    // Relating the vec2 angle features
    vector.set(v3(12, 3, -10));
    vec1.set(v3(-2, -4, -11));

    var radian = Math.PI / 3;
    var vec3 = new cc.Vec2(12, 3);
    var vec4 = new cc.Vec2(-2, -4);

    deepClose(vec1.signAngle(vector), vec4.signAngle(vec3), 0.01, 'signAngle test');

    var result = vec4.rotate(radian);
    deepEqual(vec1.rotate(radian, v3()), v3(result.x, result.y, 0), 'rotate test with a Vec3 out');
    deepEqual(vec1.rotate(radian), result, 'rotate test without out');
    deepEqual(vec1.rotateSelf(radian), v3(result.x, result.y, vec1.z), 'rotateSelf test');
});