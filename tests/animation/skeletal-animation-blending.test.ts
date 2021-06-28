
import { BlendStateBuffer, BlendStateWriter } from '../../cocos/3d/skeletal-animation/skeletal-animation-blending';
import { Node, Quat, toRadian, Vec3 } from '../../cocos/core';

describe('Skeletal animation blending', () => {
    describe('Blending', () => {
        const nodes = [
            new Node('Node position affected by all nodes'),
            new Node('Node rotation affected by all nodes'),
            new Node('Node eulerAngles affected by all nodes'),
            new Node('Node scale affected by all nodes'),
            new Node('Node Scale affected by 1'),
            new Node('Node Scale affected by 1 2'),
        ];
        const [
            nodePosition_all,
            nodeRotation_all,
            nodeEulerAngles_all,
            nodeScale_all,
            nodeScale_1,
            nodeScale_1_2,
        ] = nodes;

        function revertNodesTransforms () {
            for (const node of nodes) {
                node.setPosition(0.0, 0.0, 0.0);
                node.setScale(1.0, 1.0, 1.0);
                node.setRotation(Quat.IDENTITY);
            }
        }

        const blendBuffer = new BlendStateBuffer();

        const host1 = { weight: 0.0 };
        const writers1 = {
            nodePosition_all: blendBuffer.createWriter(nodePosition_all, 'position', host1, false),
            nodeRotation_all: blendBuffer.createWriter(nodeRotation_all, 'rotation', host1, false),
            nodeEulerAngles_all: blendBuffer.createWriter(nodeEulerAngles_all, 'eulerAngles', host1, false),
            nodeScale_all: blendBuffer.createWriter(nodeScale_all, 'scale', host1, false),
            nodeScale_1: blendBuffer.createWriter(nodeScale_1, 'scale', host1, false),
            nodeScale_1_2: blendBuffer.createWriter(nodeScale_1_2, 'scale', host1, false),
        };

        const host2 = { weight: 0.0 };
        const writers2 = {
            nodePosition_all: blendBuffer.createWriter(nodePosition_all, 'position', host2, false),
            nodeRotation_all: blendBuffer.createWriter(nodeRotation_all, 'rotation', host2, false),
            nodeEulerAngles_all: blendBuffer.createWriter(nodeEulerAngles_all, 'eulerAngles', host2, false),
            nodeScale_all: blendBuffer.createWriter(nodeScale_all, 'scale', host2, false),
            nodeScale_1_2: blendBuffer.createWriter(nodeScale_1_2, 'scale', host2, false),
        };

        const host3 = { weight: 0.0 };
        const writers3 = {
            nodePosition_all: blendBuffer.createWriter(nodePosition_all, 'position', host3, false),
            nodeRotation_all: blendBuffer.createWriter(nodeRotation_all, 'rotation', host3, false),
            nodeEulerAngles_all: blendBuffer.createWriter(nodeEulerAngles_all, 'eulerAngles', host3, false),
            nodeScale_all: blendBuffer.createWriter(nodeScale_all, 'scale', host3, false),
        };

        beforeEach(() => {
            revertNodesTransforms();
        });

        test('Normalized blending ', () => {
            host1.weight = 0.3;
            host2.weight = 0.5;
            host3.weight = 0.2;

            writers1.nodePosition_all.setValue(new Vec3(0.2, 0.4, 0.6));
            writers2.nodePosition_all.setValue(new Vec3(1.2, 1.4, 1.6));
            writers3.nodePosition_all.setValue(new Vec3(7.0, 8.0, 9.0));

            writers1.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0));
            writers2.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(30.0), 0.0, 0.0));
            writers3.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(40.0), 0.0, 0.0));

            writers1.nodeEulerAngles_all.setValue(new Vec3(toRadian(20.0), 0.0, 0.0));
            writers2.nodeEulerAngles_all.setValue(new Vec3(toRadian(30.0), 0.0, 0.0));
            writers3.nodeEulerAngles_all.setValue(new Vec3(toRadian(40.0), 0.0, 0.0));

            writers1.nodeScale_all.setValue(new Vec3(0.2, 0.4, 0.6));
            writers2.nodeScale_all.setValue(new Vec3(1.2, 1.4, 1.6));
            writers3.nodeScale_all.setValue(new Vec3(7.0, 8.0, 9.0));

            blendBuffer.apply();

            expect(Vec3.equals(nodePosition_all.position, new Vec3(
                0.2 * 0.3 + 1.2 * 0.5 + 7.0 * 0.2,
                0.4 * 0.3 + 1.4 * 0.5 + 8.0 * 0.2,
                0.6 * 0.3 + 1.6 * 0.5 + 9.0 * 0.2,
            ))).toBe(true);

            expect(Vec3.equals(nodeRotation_all.rotation, Quat.fromEuler(
                new Quat(),
                toRadian(20.0 * 0.3 + 30.0 * 0.5 + 40.0 * 0.2),
                0.0,
                0.0,
            ))).toBe(true);

            expect(Vec3.equals(nodeEulerAngles_all.eulerAngles, new Vec3(
                toRadian(20.0 * 0.3 + 30.0 * 0.5 + 40.0 * 0.2),
                0.0,
                0.0,
            ))).toBe(true);

            expect(Vec3.equals(nodeScale_all.scale, new Vec3(
                0.2 * 0.3 + 1.2 * 0.5 + 7.0 * 0.2,
                0.4 * 0.3 + 1.4 * 0.5 + 8.0 * 0.2,
                0.6 * 0.3 + 1.6 * 0.5 + 9.0 * 0.2,
            ))).toBe(true);
        });

        test('Blending with zero contribution(s)', () => {
            host1.weight = 0.0;
            writers1.nodePosition_all.setValue(new Vec3(0.2, 0.4, 0.6));
            writers1.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0));
            writers1.nodeScale_all.setValue(new Vec3(0.2, 0.4, 0.6));

            host2.weight = 0.5;
            writers2.nodePosition_all.setValue(new Vec3(0.2, 0.4, 0.6));
            writers2.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0));
            writers2.nodeScale_all.setValue(new Vec3(0.2, 0.4, 0.6));

            host3.weight = 0.5;
            writers3.nodePosition_all.setValue(new Vec3(0.2, 0.4, 0.6));
            writers3.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0));
            writers3.nodeScale_all.setValue(new Vec3(0.2, 0.4, 0.6));

            blendBuffer.apply();

            expect(Vec3.equals(nodePosition_all.position, new Vec3(0.2, 0.4, 0.6))).toBe(true);
            expect(Quat.equals(nodeRotation_all.rotation, Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0))).toBe(true);
            expect(Vec3.equals(nodeScale_all.scale, new Vec3(0.2, 0.4, 0.6))).toBe(true);
        });

        test('If sum less than 1, current pose with be blended, with remain weight', () => {
            host1.weight = 0.3;
            host2.weight = 0.5;
            host3.weight = 0.2;

            writers1.nodeScale_1.setValue(new Vec3(1.2, 1.4, 1.6));
            writers1.nodeScale_1_2.setValue(new Vec3(1.2, 1.4, 1.6));

            writers2.nodeScale_1_2.setValue(new Vec3(3.0, 4.0, 5.0));

            blendBuffer.apply();

            // nodeScale_1.scale is only effect by host1
            expect(Vec3.equals(nodeScale_1.scale, new Vec3(
                1.2 * 0.3 + 1.0 * 0.7,
                1.4 * 0.3 + 1.0 * 0.7,
                1.6 * 0.3 + 1.0 * 0.7,
            ))).toBe(true);

            // nodeScale_1.scale is effect by both host1 and host2, even if their weights are not sum to 1
            expect(Vec3.equals(nodeScale_1_2.scale, new Vec3(
                1.2 * 0.3 + 3.0 * 0.5 + 1.0 * 0.2,
                1.4 * 0.3 + 4.0 * 0.5 + 1.0 * 0.2,
                1.6 * 0.3 + 5.0 * 0.5 + 1.0 * 0.2,
            ))).toBe(true);
        });
    });
});
