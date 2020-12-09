import { GFXAttributeName, Mesh, Quat } from '../../../core';
import { aabb, sphere } from '../../../core/geometry';
import { MeshCollider } from '../../framework';
import { ITrimeshShape } from '../../spec/i-physics-shape';
import { PX, USE_BYTEDANCE, _trans } from '../export-physx';
import { EPhysXShapeType, PhysXShape } from './physx-shape';

function setupCommonCookingParam (params: any, skipMeshClean = false, skipEdgedata = false): void {
    params.setSuppressTriangleMeshRemapTable(true);
    if (!skipMeshClean) {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() & ~PX.MeshPreprocessingFlag.eDISABLE_CLEAN_MESH);
    } else {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() | PX.MeshPreprocessingFlag.eDISABLE_CLEAN_MESH);
    }

    if (skipEdgedata) {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() & ~PX.MeshPreprocessingFlag.eDISABLE_ACTIVE_EDGES_PRECOMPUTE);
    } else {
        params.setMeshPreprocessParams(params.getMeshPreprocessParams() | PX.MeshPreprocessingFlag.eDISABLE_ACTIVE_EDGES_PRECOMPUTE);
    }
}

function createConvexMesh (vertices: Float32Array, cooking: any): any {
    const cdesc = new PX.ConvexMeshDesc();
    cdesc.setPointsData(vertices);
    cdesc.setPointsCount(vertices.length / 3);
    cdesc.setPointsStride(3 * Float32Array.BYTES_PER_ELEMENT);
    cdesc.setConvexFlags(PX.ConvexFlag.eCOMPUTE_CONVEX);
    return cooking.createConvexMesh(cdesc);
}

function createTriangleMesh (vertices: Float32Array, indices: Uint32Array, cooking: any): any {
    const meshDesc = new PX.TriangleMeshDesc();
    meshDesc.setPointsData(vertices);
    meshDesc.setPointsCount(vertices.length / 3);
    meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
    meshDesc.setTrianglesData(indices);
    meshDesc.setTrianglesCount(indices.length / 3);
    meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);
    return cooking.createTriangleMesh(meshDesc);
}

function createBV33TriangleMesh (vertices: Float32Array, indices: Uint32Array, cooking: any,
    skipMeshCleanUp = false,
    skipEdgeData = false,
    cookingPerformance = false,
    meshSizePerfTradeoff = true, inserted = true): any {
    const meshDesc = new PX.TriangleMeshDesc();
    meshDesc.setPointsData(vertices);
    meshDesc.setPointsCount(vertices.length / 3);
    meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
    meshDesc.setTrianglesData(indices);
    meshDesc.setTrianglesCount(indices.length / 3);
    meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);

    const params = cooking.getParams();
    setupCommonCookingParam(params, skipMeshCleanUp, skipEdgeData);
    const midDesc = new PX.BVH33MidphaseDesc();

    if (cookingPerformance) midDesc.setMeshCookingHint(PX.MeshCookingHint.eCOOKING_PERFORMANCE);
    else midDesc.setMeshCookingHint(PX.MeshCookingHint.eSIM_PERFORMANCE);

    if (meshSizePerfTradeoff) midDesc.setMeshSizePerformanceTradeOff(0.0);
    else midDesc.setMeshSizePerformanceTradeOff(0.55);

    params.setMidphaseDesc(midDesc);
    cooking.setParams(params);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Cook 状态：${cooking.validateTriangleMesh(meshDesc)}`);
    return cooking.createTriangleMesh(meshDesc);
}

function createBV34TriangleMesh (vertices: Float32Array, indices: Uint32Array, cooking: any,
    skipMeshCleanUp = false,
    skipEdgeData = false,
    numTrisPerLeaf = true,
    inserted = true): void {
    const meshDesc = new PX.TriangleMeshDesc();
    meshDesc.setPointsData(vertices);
    meshDesc.setPointsCount(vertices.length / 3);
    meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
    meshDesc.setTrianglesData(indices);
    meshDesc.setTrianglesCount(indices.length / 3);
    meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);
    const params = cooking.getParams();
    setupCommonCookingParam(params, skipMeshCleanUp, skipEdgeData);

    const midDesc = new PX.BVH34MidphaseDesc();
    midDesc.setNumPrimsLeaf(numTrisPerLeaf);
    params.setMidphaseDesc(midDesc);
    cooking.setParams(params);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`Cook 状态：${cooking.validateTriangleMesh(meshDesc)}`);
    return cooking.createTriangleMesh(meshDesc);
}

export class PhysXTrimeshShape extends PhysXShape implements ITrimeshShape {
    constructor () {
        super(EPhysXShapeType.MESH);
    }

    setMesh (v: Mesh | null): void {
        if (v && v.renderingSubMeshes.length > 0 && this._impl == null) {
            const wrappedWorld = this._sharedBody.wrappedWorld;
            const physics = wrappedWorld.physics;
            const collider = this.collider;
            const pxmat = this.getSharedMaterial(collider.sharedMaterial!);
            const meshScale = new PX.MeshScale(collider.node.worldScale, Quat.IDENTITY);
            if (collider.convex) {
                if (PX.MESH_CONVEX[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    if (USE_BYTEDANCE) {
                        const posBuf = new Float32Array(v.readAttribute(0, GFXAttributeName.ATTR_POSITION)!);
                        PX.MESH_CONVEX[v._uuid] = createConvexMesh(posBuf, cooking);
                    } else {
                        const posBuf = v.readAttribute(0, GFXAttributeName.ATTR_POSITION)!;
                        const l = posBuf.length;
                        const vArr = new PX.PxVec3Vector();
                        for (let i = 0; i < l; i += 3) {
                            vArr.push_back({ x: posBuf[i], y: posBuf[i + 1], z: posBuf[i + 2] });
                        }
                        PX.MESH_CONVEX[v._uuid] = cooking.createConvexMesh(vArr, physics);
                    }
                }
                const convexMesh = PX.MESH_CONVEX[v._uuid];
                if (USE_BYTEDANCE) {
                    const geometry = new PX.ConvexMeshGeometry(convexMesh, meshScale, 1);
                    this._impl = physics.createShape(geometry, pxmat, true, this._flags);
                } else {
                    const geometry = new PX.PxConvexMeshGeometry(convexMesh, meshScale, new PX.PxConvexMeshGeometryFlags(1));
                    this._impl = physics.createShape(geometry, pxmat, true, this._flags);
                }
            } else {
                if (PX.MESH_STATIC[v._uuid] == null) {
                    const cooking = wrappedWorld.cooking;
                    if (USE_BYTEDANCE) {
                        const posBuf = new Float32Array(v.readAttribute(0, GFXAttributeName.ATTR_POSITION)!);
                        const indBuf = new Uint32Array(v.readIndices(0)!);
                        PX.MESH_STATIC[v._uuid] = createTriangleMesh(posBuf, indBuf, cooking);
                        // PX.MESH_STATIC[v._uuid] = createBV33TriangleMesh(posBuf, indBuf, cooking);
                        // PX.MESH_STATIC[v._uuid] = createBV34TriangleMesh(posBuf, indBuf, cooking);
                    } else {
                        const posBuf = v.readAttribute(0, GFXAttributeName.ATTR_POSITION)!;
                        const l = posBuf.length;
                        const indBuf = v.readIndices(0)!;
                        const l2 = indBuf.length;
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
                    const geometry = new PX.TriangleMeshGeometry(trimesh, meshScale, PX.MeshGeometryFlag.eDOUBLE_SIDED);
                    this._impl = physics.createShape(geometry, pxmat, true, this._flags);
                } else {
                    const geometry = new PX.PxTriangleMeshGeometry(trimesh, meshScale, new PX.PxMeshGeometryFlags(0));
                    this._impl = physics.createShape(geometry, pxmat, true, this._flags);
                }
            }
        }
    }

    get collider (): MeshCollider {
        return this._collider as MeshCollider;
    }

    onComponentSet (): void {
        this.setMesh(this.collider.mesh);
    }

    updateScale (): void {
        this.setCenter(this._collider.center);
    }
}
