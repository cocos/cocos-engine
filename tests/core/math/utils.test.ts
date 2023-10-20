import { Vec3, equals, approx, clamp, clamp01, lerp, toRadian, toDegree, randomRange, randomRangeInt, pseudoRandomRange, pseudoRandomRangeInt, nextPow2, repeat, pingPong, inverseLerp, absMaxComponent, absMax } from '@base/math';

describe('Test Utils', () => {
    test('equals', () => {
        expect(equals(0, 0)).toBeTruthy();
        expect(equals(0, 1)).toBeFalsy();
        expect(equals(0.000002, 0.000001)).toBeTruthy();
        expect(equals(0.000002, 0.0000009)).toBeFalsy();
    });

    test('approx', () => {
        expect(approx(0, 0, 0)).toBeTruthy();
        expect(approx(0, 1, 0)).toBeFalsy();
        expect(approx(0.000002, 0.000001, 0.000001)).toBeTruthy();
        expect(approx(0.000002, 0.0000009, 0.000001)).toBeFalsy();
        expect(approx(0.000002, 0.000001, 0)).toBeTruthy();
    });

    test('clamp', () => {
        const min = 0;
        const max = 1;
        expect(clamp(0, min, max)).toBe(0);
        expect(clamp(1, min, max)).toBe(1);
        expect(clamp(0.5, min, max)).toBe(0.5);
        expect(clamp(-1, min, max)).toBe(0);
        expect(clamp(2, min, max)).toBe(1);
    });

    test('clamp01', () => {
        expect(clamp01(0)).toBe(0);
        expect(clamp01(1)).toBe(1);
        expect(clamp01(0.5)).toBe(0.5);
        expect(clamp01(-1)).toBe(0);
        expect(clamp01(2)).toBe(1);
    });

    test('lerp', () => {
        expect(lerp(0, 1, 0)).toBe(0);
        expect(lerp(0, 1, 1)).toBe(1);
        expect(lerp(0, 1, 0.5)).toBe(0.5);
    });

    test('toRadian', () => {
        expect(toRadian(0)).toBe(0);
        expect(toRadian(180)).toBe(Math.PI);
        expect(toRadian(360)).toBe(Math.PI * 2);
    });
    test('toDegree', () => {
        expect(toDegree(0)).toBe(0);
        expect(toDegree(Math.PI)).toBe(180);
        expect(toDegree(Math.PI * 2)).toBe(360);
    });
    test('randomRange', () => {
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = randomRange(start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
        }
    });
    test('randomRangeInt', () => {
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = randomRangeInt(start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
            expect(value % 1).toBeCloseTo(0, 6);
        }
    });
    test('pesudoRandomRange', () => {
        const seed = 1;
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = pseudoRandomRange(seed, start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
        }
    });
    test('pesudoRandomRangeInt', () => {
        const seed = 1;
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = pseudoRandomRangeInt(seed, start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
            expect(value % 1).toBeCloseTo(0, 6);
        }
    });

    test('nextPow2', () => {
        expect(nextPow2(0)).toBeCloseTo(0);
        expect(nextPow2(1)).toBeCloseTo(1);
        expect(nextPow2(2)).toBeCloseTo(2);
        expect(nextPow2(3)).toBeCloseTo(4);
        expect(nextPow2(4)).toBeCloseTo(4);
        expect(nextPow2(5)).toBeCloseTo(8);
        expect(nextPow2(31)).toBeCloseTo(32);
    });
    test('repeat', () => {
        expect(repeat(0, 1)).toBeCloseTo(0);
        expect(repeat(1, 1)).toBeCloseTo(0);
        expect(repeat(2, 1)).toBeCloseTo(0);
        expect(repeat(0.5, 1)).toBeCloseTo(0.5);
        expect(repeat(0.5, 0.5)).toBeCloseTo(0);
        expect(repeat(0.5, 0.25)).toBeCloseTo(0);
        expect(repeat(0.5, 0.75)).toBeCloseTo(0.5);
    });
    test('pingPong', () => {
        expect(pingPong(0, 1)).toBeCloseTo(0);
        expect(pingPong(1, 1)).toBeCloseTo(1);
        expect(pingPong(2, 1)).toBeCloseTo(0);
        expect(pingPong(0.5, 1)).toBeCloseTo(0.5);
        expect(pingPong(0.5, 0.5)).toBeCloseTo(0.5);
        expect(pingPong(0.5, 0.25)).toBeCloseTo(0);
        expect(pingPong(0.5, 0.75)).toBeCloseTo(0.5);
        expect(pingPong(0.75, 0.75)).toBeCloseTo(0.75);
    });
    test('inverseLerp', () => {
        expect(inverseLerp(0, 1, 0)).toBeCloseTo(0);
        expect(inverseLerp(0, 1, 1)).toBeCloseTo(1);
        expect(inverseLerp(0, 1, 0.5)).toBeCloseTo(0.5);
    });
    test('absMaxComponent', () => {
        const vec1 = new Vec3(1, 2, 3);
        const vec2 = new Vec3(1, 2, -3);
        const vec3 = new Vec3(1, 0, 3);

        expect(absMaxComponent(vec1)).toBeCloseTo(3);
        expect(absMaxComponent(vec2)).toBeCloseTo(-3);
        expect(absMaxComponent(vec3)).toBeCloseTo(3);
    });
    test('absMax', () => {
        expect(absMax(1, 3)).toBeCloseTo(3);
        expect(absMax(1, -3)).toBeCloseTo(-3);
        expect(absMax(0, 3)).toBeCloseTo(3);
    });
});