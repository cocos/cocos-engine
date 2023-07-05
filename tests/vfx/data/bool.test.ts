import { VFXBool, VFXBoolArray } from "../../../cocos/vfx/data/bool";
import { VFXValueType } from "../../../cocos/vfx/vfx-parameter";

describe('BoolArrayParameter', () => {
    const boolArray = new VFXBoolArray();
    test('basic', () => {
        expect(boolArray.type).toBe(VFXValueType.BOOL);
        expect(boolArray.isArray).toBeTruthy();
        expect(boolArray.isObject).toBeFalsy();
    });
    
    test('size', () => {
        expect(boolArray.size).toBe(16);
        expect(() => boolArray.getBoolAt(15)).not.toThrowError();
        expect(() => boolArray.getBoolAt(16)).toThrowError();
        boolArray.reserve(32);
        expect(boolArray.size).toBe(32);
        expect(() => boolArray.getBoolAt(31)).not.toThrowError();
        expect(() => boolArray.getBoolAt(32)).toThrowError();
        boolArray.reserve(16);
        expect(boolArray.size).toBe(32);
        expect(() => boolArray.getBoolAt(31)).not.toThrowError();
        expect(() => boolArray.getBoolAt(32)).toThrowError();
    });

    test('setBoolAt/getBoolAt', () => {
        expect(() => boolArray.setBoolAt(true, 100)).toThrowError();
        expect(() => boolArray.getBoolAt(100)).toThrowError();
        expect(() => boolArray.getBoolAt(-1)).toThrowError();
        expect(() => boolArray.setBoolAt(true, -1)).toThrowError();
        for (let i = 0; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeFalsy();
        }
        const randomIndex = Math.floor(Math.random() * boolArray.size);
        boolArray.setBoolAt(true, randomIndex);
        for (let i = 0; i < boolArray.size; i++) {
            if (i === randomIndex) {
                expect(boolArray.getBoolAt(i)).toBeTruthy();
            } else {
                expect(boolArray.getBoolAt(i)).toBeFalsy();
            }
        }
        for (let i = 0; i < boolArray.size; i++) {
            boolArray.setBoolAt(true, i);
        }
        for (let i = 0; i < boolArray.size; i += 2) {
            expect(boolArray.getBoolAt(i)).toBeTruthy();
            boolArray.setBoolAt(false, i);
        }
        for (let i = 0; i < boolArray.size; i++) {
            if (i % 2 === 0) {
                expect(boolArray.getBoolAt(i)).toBeFalsy();
            } else {
                expect(boolArray.getBoolAt(i)).toBeTruthy();
            }
        }
    });

    test('fill', () => {
        expect(() => boolArray.fill(true, 0, 100)).toThrowError();
        expect(() => boolArray.fill(true, 1, 0)).toThrowError();
        expect(() => boolArray.fill(true, -1, 0)).toThrowError();
        boolArray.fill(true, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeTruthy();
        }
        boolArray.fill(false, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeFalsy();
        }
        const randomIndex = Math.floor(Math.random() * boolArray.size);
        const randomIndex2 = Math.floor(Math.random() * boolArray.size);
        const min = randomIndex < randomIndex2 ? randomIndex : randomIndex2;
        const max = randomIndex < randomIndex2 ? randomIndex2 : randomIndex;
        boolArray.fill(true, min, max);
        for (let i = 0; i < boolArray.size; i++) {
            if (i >= min && i < max) {
                expect(boolArray.getBoolAt(i)).toBeTruthy();
            } else {
                expect(boolArray.getBoolAt(i)).toBeFalsy();
            }
        }
    });

    test('moveTo', () => {
        expect(() => boolArray.moveTo(100, 0)).toThrowError();
        expect(() => boolArray.moveTo(0, 100)).toThrowError();
        expect(() => boolArray.moveTo(-1, 0)).toThrowError();
        expect(() => boolArray.moveTo(0, -1)).toThrowError();
        boolArray.fill(false, 0, boolArray.size);
        boolArray.setBoolAt(true, 0);
        boolArray.moveTo(0, 1);
        expect(boolArray.getBoolAt(0)).toBeTruthy();
        expect(boolArray.getBoolAt(1)).toBeTruthy();
        for (let i = 2; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeFalsy();
        }
        boolArray.moveTo(2, 0);
        expect(boolArray.getBoolAt(0)).toBeFalsy();
        expect(boolArray.getBoolAt(1)).toBeTruthy();
        for (let i = 2; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeFalsy();
        }
        for (let i = 0; i < boolArray.size; i += 2) {
            boolArray.setBoolAt(true, i);
            boolArray.moveTo(i, i + 1);
        }
        for (let i = 0; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeTruthy();
        }

    });

    test('copyFrom', () => {
        const boolArray2 = new VFXBoolArray();
        expect(() => boolArray.copyFrom(boolArray2, 0, boolArray.size)).toThrowError();
        boolArray2.reserve(boolArray.size);
        expect(() => boolArray.copyFrom(boolArray2, 1, 0)).toThrowError();

        boolArray.fill(false, 0, boolArray.size);
        boolArray2.fill(true, 0, boolArray.size);
        boolArray.copyFrom(boolArray2, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(boolArray.getBoolAt(i)).toBeTruthy();
        }
        boolArray.fill(false, 0, boolArray.size);
        boolArray2.fill(true, 0, boolArray.size);
        const randomIndex = Math.floor(Math.random() * boolArray.size);
        const randomIndex2 = Math.floor(Math.random() * boolArray.size);
        const min = randomIndex < randomIndex2 ? randomIndex : randomIndex2;
        const max = randomIndex < randomIndex2 ? randomIndex2 : randomIndex;
        boolArray.copyFrom(boolArray2, min, max);
        for (let i = 0; i < boolArray.size; i++) {
            if (i >= min && i < max) {
                expect(boolArray.getBoolAt(i)).toBeTruthy();
            } else {
                expect(boolArray.getBoolAt(i)).toBeFalsy();
            }
        }

        for (let i = 0; i < boolArray.size; i++) {
            boolArray.setBoolAt(Math.random() > 0.5 ? true : false, i);
        }

        boolArray2.copyFrom(boolArray, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(boolArray2.getBoolAt(i)).toBe(boolArray.getBoolAt(i));
        }
    });

    test('copyToTypedArray', () => {
        const array = new Uint8Array(100);
        expect(() => boolArray.copyToTypedArray(new Uint8Array(10), 0, 3, 0, 0, boolArray.size)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, 0, 0, 3, 0, 1)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, 0, 3, 0, 3, 1)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, 0, 3, 0, -1, 1)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, 0, 3, 0, 1, 10000)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, 0, 3, 1, 1, 100)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, -1, 3, 0, 1, 3)).toThrowError();
        expect(() => boolArray.copyToTypedArray(array, 100, 3, 0, 1, 100)).toThrowError();
        const typedArray = new Uint8Array(boolArray.size * 5);
        const val = Math.random() > 0.5 ? true : false;
        boolArray.fill(val, 0, boolArray.size);
        boolArray.copyToTypedArray(typedArray, 0, 5, 1, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(typedArray[i * 5]).toBe(0);
            expect(typedArray[i * 5 + 1]).toBe(val ? 1 : 0);
            expect(typedArray[i * 5 + 2]).toBe(0);
            expect(typedArray[i * 5 + 3]).toBe(0);
            expect(typedArray[i * 5 + 4]).toBe(0);
        }
        const val2 = Math.random() > 0.5 ? true : false;
        boolArray.fill(val2, 0, boolArray.size);
        boolArray.copyToTypedArray(typedArray, 0, 5, 2, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(typedArray[i * 5]).toBe(0);
            expect(typedArray[i * 5 + 1]).toBe(val ? 1 : 0);
            expect(typedArray[i * 5 + 2]).toBe(val2 ? 1 : 0);
            expect(typedArray[i * 5 + 3]).toBe(0);
            expect(typedArray[i * 5 + 4]).toBe(0);
        }
        const val3 = Math.random() > 0.5 ? true : false;
        boolArray.fill(val3, 0, boolArray.size);
        typedArray.fill(0);
        boolArray.copyToTypedArray(typedArray, 0, 3, 0, 0, boolArray.size);
        for (let i = 0; i < boolArray.size; i++) {
            expect(typedArray[i * 3 + 0]).toBe(val3);
            expect(typedArray[i * 3 + 1]).toBe(0);
            expect(typedArray[i * 3 + 2]).toBe(0);
        }
        expect(boolArray.size * 3).toBeLessThan(typedArray.length);
        for (let i = boolArray.size * 3; i < typedArray.length; i += 3) {
            expect(typedArray[i]).toBe(0);
            expect(typedArray[i + 1]).toBe(0);
            expect(typedArray[i + 2]).toBe(0);
        }

        typedArray.fill(0);
        boolArray.copyToTypedArray(typedArray, 10, 3, 0, 0, 20);
        for (let i = 0; i < 20 * 3; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }
        for (let i = 1000 * 3; i < 3000 + 50 * 3; i += 3) {
            expect(typedArray[i]).toBeCloseTo(val3, 4);
            expect(typedArray[i + 1]).toBeCloseTo(val3, 4);
            expect(typedArray[i + 2]).toBeCloseTo(val3, 4);
        }
        for (let i = 3000 + 50 * 3; i < typedArray.length; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }

        typedArray.fill(0);
        vec3Parameter.copyToTypedArray(typedArray, 100, 3, 0, 0, vec3Parameter.capacity);
        for (let i = 0; i < 100 * 3; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }
        for (let i = 100 * 3; i < 300 + vec3Parameter.capacity * 3; i += 3) {
            expect(typedArray[i]).toBeCloseTo(val3, 4);
            expect(typedArray[i + 1]).toBeCloseTo(val3, 4);
            expect(typedArray[i + 2]).toBeCloseTo(val3, 4);
        }
        for (let i = 300 + vec3Parameter.capacity * 3; i < typedArray.length; i++) {
            expect(typedArray[i]).toBeCloseTo(0, 4);
        }
    });
});

describe('VFXBool', () => {
    const boolVal = new VFXBool();
    test('basic', () => {
        expect(boolVal.type).toBe(VFXValueType.BOOL);
        expect(boolVal.isArray).toBe(false);
    });

    test('data', () => {
        expect(boolVal.data).toBe(false);
        boolVal.data = true;
        expect(boolVal.data).toBe(true);
        boolVal.data = false;
        expect(boolVal.data).toBe(false);
    });
});