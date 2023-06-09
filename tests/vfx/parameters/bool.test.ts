import { VFXValueType } from "../../../cocos/vfx/define";
import { BoolArrayParameter, BoolParameter } from "../../../cocos/vfx/parameters/bool";

describe('BoolArrayParameter', () => {
    const boolParameter = new BoolArrayParameter();
    test('basic', () => {
        expect(boolParameter.type).toBe(VFXValueType.BOOL);
        expect(boolParameter.isArray).toBeTruthy();
        expect(boolParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(boolParameter.capacity).toBe(16);
        expect(boolParameter.data).toBeTruthy();
        expect(boolParameter.data.length).toBe(16 * boolParameter.stride);
        boolParameter.reserve(32);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32 * boolParameter.stride);
        boolParameter.reserve(16);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32 * boolParameter.stride);
    });

    test('setBoolAt/getBoolAt', () => {
        expect(() => boolParameter.setBoolAt(true, 100)).toThrowError();
        expect(() => boolParameter.getBoolAt(100)).toThrowError();
        expect(() => boolParameter.getBoolAt(-1)).toThrowError();
        expect(() => boolParameter.setBoolAt(true, -1)).toThrowError();
        boolParameter.data.fill(0);
        for (let i = 0; i < boolParameter.capacity; i++) {
            expect(boolParameter.getBoolAt(i)).toBeFalsy();
        }
        const randomIndex = Math.floor(Math.random() * boolParameter.capacity);
        boolParameter.setBoolAt(true, randomIndex);
        for (let i = 0; i < boolParameter.capacity; i++) {
            if (i === randomIndex) {
                expect(boolParameter.getBoolAt(i)).toBeTruthy();
            } else {
                expect(boolParameter.getBoolAt(i)).toBeFalsy();
            }
        }
        boolParameter.data.fill(1);
        for (let i = 0; i < boolParameter.capacity; i += 2) {
            expect(boolParameter.getBoolAt(i)).toBeTruthy();
            boolParameter.setBoolAt(false, i);
        }
        for (let i = 0; i < boolParameter.capacity; i++) {
            if (i % 2 === 0) {
                expect(boolParameter.getBoolAt(i)).toBeFalsy();
            } else {
                expect(boolParameter.getBoolAt(i)).toBeTruthy();
            }
        }
    });

    test('move', () => {
        expect(() => boolParameter.move(100, 0)).toThrowError();
        expect(() => boolParameter.move(0, 100)).toThrowError();
        expect(() => boolParameter.move(-1, 0)).toThrowError();
        expect(() => boolParameter.move(0, -1)).toThrowError();
        boolParameter.data.fill(0);
        boolParameter.setBoolAt(true, 0);
        boolParameter.move(0, 1);
        expect(boolParameter.getBoolAt(0)).toBeTruthy();
        expect(boolParameter.getBoolAt(1)).toBeTruthy();
        for (let i = 2; i < boolParameter.capacity; i++) {
            expect(boolParameter.getBoolAt(i)).toBeFalsy();
        }
        boolParameter.move(2, 0);
        expect(boolParameter.getBoolAt(0)).toBeFalsy();
        expect(boolParameter.getBoolAt(1)).toBeTruthy();
        for (let i = 2; i < boolParameter.capacity; i++) {
            expect(boolParameter.getBoolAt(i)).toBeFalsy();
        }
    });

    test('fill', () => {
        expect(() => boolParameter.fill(true, 0, 100)).toThrowError();
        expect(() => boolParameter.fill(true, 1, 0)).toThrowError();
        expect(() => boolParameter.fill(true, -1, 0)).toThrowError();
        boolParameter.fill(true, 0, boolParameter.capacity);
        for (let i = 0; i < boolParameter.capacity; i++) {
            expect(boolParameter.getBoolAt(i)).toBeTruthy();
        }
        boolParameter.fill(false, 0, boolParameter.capacity);
        for (let i = 0; i < boolParameter.capacity; i++) {
            expect(boolParameter.getBoolAt(i)).toBeFalsy();
        }
    });

    test('copyFrom', () => {

    });

    test('copyToTypedArray', () => {

    });
});

describe('BoolParameter', () => {
    const boolParameter = new BoolParameter();
    test('basic', () => {
        expect(boolParameter.type).toBe(VFXValueType.BOOL);
        expect(boolParameter.isArray).toBe(false);
    });

    test('data', () => {
        expect(boolParameter.data).toBe(false);
        boolParameter.data = true;
        expect(boolParameter.data).toBe(true);
        boolParameter.data = false;
        expect(boolParameter.data).toBe(false);
    });
});