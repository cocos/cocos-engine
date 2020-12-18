/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-undef */
import { BYTEDANCE } from 'internal:constants';
import { IQuatLike, IVec3Like, Node, Quat, Vec3 } from '../../core';

export let USE_BYTEDANCE = false;
if (BYTEDANCE) USE_BYTEDANCE = true;

let _px = globalThis.PhysX as any;
if (USE_BYTEDANCE && globalThis.tt.getPhy) _px = globalThis.tt.getPhy();
export const PX = _px;

/// enum ///

export enum EFilterDataWord3 {
    QUERY_FILTER = 1 << 0,
    QUERY_CHECK_TRIGGER = 1 << 1,
    QUERY_SINGLE_HIT = 1 << 2,
    DETECT_TRIGGER_EVENT = 1 << 3,
    DETECT_CONTACT_EVENT = 1 << 4,
    DETECT_CONTACT_POINT = 1 << 5,
    DETECT_CONTACT_CCD = 1 << 6,
}

/// adapters ///

export const _trans = {
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
};

export const _pxtrans = USE_BYTEDANCE && PX ? new PX.Transform({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0, w: 1 }) : _trans;

if (PX) {
    PX.CACHE_MAT = {};
    PX.IMPL_PTR = {};
    PX.MESH_CONVEX = {};
    PX.MESH_STATIC = {};
    PX.TERRAIN_STATIC = {};
    if (!USE_BYTEDANCE) {
        PX.VECTOR_MAT = new PX.PxMaterialVector();
        PX.ShapeFlag = PX.PxShapeFlag;
        PX.ActorFlag = PX.PxActorFlag;
        PX.RigidBodyFlag = PX.PxRigidBodyFlag;
        PX.RigidDynamicLockFlag = PX.PxRigidDynamicLockFlag;
        PX.CombineMode = PX.PxCombineMode;
        PX.ForceMode = PX.PxForceMode;
        PX.SphereGeometry = PX.PxSphereGeometry;
        PX.BoxGeometry = PX.PxBoxGeometry;
        PX.CapsuleGeometry = PX.PxCapsuleGeometry;
        PX.PlaneGeometry = PX.PxPlaneGeometry;
        PX.ConvexMeshGeometry = PX.PxConvexMeshGeometry;
        PX.MeshScale = PX.PxMeshScale;
        PX.createRevoluteJoint = (a: any, b: any, c: any, d: any): any => PX.PxRevoluteJointCreate(PX.physics, a, b, c, d);
        PX.createDistanceJoint = (a: any, b: any, c: any, d: any): any => PX.PxDistanceJointCreate(PX.physics, a, b, c, d);
    }
}

export function getImplPtr (impl: any) {
    if (USE_BYTEDANCE) {
        return impl.getQueryFilterData().word2;
    }
    return impl.$$.ptr;
}

export function getWrapShape<T> (pxShape: any): T {
    return PX.IMPL_PTR[getImplPtr(pxShape)];
}

/**
 * f32 x3  position.x,position.y,position.z,
 * f32 separation,
 * f32 x3 normal.x,normal.y,normal.z,
 * ui32 internalFaceIndex0,
 * f32 x3 impulse.x,impulse.y,impulse.z,
 * ui32 internalFaceIndex1
 * totoal = 48
 */
export function getContactPosition (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    // return USE_BYTEDANCE ? pxContact.getPosition() : pxContactOrIndex.position;
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 48 * pxContactOrIndex, 3));
    } else {
        Vec3.copy(out, pxContactOrIndex.position);
    }
}

export function getContactNormal (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    // return USE_BYTEDANCE ? pxContact.getNormal() : pxContact.normal;
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 48 * pxContactOrIndex + 16, 3));
    } else {
        Vec3.copy(out, pxContactOrIndex.normal);
    }
}

export function getTempTransform (pos: IVec3Like, quat: IQuatLike): any {
    if (USE_BYTEDANCE) {
        _pxtrans.setPosition(pos);
        _pxtrans.setQuaternion(quat);
    } else {
        Vec3.copy(_pxtrans.translation, pos);
        Quat.copy(_pxtrans.rotation, quat);
    }
    return _pxtrans;
}

export function setJointActors (joint: any, actor0: any, actor1: any): void {
    if (USE_BYTEDANCE) {
        // eslint-disable-next-line no-unused-expressions
        actor1 ? joint.setActors(actor0, actor1) : joint.setActors(actor0);
    } else {
        joint.setActors(actor0, actor1);
    }
}

export function setMassAndUpdateInertia (impl: any, mass: number): void {
    if (USE_BYTEDANCE) {
        PX.RigidBodyExt.setMassAndUpdateInertia(impl, mass);
    } else {
        impl.setMassAndUpdateInertia(mass);
    }
}

export function copyPhysXTransform (node: Node, transform: any): void {
    if (USE_BYTEDANCE) {
        const pos = transform.getPosition();
        const rot = transform.getQuaternion();
        node.setWorldPosition(pos);
        node.setWorldRotation(rot);
    } else {
        node.setWorldPosition(transform.translation);
        node.setWorldRotation(transform.rotation);
    }
}

export function getContactData (vec: any, index: number) {
    if (USE_BYTEDANCE) {
        // return vec[index];
        return index;
    } else {
        return vec.get(index);
    }
}

export function applyImpulse (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyImpulse(impl, vec, rp);
        } else {
            impl.applyImpulse(vec, rp);
        }
    } else {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyLocalImpulse(impl, vec, rp);
        } else {
            impl.applyLocalImpulse(vec, rp);
        }
    }
}

export function applyForce (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyForce(impl, vec, rp);
        } else {
            impl.applyForce(vec, rp);
        }
    } else {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyLocalForce(impl, vec, rp);
        } else {
            impl.applyLocalForce(vec, rp);
        }
    }
}

export function applyTorqueForce (impl: any, vec: IVec3Like) {
    if (USE_BYTEDANCE) {
        impl.addTorque(vec, PX.ForceMode.eFORCE, true);
    } else {
        impl.addTorque(vec);
    }
}

export function getShapeFlags (isTrigger: boolean): any {
    if (USE_BYTEDANCE) {
        const flag = (isTrigger ? PX.ShapeFlag.eTRIGGER_SHAPE : PX.ShapeFlag.eSIMULATION_SHAPE)
            | PX.ShapeFlag.eSCENE_QUERY_SHAPE;
        return flag;
    } else {
        const flag = (isTrigger ? PX.PxShapeFlag.eTRIGGER_SHAPE.value : PX.PxShapeFlag.eSIMULATION_SHAPE.value)
            | PX.PxShapeFlag.eSCENE_QUERY_SHAPE.value;
        return new PX.PxShapeFlags(flag);
    }
}

export function getShapeMaterials (pxMtl: any) {
    if (USE_BYTEDANCE) {
        return [pxMtl];
    } else {
        if (PX.VECTOR_MAT.size() > 0) {
            PX.VECTOR_MAT.set(0, pxMtl);
        } else {
            PX.VECTOR_MAT.push_back(pxMtl);
        }
        return PX.VECTOR_MAT;
    }
}

export function setupCommonCookingParam (params: any, skipMeshClean = false, skipEdgedata = false): void {
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

export function createConvexMesh (vertices: Float32Array, cooking: any, physics: any): any {
    if (USE_BYTEDANCE) {
        const cdesc = new PX.ConvexMeshDesc();
        cdesc.setPointsData(vertices);
        cdesc.setPointsCount(vertices.length / 3);
        cdesc.setPointsStride(3 * Float32Array.BYTES_PER_ELEMENT);
        cdesc.setConvexFlags(PX.ConvexFlag.eCOMPUTE_CONVEX);
        return cooking.createConvexMesh(cdesc);
    } else {
        ;
        const l = vertices.length;
        const vArr = new PX.PxVec3Vector();
        for (let i = 0; i < l; i += 3) {
            vArr.push_back({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] });
        }
        return cooking.createConvexMesh(vArr, physics);
    }
}

//eTIGHT_BOUNDS = (1<<0) convex
//eDOUBLE_SIDED = (1<<1) trimesh
export function createMeshGeometryFlags (flags: number, isConvex: boolean) {
    if (USE_BYTEDANCE) {
        return flags;
    } else {
        return isConvex ? new PX.PxConvexMeshGeometryFlags(flags) : new PX.PxMeshGeometryFlags(flags);
    }
}

export function createTriangleMesh (vertices: Float32Array, indices: Uint32Array, cooking: any, physics: any): any {
    if (USE_BYTEDANCE) {
        const meshDesc = new PX.TriangleMeshDesc();
        meshDesc.setPointsData(vertices);
        meshDesc.setPointsCount(vertices.length / 3);
        meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
        meshDesc.setTrianglesData(indices);
        meshDesc.setTrianglesCount(indices.length / 3);
        meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);
        return cooking.createTriangleMesh(meshDesc);
    } else {
        const l = vertices.length;
        const l2 = indices.length;
        const vArr = new PX.PxVec3Vector();
        for (let i = 0; i < l; i += 3) {
            vArr.push_back({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] });
        }
        const iArr = new PX.PxU16Vector();
        for (let i = 0; i < l2; i += 3) {
            iArr.push_back(indices[i]); iArr.push_back(indices[i + 1]); iArr.push_back(indices[i + 2]);
        }
        return cooking.createTriMeshExt(vArr, iArr, physics);
    }
}

export function createBV33TriangleMesh (vertices: Float32Array, indices: Uint32Array, cooking: any, physics: any,
    skipMeshCleanUp = false,
    skipEdgeData = false,
    cookingPerformance = false,
    meshSizePerfTradeoff = true, inserted = true): any {
    if (!USE_BYTEDANCE) return;
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

export function createBV34TriangleMesh (vertices: Float32Array, indices: Uint32Array, cooking: any, physics: any,
    skipMeshCleanUp = false,
    skipEdgeData = false,
    numTrisPerLeaf = true,
    inserted = true): void {
    if (!USE_BYTEDANCE) return;
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

export function createHeightField (terrain: any, heightScale: number, cooking: any, physics: any) {
    const sizeI = terrain.getVertexCountI();
    const sizeJ = terrain.getVertexCountJ();
    if (USE_BYTEDANCE) {
        const samples = new PX.HeightFieldSamples(sizeI * sizeJ);
        for (let i = 0; i < sizeI; i++) {
            for (let j = 0; j < sizeJ; j++) {
                const s = terrain.getHeight(i, j) / heightScale;
                const index = j + i * sizeJ;
                samples.setHeightAtIndex(index, s);
                // samples.setMaterialIndex0AtIndex(index, 0);
                // samples.setMaterialIndex1AtIndex(index, 0);
            }
        }
        const hfdesc = new PX.HeightFieldDesc();
        hfdesc.setNbRows(sizeJ);
        hfdesc.setNbColumns(sizeI);
        hfdesc.setSamples(samples);
        return cooking.createHeightField(hfdesc);
    } else {
        const samples = new PX.PxHeightFieldSampleVector();
        for (let i = 0; i < sizeI; i++) {
            for (let j = 0; j < sizeJ; j++) {
                const s = new PX.PxHeightFieldSample();
                s.height = terrain.getHeight(i, j) / heightScale;
                samples.push_back(s);
            }
        }
        return cooking.createHeightFieldExt(sizeI, sizeJ, samples, physics);
    }
}

export function createHeightFieldGeometry (hf: any, flags: number, hs: number, xs: number, zs: number) {
    if (USE_BYTEDANCE) {
        return new PX.HeightFieldGeometry(hf, hs, xs, zs);
    } else {
        return new PX.PxHeightFieldGeometry(hf, new PX.PxMeshGeometryFlags(flags),
            hs, xs, zs);
    }
}
