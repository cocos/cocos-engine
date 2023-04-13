
import { BlendStateWriterHost, LegacyBlendStateBuffer } from '../../cocos/3d/skeletal-animation/skeletal-animation-blending';
import { Quat, toRadian, Vec3 } from '../../cocos/core';
import { Node } from '../../cocos/scene-graph';
import '../utils/matcher-deep-close-to';

describe('Skeletal animation blending', () => {
    function createTestCase() {
        const nodes = ([
            {
                node: new Node('Node position affected by all nodes'),
                originalPosition: new Vec3(77.0, 88.0, 99.0),
            },
            {
                node: new Node('Node rotation affected by all nodes'),
                originalRotation: Quat.fromEuler(new Quat(), toRadian(77.0), 0.0, 0.0),
            },
            {
                node: new Node('Node eulerAngles affected by all nodes'),
                originalEulerAngles: new Vec3(toRadian(77.0), toRadian(88.0), toRadian(99.0)),
            },
            {
                node: new Node('Node scale affected by all nodes'),
                originalScale: new Vec3(77.0, 88.0, 99.0),
            },
            {
                node: new Node('Node Scale affected by 1'),
                originalScale: new Vec3(77.0, 88.0, 99.0),
            },
            {
                node: new Node('Node Scale affected by 1 2'),
                originalScale: new Vec3(77.0, 88.0, 99.0),
            },
        ] as Array<{
            node: Node;
            originalPosition?: Readonly<Vec3>;
            originalScale?: Readonly<Vec3>;
            originalRotation?: Readonly<Quat>;
            originalEulerAngles?: Readonly<Vec3>;
        }>).map(({ node, originalPosition, originalRotation, originalScale, originalEulerAngles }) => {
            return {
                node,
                originalPosition: originalPosition ?? Vec3.ZERO,
                originalScale: originalScale ?? Vec3.ONE,
                originalRotation: originalRotation
                    ? originalRotation
                    : originalEulerAngles
                        ? Quat.fromEuler(new Quat(), originalEulerAngles.x, originalEulerAngles.y, originalEulerAngles.z)
                        : Quat.IDENTITY,
                originalEulerAngles,
            };
        });

        const [
            nodePosition_all,
            nodeRotation_all,
            nodeEulerAngles_all,
            nodeScale_all,
            nodeScale_1,
            nodeScale_1_2,
        ] = nodes;

        function revertNodesTransforms () {
            for (const { node, originalPosition, originalRotation, originalScale, originalEulerAngles } of nodes) {
                node.setPosition(originalPosition);
                node.setScale(originalScale);
                node.setRotation(originalRotation);
            }
        }

        revertNodesTransforms();

        const blendBuffer = new LegacyBlendStateBuffer();

        const host1 = { weight: 0.0 };
        const writers1 = {
            nodePosition_all: blendBuffer.createWriter(nodePosition_all.node, 'position', host1, false),
            nodeRotation_all: blendBuffer.createWriter(nodeRotation_all.node, 'rotation', host1, false),
            nodeEulerAngles_all: blendBuffer.createWriter(nodeEulerAngles_all.node, 'eulerAngles', host1, false),
            nodeScale_all: blendBuffer.createWriter(nodeScale_all.node, 'scale', host1, false),
            nodeScale_1: blendBuffer.createWriter(nodeScale_1.node, 'scale', host1, false),
            nodeScale_1_2: blendBuffer.createWriter(nodeScale_1_2.node, 'scale', host1, false),
        };

        const host2 = { weight: 0.0 };
        const writers2 = {
            nodePosition_all: blendBuffer.createWriter(nodePosition_all.node, 'position', host2, false),
            nodeRotation_all: blendBuffer.createWriter(nodeRotation_all.node, 'rotation', host2, false),
            nodeEulerAngles_all: blendBuffer.createWriter(nodeEulerAngles_all.node, 'eulerAngles', host2, false),
            nodeScale_all: blendBuffer.createWriter(nodeScale_all.node, 'scale', host2, false),
            nodeScale_1_2: blendBuffer.createWriter(nodeScale_1_2.node, 'scale', host2, false),
        };

        const host3 = { weight: 0.0 };
        const writers3 = {
            nodePosition_all: blendBuffer.createWriter(nodePosition_all.node, 'position', host3, false),
            nodeRotation_all: blendBuffer.createWriter(nodeRotation_all.node, 'rotation', host3, false),
            nodeEulerAngles_all: blendBuffer.createWriter(nodeEulerAngles_all.node, 'eulerAngles', host3, false),
            nodeScale_all: blendBuffer.createWriter(nodeScale_all.node, 'scale', host3, false),
        };

        return {
            blendBuffer,
            revertNodesTransforms,
            nodePosition_all,
            nodeRotation_all,
            nodeEulerAngles_all,
            nodeScale_all,
            nodeScale_1,
            nodeScale_1_2,
            host1,
            writers1,
            host2,
            writers2,
            host3,
            writers3,
        };
    }

    describe('Algorithm: legacy', () => {
        const {
            blendBuffer,
            revertNodesTransforms,
            nodePosition_all,
            nodeRotation_all,
            nodeEulerAngles_all,
            nodeScale_all,
            nodeScale_1,
            nodeScale_1_2,
            host1,
            writers1,
            host2,
            writers2,
            host3,
            writers3,
        } = createTestCase();

        beforeEach(() => {
            revertNodesTransforms();
        });

        test('All zero', () => {
            blendBuffer.apply();

            for (const {
                node,
                originalEulerAngles,
                originalPosition,
                originalRotation,
                originalScale,
            } of [
                nodePosition_all,
                nodeRotation_all,
                nodeEulerAngles_all,
                nodeScale_all,
                nodeScale_1,
                nodeScale_1_2,
            ]) {
                expect(Vec3.equals(node.position, originalPosition)).toBe(true);
                expect(Vec3.equals(node.scale, originalScale)).toBe(true);
                expect(Quat.equals(node.rotation, originalRotation)).toBe(true);
                if (originalEulerAngles) {
                    expect(Vec3.equals(node.eulerAngles, originalEulerAngles)).toBe(true);
                }
            }
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

            expect(Vec3.equals(nodePosition_all.node.position, new Vec3(
                0.2 * 0.3 + 1.2 * 0.5 + 7.0 * 0.2,
                0.4 * 0.3 + 1.4 * 0.5 + 8.0 * 0.2,
                0.6 * 0.3 + 1.6 * 0.5 + 9.0 * 0.2,
            ))).toBe(true);

            expect(Vec3.equals(nodeRotation_all.node.rotation, Quat.fromEuler(
                new Quat(),
                toRadian(20.0 * 0.3 + 30.0 * 0.5 + 40.0 * 0.2),
                0.0,
                0.0,
            ))).toBe(true);

            expect(Vec3.equals(nodeEulerAngles_all.node.eulerAngles, new Vec3(
                toRadian(20.0 * 0.3 + 30.0 * 0.5 + 40.0 * 0.2),
                0.0,
                0.0,
            ))).toBe(true);

            expect(Vec3.equals(nodeScale_all.node.scale, new Vec3(
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

            expect(Vec3.equals(nodePosition_all.node.position, new Vec3(0.2, 0.4, 0.6))).toBe(true);
            expect(Quat.equals(nodeRotation_all.node.rotation, Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0))).toBe(true);
            expect(Vec3.equals(nodeScale_all.node.scale, new Vec3(0.2, 0.4, 0.6))).toBe(true);
        });

        test('If sum is less than 1, current animation with be blended, with remain weight', () => {
            host1.weight = 0.3;
            host2.weight = 0.5;
            host3.weight = 0.2;

            writers1.nodeScale_1.setValue(new Vec3(1.2, 1.4, 1.6));
            writers1.nodeScale_1_2.setValue(new Vec3(1.2, 1.4, 1.6));

            writers2.nodeScale_1_2.setValue(new Vec3(3.0, 4.0, 5.0));

            blendBuffer.apply();

            // nodeScale_1.scale is only effect by host1
            expect(Vec3.equals(nodeScale_1.node.scale, new Vec3(
                1.2 * 0.3 + nodeScale_1.originalScale.x * 0.7,
                1.4 * 0.3 + nodeScale_1.originalScale.y * 0.7,
                1.6 * 0.3 + nodeScale_1.originalScale.z * 0.7,
            ))).toBe(true);

            // nodeScale_1_2.scale is effect by both host1 and host2, even if their weights are not sum to 1
            expect(Vec3.equals(nodeScale_1_2.node.scale, new Vec3(
                1.2 * 0.3 + 3.0 * 0.5 + nodeScale_1_2.originalScale.x * 0.2,
                1.4 * 0.3 + 4.0 * 0.5 + nodeScale_1_2.originalScale.y * 0.2,
                1.6 * 0.3 + 5.0 * 0.5 + nodeScale_1_2.originalScale.z * 0.2,
            ))).toBe(true);
        });
    });
});
