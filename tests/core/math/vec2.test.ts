import { log } from '../../test.log';
import { Vec2 } from '../../../cocos/core/math/vec2';
import { Vec3 } from '../../../cocos/core/math/vec3';
import { Mat3 } from '../../../cocos/core/math/mat3';
import { Mat4 } from '../../../cocos/core/math/mat4';

describe('Test Vec2', () => {
    test('normalize', () => {
        const v0 = new Vec2(3, 4);
        const v1 = new Vec2(3, 4);
        const expect0 = new Vec2(0.6, 0.8);
        Vec2.normalize(v0, v0);
        v1.normalize();
        log('normalize 0: ', v0);
        log('normalize 1: ', v1);
        expect(Vec2.equals(v0, expect0)).toBe(true);
        expect(Vec2.equals(v1, expect0)).toBe(true);
    });

    test('dot', () => {
        const v0 = new Vec2(3, 4);
        const v1 = new Vec2(-4, 3);
        const value0 = Vec2.dot(v0, v1);
        const value1 = v0.dot(v1);
        const expect0 = 0;
        const expect1 = 0;
        log('dot 0: ', value0);
        log('dot 1: ', value1);
        expect(value0).toBe(expect0);
        expect(value1).toBe(expect1);
    });

    test('transformMat3', () => {
        const v0 = new Vec2(3, 4);
        const m0 = Mat3.fromTranslation(new Mat3(), new Vec2(1, 2));
        const expect0 = new Vec2(4, 6);
        Vec2.transformMat3(v0, v0, m0);
        log('transformMat3: ', v0);
        expect(Vec2.equals(v0, expect0)).toBe(true);
    });

    test('transformMat4', () => {
        const v0 = new Vec2(3, 4);
        const v1 = new Vec2(3, 4);
        const m0 = Mat4.fromScaling(new Mat4(), new Vec3(1, 2, 3));
        const expect0 = new Vec2(3, 8);
        Vec2.transformMat4(v0, v0, m0);
        v1.transformMat4(m0);
        log('transformMat4 0: ', v0);
        log('transformMat4 1: ', v1);
        expect(Vec2.equals(v0, expect0)).toBe(true);
        expect(Vec2.equals(v1, expect0)).toBe(true);
    });

    test('angle', () => {
        const v0 = new Vec2(3, 4);
        const v1 = new Vec2(-6, -8);
        const expect0 = Math.PI;
        const value0 = Vec2.angle(v0, v1);
        const value1 = v0.angle(v1);
        log('angle 0: ', value0);
        log('angle 1: ', value1);
        expect(value0).toBe(expect0);
        expect(value1).toBe(expect0);
    });

    test('rotate', () => {
        const v0 = new Vec2(3, 4);
        const expect0 = new Vec2(-4, 3);
        v0.rotate(Math.PI / 2);
        log('rotate: ', v0);
        expect(Vec2.equals(v0, expect0)).toBe(true);
    });
});