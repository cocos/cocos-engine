/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-lonely-if */
/* eslint-disable import/order */

import { PhysX } from './physx.asmjs';
import { BYTEDANCE, DEBUG, EDITOR, TEST } from 'internal:constants';
import { IQuatLike, IVec3Like, Quat, RecyclePool, Vec3, cclegacy, geometry, Settings, settings } from '../../core';
import { shrinkPositions } from '../utils/util';
import { IRaycastOptions } from '../spec/i-physics-world';
import { IPhysicsConfig, PhysicsRayResult, PhysicsSystem } from '../framework';
import { PhysXWorld } from './physx-world';
import { PhysXInstance } from './physx-instance';
import { PhysXShape } from './shapes/physx-shape';
import { PxHitFlag, PxPairFlag, PxQueryFlag, EFilterDataWord3 } from './physx-enum';
import { Node } from '../../scene-graph';
import { Director, director, game } from '../../game';

export const PX = {} as any;
const globalThis = cclegacy._global;
// Use bytedance native or js physics if nativePhysX is not null.
const USE_BYTEDANCE = BYTEDANCE && globalThis.nativePhysX;
const USE_EXTERNAL_PHYSX = !!globalThis.PHYSX;

// Init physx libs when engine init.
game.onPostInfrastructureInitDelegate.add(InitPhysXLibs);

export function InitPhysXLibs () {
    if (USE_BYTEDANCE) {
        if (!EDITOR && !TEST) console.info('[PHYSICS]:', `Use PhysX Libs in BYTEDANCE.`);
        Object.assign(PX, globalThis.nativePhysX);
        Object.assign(_pxtrans, new PX.Transform(_v3, _v4));
        _pxtrans.setPosition = PX.Transform.prototype.setPosition.bind(_pxtrans);
        _pxtrans.setQuaternion = PX.Transform.prototype.setQuaternion.bind(_pxtrans);
        initConfigAndCacheObject(PX);
    } else {
        if (!EDITOR && !TEST) console.info('[PHYSICS]:', 'Use PhysX js or wasm Libs.');
        return initPhysXWithJsModule();
    }
}

function initPhysXWithJsModule () {
    // If external PHYSX not given, then try to use internal PhysX libs.
    globalThis.PhysX = globalThis.PHYSX ? globalThis.PHYSX : PhysX;
    if (globalThis.PhysX != null) {
        return globalThis.PhysX().then((Instance: any) => {
            if (!EDITOR && !TEST) console.info('[PHYSICS]:', `${USE_EXTERNAL_PHYSX ? 'External' : 'Internal'} PhysX libs loaded.`);
            initAdaptWrapper(Instance);
            initConfigAndCacheObject(Instance);
            Object.assign(PX, Instance);
        }, (reason: any) => { console.error('[PHYSICS]:', `PhysX load failed: ${reason}`); });
    } else {
        if (!EDITOR) console.error('[PHYSICS]:', 'Not Found PhysX js or wasm Libs.');
    }
}

function initConfigAndCacheObject (PX: any) {
    globalThis.PhysX = PX;
    PX.EPSILON = 1e-3;
    PX.MULTI_THREAD = false;
    PX.SUB_THREAD_COUNT = 1;
    PX.CACHE_MAT = {};
    PX.IMPL_PTR = {};
    PX.MESH_CONVEX = {};
    PX.MESH_STATIC = {};
    PX.TERRAIN_STATIC = {};
}

function initAdaptWrapper (obj: any) {
    obj.VECTOR_MAT = new obj.PxMaterialVector();
    obj.MeshScale = obj.PxMeshScale;
    obj.ShapeFlag = obj.PxShapeFlag;
    obj.ActorFlag = obj.PxActorFlag;
    obj.ForceMode = obj.PxForceMode;
    obj.CombineMode = obj.PxCombineMode;
    obj.BoxGeometry = obj.PxBoxGeometry;
    obj.QueryHitType = obj.PxQueryHitType;
    obj.RigidBodyFlag = obj.PxRigidBodyFlag;
    obj.PlaneGeometry = obj.PxPlaneGeometry;
    obj.SphereGeometry = obj.PxSphereGeometry;
    obj.CapsuleGeometry = obj.PxCapsuleGeometry;
    obj.ConvexMeshGeometry = obj.PxConvexMeshGeometry;
    obj.TriangleMeshGeometry = obj.PxTriangleMeshGeometry;
    obj.RigidDynamicLockFlag = obj.PxRigidDynamicLockFlag;
    obj.createRevoluteJoint = (a: any, b: any, c: any, d: any): any => obj.PxRevoluteJointCreate(PX.physics, a, b, c, d);
    obj.createFixedConstraint = (a: any, b: any, c: any, d: any): any => obj.PxFixedJointCreate(PX.physics, a, b, c, d);
    obj.createSphericalJoint = (a: any, b: any, c: any, d: any): any => obj.PxSphericalJointCreate(PX.physics, a, b, c, d);
}

const _v3: IVec3Like = { x: 0, y: 0, z: 0 };
const _v4: IQuatLike = { x: 0, y: 0, z: 0, w: 1 };
export const _trans = {
    translation: _v3,
    rotation: _v4,
    p: _v3,
    q: _v4,
};

type IPxTransformExt = { [x in keyof typeof _trans]: typeof _trans[x]; } &
{
    setPosition(pos: IVec3Like): void;
    setQuaternion(quat: IQuatLike): void;
};

export const _pxtrans = _trans as unknown as IPxTransformExt;

export function addReference (shape: PhysXShape, impl: any) {
    if (!impl) return;
    if (USE_BYTEDANCE) {
        PX.IMPL_PTR[shape.id] = shape;
        impl.setUserData(shape.id);
    } else {
        if (impl.$$) { PX.IMPL_PTR[impl.$$.ptr] = shape; }
    }
}

export function removeReference (shape: PhysXShape, impl: any) {
    if (!impl) return;
    if (USE_BYTEDANCE) {
        PX.IMPL_PTR[shape.id] = null;
        delete PX.IMPL_PTR[shape.id];
    } else {
        if (impl.$$) {
            PX.IMPL_PTR[impl.$$.ptr] = null;
            delete PX.IMPL_PTR[impl.$$.ptr];
        }
    }
}

export function getWrapShape<T> (pxShape: any): T {
    if (USE_BYTEDANCE) {
        return PX.IMPL_PTR[pxShape];
    } else {
        return PX.IMPL_PTR[pxShape.$$.ptr];
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

export function getJsTransform (pos: IVec3Like, quat: IQuatLike): any {
    Vec3.copy(_trans.p, pos);
    Quat.copy(_trans.q, quat);
    return _trans;
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
        node.setWorldPosition(transform.p);
        node.setWorldRotation(transform.q);
    } else {
        node.setWorldPosition(transform.translation);
        node.setWorldRotation(transform.rotation);
    }
}

export function physXEqualsCocosVec3 (trans: any, v3: IVec3Like): boolean {
    const pos = USE_BYTEDANCE ? trans.p : trans.translation;
    return Vec3.equals(pos, v3, PX.EPSILON);
}

export function physXEqualsCocosQuat (trans: any, q: IQuatLike): boolean {
    const rot = USE_BYTEDANCE ? trans.q : trans.rotation;
    return Quat.equals(rot, q, PX.EPSILON);
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

export function getShapeWorldBounds (shape: any, actor: any, i = 1.01, out: geometry.AABB) {
    if (USE_BYTEDANCE) {
        const b3 = PX.RigidActorExt.getWorldBounds(shape, actor, i);
        geometry.AABB.fromPoints(out, b3.minimum, b3.maximum);
    } else {
        const b3 = shape.getWorldBounds(actor, i);
        geometry.AABB.fromPoints(out, b3.minimum, b3.maximum);
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
        // meshDesc.setPointsCount(vertices.length / 3);
        // meshDesc.setPointsStride(Float32Array.BYTES_PER_ELEMENT * 3);
        const indicesUI32 = new Uint32Array(indices);
        meshDesc.setTrianglesData(indicesUI32);
        // meshDesc.setTrianglesCount(indicesUI32.length / 3);
        // meshDesc.setTrianglesStride(Uint32Array.BYTES_PER_ELEMENT * 3);
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
    meshDesc.setTrianglesData(indices);

    const params = cooking.getParams();
    setupCommonCookingParam(params, skipMeshCleanUp, skipEdgeData);
    const midDesc = new PX.BVH33MidphaseDesc();

    if (cookingPerformance) midDesc.setMeshCookingHint(PX.MeshCookingHint.eCOOKING_PERFORMANCE);
    else midDesc.setMeshCookingHint(PX.MeshCookingHint.eSIM_PERFORMANCE);

    if (meshSizePerfTradeoff) midDesc.setMeshSizePerformanceTradeOff(0.0);
    else midDesc.setMeshSizePerformanceTradeOff(0.55);

    params.setMidphaseDesc(midDesc);
    cooking.setParams(params);
    console.info(`[PHYSICS]: cook bvh33 status:${cooking.validateTriangleMesh(meshDesc)}`);
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
    meshDesc.setTrianglesData(indices);
    const params = cooking.getParams();
    setupCommonCookingParam(params, skipMeshCleanUp, skipEdgeData);

    const midDesc = new PX.BVH34MidphaseDesc();
    midDesc.setNumPrimsLeaf(numTrisPerLeaf);
    params.setMidphaseDesc(midDesc);
    cooking.setParams(params);
    console.info(`[PHYSICS]: cook bvh34 status:${cooking.validateTriangleMesh(meshDesc)}`);
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

export function raycastAll (world: PhysXWorld, worldRay: geometry.Ray, options: IRaycastOptions,
    pool: RecyclePool<PhysicsRayResult>, results: PhysicsRayResult[]): boolean {
    const maxDistance = options.maxDistance;
    const flags = PxHitFlag.ePOSITION | PxHitFlag.eNORMAL;
    const word3 = EFilterDataWord3.QUERY_FILTER | (options.queryTrigger ? 0 : EFilterDataWord3.QUERY_CHECK_TRIGGER);
    const queryFlags = PxQueryFlag.eSTATIC | PxQueryFlag.eDYNAMIC | PxQueryFlag.ePREFILTER | PxQueryFlag.eNO_BLOCK;
    const queryfilterData = PhysXInstance.queryfilterData;
    const queryFilterCB = PhysXInstance.queryFilterCB;
    const mutipleResults = PhysXInstance.mutipleResults;
    const mutipleResultSize = PhysXInstance.mutipleResultSize;
    if (USE_BYTEDANCE) {
        queryfilterData.data.word3 = word3;
        queryfilterData.data.word0 = options.mask >>> 0;
        queryfilterData.flags = queryFlags;
        const r = PX.SceneQueryExt.raycastMultiple(world.scene, worldRay.o, worldRay.d, maxDistance, flags,
            mutipleResultSize, queryfilterData, queryFilterCB);

        if (r) {
            for (let i = 0; i < r.length; i++) {
                const block = r[i];
                const collider = getWrapShape<PhysXShape>(block.shapeData).collider;
                const result = pool.add();
                result._assign(block.position, block.distance, collider, block.normal);
                results.push(result);
            }
            return true;
        }
    } else {
        queryfilterData.setWords(options.mask >>> 0, 0);
        queryfilterData.setWords(word3, 3);
        queryfilterData.setFlags(queryFlags);
        const blocks = mutipleResults;
        const r = world.scene.raycastMultiple(worldRay.o, worldRay.d, maxDistance, flags,
            blocks, blocks.size(), queryfilterData, queryFilterCB, null);

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

export function raycastClosest (world: PhysXWorld, worldRay: geometry.Ray, options: IRaycastOptions, result: PhysicsRayResult): boolean {
    const maxDistance = options.maxDistance;
    const flags = PxHitFlag.ePOSITION | PxHitFlag.eNORMAL;
    const word3 = EFilterDataWord3.QUERY_FILTER | (options.queryTrigger ? 0 : EFilterDataWord3.QUERY_CHECK_TRIGGER)
        | EFilterDataWord3.QUERY_SINGLE_HIT;
    const queryFlags = PxQueryFlag.eSTATIC | PxQueryFlag.eDYNAMIC | PxQueryFlag.ePREFILTER;
    const queryfilterData = PhysXInstance.queryfilterData;
    const queryFilterCB = PhysXInstance.queryFilterCB;
    if (USE_BYTEDANCE) {
        queryfilterData.data.word3 = word3;
        queryfilterData.data.word0 = options.mask >>> 0;
        queryfilterData.flags = queryFlags;
        const block = PX.SceneQueryExt.raycastSingle(world.scene, worldRay.o, worldRay.d, maxDistance,
            flags, queryfilterData, queryFilterCB);
        if (block) {
            const collider = getWrapShape<PhysXShape>(block.shapeData).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
    } else {
        queryfilterData.setWords(options.mask >>> 0, 0);
        queryfilterData.setWords(word3, 3);
        queryfilterData.setFlags(queryFlags);
        const block = PhysXInstance.singleResult;
        const r = world.scene.raycastSingle(worldRay.o, worldRay.d, options.maxDistance, flags,
            block, queryfilterData, queryFilterCB, null);
        if (r) {
            const collider = getWrapShape<PhysXShape>(block.getShape()).collider;
            result._assign(block.position, block.distance, collider, block.normal);
            return true;
        }
    }
    return false;
}

export function initializeWorld (world: any) {
    if (USE_BYTEDANCE) {
        // construct PhysX instance object only once
        if (!PhysXInstance.physics) {
            // const physics = PX.createPhysics();
            PhysXInstance.physics = PX.physics; // Bytedance have internal physics instance
            PhysXInstance.cooking = PX.createCooking(new PX.CookingParams());
            PhysXInstance.queryFilterCB = new PX.QueryFilterCallback();
            PhysXInstance.queryFilterCB.setPreFilter(world.callback.queryCallback.preFilterForByteDance);
            PhysXInstance.queryfilterData = { data: { word0: 0, word1: 0, word2: 0, word3: 1 }, flags: 0 };
        }

        initConfigForByteDance();
        hackForMultiThread();
        const sceneDesc = PhysXInstance.physics.createSceneDesc();
        if (PX.MULTI_THREAD) {
            const mstc = sceneDesc.getMaxSubThreadCount();
            const count = PX.SUB_THREAD_COUNT > mstc ? mstc : PX.SUB_THREAD_COUNT;
            sceneDesc.setSubThreadCount(count);
            console.info('[PHYSICS][PhysX]:', `use muti-thread mode, sub thread count: ${count}, max count: ${mstc}`);
        } else {
            console.info('[PHYSICS][PhysX]:', 'use single-thread mode');
        }
        sceneDesc.setFlag(PX.SceneFlag.eENABLE_PCM, true);
        sceneDesc.setFlag(PX.SceneFlag.eENABLE_CCD, true);
        const scene = PhysXInstance.physics.createScene(sceneDesc);
        scene.setNeedOnContact(true);
        scene.setNeedOnTrigger(true);
        world.scene = scene;
    } else {
        // construct PhysX instance object only once
        if (!PhysXInstance.foundation) {
            const version = PX.PX_PHYSICS_VERSION;
            const allocator = new PX.PxDefaultAllocator();
            const defaultErrorCallback = new PX.PxDefaultErrorCallback();
            const foundation = PhysXInstance.foundation = PX.PxCreateFoundation(version, allocator, defaultErrorCallback);
            if (DEBUG) {
                PhysXInstance.pvd = PX.PxCreatePvd(foundation);
            } else {
                PhysXInstance.pvd = null;
            }
            const scale = new PX.PxTolerancesScale();
            PhysXInstance.physics = PX.physics = PX.PxCreatePhysics(version, foundation, scale, false, PhysXInstance.pvd);
            PhysXInstance.cooking = PX.PxCreateCooking(version, foundation, new PX.PxCookingParams(scale));
            PX.PxInitExtensions(PhysXInstance.physics, PhysXInstance.pvd);
            PhysXInstance.singleResult = new PX.PxRaycastHit();
            PhysXInstance.mutipleResults = new PX.PxRaycastHitVector();
            PhysXInstance.mutipleResults.resize(PhysXInstance.mutipleResultSize, PhysXInstance.singleResult);
            PhysXInstance.queryfilterData = new PX.PxQueryFilterData();
            PhysXInstance.simulationCB = PX.PxSimulationEventCallback.implement(world.callback.eventCallback);
            PhysXInstance.queryFilterCB = PX.PxQueryFilterCallback.implement(world.callback.queryCallback);
        }

        const sceneDesc = PX.getDefaultSceneDesc(PhysXInstance.physics.getTolerancesScale(), 0, PhysXInstance.simulationCB);
        world.scene = PhysXInstance.physics.createScene(sceneDesc);
    }
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
export function getContactPosition (pxContactOrOffset: any, out: IVec3Like, buf: any) {
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, pxContactOrOffset, 3));
    } else {
        Vec3.copy(out, pxContactOrOffset.position);
    }
}

export function getContactNormal (pxContactOrOffset: any, out: IVec3Like, buf: any) {
    if (USE_BYTEDANCE) {
        Vec3.fromArray(out, new Float32Array(buf, (pxContactOrOffset as number) + 12, 3));
    } else {
        Vec3.copy(out, pxContactOrOffset.normal);
    }
}

export function getContactDataOrByteOffset (index: number, offset: number) {
    if (USE_BYTEDANCE) {
        return index * 40 + offset;
    } else {
        const gc = PX.getGContacts();
        const data = gc.get(index + offset);
        gc.delete();
        return data;
    }
}

export function gatherEvents (world: PhysXWorld) {
    if (USE_BYTEDANCE) {
        // contact
        const contactBuf = world.scene.getContactData() as ArrayBuffer;
        if (contactBuf && contactBuf.byteLength > 0) {
            const uint32view = new Uint32Array(contactBuf);
            const pairCount = uint32view[0];
            /**
             * struct ContactPair{
             *      u32 shapeUserData0;
             *      u32 shapeUserData1;
             *      u32 events;
             *      u32 contactCount;
             * };
             * Total byte length = 16
             */
            const contactPointBufferBegin = pairCount * 16 + 4;
            let contactPointByteOffset = contactPointBufferBegin;
            for (let i = 0; i < pairCount; i++) {
                const offset = i * 4 + 1;
                const shape0 = PX.IMPL_PTR[uint32view[offset]] as PhysXShape;
                const shape1 = PX.IMPL_PTR[uint32view[offset + 1]] as PhysXShape;
                const events = uint32view[offset + 2];
                const contactCount = uint32view[offset + 3];
                if (events & PxPairFlag.eNOTIFY_TOUCH_PERSISTS) {
                    world.callback.onCollision('onCollisionStay', shape0, shape1, contactCount, contactBuf, contactPointByteOffset);
                } else if (events & PxPairFlag.eNOTIFY_TOUCH_FOUND) {
                    world.callback.onCollision('onCollisionEnter', shape0, shape1, contactCount, contactBuf, contactPointByteOffset);
                } else if (events & PxPairFlag.eNOTIFY_TOUCH_LOST) {
                    world.callback.onCollision('onCollisionExit', shape0, shape1, contactCount, contactBuf, contactPointByteOffset);
                }
                /**
                 * struct ContactPairPoint{
                 *      PxVec3 position;
                 *      PxVec3 normal;
                 *      PxVec3 impulse;
                 *      float separation;
                 * };
                 * Total byte length = 40
                 */
                contactPointByteOffset += 40 * contactCount;
            }
        }

        // trigger
        const triggerBuf = world.scene.getTriggerData() as ArrayBuffer;
        if (triggerBuf && triggerBuf.byteLength > 0) {
            /**
             * struct TriggerPair {
             *      u32 shapeUserData0;
             *      u32 shapeUserData1;
             *      u32 status;
             * };
             * Total byte length = 12
             */
            const uint32view = new Uint32Array(triggerBuf);
            const pairCount = uint32view.length / 3;
            for (let i = 0; i < pairCount; i++) {
                const begin = i * 3;
                const shape0 = PX.IMPL_PTR[uint32view[begin]] as PhysXShape;
                const shape1 = PX.IMPL_PTR[uint32view[begin + 1]] as PhysXShape;
                const events = uint32view[begin + 2];
                if (events & PxPairFlag.eNOTIFY_TOUCH_FOUND) {
                    world.callback.onTrigger('onTriggerEnter', shape0, shape1, true);
                } else if (events & PxPairFlag.eNOTIFY_TOUCH_LOST) {
                    world.callback.onTrigger('onTriggerExit', shape0, shape1, false);
                }
            }
        }
    }
}

export function syncNoneStaticToSceneIfWaking (actor: any, node: Node) {
    if (USE_BYTEDANCE) {
        const transform = actor.getGlobalPoseIfWaking();
        if (!transform) return;
        copyPhysXTransform(node, transform);
    } else {
        if (actor.isSleeping()) return;
        copyPhysXTransform(node, actor.getGlobalPose());
    }
}

/**
 * Extension config for bytedance
 */
interface IPhysicsConfigEXT extends IPhysicsConfig {
    physX: { epsilon: number, multiThread: boolean, subThreadCount: number, }
}

function initConfigForByteDance () {
    const physX = settings.querySettings(Settings.Category.PHYSICS, 'physX');
    if (physX) {
        const { epsilon, multiThread, subThreadCount } = physX;
        PX.EPSILON = epsilon;
        PX.MULTI_THREAD = multiThread;
        PX.SUB_THREAD_COUNT = subThreadCount;
    }
}

// hack for multi thread mode, should be refactor in future
function hackForMultiThread () {
    if (USE_BYTEDANCE && PX.MULTI_THREAD) {
        PhysicsSystem.prototype.postUpdate = function postUpdate (deltaTime: number) {
            const sys = this as any;
            if (!sys._enable) {
                sys.physicsWorld.syncSceneToPhysics();
                return;
            }
            if (sys._autoSimulation) {
                director.emit(Director.EVENT_BEFORE_PHYSICS);
                sys._accumulator += deltaTime;
                sys._subStepCount = 1;
                sys.physicsWorld.syncSceneToPhysics();
                sys.physicsWorld.step(sys._fixedTimeStep);
                sys._accumulator -= sys._fixedTimeStep;
                sys._mutiThreadYield = performance.now();
            }
        };

        // eslint-disable-next-line no-inner-declarations
        function lastUpdate (sys: any) {
            if (!sys._enable) return;

            if (sys._autoSimulation) {
                const yieldTime = performance.now() - sys._mutiThreadYield;
                sys.physicsWorld.syncPhysicsToScene();
                sys.physicsWorld.emitEvents();
                if (cclegacy.profiler && cclegacy.profiler._stats) {
                    cclegacy.profiler._stats.physics.counter._time += yieldTime;
                }
                director.emit(Director.EVENT_AFTER_PHYSICS);
            }
        }

        director.on(Director.EVENT_END_FRAME, () => {
            if (!director.isPaused()) {
                lastUpdate(PhysicsSystem.instance);
            }
        });
    }
}
