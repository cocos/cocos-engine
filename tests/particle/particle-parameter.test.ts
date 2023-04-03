import { Vec3 } from '../../cocos/core';
import { BATCH_OPERATION_THRESHOLD_VEC3, ParticleBoolArrayParameter, ParticleColorArrayParameter, ParticleFloatArrayParameter, ParticleParameterType, ParticleUint32ArrayParameter, ParticleVec3ArrayParameter } from '../../cocos/particle/particle-parameter';

describe('ParticleVec3ArrayParameter', () => {
    const vec3Parameter = new ParticleVec3ArrayParameter('test');
    const vec3 = new Vec3();
    test('basic', () => {
        expect(vec3Parameter.name).toBe('test');
        vec3Parameter.name = 'test2';
        expect(vec3Parameter.name).toBe('test2');
        vec3Parameter.name = 'test';
        expect(vec3Parameter.name).toBe('test');
        expect(vec3Parameter.stride).toBe(3);
        expect(vec3Parameter.type).toBe(ParticleParameterType.VEC3);
    });
    
    test('capacity', () => {
        expect(vec3Parameter.capacity).toBe(16);
        expect(vec3Parameter.data).toBeTruthy();
        expect(vec3Parameter.data instanceof Float32Array).toBeTruthy();
        expect(vec3Parameter.data.length).toBe(16 * 3);
        for (let i = 0; i < vec3Parameter.capacity * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        vec3Parameter.reserve(32);
        expect(vec3Parameter.capacity).toBe(32);
        expect(vec3Parameter.data.length).toBe(32 * 3);
        for (let i = 0; i < vec3Parameter.capacity * 3; i++) {
            expect(vec3Parameter.data[i]).toBe(0);
        }
        vec3Parameter.reserve(16);
        expect(vec3Parameter.capacity).toBe(32);
        expect(vec3Parameter.data.length).toBe(32 * 3);
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

    test('scaleAndAdd', () => {
        vec3Parameter.fill1f(0, 0, vec3Parameter.capacity);
        const b = new ParticleVec3ArrayParameter('b');
        expect(() => ParticleVec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 0, 100)).toThrowError();
        b.reserve(vec3Parameter.capacity);
        expect(() => ParticleVec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, -1, 100)).toThrowError();
        expect(() => ParticleVec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 0, 10000)).toThrowError();
        expect(() => ParticleVec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 3, 2)).toThrowError();
        b.fill1f(1, 0, b.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        ParticleVec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            if (i === randomIndex) {
                expect(vec3Parameter.getXAt(i)).toBe(0.5);
                expect(vec3Parameter.getYAt(i)).toBe(0.5);
                expect(vec3Parameter.getZAt(i)).toBe(0.5);
            } else {
                expect(vec3Parameter.getXAt(i)).toBe(0);
                expect(vec3Parameter.getYAt(i)).toBe(0);
                expect(vec3Parameter.getZAt(i)).toBe(0);
            }
        }
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.set3fAt(i, i + 1, i + 2, i);
            b.set3fAt(i, i - 1, i - 2 ,i);
        }
        ParticleVec3ArrayParameter.scaleAndAdd(vec3Parameter, vec3Parameter, b, 0.5, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3).toStrictEqual(new Vec3(i * 1.5, 1.5 * i + 0.5, 1.5 * i + 1));
        }
        ParticleVec3ArrayParameter.scaleAndAdd(b, vec3Parameter, b, 0, 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(b.getXAt(i)).toBeCloseTo(vec3.x, 5);
            expect(b.getYAt(i)).toBeCloseTo(vec3.y, 5);
            expect(b.getZAt(i)).toBeCloseTo(vec3.z, 5);
        }
    });

    test('fill', () => {
        expect(() => vec3Parameter.fill(vec3, -1, 50)).toThrowError();
        expect(() => vec3Parameter.fill(vec3, 2, 10000)).toThrowError();
        expect(() => vec3Parameter.fill(vec3, 4, 3)).toThrowError();
        vec3Parameter.fill1f(1, 0, vec3Parameter.capacity);
        const randomIndex = Math.floor(Math.random() * vec3Parameter.capacity);
        vec3Parameter.fill(new Vec3(2, 3, 4), randomIndex, randomIndex + 1);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            if (i === randomIndex) {
                expect(vec3).toStrictEqual(new Vec3(2, 3, 4));
            } else {
                expect(vec3).toStrictEqual(Vec3.ONE);
            }
        }
        vec3Parameter.fill(new Vec3(2, 3, 4), 0, vec3Parameter.capacity);
        for (let i = 0; i < vec3Parameter.capacity; i++) {
            vec3Parameter.getVec3At(vec3, i);
            expect(vec3).toStrictEqual(new Vec3(2, 3, 4));
        }
    });


});

describe('ParticleFloatArrayParameter', () => {
    const floatParameter = new ParticleFloatArrayParameter('test');
    test('basic', () => {
        expect(floatParameter.name).toBe('test');
        floatParameter.name = 'test2';
        expect(floatParameter.name).toBe('test2');
        floatParameter.name = 'test';
        expect(floatParameter.name).toBe('test');
        expect(floatParameter.type).toBe(ParticleParameterType.FLOAT);
        expect(floatParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(floatParameter.capacity).toBe(16);
        expect(floatParameter.data).toBeTruthy();
        expect(floatParameter.data.length).toBe(16);
        floatParameter.reserve(32);
        expect(floatParameter.capacity).toBe(32);
        expect(floatParameter.data.length).toBe(32);
        floatParameter.reserve(16);
        expect(floatParameter.capacity).toBe(32);
        expect(floatParameter.data.length).toBe(32);
    });
});

describe('ParticleUint32ArrayParameter', () => {
    const uint32Parameter = new ParticleUint32ArrayParameter('test');
    test('basic', () => {
        expect(uint32Parameter.name).toBe('test');
        uint32Parameter.name = 'test2';
        expect(uint32Parameter.name).toBe('test2');
        uint32Parameter.name = 'test';
        expect(uint32Parameter.name).toBe('test');
        expect(uint32Parameter.type).toBe(ParticleParameterType.UINT32);
        expect(uint32Parameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(uint32Parameter.capacity).toBe(16);
        expect(uint32Parameter.data).toBeTruthy();
        expect(uint32Parameter.data.length).toBe(16);
        uint32Parameter.reserve(32);
        expect(uint32Parameter.capacity).toBe(32);
        expect(uint32Parameter.data.length).toBe(32);
        uint32Parameter.reserve(16);
        expect(uint32Parameter.capacity).toBe(32);
        expect(uint32Parameter.data.length).toBe(32);
    });
});

describe('ParticleBoolArrayParameter', () => {
    const boolParameter = new ParticleBoolArrayParameter('test');
    test('basic', () => {
        expect(boolParameter.name).toBe('test');
        boolParameter.name = 'test2';
        expect(boolParameter.name).toBe('test2');
        boolParameter.name = 'test';
        expect(boolParameter.name).toBe('test');
        expect(boolParameter.type).toBe(ParticleParameterType.BOOL);
        expect(boolParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(boolParameter.capacity).toBe(16);
        expect(boolParameter.data).toBeTruthy();
        expect(boolParameter.data.length).toBe(16);
        boolParameter.reserve(32);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32);
        boolParameter.reserve(16);
        expect(boolParameter.capacity).toBe(32);
        expect(boolParameter.data.length).toBe(32);
    });
});

describe('ParticleColorArrayParameter', () => {
    const colorParameter = new ParticleColorArrayParameter('test');
    test('basic', () => {
        expect(colorParameter.name).toBe('test');
        colorParameter.name = 'test2';
        expect(colorParameter.name).toBe('test2');
        colorParameter.name = 'test';
        expect(colorParameter.name).toBe('test');
        expect(colorParameter.type).toBe(ParticleParameterType.COLOR);
        expect(colorParameter.stride).toBe(1);
    });
    
    test('capacity', () => {
        expect(colorParameter.capacity).toBe(16);
        expect(colorParameter.data).toBeTruthy();
        expect(colorParameter.data.length).toBe(16);
        colorParameter.reserve(32);
        expect(colorParameter.capacity).toBe(32);
        expect(colorParameter.data.length).toBe(32);
        colorParameter.reserve(16);
        expect(colorParameter.capacity).toBe(32);
        expect(colorParameter.data.length).toBe(32);
    });
});

