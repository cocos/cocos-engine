import { GFXAttributeName, Mesh, Quat, Vec3 } from '../../../core';
import { MeshCollider } from '../../framework';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { createConvexMesh, createMeshGeometryFlags, createTriangleMesh, PX, _trans } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

export class PhysXTrimeshShape extends PhysXShape implements ITrimeshShape {
    geometry: any;

    constructor () {
        super(EPhysXShapeType.MESH);
    }

    setMesh (v: Mesh | null): void {
        if (v && v.renderingSubMeshes.length > 0 && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics;
            const collider = this.collider;
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            const meshScale = PhysXShape.MESH_SCALE;
            meshScale.setScale(Vec3.ONE);
            meshScale.setRotation(Quat.IDENTITY);
            if (collider.convex) {
                if (PX.MESH_CONVEX[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    const posBuf = v.readAttribute(0, GFXAttributeName.ATTR_POSITION)! as unknown as Float32Array;
                    PX.MESH_CONVEX[v._uuid] = createConvexMesh(posBuf, cooking, physics);
                }
                const convexMesh = PX.MESH_CONVEX[v._uuid];
                this.geometry = new PX.ConvexMeshGeometry(convexMesh, meshScale, createMeshGeometryFlags(0, true));
            } else {
                if (PX.MESH_STATIC[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    const posBuf = v.readAttribute(0, GFXAttributeName.ATTR_POSITION)! as unknown as Float32Array;
                    const indBuf = v.readIndices(0)! as unknown as Uint32Array; // Uint16Array ?
                    PX.MESH_STATIC[v._uuid] = createTriangleMesh(posBuf, indBuf, cooking, physics);
                }
                const trimesh = PX.MESH_STATIC[v._uuid];
                this.geometry = new PX.TriangleMeshGeometry(trimesh, meshScale, createMeshGeometryFlags(0, false));
            }
            this.updateGeometry();
            this._impl = physics.createShape(this.geometry, pxmat, true, this._flags);
        }
    }

    get collider (): MeshCollider {
        return this._collider as MeshCollider;
    }

    onComponentSet (): void {
        this.setMesh(this.collider.mesh);
    }

    updateScale (): void {
        this.updateGeometry();
        this.setCenter(this._collider.center);
    }

    updateGeometry (): void {
        const meshScale = PhysXShape.MESH_SCALE;
        meshScale.setScale(this.collider.node.worldScale);
        meshScale.setRotation(Quat.IDENTITY);
        this.geometry.setScale(meshScale);
    }
}
