module('Vec2');

var v2 = cc.v2;

test('basic test', function () {
    var vec1 = new cc.Vec2(5, 6);
    ok(vec1 instanceof cc.Vec2, 'is instanceof Vec2');
    strictEqual(vec1.x, 5, 'can get x');
    strictEqual(vec1.y, 6, 'can get y');
    vec1.x = -1;
    vec1.y = -2;
    strictEqual(vec1.x, -1, 'can set x');
    strictEqual(vec1.y, -2, 'can set y');
    var vec2 = vec1.clone();
    deepEqual(vec1, vec2, 'can clone');
});

test('scale test', function () {
    var vec1 = new cc.Vec2(5, 6);
    deepEqual(vec1.scale(v2(1, 2)), v2(5, 12), 'can scale');
    deepEqual(vec1, v2(5, 6), 'ensure vec1 not being changed after scale');
    deepEqual(vec1.scaleSelf(v2(1, 2)), v2(5, 12), 'can scaleSelf');
});

test('misc', function(){
    var vector = v2(7, 11);
    var vec1 = new cc.Vec2(11, -42);
    strictEqual(vec1.dot(vector), -385, 'vec1 test');
    strictEqual(vec1.cross(vector), 415, 'corss test');
    strictEqual(vec1.magSqr(vector), 1885, 'magSqr test');

    var normalizeSelf = vec1.normalizeSelf();
    var mag = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    var expect = v2(vec1.x / mag, vec1.y / mag);
    deepEqual(normalizeSelf, expect, 'normalizeSelf test');
});
