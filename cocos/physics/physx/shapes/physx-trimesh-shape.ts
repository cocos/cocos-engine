import { GFXAttributeName, Mesh, Quat } from "../../../core";
import { aabb, sphere } from "../../../core/geometry";
import { MeshCollider } from "../../framework";
import { ITrimeshShape } from "../../spec/i-physics-shape";
import { PX, USE_BYTEDANCE, _trans } from "../export-physx";
import { EPhysXShapeType, PhysXShape } from "./physx-shape";

export class PhysXTrimeshShape extends PhysXShape implements ITrimeshShape {

    constructor () {
        super(EPhysXShapeType.MESH);
    }

    setMesh (v: Mesh | null) {
        if (v && v.renderingSubMeshes.length > 0 && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics as any;
            const collider = this.collider;
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            let meshScale;
            if (USE_BYTEDANCE) {
                meshScale = new PX.MeshScale(collider.node.worldScale, Quat.IDENTITY);
            } else {
                meshScale = new PX.PxMeshScale(collider.node.worldScale, Quat.IDENTITY);
            }
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
                    const indBuf = v.readIndices(0)!;
                    const l2 = indBuf.length;
                    if (USE_BYTEDANCE) {
                        const mdesc = new PX.TriangleMeshDesc();
                        mdesc.setPointCount(l / 3);
                        mdesc.setPointStride(3 * Float32Array.BYTES_PER_ELEMENT);
                        mdesc.setPointData(posBuf);
                        mdesc.setTriangleCount(l2 / 3);
                        mdesc.setTriangleStride(3 * Uint16Array.BYTES_PER_ELEMENT);
                        mdesc.setTriangleData(indBuf);
                        PX.MESH_STATIC[v._uuid] = cooking.createTriangleMesh(mdesc);
                    } else {
                        const vArr = new PX.PxVec3Vector();
                        for (let i = 0; i < l; i += 3) {
                            vArr.push_back({ x: posBuf[i], y: posBuf[i + 1], z: posBuf[i + 2] });
                        }
                        const iArr = new PX.PxU16Vector();
                        for (let i = 0; i < l2; i += 3) {
                            iArr.push_back(indBuf[i]); iArr.push_back(indBuf[i + 1]); iArr.push_back(indBuf[i + 2]);
                        }
                        PX.MESH_STATIC[v._uuid] = cooking.createTriMeshExt(vArr, iArr, physics);
                    }
                }
                const trimesh = PX.MESH_STATIC[v._uuid];
                if (USE_BYTEDANCE) {
                    const geometry = new PX.TriangleMeshGeometry(trimesh, meshScale, PX.MeshGeometryFlags.eDOUBLE_SIDED)
                    this._impl = physics.createShape(geometry, pxmat);
                    const isT = this._collider.isTrigger;
                    if (isT) {
                        this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !isT)
                        this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, isT);
                    } else {
                        this._impl.setFlag(PX.ShapeFlag.eTRIGGER_SHAPE, isT);
                        this._impl.setFlag(PX.ShapeFlag.eSIMULATION_SHAPE, !isT)
                    }
                } else {
                    const geometry = new PX.PxTriangleMeshGeometry(trimesh, meshScale, new PX.PxMeshGeometryFlags(0))
                    this._impl = physics.createShape(geometry, pxmat, true, this._flags);
                }
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
