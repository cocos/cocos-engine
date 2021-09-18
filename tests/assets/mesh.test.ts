
import { Mesh, SubMesh, VertexAttributeVec3View, VertexAttributeVec4View, VertexAttributeView } from '../../cocos/3d/assets/mesh';
import { gfx, Vec3, Vec4 } from '../../cocos/core';
import { Color } from '../../cocos/core/gfx';
import '../utils/matcher-deep-close-to';
import 'jest-extended';

describe('Mesh', () => {
    describe('Attribute view', () => {
        const mesh = new Mesh();
        const subMesh = mesh.addSubMesh();
        subMesh.rearrange({
            streams: [{
                attributes: [{
                    name: gfx.AttributeName.ATTR_POSITION,
                    format: gfx.Format.RGB32F,
                }, {
                    name: gfx.AttributeName.ATTR_NORMAL,
                    format: gfx.Format.RGB32F,
                }],
            }, {
                attributes: [{
                    name: gfx.AttributeName.ATTR_COLOR,
                    format: gfx.Format.RGBA32F,
                }],
            }],
        }, 3);

        expect(subMesh.vertexCount).toBe(3);
        expect(subMesh.hasAttribute(gfx.AttributeName.ATTR_POSITION));
        expect(subMesh.hasAttribute(gfx.AttributeName.ATTR_NORMAL));
        expect(subMesh.hasAttribute(gfx.AttributeName.ATTR_COLOR));

        const positions = Array.from({ length: 3 * subMesh.vertexCount }, (_, index) => index * 0.1);
        const normals = Array.from({ length: 3 * subMesh.vertexCount }, (_, index) => index * 1.2);
        const colors = Array.from({ length: 3 * subMesh.vertexCount }, (_, index) => index * -3.6);

        subMesh.viewAttribute(gfx.AttributeName.ATTR_POSITION).write(positions);
        subMesh.viewAttribute(gfx.AttributeName.ATTR_NORMAL).write(normals);
        subMesh.viewAttribute(gfx.AttributeName.ATTR_COLOR).write(colors);

        test.each([
            ['interleaved', {
                attributeName: gfx.AttributeName.ATTR_NORMAL,
                expectedComponentCount: 3,
            }],
            ['compact', {
                attributeName: gfx.AttributeName.ATTR_COLOR,
                expectedComponentCount: 4,
            }],
        ])('View on %s attribute', (_, { attributeName, expectedComponentCount }) => {
            const view = subMesh.viewAttribute(attributeName);

            expect(view.vertexCount).toBe(subMesh.vertexCount);
            expect(view.componentCount).toBe(expectedComponentCount);
    
            // Set 3rd vertex's y component to 0.1 
            view.setComponent(2, 1, 0.1);
            expect(view.getComponent(2, 1)).toBeCloseTo(0.1);
    
            // Copy 3rd vertex's value into 2nd vertex
            view.set(view.subarray(2), 1);
            for (let i = 0; i < view.componentCount; ++i) {
                expect(view.getComponent(2, i)).toBe(view.getComponent(1, i));
            }
    
            // Read all vertices' normal
            const normals = view.read() as Float32Array;
            expect(normals).toBeInstanceOf(Float32Array);
            expect(normals).toHaveLength(view.componentCount * view.vertexCount);
            for (let iVertex = 0; iVertex < view.vertexCount; ++iVertex) {
                for (let iComponent = 0; iComponent < view.componentCount; ++iComponent) {
                    expect(view.getComponent(iVertex, iComponent)).toBe(normals[view.componentCount * iVertex + iComponent]);
                }
            }
    
            // Read only two vertices' normal
            const normals2 = view.read(2);
            expect(normals2).toBeInstanceOf(Float32Array);
            expect(normals2).toHaveLength(view.componentCount * 2);
            for (let iVertex = 0; iVertex < 2; ++iVertex) {
                for (let iComponent = 0; iComponent < view.componentCount; ++iComponent) {
                    expect(view.getComponent(iVertex, iComponent)).toBe(normals[view.componentCount * iVertex + iComponent]);
                }
            }
    
            // Read 3(all) vertices' normal and store by your preferred array constructor
            const normals3 = view.read(3, Float64Array);
            // Read all vertices' normal into specified array(and optionally specify a count)
            const normals4 = view.read(new Float32Array(3 * 3), 3);
        });

        test('Vec3 view', () => {
            // Operates on whole attribute
            const normalViewVec3 = new VertexAttributeVec3View(subMesh.viewAttribute(gfx.AttributeName.ATTR_NORMAL));
            // Set 2nd vertex's value to (0.0, 1.0, 0.0)
            normalViewVec3.set(1, new Vec3(0.0, 1.0, 0.0));
            expect(normalViewVec3.get(1, new Vec3())).toStrictEqual(new Vec3(0.0, 1.0, 0.0));
        });

        test('Vec4 view', () => {
            // Operates in Color(Vec4)
            const colorView = new VertexAttributeVec4View(subMesh.viewAttribute(gfx.AttributeName.ATTR_COLOR));
            colorView.set(1, new Color(0.1, 0.2, 0.3, 0.4));
            expect(colorView.get(1, new Vec4())).toBeDeepCloseTo(new Color(0.1, 0.2, 0.3, 0.4), 5);
        });
    });

    describe(`Resize`, () => {
        function createSimple() {
            const mesh = new Mesh();
            const subMesh = mesh.addSubMesh();
            subMesh.rearrange({
                streams: [{
                    attributes: [{
                        name: gfx.AttributeName.ATTR_POSITION,
                        format: gfx.Format.RGB32F,
                    }],
                }],
            }, 3);

            const positions = new VertexAttributeVec3View(subMesh.viewAttribute(gfx.AttributeName.ATTR_POSITION));
            for (let i = 0; i < 3; ++i) {
                positions.set(i, new Vec3(i + 1.0));
            }
            return subMesh;
        }

        test(`Shrink`, () => {
            const subMesh = createSimple();
            subMesh.resize(2);
            expect(subMesh.vertexCount).toBe(2);
            const positions = new VertexAttributeVec3View(subMesh.viewAttribute(gfx.AttributeName.ATTR_POSITION));
            expect(positions.get(0)).toBeDeepCloseTo(new Vec3(1.0));
            expect(positions.get(1)).toBeDeepCloseTo(new Vec3(2.0));
        });

        test(`Expansion`, () => {
            const subMesh = createSimple();
            subMesh.resize(5);
            expect(subMesh.vertexCount).toBe(5);
            const positions = new VertexAttributeVec3View(subMesh.viewAttribute(gfx.AttributeName.ATTR_POSITION));
            expect(positions.get(0)).toBeDeepCloseTo(new Vec3(1.0));
            expect(positions.get(1)).toBeDeepCloseTo(new Vec3(2.0));
            expect(positions.get(2)).toBeDeepCloseTo(new Vec3(3.0));
            expect([3, 4]).toSatisfyAll((index) => positions.get(index).x === 0.0);
        });
    });

    test(`Rearrange`, () => {
        const mesh = new Mesh();
        const subMesh = mesh.addSubMesh();
        subMesh.rearrange({
            streams: [{
                attributes: [{
                    name: gfx.AttributeName.ATTR_POSITION,
                    format: gfx.Format.RGB32F,
                }],
            }],
        }, 3);

        subMesh.viewAttribute(gfx.AttributeName.ATTR_POSITION).write(
            Array.from({ length: 3 * subMesh.vertexCount }, (_, index) => index));

        subMesh.rearrange({
            streams: [{
                attributes: [{
                    name: gfx.AttributeName.ATTR_POSITION,
                    format: gfx.Format.RGB32F,
                }, {
                    name: gfx.AttributeName.ATTR_NORMAL,
                    format: gfx.Format.RGB32F,
                }],
            }, {
                attributes: [{
                    name: gfx.AttributeName.ATTR_COLOR,
                    format: gfx.Format.RGBA32F,
                }],
            }],
        }, 6);

        expect(subMesh.vertexCount).toBe(6);
        expect(subMesh.hasAttribute(gfx.AttributeName.ATTR_POSITION));
        expect(subMesh.hasAttribute(gfx.AttributeName.ATTR_NORMAL));
        expect(subMesh.hasAttribute(gfx.AttributeName.ATTR_COLOR));
        expect(subMesh.attributeNames).toSatisfyAll(
            (attribute) => subMesh.viewAttribute(attribute).read().every((v) => v === 0.0));
    });

    describe(`Events`, () => {
        test(`Rendering mesh reconstituted`, () => {
            const recorder = jest.fn<void, []>();

            const mesh = new Mesh();
            mesh.initialize();
            
            mesh.on(Mesh.EventType.RENDERING_SUB_MESH_RECONSTITUTED, recorder);

            const subMesh = mesh.addSubMesh();
            mesh.flush();
            mesh.flush();
            expect(recorder).toBeCalledTimes(1);
            recorder.mockClear();

            subMesh.rearrange({
                streams: [{
                    attributes: [{
                        name: gfx.AttributeName.ATTR_POSITION,
                        format: gfx.Format.RGB32F,
                    }],
                }],
            }, 3);
            mesh.flush();
            mesh.flush();
            expect(recorder).toBeCalledTimes(1);
            recorder.mockClear();
        });
    });
});
