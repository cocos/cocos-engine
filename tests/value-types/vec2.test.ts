import { v2, Vec2 } from '../../cocos/core/math/vec2';

test('basic test', function () {
    let vec1 = new Vec2(5, 6);
    expect(vec1 instanceof Vec2).toBeTruthy();
    expect(vec1.x).toBe(5);
    expect(vec1.y).toBe(6);
    vec1.x = -1;
    vec1.y = -2;
    expect(vec1.x).toBe(-1);
    expect(vec1.y).toBe(-2);
    let vec2 = vec1.clone();
    expect(vec1).toStrictEqual(vec2);
});

test('scale test', function () {
    var vec1 = new Vec2(5, 6);
    var tmp = new Vec2(vec1);
    tmp.multiply(new Vec2(1, 2));
    expect(tmp).toStrictEqual(new Vec2(5, 12));
    expect(vec1).toStrictEqual(new Vec2(5, 6));
    vec1.multiply(new Vec2(1, 2));
    expect(vec1).toStrictEqual(new Vec2(5, 12));
});

test('misc', function(){
    let vector = new Vec2(7, 11);
    let vec1 = new Vec2(11, -42);
    expect(vec1.dot(vector)).toStrictEqual(-385);
    expect(vec1.cross(vector)).toStrictEqual(415);
    expect(vec1.lengthSqr()).toStrictEqual(1885);

    vec1.normalize();
    let mag = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    let result = new Vec2(vec1.x / mag, vec1.y / mag);
    expect(vec1).toStrictEqual(result);
});

test(`Normalization`, () => {
    const t = (input: Readonly<Vec2>) => {
        const result = new Vec2(NaN, NaN);
        expect(Vec2.normalize(result, input)).toBe(result);
        return result;
    };

    expect(t(v2(1., 2.))).toMatchObject({
        x: 0.4472135954999579,
        y: 0.8944271909999159,
    });

    // Normalize exactly zero vector gives zero vector.
    expect(t(v2(0., 0.))).toMatchObject({
        x: 0.,
        y: 0.,
    });

    // Even the input vector is very close to zero vector, the result is far from zero vector.
    expect(t(v2(1e-20, 0.))).toMatchObject({
        x: 1.,
        y: 0.,
    });

    // This once was a bug because the lack of assignment to result if the input vector is zero.
    expect(Vec2.normalize(v2(2., 4.,), v2(0., 0.))).toMatchObject({
        x: 0.,
        y: 0.,
    });
});