import { IGeometry } from '../../cocos/primitive/define';
import { scale } from '../../cocos/primitive/transform';
import '../utils/matcher-deep-close-to';

test('Scaling', () => {
    expect(scale({ positions: [2.0, 3.0, 4.0] }, { x: 1.2, })).toBeDeepCloseTo({
        positions: [2.4, 3.0, 4.0],
    });

    expect(scale({
        positions: [2.0, 3.0, 4.0],
        minPos: { x: -1.0, y: -2.0, z: -3.0 },
        maxPos: { x: 2.0, y: 3.2, z: 4.4 },
        boundingRadius: 6.6,
    }, { x: 1.2, y: 1.3, z: -3.0 })).toBeDeepCloseTo({
        positions: [2.0 * 1.2, 3.0 * 1.3, 4.0 * -3.0],
        minPos: { x: -1.0 * 1.2, y: -2.0 * 1.3, z: 4.4 * -3.0 },
        maxPos: { x: 2.0 * 1.2, y: 3.2 * 1.3, z: -3.0 * -3.0 },
        boundingRadius: 6.6 * 3.0,
    });
});