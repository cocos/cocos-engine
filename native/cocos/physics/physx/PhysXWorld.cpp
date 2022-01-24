/****************************************************************************
 Copyright (c) 2020-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#include "physics/physx/PhysXWorld.h"
#include "physics/physx/PhysXFilterShader.h"
#include "physics/physx/PhysXInc.h"
#include "physics/physx/joints/PhysXJoint.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/spec/IWorld.h"

namespace cc {
namespace physics {

PhysXWorld *PhysXWorld::instance = nullptr;
PhysXWorld &PhysXWorld::getInstance() {
    return *instance;
}

physx::PxFoundation &PhysXWorld::getFundation() {
    return *getInstance()._mFoundation;
}

physx::PxCooking &PhysXWorld::getCooking() {
    return *getInstance()._mCooking;
}

physx::PxPhysics &PhysXWorld::getPhysics() {
    return *getInstance()._mPhysics;
}

PhysXWorld::PhysXWorld() {
    instance = this;
    static physx::PxDefaultAllocator     gAllocator;
    static physx::PxDefaultErrorCallback gErrorCallback;
    _mFoundation = PxCreateFoundation(PX_PHYSICS_VERSION, gAllocator, gErrorCallback);
    physx::PxTolerancesScale scale{};
    _mCooking = PxCreateCooking(PX_PHYSICS_VERSION, *_mFoundation, physx::PxCookingParams(scale));

    physx::PxPvd *pvd = nullptr;
#ifdef CC_DEBUG
    pvd = _mPvd                      = physx::PxCreatePvd(*_mFoundation);
    physx::PxPvdTransport *transport = physx::PxDefaultPvdSocketTransportCreate("127.0.0.1", 5425, 10);
    _mPvd->connect(*transport, physx::PxPvdInstrumentationFlag::eALL);
#endif
    _mPhysics = PxCreatePhysics(PX_PHYSICS_VERSION, *_mFoundation, scale, true, pvd);
    PxInitExtensions(*_mPhysics, pvd);
    _mDispatcher = physx::PxDefaultCpuDispatcherCreate(0);

    _mEventMgr = new PhysXEventManager();

    physx::PxSceneDesc sceneDesc(_mPhysics->getTolerancesScale());
    sceneDesc.gravity                 = physx::PxVec3(0.0F, -10.0F, 0.0F);
    sceneDesc.cpuDispatcher           = _mDispatcher;
    sceneDesc.kineKineFilteringMode   = physx::PxPairFilteringMode::eKEEP;
    sceneDesc.staticKineFilteringMode = physx::PxPairFilteringMode::eKEEP;
    sceneDesc.flags |= physx::PxSceneFlag::eENABLE_CCD;
    sceneDesc.filterShader            = simpleFilterShader;
    sceneDesc.simulationEventCallback = &_mEventMgr->getEventCallback();
    _mScene                           = _mPhysics->createScene(sceneDesc);

    _mCollisionMatrix[0] = 1;

    createMaterial(0, 0.6F, 0.6F, 0.1F, 2, 2);
}

PhysXWorld::~PhysXWorld() {
    auto& materialMap = getPxMaterialMap();
    // clear material cache
    materialMap.clear();
    delete _mEventMgr;
    PhysXJoint::releaseTempRigidActor();
    PX_RELEASE(_mScene);
    PX_RELEASE(_mDispatcher);
    PX_RELEASE(_mPhysics);
#ifdef CC_DEBUG
    physx::PxPvdTransport *transport = _mPvd->getTransport();
    PX_RELEASE(_mPvd);
    PX_RELEASE(transport);
#endif
    // release cooking before foundation
    PX_RELEASE(_mCooking);
    PxCloseExtensions();
    PX_RELEASE(_mFoundation);
}

void PhysXWorld::step(float fixedTimeStep) {
    _mScene->simulate(fixedTimeStep);
    _mScene->fetchResults(true);
    syncPhysicsToScene();
}

void PhysXWorld::setGravity(float x, float y, float z) {
    _mScene->setGravity(physx::PxVec3(x, y, z));
}

void PhysXWorld::destroy() {
}

void PhysXWorld::setCollisionMatrix(uint32_t index, uint32_t mask) {
    if (index > 31) return;
    _mCollisionMatrix[index] = mask;
}

uintptr_t PhysXWorld::createConvex(ConvexDesc &desc) {
    physx::PxConvexMeshDesc convexDesc;
    convexDesc.points.count         = desc.positionLength;
    convexDesc.points.stride        = sizeof(physx::PxVec3);
    convexDesc.points.data          = static_cast<physx::PxVec3 *>(desc.positions);
    convexDesc.flags                = physx::PxConvexFlag::eCOMPUTE_CONVEX;
    physx::PxConvexMesh *convexMesh = getCooking().createConvexMesh(convexDesc, PxGetPhysics().getPhysicsInsertionCallback());
    return reinterpret_cast<uintptr_t>(convexMesh);
}

uintptr_t PhysXWorld::createTrimesh(TrimeshDesc &desc) {
    physx::PxTriangleMeshDesc meshDesc;
    meshDesc.points.count    = desc.positionLength;
    meshDesc.points.stride   = sizeof(physx::PxVec3);
    meshDesc.points.data     = static_cast<physx::PxVec3 *>(desc.positions);
    meshDesc.triangles.count = desc.triangleLength;
    if (desc.isU16) {
        meshDesc.triangles.stride = 3 * sizeof(physx::PxU16);
        meshDesc.triangles.data   = static_cast<physx::PxU16 *>(desc.triangles);
        meshDesc.flags            = physx::PxMeshFlag::e16_BIT_INDICES;
    } else {
        meshDesc.triangles.stride = 3 * sizeof(physx::PxU32);
        meshDesc.triangles.data   = static_cast<physx::PxU32 *>(desc.triangles);
    }
    physx::PxTriangleMesh *triangleMesh = getCooking().createTriangleMesh(meshDesc, PxGetPhysics().getPhysicsInsertionCallback());
    return reinterpret_cast<uintptr_t>(triangleMesh);
}

uintptr_t PhysXWorld::createHeightField(HeightFieldDesc &desc) {
    const auto         rows    = desc.rows;
    const auto         columns = desc.columns;
    const physx::PxU32 counts  = rows * columns;
    auto *             samples = new physx::PxHeightFieldSample[counts];
    for (physx::PxU32 r = 0; r < rows; r++) {
        for (physx::PxU32 c = 0; c < columns; c++) {
            const auto index      = c + r * columns;
            auto       v          = (static_cast<int16_t *>(desc.samples))[index];
            samples[index].height = v;
        }
    }
    physx::PxHeightFieldDesc hfDesc;
    hfDesc.nbRows            = rows;
    hfDesc.nbColumns         = columns;
    hfDesc.samples.data      = samples;
    hfDesc.samples.stride    = sizeof(physx::PxHeightFieldSample);
    physx::PxHeightField *hf = getCooking().createHeightField(hfDesc, PxGetPhysics().getPhysicsInsertionCallback());
    delete[] samples;
    return reinterpret_cast<uintptr_t>(hf);
}

uintptr_t PhysXWorld::createMaterial(uint16_t id, float f, float df, float r,
                                     uint8_t m0, uint8_t m1) {
    physx::PxMaterial *mat;
    auto &             m = getPxMaterialMap();
    if (m.find(id) == m.end()) {
        mat   = PxGetPhysics().createMaterial(f, df, r);
        // add reference count avoid auto releasing by physx
        mat->acquireReference();
        m[id] = reinterpret_cast<uintptr_t>(mat);
        mat->setFrictionCombineMode(physx::PxCombineMode::Enum(m0));
        mat->setRestitutionCombineMode(physx::PxCombineMode::Enum(m1));
    } else {
        mat = reinterpret_cast<physx::PxMaterial *>(m[id]);
        mat->setStaticFriction(f);
        mat->setDynamicFriction(df);
        mat->setRestitution(r);
        mat->setFrictionCombineMode(physx::PxCombineMode::Enum(m0));
        mat->setRestitutionCombineMode(physx::PxCombineMode::Enum(m1));
    }
    return uintptr_t(mat);
}

void PhysXWorld::emitEvents() {
    _mEventMgr->refreshPairs();
}

void PhysXWorld::syncSceneToPhysics() {
    for (auto const &sb : _mSharedBodies) {
        sb->syncSceneToPhysics();
    }
}

uint32_t PhysXWorld::getMaskByIndex(uint32_t i) {
    if (i > 31) i = 0;
    return _mCollisionMatrix[i];
}

void PhysXWorld::syncPhysicsToScene() {
    for (auto const &sb : _mSharedBodies) {
        sb->syncPhysicsToScene();
    }
}

void PhysXWorld::syncSceneWithCheck() {
    for (auto const &sb : _mSharedBodies) {
        sb->syncSceneWithCheck();
    }
}

void PhysXWorld::setAllowSleep(bool val) {
}

void PhysXWorld::addActor(const PhysXSharedBody &sb) {
    auto beg  = _mSharedBodies.begin();
    auto end  = _mSharedBodies.end();
    auto iter = find(beg, end, &sb);
    if (iter == end) {
        _mScene->addActor(*(const_cast<PhysXSharedBody &>(sb).getImpl().rigidActor));
        _mSharedBodies.push_back(&const_cast<PhysXSharedBody &>(sb));
    }
}

void PhysXWorld::removeActor(const PhysXSharedBody &sb) {
    auto beg  = _mSharedBodies.begin();
    auto end  = _mSharedBodies.end();
    auto iter = find(beg, end, &sb);
    if (iter != end) {
        _mScene->removeActor(*(const_cast<PhysXSharedBody &>(sb).getImpl().rigidActor), true);
        _mSharedBodies.erase(iter);
    }
}

bool PhysXWorld::raycast(RaycastOptions &opt) {
    physx::PxQueryCache *cache = nullptr;
    const auto           o     = opt.origin;
    const auto           ud    = opt.unitDir;
    physx::PxVec3        origin{o.x, o.y, o.z};
    physx::PxVec3        unitDir{ud.x, ud.y, ud.z};
    unitDir.normalize();
    physx::PxHitFlags             flags = physx::PxHitFlag::ePOSITION | physx::PxHitFlag::eNORMAL;
    physx::PxSceneQueryFilterData filterData;
    filterData.data.word0 = opt.mask;
    filterData.data.word3 = QUERY_FILTER | (opt.queryTrigger ? 0 : QUERY_CHECK_TRIGGER);
    filterData.flags      = physx::PxQueryFlag::eSTATIC | physx::PxQueryFlag::eDYNAMIC | physx::PxQueryFlag::ePREFILTER;
    auto &     hitBuffer  = getPxRaycastHitBuffer();
    bool       result     = false;
    const auto nbTouches  = physx::PxSceneQueryExt::raycastMultiple(
        getScene(), origin, unitDir, opt.distance, flags, hitBuffer.data(),
        static_cast<physx::PxU32>(hitBuffer.size()), result, filterData, &getQueryFilterShader(), cache);
    if (nbTouches == 0 || nbTouches == -1) return false;
    auto &r = raycastResult();
    r.resize(nbTouches);
    for (physx::PxI32 i = 0; i < nbTouches; i++) {
        const auto &shapeIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(hitBuffer[i].shape));
        if (shapeIter == getPxShapeMap().end()) return false;
        r[i].shape    = shapeIter->second;
        r[i].distance = hitBuffer[i].distance;
        pxSetVec3Ext(r[i].hitNormal, hitBuffer[i].normal);
        pxSetVec3Ext(r[i].hitPoint, hitBuffer[i].position);
    }
    return true;
}

std::vector<RaycastResult> &PhysXWorld::raycastResult() {
    static std::vector<RaycastResult> hits;
    return hits;
}

bool PhysXWorld::raycastClosest(RaycastOptions &opt) {
    physx::PxRaycastHit  hit;
    physx::PxQueryCache *cache = nullptr;
    const auto           o     = opt.origin;
    const auto           ud    = opt.unitDir;
    physx::PxVec3        origin{o.x, o.y, o.z};
    physx::PxVec3        unitDir{ud.x, ud.y, ud.z};
    unitDir.normalize();
    physx::PxHitFlags             flags = physx::PxHitFlag::ePOSITION | physx::PxHitFlag::eNORMAL;
    physx::PxSceneQueryFilterData filterData;
    filterData.data.word0 = opt.mask;
    filterData.data.word3 = QUERY_FILTER | (opt.queryTrigger ? 0 : QUERY_CHECK_TRIGGER) | QUERY_SINGLE_HIT;
    filterData.flags      = physx::PxQueryFlag::eSTATIC | physx::PxQueryFlag::eDYNAMIC | physx::PxQueryFlag::ePREFILTER;
    const auto result     = physx::PxSceneQueryExt::raycastSingle(
        getScene(), origin, unitDir, opt.distance, flags,
        hit, filterData, &getQueryFilterShader(), cache);
    if (result) {
        auto &      r         = raycastClosestResult();
        const auto &shapeIter = getPxShapeMap().find(reinterpret_cast<uintptr_t>(hit.shape));
        if (shapeIter == getPxShapeMap().end()) return false;
        r.shape    = shapeIter->second;
        r.distance = hit.distance;
        pxSetVec3Ext(r.hitPoint, hit.position);
        pxSetVec3Ext(r.hitNormal, hit.normal);
    }
    return result;
}

RaycastResult &PhysXWorld::raycastClosestResult() {
    static RaycastResult hit;
    return hit;
}

} // namespace physics
} // namespace cc
