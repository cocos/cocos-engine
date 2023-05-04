import { Vec3 } from "../../../cocos/core";
import { VFXParameterType } from "../../../cocos/vfx/define";
import { Vec3ArrayParameter } from "../../../cocos/vfx/parameters/vec3";
import { RandomStream } from "../../../cocos/vfx/random-stream";
import { BATCH_OPERATION_THRESHOLD_VEC3 } from "../../../cocos/vfx/vfx-parameter";


describe('Vec3ArrayParameter', () => {
    const vec3Parameter = new Vec3ArrayParameter();
    const vec3 = new Vec3();
    test('basic', () => {
        expect(vec3Parameter.stride).toBe(3);
        expect(vec3Parameter.type).toBe(VFXParameterType.VEC3);
    });
    
    test('capacity', () => {
        expect(vec3Parameter.capacity).toBe(16);
        expect(vec3Parameter.data).toBeTruthy();
        expect(vec3Parameter.data instanceof Float32Array).toBeTruthy();
        expect(vec3Parameter.data.length).toBe(16 * vec3Parameter.stride);
        for (let i = 0; i < vec3Parameter.capacity * vec3Parameter.stride; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        vec3Parameter.reserve(32);
        expect(vec3Parameter.capacity).toBe(32);
        expect(vec3Parameter.data.length).toBe(32 * vec3Parameter.stride);
        for (let i = 0; i < vec3Parameter.capacity * vec3Parameter.stride; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        vec3Parameter.reserve(16);
        expect(vec3Parameter.capacity).toBe(32);
        expect(vec3Parameter.data.length).toBe(32 * vec3Parameter.stride);
    });

    test('fill1f', () => {
        expect(() => vec3Parameter.fill1f(1, -1, 2)).toThrowError();
        expect(() => vec3Parameter.fill1f(1, 2, 10000)).toThrowError();
        expect(() => vec3Parameter.fill1f(1, 3, 2)).toThrowError();
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(1);
        }
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3Parameter.fill1f(2, randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.data[randomIndex * 3]).toBe(2);
                expect(vec3Parameter.data[randomIndex * 3 + 1]).toBe(2);
                expect(vec3Parameter.data[randomIndex * 3 + 2]).toBe(2);
            } else {
                expect(vec3Parameter.data[i * 3]).toBe(1);
                expect(vec3Parameter.data[i * 3 + 1]).toBe(1);
                expect(vec3Parameter.data[i * 3 + 2]).toBe(1);
            }
        }
        vec3Parameter.fill1f(1, randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3Parameter.fill1f(i, i, i + 1);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 0) {
                expect(vec3Parameter.data[i * 3]).toBe(i);
                expect(vec3Parameter.data[i * 3 + 1]).toBe(i);
                expect(vec3Parameter.data[i * 3 + 2]).toBe(i);
            } else {
                expect(vec3Parameter.data[i * 3]).toBe(1);
                expect(vec3Parameter.data[i * 3 + 1]).toBe(1);
                expect(vec3Parameter.data[i * 3 + 2]).toBe(1);
            }
        }
        vec3Parameter.fill1f(0, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        vec3Parameter.fill1f(1, 5, 10);
        for (let i = 0; i < 5 * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        for (let i = 5 * 3; i < 10 * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(1);
        }
        for (let i = 10 * 3; i < vec3Parameter.capacity * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        vec3Parameter.reserve(BATCH_OPERATION_THRESHOLD_VEC3 * 3);
        vec3Parameter.fill1f(1.5, 0, BATCH_OPERATION_THRESHOLD_VEC3 * 2);
        for (let i = 0; i < BATCH_OPERATION_THRESHOLD_VEC3 * 2 * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(1.5);
        }
        for (let i = BATCH_OPERATION_THRESHOLD_VEC3 * 2 * 3; i < vec3Parameter.capacity * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
    });

    test('set x, y, z, get x, y, z', () => {
        vec3Parameter.fill1f(0, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.setXAt(1, -1)).toThrowError();
        expect(() => vec3Parameter.setXAt(1, 10000)).toThrowError();
        expect(() => vec3Parameter.setYAt(1, -1)).toThrowError();
        expect(() => vec3Parameter.setYAt(1, 10000)).toThrowError();
        expect(() => vec3Parameter.setZAt(1, -1)).toThrowError();
        expect(() => vec3Parameter.setZAt(1, 10000)).toThrowError();
        expect(() => vec3Parameter.getXAt(-1)).toThrowError();
        expect(() => vec3Parameter.getXAt(10000)).toThrowError();
        expect(() => vec3Parameter.getYAt(-1)).toThrowError();
        expect(() => vec3Parameter.getYAt(10000)).toThrowError();
        expect(() => vec3Parameter.getZAt(-1)).toThrowError();
        expect(() => vec3Parameter.getZAt(10000)).toThrowError();
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            expect(vec3Parameter.getXAt(i)).toBe(0);
            expect(vec3Parameter.getYAt(i)).toBe(0);
            expect(vec3Parameter.getZAt(i)).toBe(0);
        }
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3Parameter.setXAt(2, randomIndex);
        vec3Parameter.setYAt(3, randomIndex);
        vec3Parameter.setZAt(4, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.data[randomIndex * 3]).toBe(2);
                expect(vec3Parameter.data[randomIndex * 3 + 1]).toBe(3);
                expect(vec3Parameter.data[randomIndex * 3 + 2]).toBe(4);
            } else {
                expect(vec3Parameter.data[i * 3]).toBe(0);
                expect(vec3Parameter.data[i * 3 + 1]).toBe(0);
                expect(vec3Parameter.data[i * 3 + 2]).toBe(0);
            }
        }
        vec3Parameter.setXAt(0, randomIndex);
        vec3Parameter.setYAt(0, randomIndex);
        vec3Parameter.setZAt(0, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3Parameter.setXAt(i ** 2, i);
            vec3Parameter.setYAt(i / vec3Parameter.capacity, i);
            vec3Parameter.setZAt(Math.sqrt(i), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 0) {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(i ** 2, 5);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(i / vec3Parameter.capacity, 5);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(Math.sqrt(i), 5);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            }
        }
    });

    test('set3fAt', () => {
        expect(() => vec3Parameter.set3fAt(1, 2, 3, -1)).toThrowError();
        expect(() => vec3Parameter.set3fAt(1, 2, 3, 10000)).toThrowError();
        vec3Parameter.fill1f(0, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity); 
        vec3Parameter.set3fAt(1, 2, 3, randomIndex);
        for (let i = 1; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBe(1);
                expect(vec3Parameter.getYAt(i)).toBe(2);
                expect(vec3Parameter.getZAt(i)).toBe(3);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            }
        }
        vec3Parameter.set3fAt(0, 0, 0, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3Parameter.set3fAt(i * 3, i * 3 + 1, i * 3 + 2, i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 1) {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(i * 3);
                expect(vec3Parameter.getYAt(i)).toBe(i * 3 + 1);
                expect(vec3Parameter.getZAt(i)).toBe(i * 3 + 2);
            }
        }

        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 1) {
                vec3Parameter.set3fAt(i * 3, i * 3 + 1, i * 3 + 2, i);
            } else {
                vec3Parameter.set3fAt(0, 0, 0, i);
            }
        }

        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 0) {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(i * 3);
                expect(vec3Parameter.getYAt(i)).toBe(i * 3 + 1);
                expect(vec3Parameter.getZAt(i)).toBe(i * 3 + 2);
            }
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.set3fAt(i ** 2, i / vec3Parameter.capacity, Math.sqrt(i), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            expect(vec3Parameter.getXAt(i)).toBeCloseTo(i ** 2, 5);
            expect(vec3Parameter.getYAt(i)).toBeCloseTo(i / vec3Parameter.capacity, 5);
            expect(vec3Parameter.getZAt(i)).toBeCloseTo(Math.sqrt(i), 5);
        }
    });

    

    test('getVec3At', () => {
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.getVec3At(vec3, -1)).toThrowError();
        expect(() => vec3Parameter.getVec3At(vec3, 10000)).toThrowError();
        expect(vec3Parameter.getVec3At(vec3, 0)).toBe(vec3);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBe(1);
            expect(vec3.y).toBe(1);
            expect(vec3.z).toBe(1);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.set3fAt(i ** 2, i / vec3Parameter.capacity, Math.sqrt(i), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(i ** 2, 5);
            expect(vec3.y).toBeCloseTo(i / vec3Parameter.capacity, 5);
            expect(vec3.z).toBeCloseTo(Math.sqrt(i), 5);
        }

    });

    test('move', () => {
        vec3Parameter.fill1f(0, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.move(1, -1)).toThrowError();
        expect(() => vec3Parameter.move(1, 10000)).toThrowError();
        const randomIndex1 = Math.floor(Math.random() * vec3Parameter.capacity);
        const randomIndex2 = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3Parameter.set3fAt(2, 2, 2, randomIndex1);
        vec3Parameter.set3fAt(3, 3, 3, randomIndex2);
        vec3Parameter.move(randomIndex1, randomIndex2);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex1 || i === randomIndex2) {
                expect(vec3Parameter.getXAt(i)).toBe(2);
                expect(vec3Parameter.getYAt(i)).toBe(2);
                expect(vec3Parameter.getZAt(i)).toBe(2);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            }
        }
        vec3Parameter.set3fAt(0, 0, 0, randomIndex1);
        vec3Parameter.set3fAt(0, 0, 0, randomIndex1);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3Parameter.set3fAt(i ** 2, i / vec3Parameter.capacity, Math.sqrt(i), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3Parameter.move(i, i + 1);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 0) {
                vec3Parameter.getVec3At(vec3, i);
                expect(vec3.x).toBeCloseTo(i ** 2, 5);
                expect(vec3.y).toBeCloseTo(i / vec3Parameter.capacity, 5);
                expect(vec3.z).toBeCloseTo(Math.sqrt(i), 5);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(vec3.x);
                expect(vec3Parameter.getYAt(i)).toBe(vec3.y);
                expect(vec3Parameter.getZAt(i)).toBe(vec3.z);
            }
        }
    });

    test('set1fAt', () => {
        vec3Parameter.fill1f(0, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.set1fAt(1, -1)).toThrowError();
        expect(() => vec3Parameter.set1fAt(1, 10000)).toThrowError();
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3Parameter.set1fAt(2, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBe(2);
                expect(vec3Parameter.getYAt(i)).toBe(2);
                expect(vec3Parameter.getZAt(i)).toBe(2);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            }
        }
        vec3Parameter.set1fAt(0, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3Parameter.set1fAt(vec3Parameter.capacity - i, i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i % 2 === 0) {
                expect(vec3Parameter.getXAt(i)).toBe(vec3Parameter.capacity - i);
                expect(vec3Parameter.getYAt(i)).toBe(vec3Parameter.capacity - i);
                expect(vec3Parameter.getZAt(i)).toBe(vec3Parameter.capacity - i);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            }
        }
    });

    test('setVec3At', () => {
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.setVec3At(vec3, -1)).toThrowError();
        expect(() => vec3Parameter.setVec3At(vec3, 10000)).toThrowError();
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3.set(2, 3, 4);
        vec3Parameter.setVec3At(vec3, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBe(2);
                expect(vec3Parameter.getYAt(i)).toBe(3);
                expect(vec3Parameter.getZAt(i)).toBe(4);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(1);
                expect(vec3Parameter.getYAt(i)).toBe(1);
                expect(vec3Parameter.getZAt(i)).toBe(1);
            }
        }
        vec3Parameter.setVec3At(Vec3.ONE, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3.set(i ** 2, i / vec3Parameter.capacity, Math.sqrt(i));
            vec3Parameter.setVec3At(vec3, i);
            expect(vec3Parameter.getXAt(i)).toBeCloseTo(vec3.x, 5);
            expect(vec3Parameter.getYAt(i)).toBeCloseTo(vec3.y, 5);
            expect(vec3Parameter.getZAt(i)).toBeCloseTo(vec3.z, 5);
        }
        for (let i = 1; i < vec3Parameter.capacity; i += 2) {
            expect(vec3Parameter.getXAt(i)).toBe(1);
            expect(vec3Parameter.getYAt(i)).toBe(1);
            expect(vec3Parameter.getZAt(i)).toBe(1);
        }
    });

    test('addVec3At', () => {
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.addVec3At(vec3, -1)).toThrowError();
        expect(() => vec3Parameter.addVec3At(vec3, 10000)).toThrowError();
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3.set(2, 3, 4);
        vec3Parameter.addVec3At(vec3, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBe(3);
                expect(vec3Parameter.getYAt(i)).toBe(4);
                expect(vec3Parameter.getZAt(i)).toBe(5);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(1);
                expect(vec3Parameter.getYAt(i)).toBe(1);
                expect(vec3Parameter.getZAt(i)).toBe(1);
            }
        }
        vec3Parameter.setVec3At(Vec3.ONE, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3.set(i ** 2, i / vec3Parameter.capacity, Math.sqrt(i));
            vec3Parameter.addVec3At(vec3, i);
            expect(vec3Parameter.getXAt(i)).toBeCloseTo(1 + vec3.x, 5);
            expect(vec3Parameter.getYAt(i)).toBeCloseTo(1 + vec3.y, 5);
            expect(vec3Parameter.getZAt(i)).toBeCloseTo(1 + vec3.z, 5);
        }
    });

    test('subVec3At', () => {
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        expect(() => vec3Parameter.subVec3At(vec3, -1)).toThrowError();
        expect(() => vec3Parameter.subVec3At(vec3, 10000)).toThrowError();
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3.set(2, 3, 4);
        vec3Parameter.subVec3At(vec3, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBe(-1);
                expect(vec3Parameter.getYAt(i)).toBe(-2);
                expect(vec3Parameter.getZAt(i)).toBe(-3);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(1);
                expect(vec3Parameter.getYAt(i)).toBe(1);
                expect(vec3Parameter.getZAt(i)).toBe(1);
            }
        }
        vec3Parameter.setVec3At(Vec3.ONE, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i += 2) {
            vec3.set(i ** 2, i / vec3Parameter.capacity, Math.sqrt(i));
            vec3Parameter.subVec3At(vec3, i);
            expect(vec3Parameter.getXAt(i)).toBeCloseTo(1 - vec3.x, 5);
            expect(vec3Parameter.getYAt(i)).toBeCloseTo(1 - vec3.y, 5);
            expect(vec3Parameter.getZAt(i)).toBeCloseTo(1 - vec3.z, 5);
        }
    });

    test('static add', () => {
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const b = new Vec3ArrayParameter();
        expect(() => Vec3ArrayParameter.add(vec3Parameter, vec3Parameter, b, 0, 100)).toThrowError();
        b.reserve(vec3Parameter.capacity);
        expect(() => Vec3ArrayParameter.add(vec3Parameter, vec3Parameter, b, -1, 100)).toThrowError();
        expect(() => Vec3ArrayParameter.add(vec3Parameter, vec3Parameter, b, 0, 10000)).toThrowError();
        expect(() => Vec3ArrayParameter.add(vec3Parameter, vec3Parameter, b, 3, 2)).toThrowError();
        const val2 = Math.random();
        b.fill1f(val2, 0, b.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        Vec3ArrayParameter.add(vec3Parameter, vec3Parameter, b, randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(val2 + val, 4);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(val2 + val, 4);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(val2 + val, 4);
            } else {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(val, 4);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(val, 4);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(val, 4);
            }
        }
        const randomStream = new RandomStream();
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.setXAt(randomStream.getFloat(), i);
            b.setXAt(randomStream.getFloat(), i);
            vec3Parameter.setYAt(randomStream.getFloat(), i);
            b.setYAt(randomStream.getFloat(), i);
            vec3Parameter.setZAt(randomStream.getFloat(), i);
            b.setZAt(randomStream.getFloat(), i);
        }
        Vec3ArrayParameter.add(vec3Parameter, vec3Parameter, b, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3Parameter.getXAt(i)).toBeCloseTo(randomStream2.getFloat() + randomStream2.getFloat());
            expect(vec3Parameter.getYAt(i)).toBeCloseTo(randomStream2.getFloat() + randomStream2.getFloat());
            expect(vec3Parameter.getZAt(i)).toBeCloseTo(randomStream2.getFloat() + randomStream2.getFloat());
        }
    });


    test('scaleAndAdd', () => {
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const b = new Vec3ArrayParameter();
        expect(() => Vec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 0, 100)).toThrowError();
        b.reserve(vec3Parameter.capacity);
        expect(() => Vec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, -1, 100)).toThrowError();
        expect(() => Vec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 0, 10000)).toThrowError();
        expect(() => Vec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 3, 2)).toThrowError();
        const val2 = Math.random() * 200 - 100;
        b.fill1f(val2, 0, b.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const val3 = Math.random();
        Vec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, val3, randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(val + val2 * val3, 4);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(val + val2 * val3, 4);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(val + val2 * val3, 4);
            } else {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(val, 4);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(val, 4);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(val, 4);
            }
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.set3fAt(i, i + 1, i + 2, i);
            b.set3fAt(i, i - 1, i - 2 ,i);
        }
        Vec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3).toStrictEqual(new Vec3(i * 1.5, 1.5 * i + 0.5, 1.5 * i + 1));
        }
        Vec3ArrayParameter.scaleAndAdd(b, vec3Parameter, b, 0, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(b.getXAt(i)).toBeCloseTo(vec3.x, 5);
            expect(b.getYAt(i)).toBeCloseTo(vec3.y, 5);
            expect(b.getZAt(i)).toBeCloseTo(vec3.z, 5);
        }
    });

    test('static sub', () => {
        const val2 = Math.random() * 1000 - 500;
        vec3Parameter.fill1f(val2, 0, vec3Parameter.capacity);
        const b = new Vec3ArrayParameter();
        expect(() => Vec3ArrayParameter.sub(vec3Parameter, vec3Parameter, b, 0, 100)).toThrowError();
        b.reserve(vec3Parameter.capacity);
        expect(() => Vec3ArrayParameter.sub(vec3Parameter, vec3Parameter, b, -1, 100)).toThrowError();
        expect(() => Vec3ArrayParameter.sub(vec3Parameter, vec3Parameter, b, 0, 10000)).toThrowError();
        expect(() => Vec3ArrayParameter.sub(vec3Parameter, vec3Parameter, b, 3, 2)).toThrowError();
        const val = Math.random() * 1000 - 500;
        b.fill1f(val, 0, b.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        Vec3ArrayParameter.sub(vec3Parameter, vec3Parameter, b, randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(val2 - val, 4);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(val2 - val, 4);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(val2 - val, 4);
            } else {
                expect(vec3Parameter.getXAt(i)).toBeCloseTo(val2, 4);
                expect(vec3Parameter.getYAt(i)).toBeCloseTo(val2, 4);
                expect(vec3Parameter.getZAt(i)).toBeCloseTo(val2, 4);
            }
        }
        const randomStream = new RandomStream(Math.random() * 1000);
        const randomStream2 = new RandomStream(randomStream.seed);
        const randomStream3 = new RandomStream(Math.random() * 1000);
        const randomStream4 = new RandomStream(randomStream3.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.set3fAt(randomStream.getFloatFromRange(-200, 200), 
                randomStream.getFloatFromRange(-200, 200),
                randomStream.getFloatFromRange(-200, 200), i);
            b.set3fAt(randomStream3.getFloatFromRange(-200, 200), 
            randomStream3.getFloatFromRange(-200, 200),
            randomStream3.getFloatFromRange(-200, 200) ,i);
        }
        Vec3ArrayParameter.sub(vec3Parameter, vec3Parameter, b, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(randomStream2.getFloatFromRange(-200, 200) - randomStream4.getFloatFromRange(-200, 200), 4);
            expect(vec3.y).toBeCloseTo(randomStream2.getFloatFromRange(-200, 200) - randomStream4.getFloatFromRange(-200, 200), 4);
            expect(vec3.z).toBeCloseTo(randomStream2.getFloatFromRange(-200, 200) - randomStream4.getFloatFromRange(-200, 200), 4);
        }
    });

    test('fill', () => {
        expect(() => vec3Parameter.fill(vec3, -1, 50)).toThrowError();
        expect(() => vec3Parameter.fill(vec3, 2, 10000)).toThrowError();
        expect(() => vec3Parameter.fill(vec3, 4, 3)).toThrowError();
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        const z = Math.random() * 1000 - 500;
        vec3Parameter.fill(new Vec3(x, y, z), randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(x, 4);
                expect(vec3.y).toBeCloseTo(y, 4);
                expect(vec3.z).toBeCloseTo(z, 4);
            } else {
                expect(vec3).toStrictEqual(Vec3.ONE);
            }
        }
        const x2 = Math.random() * 1000 - 500;
        const y2 = Math.random() * 1000 - 500;
        const z2 = Math.random() * 1000 - 500;
        vec3Parameter.fill(new Vec3(x2, y2, z2), 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(x2, 4);
            expect(vec3.y).toBeCloseTo(y2, 4);
            expect(vec3.z).toBeCloseTo(z2, 4);
        }
    });

    test('copyToTypedArray', () => {
        const array = new Float32Array(10000);
        expect(() => vec3Parameter.copyToTypedArray(new Float32Array(100), 0, 3, 0, 0, vec3Parameter.capacity)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, 0, 0, 3, 0, 1)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, 0, 3, 0, 3, 1)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, 0, 3, 0, -1, 1)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, 0, 3, 0, 1, 10000)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, 0, 3, 1, 1, 100)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, -1, 3, 0, 1, 100)).toThrowError();
        expect(() => vec3Parameter.copyToTypedArray(array, 10000, 3, 0, 1, 100)).toThrowError();
        const typedArray = new Float32Array(vec3Parameter.capacity * 5);
        const val = Math.random() * 1000 - 500;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        vec3Parameter.copyToTypedArray(typedArray, 0, 5, 1, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            expect(typedArray[i * 5]).toBeCloseTo(0, 5);
            expect(typedArray[i * 5 + 1]).toBeCloseTo(val, 4);
            expect(typedArray[i * 5 + 2]).toBeCloseTo(val, 4);
            expect(typedArray[i * 5 + 3]).toBeCloseTo(val, 4);
            expect(typedArray[i * 5 + 4]).toBeCloseTo(0, 5);
        }
        const val2 = Math.random() * 1000 - 500;
        vec3Parameter.fill1f(val2, 0, vec3Parameter.capacity);
        vec3Parameter.copyToTypedArray(typedArray, 0, 5, 2, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            expect(typedArray[i * 5]).toBeCloseTo(0, 5);
            expect(typedArray[i * 5 + 1]).toBeCloseTo(val, 4);
            expect(typedArray[i * 5 + 2]).toBeCloseTo(val2, 4);
            expect(typedArray[i * 5 + 3]).toBeCloseTo(val2, 4);
            expect(typedArray[i * 5 + 4]).toBeCloseTo(val2, 4);
        }
        const val3 = Math.random() * 1000 - 500;
        vec3Parameter.fill1f(val3, 0, vec3Parameter.capacity);
        typedArray.fill(0);
        vec3Parameter.copyToTypedArray(typedArray, 0, 3, 0, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            expect(typedArray[i * 3 + 0]).toBeCloseTo(val3, 4);
            expect(typedArray[i * 3 + 1]).toBeCloseTo(val3, 4);
            expect(typedArray[i * 3 + 2]).toBeCloseTo(val3, 4);
        }
        expect(vec3Parameter.capacity * 3).toBeLessThan(typedArray.length);
        for (let i = vec3Parameter.capacity * 3; i < typedArray.length; i += 3) {
            expect(typedArray[i]).toBe(0);
            expect(typedArray[i + 1]).toBe(0);
            expect(typedArray[i + 2]).toBe(0);
        }

        typedArray.fill(0);
        vec3Parameter.copyToTypedArray(typedArray, 1000, 3, 0, 0, 50);
        for (let i = 0; i < 1000 * 3; i++) {
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

    test('add3fAt', () => {
        expect(() => vec3Parameter.add3fAt(0, 0, 0, -1)).toThrowError();
        expect(() => vec3Parameter.add3fAt(0, 0, 0, 10000)).toThrowError();
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        const z = Math.random() * 1000 - 500;
        vec3Parameter.add3fAt(x, y, z, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(1 + x, 4);
                expect(vec3.y).toBeCloseTo(1 + y, 4);
                expect(vec3.z).toBeCloseTo(1 + z, 4);
            } else {
                expect(vec3).toStrictEqual(Vec3.ONE);
            }
        }
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.add3fAt(randomStream.getSignedFloat() * 1000, randomStream.getSignedFloat() * 100, 
                randomStream.getSignedFloat() * 10, i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(1 + randomStream2.getSignedFloat() * 1000, 4);
            expect(vec3.y).toBeCloseTo(1 + randomStream2.getSignedFloat() * 100, 5);
            expect(vec3.z).toBeCloseTo(1 + randomStream2.getSignedFloat() * 10, 5);
        }
    });

    test('addX, addY, addZ', () => {
        expect(() => vec3Parameter.addXAt(0, -1)).toThrowError();
        expect(() => vec3Parameter.addXAt(0, 10000)).toThrowError();
        expect(() => vec3Parameter.addYAt(0, -1)).toThrowError();
        expect(() => vec3Parameter.addYAt(0, 10000)).toThrowError();
        expect(() => vec3Parameter.addZAt(0, -1)).toThrowError();
        expect(() => vec3Parameter.addZAt(0, 10000)).toThrowError();
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random() * 200 - 100;
        const y = Math.random() * 200 - 100;
        const z = Math.random() * 200 - 100;
        vec3Parameter.addXAt(x, randomIndex);
        vec3Parameter.addYAt(y, randomIndex);
        vec3Parameter.addZAt(z, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(val + x, 4);
                expect(vec3.y).toBeCloseTo(val + y, 4);
                expect(vec3.z).toBeCloseTo(val + z, 4);
            } else {
                expect(vec3.x).toBeCloseTo(val, 4);
                expect(vec3.y).toBeCloseTo(val, 4);
                expect(vec3.z).toBeCloseTo(val, 4);
            }
        }
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const randomStream = new RandomStream();
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.addXAt(randomStream.getSignedFloat() * 1000, i);
            vec3Parameter.addYAt(randomStream.getSignedFloat() * 100, i);
            vec3Parameter.addZAt(randomStream.getSignedFloat() * 10, i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(val + randomStream2.getSignedFloat() * 1000, 3);
            expect(vec3.y).toBeCloseTo(val + randomStream2.getSignedFloat() * 100, 4);
            expect(vec3.z).toBeCloseTo(val + randomStream2.getSignedFloat() * 10, 4);
        }
    });

    test('multiplyVec3', () => {
        expect(() => vec3Parameter.multiplyVec3At(Vec3.ONE, -1)).toThrowError();
        expect(() => vec3Parameter.multiplyVec3At(Vec3.ONE, 10000)).toThrowError();
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        vec3Parameter.multiplyVec3At(new Vec3(x, y, z), randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(x * val, 4);
                expect(vec3.y).toBeCloseTo(y * val, 4);
                expect(vec3.z).toBeCloseTo(z * val, 4);
            } else {
                expect(vec3.x).toBeCloseTo(val, 4);
                expect(vec3.y).toBeCloseTo(val, 4);
                expect(vec3.z).toBeCloseTo(val, 4);
            }
        }
        const val2 = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val2, 0, vec3Parameter.capacity);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.multiplyVec3At(new Vec3(randomStream.getSignedFloat(), randomStream.getSignedFloat(), 
                randomStream.getSignedFloat()), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(randomStream2.getSignedFloat() * val2, 4);
            expect(vec3.y).toBeCloseTo(randomStream2.getSignedFloat() * val2, 4);
            expect(vec3.z).toBeCloseTo(randomStream2.getSignedFloat() * val2, 4);
        }
    });

    test('multiply3fAt', () => {
        expect(() => vec3Parameter.multiply3fAt(1, 1, 1, -1)).toThrowError();
        expect(() => vec3Parameter.multiply3fAt(1, 1, 1, 10000)).toThrowError();
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        vec3Parameter.multiply3fAt(x, y, z, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(x * val, 4);
                expect(vec3.y).toBeCloseTo(y * val, 4);
                expect(vec3.z).toBeCloseTo(z * val, 4);
            } else {
                expect(vec3.x).toBeCloseTo(val, 4);
                expect(vec3.y).toBeCloseTo(val, 4);
                expect(vec3.z).toBeCloseTo(val, 4);
            }
        }
        const val2 = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val2, 0, vec3Parameter.capacity);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.multiply3fAt(randomStream.getSignedFloat(), randomStream.getSignedFloat(), 
                randomStream.getSignedFloat(), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(randomStream2.getSignedFloat() * val2, 4);
            expect(vec3.y).toBeCloseTo(randomStream2.getSignedFloat() * val2, 4);
            expect(vec3.z).toBeCloseTo(randomStream2.getSignedFloat() * val2, 4);
        }
    });

    test('multiply1fAt', () => {
        expect(() => vec3Parameter.multiply1fAt(1, -1)).toThrowError();
        expect(() => vec3Parameter.multiply1fAt(1, 10000)).toThrowError();
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random();
        vec3Parameter.multiply1fAt(x, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(x * val, 4);
                expect(vec3.y).toBeCloseTo(x * val, 4);
                expect(vec3.z).toBeCloseTo(x * val, 4);
            } else {
                expect(vec3.x).toBeCloseTo(val, 4);
                expect(vec3.y).toBeCloseTo(val, 4);
                expect(vec3.z).toBeCloseTo(val, 4);
            }
        }
        const val2 = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val2, 0, vec3Parameter.capacity);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.multiply1fAt(randomStream.getSignedFloat(), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            const random = randomStream2.getSignedFloat();
            expect(vec3.x).toBeCloseTo(random * val2, 4);
            expect(vec3.y).toBeCloseTo(random * val2, 4);
            expect(vec3.z).toBeCloseTo(random * val2, 4);
        }
    });

    test('add1fAt', () => {
        expect(() => vec3Parameter.add1fAt(1, -1)).toThrowError();
        expect(() => vec3Parameter.add1fAt(1, 10000)).toThrowError();
        const val = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        const x = Math.random();
        vec3Parameter.add1fAt(x, randomIndex);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3.x).toBeCloseTo(x + val, 4);
                expect(vec3.y).toBeCloseTo(x + val, 4);
                expect(vec3.z).toBeCloseTo(x + val, 4);
            } else {
                expect(vec3.x).toBeCloseTo(val, 4);
                expect(vec3.y).toBeCloseTo(val, 4);
                expect(vec3.z).toBeCloseTo(val, 4);
            }
        }
        const val2 = Math.random() * 200 - 100;
        vec3Parameter.fill1f(val2, 0, vec3Parameter.capacity);
        const randomStream = new RandomStream(Math.random() * 10000);
        const randomStream2 = new RandomStream(randomStream.seed);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.add1fAt(randomStream.getSignedFloat(), i);
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            const random = randomStream2.getSignedFloat();
            expect(vec3.x).toBeCloseTo(random + val2, 4);
            expect(vec3.y).toBeCloseTo(random + val2, 4);
            expect(vec3.z).toBeCloseTo(random + val2, 4);
        }
    });

    test('copyFrom', () => {
        const vec3Parameter2 = new Vec3ArrayParameter();
        expect(() => vec3Parameter.copyFrom(vec3Parameter2, 0, vec3Parameter.capacity)).toThrowError();
        vec3Parameter2.reserve(vec3Parameter.capacity);
        expect(() => vec3Parameter.copyFrom(vec3Parameter2, -1, 100)).toThrowError();
        expect(() => vec3Parameter.copyFrom(vec3Parameter2, 0, 10000)).toThrowError();
        expect(() => vec3Parameter.copyFrom(vec3Parameter2, 100, 50)).toThrowError();
        const rand = Math.random() * 100;
        vec3Parameter2.fill1f(rand, 0, vec3Parameter2.capacity);
        vec3Parameter.copyFrom(vec3Parameter2, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(rand, 4);
            expect(vec3.y).toBeCloseTo(rand, 4);
            expect(vec3.z).toBeCloseTo(rand, 4);
        }
        const rand2 = Math.random() * 100;
        vec3Parameter2.fill1f(rand2, 0, vec3Parameter2.capacity);
        vec3Parameter.copyFrom(vec3Parameter2, 50, 100);

        for (let i = 0; i < 50; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(rand, 4);
            expect(vec3.y).toBeCloseTo(rand, 4);
            expect(vec3.z).toBeCloseTo(rand, 4);
        }
        for (let i = 50; i < 100; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(rand2, 4);
            expect(vec3.y).toBeCloseTo(rand2, 4);
            expect(vec3.z).toBeCloseTo(rand2, 4);
        }
        for (let i = 100; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3.x).toBeCloseTo(rand, 4);
            expect(vec3.y).toBeCloseTo(rand, 4);
            expect(vec3.z).toBeCloseTo(rand, 4);
        }
    });
});