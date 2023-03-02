import { Vec2, Vec3 } from '../../cocos/core/math';
import { perlin3D } from '../../cocos/particle/modules/perlin-noise';

test('perlin noise', () => {
    const dereviate = perlin3D(new Vec2(), new Vec3(0.5, 6.25, 7.03), 0.5);
    expect(dereviate).toStrictEqual(Vec2.ZERO);

})