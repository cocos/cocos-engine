import { VFXValueType } from "../../../cocos/vfx/define";
import { FloatArrayParameter, FloatParameter } from "../../../cocos/vfx/parameters/float";
import { RandomStream } from "../../../cocos/vfx/random-stream";

describe('FloatArrayParameter', () => {
    const floatParameter = new FloatArrayParameter();
    test('basic', () => {
        expect(floatParameter.type).toBe(VFXValueType.FLOAT);
        expect(floatParameter.isArray).toBeTruthy();
        expect(floatParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(floatParameter.capacity).toBe(16);
        expect(floatParameter.data).toBeTruthy();
        expect(floatParameter.data.length).toBe(16 * floatParameter.stride);
        floatParameter.reserve(32);
        expect(floatParameter.capacity).toBe(32);
        expect(floatParameter.data.length).toBe(32 * floatParameter.stride);
        floatParameter.reserve(16);
        expect(floatParameter.capacity).toBe(32);
        expect(floatParameter.data.length).toBe(32 * floatParameter.stride);
    });

    test('getFloatAt', () => {
        expect(() => floatParameter.getFloatAt(-1)).toThrowError();
        expect(() => floatParameter.getFloatAt(200)).toThrowError();
        const randomIndex = Math.floor(Math.random() * floatParameter.capacity);
        const val = Math.random() * 100;
        floatParameter.data[randomIndex] = val;
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i === randomIndex) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(0, 4);
            }
        }
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < floatParameter.capacity; i++) {
            floatParameter.data[i] = randomStream.getFloat() * 100;
        }
        for (let i = 0; i < floatParameter.capacity; i++) {
            const random = randomStream2.getFloat() * 100;
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(random, 4);
        }
    });

    test('setFloatAt', () => {
        expect(() => floatParameter.setFloatAt(0, -1)).toThrowError();
        expect(() => floatParameter.setFloatAt(0, 200)).toThrowError();
        const randomIndex = Math.floor(Math.random() * floatParameter.capacity);
        const val = Math.random() * 100;
        floatParameter.data.fill(0);
        floatParameter.setFloatAt(val, randomIndex);
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i === randomIndex) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(0, 4);
            }
        }
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < floatParameter.capacity; i++) {
            floatParameter.setFloatAt(randomStream.getFloat() * 100, i);
        }
        for (let i = 0; i < floatParameter.capacity; i++) {
            const random = randomStream2.getFloat() * 100;
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(random, 4);
        }
    });

    test('addFloatAt', () => {
        expect(() => floatParameter.addFloatAt(0, -1)).toThrowError();
        expect(() => floatParameter.addFloatAt(0, 200)).toThrowError();
        const randomIndex = Math.floor(Math.random() * floatParameter.capacity);
        const val = Math.random() * 100;
        floatParameter.data.fill(1);
        floatParameter.addFloatAt(val, randomIndex);
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i === randomIndex) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val + 1, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(1, 4);
            }
        }
        floatParameter.setFloatAt(1, randomIndex);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < floatParameter.capacity; i++) {
            floatParameter.addFloatAt(randomStream.getFloat() * 100, i);
        }
        for (let i = 0; i < floatParameter.capacity; i++) {
            const random = randomStream2.getFloat() * 100 + 1;
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(random, 4);
        }
    });

    test('multiplyFloatAt', () => {
        expect(() => floatParameter.multiplyFloatAt(0, -1)).toThrowError();
        expect(() => floatParameter.multiplyFloatAt(0, 200)).toThrowError();
        const randomIndex = Math.floor(Math.random() * floatParameter.capacity);
        const val = Math.random() * 100;
        floatParameter.data.fill(1);
        floatParameter.multiplyFloatAt(val, randomIndex);
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i === randomIndex) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(1, 4);
            }
        }
        floatParameter.setFloatAt(1, randomIndex);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < floatParameter.capacity; i++) {
            floatParameter.multiplyFloatAt(randomStream.getFloat() * 100, i);
        }
        for (let i = 0; i < floatParameter.capacity; i++) {
            const random = randomStream2.getFloat() * 100;
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(random, 4);
        }
    });

    test('move', () => {
        expect(() => floatParameter.move(-1, 0)).toThrowError();
        expect(() => floatParameter.move(0, -1)).toThrowError();
        expect(() => floatParameter.move(0, 200)).toThrowError();
        expect(() => floatParameter.move(200, 0)).toThrowError();
        for (let i = 0; i < floatParameter.capacity; i++) {
            floatParameter.setFloatAt(i, i);
        }
        floatParameter.move(0, 1);
        expect(floatParameter.getFloatAt(0)).toBeCloseTo(0, 4);
        expect(floatParameter.getFloatAt(1)).toBeCloseTo(0, 4);
        floatParameter.move(floatParameter.capacity - 1, 0);
        expect(floatParameter.getFloatAt(0)).toBeCloseTo(floatParameter.capacity - 1, 4);
        expect(floatParameter.getFloatAt(floatParameter.capacity - 1)).toBeCloseTo(floatParameter.capacity - 1, 4);
        for (let i = 0; i < 100; i++) {
            const randomIndex = Math.floor(Math.random() * floatParameter.capacity);
            const randomIndex2 = Math.floor(Math.random() * floatParameter.capacity);
            floatParameter.move(randomIndex, randomIndex2);
            expect(floatParameter.getFloatAt(randomIndex)).toBeCloseTo(floatParameter.getFloatAt(randomIndex2), 4);
        }
       
    });

    test('fill', () => {
        expect(() => floatParameter.fill(1, -1, 1)).toThrowError();
        expect(() => floatParameter.fill(1, 0, 200)).toThrowError();
        expect(() => floatParameter.fill(1, 200, 0)).toThrowError();
        floatParameter.fill(1, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(1, 4);
        }
        floatParameter.fill(0, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(0, 4);
        }
        const randomIndex = Math.floor(Math.random() * floatParameter.capacity);
        const val = Math.random() * 100;
        floatParameter.fill(val, randomIndex, randomIndex + 1);
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i === randomIndex) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(0, 4);
            }
        }
    });

    test('copyFrom', () => {
        const floatParameter2 = new FloatArrayParameter();
        expect(() => floatParameter.copyFrom(floatParameter2, -1, 0)).toThrowError();
        expect(() => floatParameter.copyFrom(floatParameter2, 0, -1)).toThrowError();
        expect(() => floatParameter.copyFrom(floatParameter2, 0, 200)).toThrowError();
        expect(() => floatParameter.copyFrom(floatParameter2, 200, 0)).toThrowError();
        expect(() => floatParameter.copyFrom(floatParameter2, 0, 25)).toThrowError();
        floatParameter2.reserve(floatParameter.capacity);
        const val = Math.random() * 100;
        floatParameter2.fill(val, 0, floatParameter2.capacity);
        floatParameter.copyFrom(floatParameter2, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
        }
        floatParameter.reserve(2000);
        floatParameter2.reserve(2000);
        floatParameter.fill(0, 0, floatParameter.capacity);
        floatParameter2.fill(val, 0, floatParameter2.capacity);
        floatParameter.copyFrom(floatParameter2, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
        }
        floatParameter.fill(0, 0, floatParameter.capacity);
        floatParameter.copyFrom(floatParameter2, 50, 100);
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i >= 50 && i < 100) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(0, 4);
            }
        }
        floatParameter.fill(0, 0, floatParameter.capacity);
        floatParameter.copyFrom(floatParameter2, 50, 1250);
        for (let i = 0; i < floatParameter.capacity; i++) {
            if (i >= 50 && i < 1250) {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(val, 4);
            } else {
                expect(floatParameter.getFloatAt(i)).toBeCloseTo(0, 4);
            }
        }

    });

    test('copyToTypedArray', () => {
        const typedArray = new Float32Array(10000);
        expect(() => floatParameter.copyToTypedArray(new Float32Array(100), 0, 1, 0, 0, floatParameter.capacity)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, -1, 1, 0, 0, 100)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, 10000, 1, 0, 0, 100)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, 0, 0, 0, 0, 100)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, 0, 1, 1, 0, 100)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, 0, 1, 0, -1, 100)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, 0, 1, 0, 10000, 100)).toThrowError();
        expect(() => floatParameter.copyToTypedArray(typedArray, 0, 1, 0, 0, 10000)).toThrowError();
        const val = Math.random() * 1000 - 500;
        floatParameter.fill(val, 0, floatParameter.capacity);
        floatParameter.copyToTypedArray(typedArray, 0, 2, 1, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(typedArray[i * 2]).toBeCloseTo(0, 5);
            expect(typedArray[i * 2 + 1]).toBeCloseTo(val, 4);
        }
        const val2 = Math.random() * 1000 - 500;
        floatParameter.fill(val2, 0, floatParameter.capacity);
        floatParameter.copyToTypedArray(typedArray, 0, 2, 0, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(typedArray[i * 2]).toBeCloseTo(val2, 4);
            expect(typedArray[i * 2 + 1]).toBeCloseTo(val, 4);
        }
        const val3 = Math.random() * 1000 - 500;
        floatParameter.fill(val3, 0, floatParameter.capacity);
        typedArray.fill(0);
        floatParameter.copyToTypedArray(typedArray, 0, 3, 0, 0, floatParameter.capacity);
        for (let i = 0; i < floatParameter.capacity; i++) {
            expect(typedArray[i * 3 + 0]).toBeCloseTo(val3, 4);
            expect(typedArray[i * 3 + 1]).toBeCloseTo(0, 4);
            expect(typedArray[i * 3 + 2]).toBeCloseTo(0, 4);
        }
        expect(floatParameter.capacity * 3).toBeLessThan(typedArray.length);
        for (let i = floatParameter.capacity * 3; i < typedArray.length; i++) {
            expect(typedArray[i]).toBe(0);
        }

        typedArray.fill(0);
        floatParameter.copyToTypedArray(typedArray, 1000, 1, 0, 0, 50);
        for (let i = 0; i < 1000; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }
        for (let i = 1000; i < 1000 + 50; i++) {
            expect(typedArray[i]).toBeCloseTo(val3, 4);
        }
        for (let i = 1000 + 50; i < typedArray.length; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }

        typedArray.fill(0);
        floatParameter.copyToTypedArray(typedArray, 100, 1, 0, 0, floatParameter.capacity);
        for (let i = 0; i < 100; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }
        for (let i = 100; i < 100 + floatParameter.capacity; i++) {
            expect(typedArray[i]).toBeCloseTo(val3, 4);
        }
        for (let i = 100 + floatParameter.capacity; i < typedArray.length; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }
    });
});

describe('FloatParameter', () => {
    const floatParameter = new FloatParameter();
    test('basic', () => {
        expect(floatParameter.type).toBe(VFXValueType.FLOAT);
        expect(floatParameter.isArray).toBeFalsy();
    });

    test('data', () => {
        expect(floatParameter.data).toBe(0);
        const val = Math.random() * 1000 - 500;
        floatParameter.data = val;
        expect(floatParameter.data).toBeCloseTo(val, 4);
    });
});