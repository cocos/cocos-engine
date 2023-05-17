import { log } from '../../test.log';
import { Mat3 } from '../../../cocos/core/math/mat3';
import { Quat } from '../../../cocos/core/math/quat';
import { Vec3 } from '../../../cocos/core/math/vec3';
import { toDegree } from '../../../cocos/core/math/utils';

describe('Test Quat', () => {
    test('rotationTo', () => {
        const q0 = new Quat();
        const v0 = new Vec3(1, 0, 0);
        const v1 = new Vec3(0, 1, 0);
        const expect0 = new Quat(0, 0, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4));
        Quat.rotationTo(q0, v0, v1);
        log('rotationTo: ', q0);
        expect(Quat.equals(q0, expect0)).toBe(true);
    });

    test('getAxisAngle', () => {
        const axis = new Vec3();
        const q0 = new Quat(0, 0, Math.sin(Math.PI / 4), Math.cos(Math.PI / 4));
        const angle = Quat.getAxisAngle(axis, q0);
        const expect0 = new Vec3(0, 0, 1);
        const expect1 = Math.PI / 2;
        log('getAxisAngle 0: ', axis);
        log('getAxisAngle 1: ', angle);
        expect(Vec3.equals(axis, expect0)).toBe(true);
        expect(angle).toBeCloseTo(expect1);
    });

    test('multiply', () => {
        const q0 = new Quat(Math.sin(Math.PI / 4), 0, 0, Math.cos(Math.PI / 4));
        const expect0 = new Quat(Math.sin(Math.PI / 2), 0, 0, Math.cos(Math.PI / 2));
        Quat.multiply(q0, q0, q0);
        log('multiply: ', q0);
        expect(Quat.equals(q0, expect0)).toBe(true);
    });

    test('slerp', () => {
        const q0 = Quat.identity(new Quat());
        const q1 = new Quat(Math.sin(Math.PI / 4), 0, 0, Math.cos(Math.PI / 4));
        const expect0 = new Quat(Math.sin(Math.PI / 8), 0, 0, Math.cos(Math.PI / 8));
        const q2 = Quat.slerp(new Quat(), q0, q1, 0.5);
        log('slerp: ', q2);
        expect(Quat.equals(q2, expect0)).toBe(true);
    });

    test('invert', () => {
        const q0 = new Quat(Math.sin(Math.PI / 4), 0, 0, Math.cos(Math.PI / 4));
        const expect0 = new Quat(-Math.sin(Math.PI / 4), 0, 0, Math.cos(-Math.PI / 4));
        const q1 = Quat.invert(new Quat(), q0);
        log('invert: ', q1);
        expect(Quat.equals(q1, expect0)).toBe(true);
    });

    test('conjugate', () => {
        const q0 = new Quat(Math.sin(Math.PI / 4), 0, 0, Math.cos(Math.PI / 4));
        const expect0 = new Quat(-Math.sin(Math.PI / 4), 0, 0, Math.cos(-Math.PI / 4));
        const q1 = Quat.conjugate(new Quat(), q0);
        log('conjugate: ', q1);
        expect(Quat.equals(q1, expect0)).toBe(true);
    });

    test('normalize', () => {
        const q0 = new Quat(Math.sin(Math.PI / 4) * 3, 0, 0, Math.cos(Math.PI / 4) * 3);
        const expect0 = new Quat(Math.sin(Math.PI / 4), 0, 0, Math.cos(Math.PI / 4));
        const q1 = Quat.normalize(new Quat(), q0);
        log('normalize: ', q1);
        expect(Quat.equals(q1, expect0)).toBe(true);
    });

    test('fromAxes', () => {
        const x = new Vec3(1, 0, 0);
        const y = new Vec3(0, 1, 0);
        const z = new Vec3(0, 0, 1);
        const q0 = Quat.fromAxes(new Quat(), x, y, z);
        const x1 = Quat.toAxisX(new Vec3(), q0)
        const y1 = Quat.toAxisY(new Vec3(), q0)
        const z1 = Quat.toAxisZ(new Vec3(), q0)
        log('fromAxes 0: ', x1);
        log('fromAxes 1: ', y1);
        log('fromAxes 2: ', z1);
        expect(Vec3.equals(x, x1)).toBe(true);
        expect(Vec3.equals(y, y1)).toBe(true);
        expect(Vec3.equals(z, z1)).toBe(true);
    });

    test('fromAxisAngle', () => {
        const axis = new Vec3(1, 0, 0);
        const angle = Math.PI / 3;
        const q0 = Quat.fromAxisAngle(new Quat(), axis, angle);
        const expect0 = new Quat(Math.sin(Math.PI / 6), 0, 0, Math.cos(Math.PI / 6));
        log('fromAxisAngle: ', q0);
        expect(Quat.equals(q0, expect0)).toBe(true);
    });

    test('fromMat3', () => {
        const m0 = Mat3.fromRotation(new Mat3(), Math.PI / 3);
        const q0 = Quat.fromMat3(new Quat(), m0);
        const expect0 = new Quat(0, 0, Math.sin(Math.PI / 6), Math.cos(Math.PI / 6));
        log('fromMat3: ', q0);
        expect(Quat.equals(q0, expect0)).toBe(true);
    });

    test('fromEuler', () => {
        const q0 = Quat.fromEuler(new Quat(), 0, 0, 60);
        const expect0 = new Quat(0, 0, Math.sin(Math.PI / 6), Math.cos(Math.PI / 6));
        log('fromEuler: ', q0);
        expect(Quat.equals(q0, expect0)).toBe(true);
    });

    test('toEuler', () => {
        const q0 = new Quat(0, 0, Math.sin(Math.PI / 6), Math.cos(Math.PI / 6));
        const v0 = new Vec3();
        const expect0 = new Vec3(0, 0, 60);
        Quat.toEuler(v0, q0);
        log('toEuler: ', v0);
        expect(Vec3.equals(v0, expect0)).toBe(true);
    });

    test('rotateTowards', () => {
        const q0 = new Quat(Math.sin(Math.PI / 8), 0, 0, Math.cos(Math.PI / 8));
        const q1 = new Quat(Math.sin(Math.PI / 3), 0, 0, Math.cos(Math.PI / 3));
        const expect0 = new Quat(Math.sin(Math.PI * 3 / 16), 0, 0, Math.cos(Math.PI * 3 / 16));
        const q2 = Quat.rotateTowards(new Quat(), q0, q1, toDegree(Math.PI / 8));
        log('rotateTowards: ', q2);
        expect(Quat.equals(q2, expect0)).toBe(true);
    });
});