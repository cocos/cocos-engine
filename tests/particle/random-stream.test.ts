
import { Vec3 } from "../../cocos/core";
import { RandomStream } from "../../cocos/particle/random-stream";

describe ('rand-num-gen', () => {
    test ('PNG with no seed should produce different sequence', () => {
        const rng1 = new RandomStream();
        const rng2 = new RandomStream();
        const result1: number[] = [];
        const result2: number[] = [];
        for (let i = 0; i < 10; i++) {
            result1.push(rng1.getUInt32());
            result2.push(rng2.getUInt32());
        }
        expect(result1).not.toEqual(result2);
    });
    
    test('Float range', () => {
        const rng = new RandomStream();
        rng.seed = 1;
        for (let i = 0; i < 1000; i++) {
            const val = rng.getFloat();
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(1);
        }
    });
    
    test('Get signed float', () => {
        const rand = new RandomStream();
        const values: number[] = [];
        for (let i = 0; i < 100; i++) {
            const val = rand.getSignedFloat();
            values.push(val);
            expect(val).toBeGreaterThan(-1);
            expect(val).toBeLessThan(1);
        }
        expect(values.findIndex((val) => val < 0)).not.toBe(-1);
    });
    
    test ('Same seed RNG should produce same sequence', () => {
        const rng1 = new RandomStream(12345);
        const rng2 = new RandomStream(12345);
        for (let i = 0; i < 1000; i++) {
            const val1 = rng1.getFloat();
            const val2 = rng2.getFloat();
            expect(val1).toBe(val2);
        }
    });
    
    test('Generate Consistent Random Numbers', () => {
        const rng = new RandomStream(23456);
        const expected = [43, 18, 33, 52, 83, 62, 37, 40, 7, 70];
        for (let i = 0; i < 10; i++) {
            expect(rng.getIntFromRange(0, 100)).toBe(expected[i]);
        }
    });
    
    test('Generate values in range', () => {
        const rng = new RandomStream(34567);
        for (let i = 0; i < 1000; i++) {
            const val = rng.getIntFromRange(30, 40);
            expect(val).toBeGreaterThanOrEqual(30);
            expect(val).toBeLessThan(40);
        }
    });
    
    test('Generate float values in range', () => {
        const rng = new RandomStream(34567);
        for (let i = 0; i < 1000; i++) {
            const val = rng.getFloatFromRange(30, 40);
            expect(val).toBeGreaterThanOrEqual(30);
            expect(val).toBeLessThan(40);
        }
    });
    
    test('static getFloat', () => {
        for (let i = 0; i < 100; i++) {
            const seed = Math.random() * 10000;
            expect(new RandomStream(seed).getFloat()).toBe(RandomStream.getFloat(seed));
        }
    });
    
    test('static get3Float', () => {
        const temp = new Vec3();
        for (let i = 0; i < 100; i++) {
            const seed = Math.random() * 10000;
            const rand = new RandomStream(seed);
            expect(rand.getFloat()).toBe(RandomStream.get3Float(seed, temp).x);
            expect(rand.getFloat()).toBe(RandomStream.get3Float(seed, temp).y);
            expect(rand.getFloat()).toBe(RandomStream.get3Float(seed, temp).z);
        }
    });

    test('sub sequence', () => {
        const rng = new RandomStream(12345);
        const rng2 = new RandomStream(rng.getUInt32());
        for (let i = 0; i < 1000; i++) {
            const val1 = rng.getFloat();
            const val2 = rng2.getFloat();
            expect(val1).toStrictEqual(val2);
        }
    })

    test('distribution', () => {
        for (let i = 0; i < 10; i++) {
            const rng = new RandomStream(Math.floor(Math.random() * 100000));
            const result: number[] = [];
            for (let i = 0; i < 200000; i++) {
                result.push(rng.getFloat());
            }
            const avg = result.reduce((a, b) => a + b, 0) / result.length;
            const variance = result.reduce((a, b) => a + (b - avg) ** 2, 0) / result.length;
            expect(avg).toBeCloseTo(0.5, 2);
            expect(variance).toBeCloseTo(1 / 12, 2);
        }
    });
});
  