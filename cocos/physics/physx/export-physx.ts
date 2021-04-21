/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { BYTEDANCE } from 'internal:constants';
import { IQuatLike, IVec3Like, Node, Quat, RecyclePool, Vec3 } from '../../core';
import { shrinkPositions } from '../utils/util';
import { legacyCC } from '../../core/global-exports';
import { Ray } from '../../core/geometry';
import { IRaycastOptions } from '../spec/i-physics-world';
import { PhysicsRayResult } from '../framework';
import { PhysXWorld } from './physx-world';
import { PhysXShape } from './shapes/physx-shape';
// import PhysX from '@cocos/physx';

const globalThis = legacyCC._global;

if (PhysX) {
    globalThis.PhysX = (PhysX as any)({
        onRuntimeInitialized () {
            console.log('PhysX loaded');
            if (PX) {
                PX.CACHE_MAT = {};
                PX.IMPL_PTR = {};
                PX.MESH_CONVEX = {};
                PX.MESH_STATIC = {};
                PX.TERRAIN_STATIC = {};
                if (!USE_BYTEDANCE) {
                    PX.VECTOR_MAT = new PX.PxMaterialVector();
                    PX.QueryHitType = PX.PxQueryHitType;
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
                    PX.TriangleMeshGeometry = PX.PxTriangleMeshGeometry;
                    PX.MeshScale = PX.PxMeshScale;
                    PX.createRevoluteJoint = (a: any, b: any, c: any, d: any): any => PX.PxRevoluteJointCreate(PX.physics, a, b, c, d);
                    PX.createDistanceJoint = (a: any, b: any, c: any, d: any): any => PX.PxDistanceJointCreate(PX.physics, a, b, c, d);
                }
            }
        },
    });
}

let USE_BYTEDANCE = false;
if (BYTEDANCE) USE_BYTEDANCE = true;
let _px = globalThis.PhysX as any;
if (USE_BYTEDANCE && globalThis && globalThis.tt.getPhy) _px = globalThis.tt.getPhy();
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

export function getImplPtr (impl: any): any {
    if (USE_BYTEDANCE) {
        return impl.getQueryFilterData().word2;
    }
    return impl.$$.ptr;
}

export function getWrapShape<T> (pxShape: any): T {
    return PX.IMPL_PTR[getImplPtr(pxShape)];
}

/**
 * f32 x3 position.x,position.y,position.z,
 * f32 x3 normal.x,normal.y,normal.z,
 * f32 x3 impulse.x,impulse.y,impulse.z,
 * f32 separation,
 * totoal = 40
 * ui32 internalFaceIndex0,
 * ui32 internalFaceIndex1,
 * totoal = 48
 */
export function getContactPosition (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 40 * pxContactOrIndex, 3));
    } else {
        Vec3.copy(out, pxContactOrIndex.position);
    }
}

export function getContactNormal (pxContactOrIndex: any, out: IVec3Like, buf: any) {
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, 40 * pxContactOrIndex + 12, 3));
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

export function addActorToScene (scene: any, actor: any) {
    if (USE_BYTEDANCE) {
        scene.addActor(actor);
    } else {
        scene.addActor(actor, null);
    }
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
    const wp = node.worldPosition;
    const wr = node.worldRotation;
    const dontUpdate = physXEqualsCocosVec3(transform, wp) && physXEqualsCocosQuat(transform, wr);
    if (dontUpdate) return;
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

export function physXEqualsCocosVec3 (trans: any, v3: IVec3Like): boolean {
    const pos = USE_BYTEDANCE ? trans.getPosition() : trans.translation;
    return Vec3.equals(pos, v3);
}

export function physXEqualsCocosQuat (trans: any, q: IQuatLike): boolean {
    const rot = USE_BYTEDANCE ? trans.getQuaternion() : trans.rotation;
    return Quat.equals(rot, q);
}

export function getContactData (vec: any, index: number, o: number) {
    if (USE_BYTEDANCE) {
        return index + o;
    } else {
        const gc = PX.getGContacts();
        const data = gc.get(index + o);
        gc.delete();
        return data;
    }
}

export function applyImpulse (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyImpulse(impl, vec, rp);
        } else {
            impl.applyImpulse(vec, rp);
        }
    } else if (USE_BYTEDANCE) {
        PX.RigidBodyExt.applyLocalImpulse(impl, vec, rp);
    } else {
        impl.applyLocalImpulse(vec, rp);
    }
}

export function applyForce (isGlobal: boolean, impl: any, vec: IVec3Like, rp: IVec3Like) {
    if (isGlobal) {
        if (USE_BYTEDANCE) {
            PX.RigidBodyExt.applyForce(impl, vec, rp);
        } else {
            impl.applyForce(vec, rp);
        }
    } else if (USE_BYTEDANCE) {
        PX.RigidBodyExt.applyLocalForce(impl, vec, rp);
    } else {
        impl.applyLocalForce(vec, rp);
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
    }
    const flag = (isTrigger ? PX.PxShapeFlag.eTRIGGER_SHAPE.value : PX.PxShapeFlag.eSIMULATION_SHAPE.value)
        | PX.PxShapeFlag.eSCENE_QUERY_SHAPE.value;
    return new PX.PxShapeFlags(flag);
}

export function getShapeWorldBounds (shape: any, actor: any, i = 1.01) {
    if (USE_BYTEDANCE) {
        return PX.RigidBodyExt.getWorldBounds(shape, actor, i);
    } else {
        return shape.getWorldBounds(actor, i);
    }
}

export function getShapeMaterials (pxMtl: any) {
    if (USE_BYTEDANCE) {
        return [pxMtl];
    }
    if (PX.VECTOR_MAT.size() > 0) {
        PX.VECTOR_MAT.set(0, pxMtl);
    } else {
        PX.VECTOR_MAT.push_back(pxMtl);
    }
    return PX.VECTOR_MAT;
}

export function setupCommonCookingParam (params: any, skipMeshClean = false, skipEdgedata = false): void {
    if (!USE_BYTEDANCE) return;
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

export function createConvexMesh (_buffer: Float32Array | number[], cooking: any, physics: any): any {
    const vertices = shrinkPositions(_buffer);
    if (USE_BYTEDANCE) {
        const cdesc = new PX.ConvexMeshDesc();
        const verticesF32 = new Float32Array(vertices);
        cdesc.setPointsData(verticesF32);
        cdesc.setPointsCount(verticesF32.length / 3);
        cdesc.setPointsStride(3 * Float32Array.BYTES_PER_ELEMENT);
        cdesc.setConvexFlags(PX.ConvexFlag.eCOMPUTE_CONVEX);
        return cooking.createConvexMesh(cdesc);
    } else {
        const l = vertices.length;
        const vArr = new PX.PxVec3Vector();
        for (let i = 0; i < l; i += 3) {
            vArr.push_back({ x: vertices[i], y: vertices[i + 1], z: vertices[i + 2] });
        }
        const r = cooking.createConvexMesh(vArr, physics);
        vArr.delete();
        return r;
    }
}

// eTIGHT_BOUNDS = (1<<0) convex
// eDOUBLE_SIDED = (1<<1) trimesh
export function createMeshGeometryFlags (flags: number, isConvex: boolean) {
    if (USE_BYTEDANCE) {
        return flags;
    }
    return isConvex ? new PX.PxConvexMeshGeometryFlags(flags) : new PX.PxMeshGeometryFlags(flags);
}

export function createTriangleMesh (vertices: Float32Array | number[], indices: Uint32Array, cooking: any, physics: any): any {
    if (USE_BYTEDANCE) {
        const meshDesc = new PX.TriangleMeshDesc();
        meshDesc.setPointsData(vertices);
        meshDesc.setPointsCount(vertices.length / 3);
        meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
        const indicesUI32 = new Uint32Array(indices);
        meshDesc.setTrianglesData(indicesUI32);
        meshDesc.setTrianglesCount(indicesUI32.length / 3);
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
        const r = cooking.createTriMeshExt(vArr, iArr, physics);
        vArr.delete(); iArr.delete();
        return r;
    }
}

export function createBV33TriangleMesh (vertices: number[], indices: Uint32Array, cooking: any, physics: any,
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
    console.log(`[Physics] cook bvh33 status:${cooking.validateTriangleMesh(meshDesc)}`);
    return cooking.createTriangleMesh(meshDesc);
}

export function createBV34TriangleMesh (vertices: number[], indices: Uint32Array, cooking: any, physics: any,
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
    console.log(`[Physics] cook bvh34 status:${cooking.validateTriangleMesh(meshDesc)}`);
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
    }
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

export function createHeightFieldGeometry (hf: any, flags: number, hs: number, xs: number, zs: number) {
    if (USE_BYTEDANCE) {
        return new PX.HeightFieldGeometry(hf, hs, xs, zs);
    }
    return new PX.PxHeightFieldGeometry(hf, new PX.PxMeshGeometryFlags(flags),
        hs, xs, zs);
}

export function simulateScene (scene: any, deltaTime: number) {
    if (USE_BYTEDANCE) {
        scene.simulate(deltaTime);
    } else {
        scene.simulate(deltaTime, true);
    }
}

export function raycastAll (world: PhysXWorld, worldRay: Ray, options: IRaycastOptions,
    pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
    const maxDistance = options.maxDistance;
    const flags = (1 << 0) | (1 << 1) | (1 << 10);
    const word3 = 1 | (options.queryTrigger ? 0 : 2);
    if (USE_BYTEDANCE) {
        world.queryfilterData.data.word3 = word3;
        world.queryfilterData.data.word0 = options.mask >>> 0;
        world.queryfilterData.flags = (1 << 0) | (1 << 1) | (1 << 2) | (1 << 5);
        const r = PX.SceneQueryExt.raycastMultiple(world.scene, worldRay.o, worldRay.d, maxDistance, flags,
            world.mutipleResultSize, world.queryfilterData, world.queryFilterCB);

        if (r) {
            for (let i = 0; i < r.length; i++) {
                const block = r[i];
                const collider = getWrapShape<PhysXShape>(block.shape).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        }
    } else {
        world.queryfilterData.setWords(word3, 3);
        world.queryfilterData.setWords(options.mask >>> 0, 0);
        world.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2) | (1 << 5));
        const blocks = world.mutipleResults;
        const r = world.scene.raycastMultiple(worldRay.o, worldRay.d, maxDistance, flags,
            blocks, blocks.size(), world.queryfilterData, world.queryFilterCB, null);

        if (r > 0) {
            for (let i = 0; i < r; i++) {
                const block = blocks.get(i);
                const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        } if (r === -1) {
            // eslint-disable-next-line no-console
            console.error('not enough memory.');
        }
    }
    return false;
}

export function raycastClosest (world: PhysXWorld, worldRay: Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
    const maxDistance = options.maxDistance;
    const flags = (1 << 0) | (1 << 1); // | (1 << 10);
    const word3 = 1 | (options.queryTrigger ? 0 : 2) | 4;
    if (USE_BYTEDANCE) {
        world.queryfilterData.data.word3 = word3;
        world.queryfilterData.data.word0 = options.mask >>> 0;
        world.queryfilterData.flags = (1 << 0) | (1 << 1) | (1 << 2);
        const block = PX.SceneQueryExt.raycastSingle(world.scene, worldRay.o, worldRay.d, maxDistance,
            flags, world.queryfilterData, world.queryFilterCB);
        if (block) {
            const collider = getWrapShape<PhysXShape>(block.shape).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
    } else {
        world.queryfilterData.setWords(options.mask >>> 0, 0);
        world.queryfilterData.setWords(word3, 3);
        world.queryfilterData.setFlags((1 << 0) | (1 << 1) | (1 << 2));
        const block = world.singleResult;
        const r = world.scene.raycastSingle(worldRay.o, worldRay.d, options.maxDistance, flags,
            block, world.queryfilterData, world.queryFilterCB, null);
        if (r) {
            const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
    }
    return false;
}

export function initializeWorld (world: any, eventCallback: any, queryCallback: any, onCollision: any, onTrigger: any) {
    if (USE_BYTEDANCE) {
        // const physics = PX.createPhysics();
        const physics = PX.physics;
        const cp = new PX.CookingParams();
        const cooking = PX.createCooking(cp);
        const sceneDesc = physics.createSceneDesc();
        const simulation = new PX.SimulationEventCallback();
        simulation.setOnContact((_header: any, pairs: any) => {
            const shapes = _header.shapes as any[];
            // uint16   ContactPairFlags
            // uint16   PairFlags
            // uint16   ContactCount
            const pairBuf = _header.pairBuffer as ArrayBuffer;
            const pairL = shapes.length / 2;
            const ui16View = new Uint16Array(pairBuf, 0, pairL * 3);
            for (let i = 0; i < pairL; i++) {
                const flags = ui16View[0];
                if (flags & 3) continue;
                const shape0 = shapes[2 * i];
                const shape1 = shapes[2 * i + 1];
                if (!shape0 || !shape1) continue;
                const shapeA = getWrapShape<PhysXShape>(shape0);
                const shapeB = getWrapShape<PhysXShape>(shape1);
                const events = ui16View[1];
                const contactCount = ui16View[2];
                const contactBuffer = _header.contactBuffer as ArrayBuffer;
                if (events & 4) {
                    onCollision('onCollisionEnter', shapeA, shapeB, contactCount, contactBuffer, 0);
                } else if (events & 8) {
                    onCollision('onCollisionStay', shapeA, shapeB, contactCount, contactBuffer, 0);
                } else if (events & 16) {
                    onCollision('onCollisionExit', shapeA, shapeB, contactCount, contactBuffer, 0);
                }
            }
        });
        simulation.setOnTrigger((pairs: any, pairsBuf: ArrayBuffer) => {
            const length = pairs.length / 4;
            const ui16View = new Uint16Array(pairsBuf);
            for (let i = 0; i < length; i++) {
                const flags = ui16View[i];
                if (flags & 3) continue;
                const events = ui16View[i + 1];
                const ca = pairs[i * 4 + 1];
                const cb = pairs[i * 4 + 3];
                const shapeA = getWrapShape<PhysXShape>(ca);
                const shapeB = getWrapShape<PhysXShape>(cb);
                if (events & 4) {
                    onTrigger('onTriggerEnter', shapeA, shapeB);
                } else if (events & 16) {
                    onTrigger('onTriggerExit', shapeA, shapeB);
                }
            }
        });
        world.simulationCB = simulation;
        world.queryFilterCB = new PX.QueryFilterCallback();
        world.queryFilterCB.setPreFilter(queryCallback.preFilter);
        world.queryfilterData = { data: { word0: 0, word1: 0, word2: 0, word3: 1 }, flags: 0 };
        sceneDesc.setSimulationEventCallback(simulation);
        const scene = physics.createScene(sceneDesc);
        world.physics = physics;
        world.cooking = cooking;
        world.scene = scene;
    } else {
        world.singleResult = new PX.PxRaycastHit();
        world.mutipleResults = new PX.PxRaycastHitVector();
        world.mutipleResults.resize(world.mutipleResultSize, world.singleResult);
        world.queryfilterData = new PX.PxQueryFilterData();
        world.simulationCB = PX.PxSimulationEventCallback.implement(eventCallback);
        world.queryFilterCB = PX.PxQueryFilterCallback.implement(queryCallback);
        const version = PX.PX_PHYSICS_VERSION;
        const defaultErrorCallback = new PX.PxDefaultErrorCallback();
        const allocator = new PX.PxDefaultAllocator();
        const foundation = PX.PxCreateFoundation(version, allocator, defaultErrorCallback);
        const scale = new PX.PxTolerancesScale();
        world.cooking = PX.PxCreateCooking(version, foundation, new PX.PxCookingParams(scale));
        world.physics = PX.PxCreatePhysics(version, foundation, scale, false, null);
        PX.PxInitExtensions(world.physics, null);
        const sceneDesc = PX.getDefaultSceneDesc(world.physics.getTolerancesScale(), 0, world.simulationCB);
        world.scene = world.physics.createScene(sceneDesc);
        PX.physics = world.physics;
    }
}
