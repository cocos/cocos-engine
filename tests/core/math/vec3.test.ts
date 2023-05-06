import { log } from '../../test.log';
import { Vec3 } from '../../../cocos/core/math/vec3';
import { Mat3 } from '../../../cocos/core/math/mat3';
import { Mat4 } from '../../../cocos/core/math/mat4';
import { Quat } from '../../../cocos/core/math/quat';

describe('Test Vec3', () => {
    test('normalize', () => {
        const v0 = new Vec3(3, 4, 12);
        const v1 = new Vec3(3, 4, 12);
        const expect0 = new Vec3(0.2307692, 0.3076923, 0.9230769);
        Vec3.normalize(v0, v0);
        v1.normalize();
        log('normalize 0: ', v0);
        log('normalize 1: ', v1);
        expect(Vec3.equals(v0, expect0)).toBe(true);
        expect(Vec3.equals(v1, expect0)).toBe(true);
    });

    test('dot', () => {
        const v0 = new Vec3(3, 4, 0);
        const v1 = new Vec3(-4, 3, 0);
        const value0 = Vec3.dot(v0, v1);
        const value1 = v0.dot(v1);
        const expect0 = 0;
        const expect1 = 0;
        log('dot 0: ', value0);
        log('dot 1: ', value1);
        expect(value0).toBe(expect0);
        expect(value1).toBe(expect1);
    });

    test('cross', () => {
        const v0 = new Vec3(3, 4, 0);
        const v1 = new Vec3(3, 4, 0);
        const value0 = Vec3.cross(new Vec3(), v0, v1);
        const value1 = v0.cross(v1);
        const expect0 = new Vec3(0, 0, 0);
        log('cross 0: ', value0);
        log('cross 1: ', value1);
        expect(Vec3.equals(value0, expect0)).toBe(true);
        expect(Vec3.equals(value1, expect0)).toBe(true);
    });

    test('transformMat4', () => {
        const v0 = new Vec3(3, 4, 5);
        const v1 = new Vec3(3, 4, 5);
        const m0 = Mat4.fromScaling(new Mat4(), new Vec3(1, 2, 3));
        const m1 = Mat4.fromTranslation(new Mat4(), new Vec3(1, 2, 3));
        Mat4.multiply(m0, m1, m0);
        const expect0 = new Vec3(4, 10, 18);
        Vec3.transformMat4(v0, v0, m0);
        v1.transformMat4(m0);
        log('transformMat4 0: ', v0);
        log('transformMat4 1: ', v1);
        expect(Vec3.equals(v0, expect0)).toBe(true);
        expect(Vec3.equals(v1, expect0)).toBe(true);
    });

    test('transformMat4Normal', () => {
        const v0 = new Vec3(3, 4, 5);
        const m0 = Mat4.fromScaling(new Mat4(), new Vec3(1, 2, 3));
        const expect0 = new Vec3(3, 8, 15);
        Vec3.transformMat4Normal(v0, v0, m0);
        log('transformMat4Normal: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('transformMat3', () => {
        const v0 = new Vec3(3, 4, 5);
        const m0 = new Mat3();
        m0.m00 = 1;
        m0.m04 = 2;
        m0.m08 = 3;
        const expect0 = new Vec3(3, 8, 15);
        Vec3.transformMat3(v0, v0, m0);
        log('transformMat3: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('transformAffine', () => {
        const v0 = new Vec3(3, 4, 5);
        const m0 = Mat4.fromScaling(new Mat4(), new Vec3(1, 2, 3));
        const expect0 = new Vec3(3, 8, 15);
        Vec3.transformAffine(v0, v0, m0);
        log('transformAffine: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('transformQuat', () => {
        const v0 = new Vec3(3, 4, 5);
        const q0 = Quat.fromAxisAngle(new Quat(), new Vec3(0, 0, 1), Math.PI / 2);
        const expect0 = new Vec3(-4, 3, 5);
        Vec3.transformQuat(v0, v0, q0);
        log('transformQuat: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('transformRTS', () => {
        const v0 = new Vec3(1, 1, 1);
        const s0 = new Vec3(2, 3, 4);
        const t0 = new Vec3(1, 2, 3);
        const q0 = Quat.fromAxisAngle(new Quat(), new Vec3(0, 0, 1), Math.PI / 2);
        const expect0 = new Vec3(-2, 4, 7);
        Vec3.transformRTS(v0, v0, q0, t0, s0);
        log('transformRTS: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('transformInverseRTS', () => {
        const v0 = new Vec3(-2, 4, 7);
        const s0 = new Vec3(2, 3, 4);
        const t0 = new Vec3(1, 2, 3);
        const q0 = Quat.fromAxisAngle(new Quat(), new Vec3(0, 0, 1), Math.PI / 2);
        const expect0 = new Vec3(1, 1, 1);
        Vec3.transformInverseRTS(v0, v0, q0, t0, s0);
        log('transformInverseRTS: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('rotateX', () => {
        const v0 = new Vec3(1, 2, 3);
        const expect0 = new Vec3(1, -3, 2);
        Vec3.rotateX(v0, v0, Vec3.ZERO, Math.PI / 2);
        log('rotateX: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('rotateY', () => {
        const v0 = new Vec3(1, 2, 3);
        const expect0 = new Vec3(3, 2, -1);
        Vec3.rotateY(v0, v0, Vec3.ZERO, Math.PI / 2);
        log('rotateY: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('rotateZ', () => {
        const v0 = new Vec3(1, 2, 3);
        const expect0 = new Vec3(-2, 1, 3);
        Vec3.rotateZ(v0, v0, Vec3.ZERO, Math.PI / 2);
        log('rotateZ: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('rotateN', () => {
        const v0 = new Vec3(1, 1, 0);
        const axis = new Vec3(-1, 1, 0);
        axis.normalize();
        const expect0 = new Vec3(-1, -1, 0);
        Vec3.rotateN(v0, v0, Vec3.ZERO, axis, Math.PI);
        log('rotateN: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('angle', () => {
        const v0 = new Vec3(3, 4, 0);
        const v1 = new Vec3(-6, -8, 0);
        const expect0 = Math.PI;
        const value0 = Vec3.angle(v0, v1);
        log('angle: ', value0);
        expect(value0).toBe(expect0);
    });

    test('moveTowards', () => {
        const v0 = new Vec3(1, 1, 0);
        const v1 = new Vec3(5, 1, 0);
        const expect0 = new Vec3(3, 1, 0);
        const value0 = Vec3.moveTowards(new Vec3(), v0, v1, 2);
        log('moveTowards: ', value0);
        expect(Vec3.equals(value0, expect0)).toBe(true);
    });
});