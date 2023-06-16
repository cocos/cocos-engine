
import { Rand1, RandomStream, RandRanged1 } from "../../cocos/vfx/rand";

describe ('rand-num-gen', () => {
    test ('RNG with no seed should produce different sequence', () => {
        const result1: number[] = [];
        const result2: number[] = [];
        for (let i = 0; i < 10; i++) {
            result1.push(Rand1(Math.floor(Math.random() * 1000), 0, 0));
            result2.push(Rand1(Math.floor(Math.random() * 1000), 0, 0));
        }
        expect(result1).not.toStrictEqual(result2);
    });
    
    test('Float range', () => {
        for (let i = 0; i < 1000; i++) {
            const val = Rand1(i, 0, 0);
            expect(val).toBeGreaterThanOrEqual(0);
            expect(val).toBeLessThan(1);
        }
    });
    
    test ('Same seed RNG should produce same sequence', () => {
        for (let i = 0; i < 1000; i++) {
            const val1 = Rand1(i, 0, 0);
            const val2 = Rand1(i, 0, 0);
            expect(val1).toBe(val2);
        }
    });
    
    test('Generate float values in range', () => {
        for (let i = 0; i < 1000; i++) {
            const val = RandRanged1(30, 40, i, 0, 0);
            expect(val).toBeGreaterThanOrEqual(30);
            expect(val).toBeLessThan(40);
        }
    });

    test('distribution', () => {
        for (let i = 0; i < 10; i++) {
            const seed2 = Math.floor(Math.random() * 1000);
            const seed3 = Math.floor(Math.random() * 1000);
            const result: number[] = [];
            for (let j = 0; j < 200000; j++) {
                result.push(Rand1(j, seed2, seed3));
            }
            const avg = result.reduce((a, b) => a + b, 0) / result.length;
            const variance = result.reduce((a, b) => a + (b - avg) ** 2, 0) / result.length;
            expect(avg).toBeCloseTo(0.5, 2);
            expect(variance).toBeCloseTo(1 / 12, 2);
        }
        for (let i = 0; i < 10; i++) {
            const seed1 = Math.floor(Math.random() * 1000);
            const seed3 = Math.floor(Math.random() * 1000);
            const result: number[] = [];
            for (let j = 0; j < 200000; j++) {
                result.push(Rand1(seed1, j, seed3));
            }
            const avg = result.reduce((a, b) => a + b, 0) / result.length;
            const variance = result.reduce((a, b) => a + (b - avg) ** 2, 0) / result.length;
            expect(avg).toBeCloseTo(0.5, 2);
            expect(variance).toBeCloseTo(1 / 12, 2);
        }
        for (let i = 0; i < 10; i++) {
            const seed1 = Math.floor(Math.random() * 1000);
            const seed2 = Math.floor(Math.random() * 1000);
            const result: number[] = [];
            for (let j = 0; j < 200000; j++) {
                result.push(Rand1(seed1, seed2, j));
            }
            const avg = result.reduce((a, b) => a + b, 0) / result.length;
            const variance = result.reduce((a, b) => a + (b - avg) ** 2, 0) / result.length;
            expect(avg).toBeCloseTo(0.5, 2);
            expect(variance).toBeCloseTo(1 / 12, 2);
        }
    });

    test('Relevance testing', () => {
        for (let i = 0; i < 10; i++) {
            const result: number[] = [];
            const seed1 = Math.floor(Math.random() * 0xffffffff);
            const seed2 = Math.floor(Math.random() * 0xffffffff);
            for (let j = 0; j < 100000; j++) {
                result.push(Rand1(j, seed1, seed2));
            }
            
            let relevanceCoefficient = 0;
            for (let i = 0; i < result.length; i++) {
                const val = result[i];
                const val2 = result[i + 1 === result.length ? 0 : i + 1];
                const val2GreaterThenValChance = 1 - val;
                const val2LessThenValChance = val;
                if (val2 > val) {
                    relevanceCoefficient += 1 / val2GreaterThenValChance;
                } else {
                    relevanceCoefficient += 1 / val2LessThenValChance;
                }
            }
    
            relevanceCoefficient /= result.length;
            expect(relevanceCoefficient).toBeCloseTo(2, 1);
        }
        
    });
});
  