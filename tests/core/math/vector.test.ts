import { Vec2 } from '../../../cocos/core/math/vec2';
import { Vec3 } from '../../../cocos/core/math/vec3';

// test Vec2
describe('Test Vec2', () => {
    test('cross', () => {
        // cross and prototype.cross
        const v2_0 = new Vec2(1, 0);
        const v2_1 = new Vec2(0, 1);
        const result = v2_0.x * v2_1.y - v2_0.y * v2_1.x;
        expect(Vec2.cross(v2_0, v2_1)).toBe(result);
        expect(v2_0.cross(v2_1)).toBe(result);

        const v3_0 = new Vec3(1, 1, 1);
        const out = Vec2.cross(v3_0, v2_0, v2_1);
        expect(out).toBe(v3_0);
        expect(v3_0.x).toBe(0);
        expect(v3_0.y).toBe(0);
        expect(v3_0.z).toBe(result);
    });
});