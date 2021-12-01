
import { BlendStateBuffer, BlendStateWriter, BlendStateWriterHost, LayeredBlendStateBuffer, LegacyBlendStateBuffer } from '../../cocos/3d/skeletal-animation/skeletal-animation-blending';
import { Node, Quat, toRadian, Vec3 } from '../../cocos/core';

describe('Skeletal animation blending', () => {
    function createTestCase<T extends boolean>(legacy: T) {
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

        const blendBuffer = legacy ? new LegacyBlendStateBuffer() : new LayeredBlendStateBuffer();

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
            blendBuffer: blendBuffer as T extends true ? LegacyBlendStateBuffer : LayeredBlendStateBuffer,
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
        } = createTestCase(true);

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

    describe('Layered', () => {
        describe('Clip blending', () => {
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
            } = createTestCase(false);
    
            beforeEach(() => {
                revertNodesTransforms();
            });
    
            test.each([
                ['Sum of weights < 1.0', {
                    hostWeight1: 0.1,
                    hostWeight2: 0.2,
                    hostWeight3: 0.0,
                }],
                // ['Sum of weights > 1.0', {
                //     hostWeight1: 0.1,
                //     hostWeight2: 1.2,
                //     hostWeight3: 0.0,
                // }],
                ['Sum of weights === 0.0(ie. all weights are zero)', {
                    hostWeight1: 0.0,
                    hostWeight2: 0.0,
                    hostWeight3: 0.0,
                }],
            ] as const)(`%s`, (_title, { hostWeight1, hostWeight2, hostWeight3 }) => {
                host1.weight = hostWeight1;
                host2.weight = hostWeight2;
                host3.weight = hostWeight3;
    
                writers1.nodePosition_all.setValue(new Vec3(1.2, 1.4, 1.6));
                writers2.nodePosition_all.setValue(new Vec3(3.0, 4.0, 5.0));
                writers3.nodePosition_all.setValue(new Vec3(7.0, 8.0, 9.0));
    
                writers1.nodeScale_all.setValue(new Vec3(1.2, 1.4, 1.6));
                writers2.nodeScale_all.setValue(new Vec3(3.0, 4.0, 5.0));
                writers3.nodeScale_all.setValue(new Vec3(7.0, 8.0, 9.0));
    
                writers1.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(20.0), 0.0, 0.0));
                writers2.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(30.0), 0.0, 0.0));
                writers3.nodeRotation_all.setValue(Quat.fromEuler(new Quat(), toRadian(40.0), 0.0, 0.0));
    
                writers1.nodeEulerAngles_all.setValue(new Vec3(toRadian(20.0), 0.0, 0.0));
                writers2.nodeEulerAngles_all.setValue(new Vec3(toRadian(30.0), 0.0, 0.0));
                writers3.nodeEulerAngles_all.setValue(new Vec3(toRadian(40.0), 0.0, 0.0));
    
                blendBuffer.commitLayerChanges(1.0);
                blendBuffer.apply();
    
                const sumWeight = host1.weight + host2.weight + host3.weight;
                const defaultWeight = Math.max(0.0, 1.0 - sumWeight);
                const normalizedWeight1 = host1.weight;
                const normalizedWeight2 = host2.weight;
                const normalizedWeight3 = host3.weight;
    
                expect(Vec3.equals(nodePosition_all.node.position, new Vec3(
                    1.2 * normalizedWeight1 + 3.0 * normalizedWeight2 + 7.0 * normalizedWeight3 + nodePosition_all.originalPosition.x * defaultWeight,
                    1.4 * normalizedWeight1 + 4.0 * normalizedWeight2 + 8.0 * normalizedWeight3 + nodePosition_all.originalPosition.y * defaultWeight,
                    1.6 * normalizedWeight1 + 5.0 * normalizedWeight2 + 9.0 * normalizedWeight3 + nodePosition_all.originalPosition.z * defaultWeight,
                ))).toBe(true);
    
                expect(Vec3.equals(nodeScale_all.node.scale, new Vec3(
                    1.2 * normalizedWeight1 + 3.0 * normalizedWeight2 + 7.0 * normalizedWeight3 + nodeScale_all.originalScale.x * defaultWeight,
                    1.4 * normalizedWeight1 + 4.0 * normalizedWeight2 + 8.0 * normalizedWeight3 + nodeScale_all.originalScale.y * defaultWeight,
                    1.6 * normalizedWeight1 + 5.0 * normalizedWeight2 + 9.0 * normalizedWeight3 + nodeScale_all.originalScale.z * defaultWeight,
                ))).toBe(true);
    
                expect(Vec3.equals(nodeRotation_all.node.rotation, new Quat(Quat.fromEuler(
                    new Quat(),
                    toRadian(20.0 * normalizedWeight1 + 30.0 * normalizedWeight2 + 40.0 * normalizedWeight3 + 77.0 * defaultWeight),
                    0.0,
                    0.0,
                )))).toBe(true);
    
                expect(Vec3.equals(nodeEulerAngles_all.node.eulerAngles, new Vec3(
                    toRadian(20.0) * normalizedWeight1 + toRadian(30.0) * normalizedWeight2 + toRadian(40.0) * normalizedWeight3 + nodeEulerAngles_all.originalEulerAngles.x * defaultWeight,
                    nodeEulerAngles_all.originalEulerAngles.y * defaultWeight,
                    nodeEulerAngles_all.originalEulerAngles.z * defaultWeight,
                ))).toBe(true);
            });
        });

        describe('Layer blending', () => {
            const DEFAULT_VALUE = 0.9;
            const VALUE_0 = 2.0;
            const VALUE_1 = -5.0;
            const VALUE_2 = 16.0;
    
            test.each([
                ['Zero layers', [
                ], DEFAULT_VALUE],
                ['Single layer (0.0)', [
                    [0.0, VALUE_0],
                ], DEFAULT_VALUE * 1.0],
                ['Single layer (1.0)', [
                    [1.0, VALUE_0],
                ], VALUE_0],
                ['Single layer (0.7)', [
                    [0.7, VALUE_0],
                ], DEFAULT_VALUE * 0.3 + VALUE_0 * 0.7],
                ['Two layers (0, 0)', [
                    [0.0, VALUE_0],
                    [0.0, VALUE_1],
                ], DEFAULT_VALUE],
                ['Two layers (0, 1)', [
                    [0.0, VALUE_0],
                    [1.0, VALUE_1],
                ], VALUE_1],
                ['Two layers (1, 1)', [
                    [1.0, VALUE_0],
                    [1.0, VALUE_1],
                ], VALUE_1],
                ['Two layers (in-between, in-between)', [
                    [0.4, VALUE_0],
                    [0.7, VALUE_1],
                ], (DEFAULT_VALUE * 0.6 + VALUE_0 * 0.4) * 0.3 + VALUE_1 * 0.7],
                ['Three layers (random)', [
                    [1.0, VALUE_0],
                    [0.7, VALUE_1],
                    [0.2, VALUE_2],
                ], (VALUE_0 * 0.3 + VALUE_1 * 0.7) * 0.8 + VALUE_2 * 0.2],
            ] as Array<[
                title: string,
                layers: Array<[weight: number, value: number]>,
                expected: number,
            ]>)(`%s`, (_title, layers, expected) => {
                const nodes = Array.from({ length: 4 }, () => new Node());
                const [
                    pNode,
                    sNode,
                    rNode,
                    eNode,
                ] = nodes;

                pNode.setPosition(new Vec3(DEFAULT_VALUE, 0.0, 0.0));
                sNode.setScale(new Vec3(DEFAULT_VALUE, 0.0, 0.0));
                eNode.setRotationFromEuler(toRadian(DEFAULT_VALUE), 0.0, 0.0);
                rNode.setRotation(Quat.fromEuler(new Quat(), toRadian(DEFAULT_VALUE), 0.0, 0.0));

                const blendBuffer = new LayeredBlendStateBuffer();

                for (const [layerWeight, layerValue] of layers) {
                    const writerHost: BlendStateWriterHost = { weight: 1.0 };
                    const pWriter = blendBuffer.createWriter(pNode, 'position', writerHost, false);
                    const sWriter = blendBuffer.createWriter(sNode, 'scale', writerHost, false);
                    const eWriter = blendBuffer.createWriter(eNode, 'eulerAngles', writerHost, false);
                    const rWriter = blendBuffer.createWriter(rNode, 'rotation', writerHost, false);
                    pWriter.setValue(new Vec3(layerValue, 0.0, 0.0));
                    sWriter.setValue(new Vec3(layerValue, 0.0, 0.0));
                    eWriter.setValue(new Vec3(toRadian(layerValue), 0.0, 0.0));
                    rWriter.setValue(Quat.fromEuler(new Quat(), toRadian(layerValue), 0.0, 0.0));
                    blendBuffer.commitLayerChanges(layerWeight);
                }

                blendBuffer.apply();

                expect(pNode.position.x).toBeCloseTo(expected);
                expect(sNode.scale.x).toBeCloseTo(expected);
                expect(eNode.eulerAngles.x).toBeCloseTo(toRadian(expected));
                expect(Quat.equals(rNode.rotation, Quat.fromEuler(new Quat(), toRadian(expected), 0.0, 0.0))).toBeTrue();
            });
        });
    });
});
