/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

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

#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/shapes/PhysXShape.h"
#include "physics/physx/joints/PhysXJoint.h"
#include <cmath>

using physx::PxVec3;
using physx::PxQuat;
using physx::PxIdentity;
using physx::PxPhysics;
using physx::PxFilterData;
using physx::PxJointActorIndex;
using physx::PxTransform;
using physx::PxForceMode;
using physx::PxRigidBodyFlag;
using physx::PxRigidActor;
using physx::PxRigidBodyExt;

namespace cc {
namespace physics {
std::map<uint, PhysXSharedBody *> PhysXSharedBody::sharedBodesMap = std::map<uint, PhysXSharedBody *>();

static int idCounter = 0;
PhysXSharedBody::PhysXSharedBody(
    const uint &          handle,
    PhysXWorld *const     world,
    PhysXRigidBody *const body) : _mID(idCounter++),
                                  _mRef(0),
                                  _mType(ERigidBodyType::STATIC),
                                  _mIsStatic(true),
                                  _mIndex(-1),
                                  _mFilterData(1, 1, 0, 0),
                                  _mNodeHandle(handle),
                                  _mStaticActor(nullptr),
                                  _mDynamicActor(nullptr),
                                  _mWrappedWorld(world),
                                  _mWrappedBody(body) {
    _mImpl.ptr = 0;
    _mNode     = cc::pipeline::SharedMemory::getBuffer<cc::pipeline::Node>(_mNodeHandle);
};

PhysXSharedBody *PhysXSharedBody::getSharedBody(const uint handle, PhysXWorld *const world, PhysXRigidBody *const body) {
    auto             iter = sharedBodesMap.find(handle);
    PhysXSharedBody *newSB;
    if (iter != sharedBodesMap.end()) {
        newSB = iter->second;
    } else {
        newSB                     = new PhysXSharedBody(handle, world, body);
        newSB->_mFilterData.word0 = 1;
        newSB->_mFilterData.word1 = world->getMaskByIndex(0);
        sharedBodesMap.insert(std::pair<uint, PhysXSharedBody *>(handle, newSB));
    }
    if (body != nullptr) {
        auto g                    = body->getInitialGroup();
        newSB->_mFilterData.word0 = g;
        newSB->_mFilterData.word1 = world->getMaskByIndex(static_cast<uint32_t>(log2(g)));
    }
    return newSB;
}

PhysXSharedBody::~PhysXSharedBody() {
    if (_mStaticActor != nullptr) PX_RELEASE(_mStaticActor);
    if (_mDynamicActor != nullptr) PX_RELEASE(_mDynamicActor);
}

PhysXSharedBody::UActor PhysXSharedBody::getImpl() {
    initActor();
    _mImpl.ptr = isStatic() ? reinterpret_cast<uintptr_t>(_mStaticActor) : reinterpret_cast<uintptr_t>(_mDynamicActor);
    return _mImpl;
}

void PhysXSharedBody::setType(ERigidBodyType v) {
    if (_mType == v) return;
    _mType = v;
    initActor();
    _mImpl.ptr = isStatic() ? reinterpret_cast<uintptr_t>(_mStaticActor) : reinterpret_cast<uintptr_t>(_mDynamicActor);
}

void PhysXSharedBody::reference(bool v) {
    v ? _mRef++ : _mRef--;
    if (_mRef == 0) delete this;
}

void PhysXSharedBody::enabled(bool v) {
    if (v) {
        if (_mIndex < 0) {
            _mIndex = 1;
            _mWrappedWorld->addActor(*this);
        }
    } else {
        auto *wb       = _mWrappedBody;
        auto  ws       = _mWrappedShapes;
        auto  isRemove = ws.empty() && (wb == nullptr || (wb != nullptr && !wb->isEnabled()));
        if (isRemove) {
            _mIndex = -1;
            if (!isStaticOrKinematic()) {
                clearVelocity();
            }
            _mWrappedWorld->removeActor(*this);
        }
    }
}

void PhysXSharedBody::initActor() {
    const bool temp = _mIsStatic;
    if (isStatic()) {
        _mIsStatic = true;
        initStaticActor();
    } else {
        _mIsStatic = false;
        initDynamicActor();
    }
    if (temp != _mIsStatic) switchActor(temp);
}

void PhysXSharedBody::switchActor(const bool isStaticBefore) {
    if (_mStaticActor == nullptr || _mDynamicActor == nullptr) return;
    PxRigidActor &a0 = isStaticBefore ? *reinterpret_cast<PxRigidActor *>(_mStaticActor) : *reinterpret_cast<PxRigidActor *>(_mDynamicActor);
    PxRigidActor &a1 = !isStaticBefore ? *reinterpret_cast<PxRigidActor *>(_mStaticActor) : *reinterpret_cast<PxRigidActor *>(_mDynamicActor);
    if (_mIndex >= 0) {
        _mWrappedWorld->getScene().removeActor(a0, false);
        _mWrappedWorld->getScene().addActor(a1);
    }
    for (auto const &ws : _mWrappedShapes) {
        a0.detachShape(ws->getShape(), false);
        a1.attachShape(ws->getShape());
    }
    if (isStaticBefore) {
        if (isDynamic()) _mDynamicActor->wakeUp();
        _mDynamicActor->setRigidBodyFlag(PxRigidBodyFlag::eKINEMATIC, isKinematic());
        PxRigidBodyExt::setMassAndUpdateInertia(*_mDynamicActor, _mMass);
        PxTransform com{PxIdentity};
        for (auto const &ws : _mWrappedShapes) {
            if (!ws->isTrigger()) com.p -= ws->getCenter();
        }
        _mDynamicActor->setCMassLocalPose(com);
    }
}

void PhysXSharedBody::initStaticActor() {
    if (_mStaticActor == nullptr) {
        PxTransform transform{PxIdentity};
        pxSetVec3Ext(transform.p, getNode().worldPosition);
        pxSetQuatExt(transform.q, getNode().worldRotation);
        if (!transform.p.isFinite()) transform.p = PxVec3{PxIdentity};
        if (!transform.q.isUnit()) transform.q = PxQuat{PxIdentity};
        PxPhysics &phy = PxGetPhysics();
        _mStaticActor  = phy.createRigidStatic(transform);
    }
}

void PhysXSharedBody::initDynamicActor() {
    if (_mDynamicActor == nullptr) {
        PxTransform transform{PxIdentity};
        pxSetVec3Ext(transform.p, getNode().worldPosition);
        pxSetQuatExt(transform.q, getNode().worldRotation);
        if (!transform.p.isFinite()) transform.p = PxVec3{PxIdentity};
        if (!transform.q.isUnit()) transform.q = PxQuat{PxIdentity};
        PxPhysics &phy = PxGetPhysics();
        _mDynamicActor = phy.createRigidDynamic(transform);
        _mDynamicActor->setRigidBodyFlag(PxRigidBodyFlag::eKINEMATIC, isKinematic());
    }
}

void PhysXSharedBody::updateCenterOfMass() {
    initActor();
    if (isStatic()) return;
    PxTransform com{PxIdentity};
    for (auto const &ws : _mWrappedShapes) {
        if (!ws->isTrigger()) com.p -= ws->getCenter();
    }
    _mDynamicActor->setCMassLocalPose(com);
}

void PhysXSharedBody::syncScale() {
    for (auto const &sb : _mWrappedShapes) {
        sb->updateScale();
    }

    for (auto const &sb : _mWrappedJoints0) {
        sb->updateScale0();
    }

    for (auto const &sb : _mWrappedJoints1) {
        sb->updateScale1();
    }
}

void PhysXSharedBody::syncSceneToPhysics() {
    if (getNode().flagsChanged) {
        if (getNode().flagsChanged & static_cast<uint32_t>(TransformBit::SCALE)) syncScale();
        auto wp = getImpl().rigidActor->getGlobalPose();
        if (getNode().flagsChanged & static_cast<uint32_t>(TransformBit::POSITION)) {
            pxSetVec3Ext(wp.p, getNode().worldPosition);
        }
        if (getNode().flagsChanged & static_cast<uint32_t>(TransformBit::ROTATION)) {
            pxSetQuatExt(wp.q, getNode().worldRotation);
        }

        if (isKinematic()) {
            getImpl().rigidDynamic->setKinematicTarget(wp);
        } else {
            getImpl().rigidActor->setGlobalPose(wp, true);
        }
    }
}

void PhysXSharedBody::syncSceneWithCheck() {
    if (getNode().flagsChanged & static_cast<uint32_t>(TransformBit::SCALE)) syncScale();
    auto wp         = getImpl().rigidActor->getGlobalPose();
    bool needUpdate = false;
    if (wp.p != getNode().worldPosition) {
        pxSetVec3Ext(wp.p, getNode().worldPosition);
        needUpdate = true;
    }
    if (wp.q != getNode().worldRotation) {
        pxSetQuatExt(wp.q, getNode().worldRotation);
        needUpdate = true;
    }
    if (needUpdate) {
        getImpl().rigidActor->setGlobalPose(wp, true);
    }
}

void PhysXSharedBody::syncPhysicsToScene() {
    if (isStaticOrKinematic()) return;
    if (_mDynamicActor->isSleeping()) return;
    const PxTransform &wp = getImpl().rigidActor->getGlobalPose();
    pxSetVec3Ext(getNode().worldPosition, wp.p);
    pxSetQuatExt(getNode().worldRotation, wp.q);
    getNode().flagsChanged |= static_cast<uint32_t>(TransformBit::POSITION) | static_cast<uint32_t>(TransformBit::ROTATION);
}

void PhysXSharedBody::addShape(PhysXShape &shape) {
    auto beg  = _mWrappedShapes.begin();
    auto end  = _mWrappedShapes.end();
    auto iter = find(beg, end, &shape);
    if (iter == end) {
        shape.getShape().setSimulationFilterData(_mFilterData);
        shape.getShape().setQueryFilterData(_mFilterData);
        getImpl().rigidActor->attachShape(shape.getShape());
        _mWrappedShapes.push_back(&shape);
        if (!shape.isTrigger()) {
            if (!shape.getCenter().isZero()) updateCenterOfMass();
            if (isDynamic()) PxRigidBodyExt::setMassAndUpdateInertia(*getImpl().rigidDynamic, _mMass);
        }
    }
}

void PhysXSharedBody::removeShape(PhysXShape &shape) {
    auto beg  = _mWrappedShapes.begin();
    auto end  = _mWrappedShapes.end();
    auto iter = find(beg, end, &shape);
    if (iter != end) {
        _mWrappedShapes.erase(iter);
        getImpl().rigidActor->detachShape(shape.getShape(), true);
        if (!shape.isTrigger()) {
            if (!shape.getCenter().isZero()) updateCenterOfMass();
            if (isDynamic()) PxRigidBodyExt::setMassAndUpdateInertia(*getImpl().rigidDynamic, _mMass);
        }
    }
}

void PhysXSharedBody::addJoint(PhysXJoint &joint, const PxJointActorIndex::Enum index) {
    if (index == PxJointActorIndex::eACTOR1) {
        auto beg  = _mWrappedJoints1.begin();
        auto end  = _mWrappedJoints1.end();
        auto iter = find(beg, end, &joint);
        if (iter == end) _mWrappedJoints1.push_back(&joint);
    } else {
        auto beg  = _mWrappedJoints0.begin();
        auto end  = _mWrappedJoints0.end();
        auto iter = find(beg, end, &joint);
        if (iter == end) _mWrappedJoints0.push_back(&joint);
    }
}

void PhysXSharedBody::removeJoint(PhysXJoint &joint, const PxJointActorIndex::Enum index) {
    if (index == PxJointActorIndex::eACTOR1) {
        auto beg  = _mWrappedJoints1.begin();
        auto end  = _mWrappedJoints1.end();
        auto iter = find(beg, end, &joint);
        if (iter != end) _mWrappedJoints1.erase(iter);
    } else {
        auto beg  = _mWrappedJoints0.begin();
        auto end  = _mWrappedJoints0.end();
        auto iter = find(beg, end, &joint);
        if (iter != end) _mWrappedJoints0.erase(iter);
    }
}

void PhysXSharedBody::setMass(float v) {
    if (v <= 0) v = 1e-7F;
    _mMass = v;
    if (isDynamic()) PxRigidBodyExt::setMassAndUpdateInertia(*getImpl().rigidDynamic, _mMass);
}

void PhysXSharedBody::setGroup(uint32_t v) {
    _mFilterData.word0 = v;
    setCollisionFilter(_mFilterData);
}

void PhysXSharedBody::setMask(uint32_t v) {
    _mFilterData.word1 = v;
    setCollisionFilter(_mFilterData);
}

void PhysXSharedBody::setCollisionFilter(PxFilterData &data) {
    if (isDynamic()) _mDynamicActor->wakeUp();
    for (auto const &ws : _mWrappedShapes) {
        ws->getShape().setQueryFilterData(data);
        ws->getShape().setSimulationFilterData(data);
    }
}

void PhysXSharedBody::clearForces() {
    if (isStaticOrKinematic()) return;
    _mDynamicActor->clearForce(PxForceMode::eFORCE);
    _mDynamicActor->clearForce(PxForceMode::eIMPULSE);
    _mDynamicActor->clearTorque(PxForceMode::eFORCE);
    _mDynamicActor->clearTorque(PxForceMode::eIMPULSE);
}

void PhysXSharedBody::clearVelocity() {
    if (isStaticOrKinematic()) return;
    _mDynamicActor->setLinearVelocity(PxVec3{PxIdentity}, false);
    _mDynamicActor->setAngularVelocity(PxVec3{PxIdentity}, false);
}

} // namespace physics
} // namespace cc
