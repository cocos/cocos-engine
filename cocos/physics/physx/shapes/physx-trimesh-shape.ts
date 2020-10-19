import { GFXAttributeName, Mesh, Quat } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { MeshCollider } from "../../framework";
import { ITrimeshShape } from "../../spec/i-physics-shape";
import { PX, _trans } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXTrimeshShape extends PhysXShape implements ITrimeshShape {

    constructor () {
        super(EPhysXShapeType.MESH);
    }

    setMesh (v: Mesh | null) {
        if (v && v.renderingSubMeshes.length > 0 && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics;
            const collider = this.collider;
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            const meshScale = new PX.PxMeshScale(collider.node.worldScale, Quat.IDENTITY);
            if (collider.convex) {
                if (PX.MESH_CONVEX[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    const posBuf = v.readAttribute(0, GFXAttributeName.ATTR_POSITION)!;
                    const l = posBuf.length;
                    const vArr = new PX.PxVec3Vector();
                    for (let i = 0; i < l; i += 3) {
                        vArr.push_back({ x: posBuf[i], y: posBuf[i + 1], z: posBuf[i + 2] });
                    }
                    PX.MESH_CONVEX[v._uuid] = cooking.createConvexMesh(vArr, physics);
                }
                const convexMesh = PX.MESH_CONVEX[v._uuid];
                const geometry = new PX.PxConvexMeshGeometry(convexMesh, meshScale, new PX.PxConvexMeshGeometryFlags(1));
                this._impl = physics.createShape(geometry, pxmat, true, this._flags);
            } else {
                if (PX.MESH_STATIC[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    const posBuf = v.readAttribute(0, GFXAttributeName.ATTR_POSITION)!;
                    const l = posBuf.length;
                    const ptr = PX._malloc(4 * l);
                    let offset = 0;
                    for (let i = 0; i < l; i += 3) {
                        PX.HEAPF32[ptr + offset >> 2] = posBuf[i];
                        offset += 4;
                        PX.HEAPF32[ptr + offset >> 2] = posBuf[i + 1];
                        offset += 4;
                        PX.HEAPF32[ptr + offset >> 2] = posBuf[i + 2];
                        offset += 4;
                    }

                    const indicesBuf = v.readIndices(0)!;
                    const l2 = indicesBuf.length;
                    const ptr2 = PhysX._malloc(2 * l2 * 3);
                    let offset2 = 0;
                    for (let i = 0; i < l2; i += 3) {
                        PX.HEAPU16[ptr2 + offset2 >> 2] = indicesBuf[i];
                        offset2 += 2;
                        PX.HEAPU16[ptr2 + offset2 >> 2] = indicesBuf[i + 1];
                        offset2 += 2;
                        PX.HEAPU16[ptr2 + offset2 >> 2] = indicesBuf[i + 2];
                        offset2 += 2;
                    }

                    PX.MESH_STATIC[v._uuid] = cooking.createTriMesh(ptr, l / 3, ptr2, l2 / 3, true, physics);
                    PX._free(ptr)
                    PX._free(ptr2)
                }
                const trimesh = PX.MESH_STATIC[v._uuid];
                const geometry = new PX.PxTriangleMeshGeometry(trimesh, meshScale, new PX.PxMeshGeometryFlags(0))
                this._impl = physics.createShape(geometry, pxmat, true, this._flags);
            }
        }
    }

    get collider () {
        return this._collider as MeshCollider;
    }

    onComponentSet () {
        this.setMesh(this.collider.mesh);
    }

    updateScale () {
        this.setCenter(this._collider.center);
    }
}
