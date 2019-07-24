import '../../exports/base';
import Vec2 from '../../cocos/core/value-types/vec2';

test('basic test', function () {
    var vec1 = new Vec2(5, 6);
    expect(vec1 instanceof Vec2).toBeTruthy();
    expect(vec1.x).toBe(5);
    expect(vec1.y).toBe(6);
    vec1.x = -1;
    vec1.y = -2;
    expect(vec1.x).toBe(-1);
    expect(vec1.y).toBe(-2);
    var vec2 = vec1.clone();
    expect(vec1).toStrictEqual(vec2);
});

test('scale test', function () {
    var vec1 = new Vec2(5, 6);
    var tmp = new Vec2(vec1);
    tmp.scale(new Vec2(1, 2));
    expect(tmp).toStrictEqual(new Vec2(5, 12));
    expect(vec1).toStrictEqual(new Vec2(5, 6));
    vec1.scale(new Vec2(1, 2));
    expect(vec1).toStrictEqual(new Vec2(5, 12));
});

test('misc', function(){
    var vector = new Vec2(7, 11);
    var vec1 = new Vec2(11, -42);
    expect(vec1.dot(vector)).toStrictEqual(-385);
    expect(vec1.cross(vector)).toStrictEqual(415);
    expect(vec1.magSqr()).toStrictEqual(1885);

    vec1.normalize();
    var mag = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    var result = new Vec2(vec1.x / mag, vec1.y / mag);
    expect(vec1).toStrictEqual(result);
});
