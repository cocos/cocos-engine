import * as Utils from "../../../cocos/core/math/utils";
import { Vec3 } from "../../../cocos/core";

describe('Test Utils', () => {
    test('equals', () => {
        expect(Utils.equals(0, 0)).toBeTruthy();
        expect(Utils.equals(0, 1)).toBeFalsy();
        expect(Utils.equals(0.000002, 0.000001)).toBeTruthy();
        expect(Utils.equals(0.000002, 0.0000009)).toBeFalsy();
    });

    test('approx', () => {
        expect(Utils.approx(0, 0, 0)).toBeTruthy();
        expect(Utils.approx(0, 1, 0)).toBeFalsy();
        expect(Utils.approx(0.000002, 0.000001, 0.000001)).toBeTruthy();
        expect(Utils.approx(0.000002, 0.0000009, 0.000001)).toBeFalsy();
        expect(Utils.approx(0.000002, 0.000001, 0)).toBeTruthy();
    });

    test('clamp', () => {
        const min = 0;
        const max = 1;
        expect(Utils.clamp(0, min, max)).toBe(0);
        expect(Utils.clamp(1, min, max)).toBe(1);
        expect(Utils.clamp(0.5, min, max)).toBe(0.5);
        expect(Utils.clamp(-1, min, max)).toBe(0);
        expect(Utils.clamp(2, min, max)).toBe(1);
    });

    test('clamp01', () => {
        expect(Utils.clamp01(0)).toBe(0);
        expect(Utils.clamp01(1)).toBe(1);
        expect(Utils.clamp01(0.5)).toBe(0.5);
        expect(Utils.clamp01(-1)).toBe(0);
        expect(Utils.clamp01(2)).toBe(1);
    });

    test('lerp', () => {
        expect(Utils.lerp(0, 1, 0)).toBe(0);
        expect(Utils.lerp(0, 1, 1)).toBe(1);
        expect(Utils.lerp(0, 1, 0.5)).toBe(0.5);
    });

    test('toRadian', () => {
        expect(Utils.toRadian(0)).toBe(0);
        expect(Utils.toRadian(180)).toBe(Math.PI);
        expect(Utils.toRadian(360)).toBe(Math.PI * 2);
    });
    test('toDegree', () => {
        expect(Utils.toDegree(0)).toBe(0);
        expect(Utils.toDegree(Math.PI)).toBe(180);
        expect(Utils.toDegree(Math.PI * 2)).toBe(360);
    });
    test('randomRange', () => {
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = Utils.randomRange(start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
        }
    });
    test('randomRangeInt', () => {
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = Utils.randomRangeInt(start, end);
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
            const value = Utils.pseudoRandomRange(seed, start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
        }
    });
    test('pesudoRandomRangeInt', () => {
        const seed = 1;
        const start = 1;
        const end = 5;

        for (let i = 0; i < 100; i++) {
            const value = Utils.pseudoRandomRangeInt(seed, start, end);
            expect(value >= start).toBeTruthy();
            expect(value <= end).toBeTruthy();
            expect(value % 1).toBeCloseTo(0, 6);
        }
    });

    test('nextPow2', () => {
        expect(Utils.nextPow2(0)).toBeCloseTo(0);
        expect(Utils.nextPow2(1)).toBeCloseTo(1);
        expect(Utils.nextPow2(2)).toBeCloseTo(2);
        expect(Utils.nextPow2(3)).toBeCloseTo(4);
        expect(Utils.nextPow2(4)).toBeCloseTo(4);
        expect(Utils.nextPow2(5)).toBeCloseTo(8);
        expect(Utils.nextPow2(31)).toBeCloseTo(32);
    });
    test('repeat', () => {
        expect(Utils.repeat(0, 1)).toBeCloseTo(0);
        expect(Utils.repeat(1, 1)).toBeCloseTo(0);
        expect(Utils.repeat(2, 1)).toBeCloseTo(0);
        expect(Utils.repeat(0.5, 1)).toBeCloseTo(0.5);
        expect(Utils.repeat(0.5, 0.5)).toBeCloseTo(0);
        expect(Utils.repeat(0.5, 0.25)).toBeCloseTo(0);
        expect(Utils.repeat(0.5, 0.75)).toBeCloseTo(0.5);
    });
    test('pingPong', () => {
        expect(Utils.pingPong(0, 1)).toBeCloseTo(0);
        expect(Utils.pingPong(1, 1)).toBeCloseTo(1);
        expect(Utils.pingPong(2, 1)).toBeCloseTo(0);
        expect(Utils.pingPong(0.5, 1)).toBeCloseTo(0.5);
        expect(Utils.pingPong(0.5, 0.5)).toBeCloseTo(0.5);
        expect(Utils.pingPong(0.5, 0.25)).toBeCloseTo(0);
        expect(Utils.pingPong(0.5, 0.75)).toBeCloseTo(0.5);
        expect(Utils.pingPong(0.75, 0.75)).toBeCloseTo(0.75);
    });
    test('inverseLerp', () => {
        expect(Utils.inverseLerp(0, 1, 0)).toBeCloseTo(0);
        expect(Utils.inverseLerp(0, 1, 1)).toBeCloseTo(1);
        expect(Utils.inverseLerp(0, 1, 0.5)).toBeCloseTo(0.5);
    });
    test('absMaxComponent', () => {
        const vec1 = new Vec3(1, 2, 3);
        const vec2 = new Vec3(1, 2, -3);
        const vec3 = new Vec3(1, 0, 3);

        expect(Utils.absMaxComponent(vec1)).toBeCloseTo(3);
        expect(Utils.absMaxComponent(vec2)).toBeCloseTo(-3);
        expect(Utils.absMaxComponent(vec3)).toBeCloseTo(3);
    });
    test('absMax', () => {
        expect(Utils.absMax(1, 3)).toBeCloseTo(3);
        expect(Utils.absMax(1, -3)).toBeCloseTo(-3);
        expect(Utils.absMax(0, 3)).toBeCloseTo(3);
    });
});