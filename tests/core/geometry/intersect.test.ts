import { AABB } from '../../../cocos/core/geometry/aabb';
import { OBB } from '../../../cocos/core/geometry/obb';
import intersect from '../../../cocos/core/geometry/intersect';
import { Quat, Vec3, Mat3 } from '../../../cocos/core/math';

describe('geometry.intersect.aabbWithOBB', () => {
    test('reports separation for an OBB placed clear of the AABB on a world-axis x local-Y-axis plane', () => {
        // aabbWithOBB tests 15 SAT axes: 3 world axes, 3 OBB local axes, and 9 cross
        // products of world axes with OBB local axes. The cross products with the OBB's
        // second local axis (worldAxis x B) are never written into the test axis array,
        // so any pair whose only separating axis is one of those three is reported as
        // intersecting even though it is not.
        const aabb = new AABB(0, 0, 0, 1, 1, 1);

        const rotZ = new Quat();
        Quat.rotateZ(rotZ, Quat.identity(new Quat()), 0.3);
        const rotation = new Quat();
        Quat.rotateX(rotation, rotZ, 0.3);
        const orientation = new Mat3();
        Mat3.fromQuat(orientation, rotation);

        const obb = new OBB();
        Vec3.set(obb.center, -2.0, -1.1, 2.2);
        Vec3.set(obb.halfExtents, 1, 1, 1);
        Mat3.copy(obb.orientation, orientation);

        // Ground truth: represent the AABB as an identity-oriented OBB and use the
        // (correctly implemented) OBB-vs-OBB SAT test, which checks all 15 axes.
        const aabbAsObb = new OBB();
        Vec3.copy(aabbAsObb.center, aabb.center);
        Vec3.copy(aabbAsObb.halfExtents, aabb.halfExtents);
        expect(intersect.obbWithOBB(aabbAsObb, obb)).toBe(0);

        expect(intersect.aabbWithOBB(aabb, obb)).toBe(0);
    });
});
