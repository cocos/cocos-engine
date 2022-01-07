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

#include "physics/physx/PhysXSharedBody.h"
#include <cmath>
#include "physics/physx/PhysXInc.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"
#include "physics/physx/joints/PhysXJoint.h"
#include "physics/physx/shapes/PhysXShape.h"

using physx::PxFilterData;
using physx::PxForceMode;
using physx::PxIdentity;
using physx::PxJointActorIndex;
using physx::PxPhysics;
using physx::PxQuat;
using physx::PxRigidActor;
using physx::PxRigidBodyExt;
using physx::PxRigidBodyFlag;
using physx::PxTransform;
using physx::PxVec3;

namespace cc {
namespace physics {
std::map<Node *, PhysXSharedBody *> PhysXSharedBody::sharedBodesMap = std::map<Node *, PhysXSharedBody *>();

static int idCounter = 0;
PhysXSharedBody::PhysXSharedBody(
    Node *                node,
    PhysXWorld *const     world,
    PhysXRigidBody *const body) : _mID(idCounter++),
                                  _mRef(0),
                                  _mType(ERigidBodyType::STATIC),
                                  _mIsStatic(true),
                                  _mIndex(-1),
                                  _mFilterData(1, 1, 0, 0),
                                  _mStaticActor(nullptr),
                                  _mDynamicActor(nullptr),
                                  _mWrappedWorld(world),
                                  _mWrappedBody(body) {
    _mImpl.ptr = 0;
    _mNode     = node;
};

PhysXSharedBody *PhysXSharedBody::getSharedBody(const Node *node, PhysXWorld *const world, PhysXRigidBody *const body) {
    auto             iter = sharedBodesMap.find(const_cast<Node *>(node));
    PhysXSharedBody *newSB;
    if (iter != sharedBodesMap.end()) {
        newSB = iter->second;
    } else {
        newSB                     = new PhysXSharedBody(const_cast<Node *>(node), world, body);
        newSB->_mFilterData.word0 = 1;
        newSB->_mFilterData.word1 = world->getMaskByIndex(0);
        sharedBodesMap.insert(std::pair<Node *, PhysXSharedBody *>(const_cast<Node *>(node), newSB));
    }
    if (body != nullptr) {
        auto g                    = body->getInitialGroup();
        newSB->_mFilterData.word0 = g;
        newSB->_mFilterData.word1 = world->getMaskByIndex(static_cast<uint32_t>(log2(g)));
    }
    return newSB;
}

PhysXSharedBody::~PhysXSharedBody() {
    sharedBodesMap.erase(_mNode);
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
    if (isStatic()) {
        _mImpl.ptr = reinterpret_cast<uintptr_t>(_mStaticActor);
    } else {
        _mImpl.ptr = reinterpret_cast<uintptr_t>(_mDynamicActor);
        _mImpl.rigidDynamic->setRigidBodyFlag(physx::PxRigidBodyFlag::eKINEMATIC, _mType == ERigidBodyType::KINEMATIC);
    }
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
        getNode()->updateWorldTransform();
        pxSetVec3Ext(transform.p, getNode()->getWorldPosition());
        pxSetQuatExt(transform.q, getNode()->getWorldRotation());
        if (!transform.p.isFinite()) transform.p = PxVec3{PxIdentity};
        if (!transform.q.isUnit()) transform.q = PxQuat{PxIdentity};
        PxPhysics &phy = PxGetPhysics();
        _mStaticActor  = phy.createRigidStatic(transform);
    }
}

void PhysXSharedBody::initDynamicActor() {
    if (_mDynamicActor == nullptr) {
        PxTransform transform{PxIdentity};
        getNode()->updateWorldTransform();
        pxSetVec3Ext(transform.p, getNode()->getWorldPosition());
        pxSetQuatExt(transform.q, getNode()->getWorldRotation());
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
    uint32_t getChangedFlags = getNode()->getChangedFlags();
    if (getChangedFlags) {
        if (getChangedFlags & static_cast<uint32_t>(TransformBit::SCALE)) syncScale();
        auto wp = getImpl().rigidActor->getGlobalPose();
        if (getChangedFlags & static_cast<uint32_t>(TransformBit::POSITION)) {
            getNode()->updateWorldTransform();
            pxSetVec3Ext(wp.p, getNode()->getWorldPosition());
        }
        if (getChangedFlags & static_cast<uint32_t>(TransformBit::ROTATION)) {
            getNode()->updateWorldTransform();
            pxSetQuatExt(wp.q, getNode()->getWorldRotation());
        }

        if (isKinematic()) {
            getImpl().rigidDynamic->setKinematicTarget(wp);
        } else {
            getImpl().rigidActor->setGlobalPose(wp, true);
        }
    }
}

void PhysXSharedBody::syncSceneWithCheck() {
    if (getNode()->getChangedFlags() & static_cast<uint32_t>(TransformBit::SCALE)) syncScale();
    auto wp         = getImpl().rigidActor->getGlobalPose();
    bool needUpdate = false;
    getNode()->updateWorldTransform();
    if (wp.p != getNode()->getWorldPosition()) {
        pxSetVec3Ext(wp.p, getNode()->getWorldPosition());
        needUpdate = true;
    }
    const auto nr = getNode()->getWorldRotation();
    if (wp.q.x != nr.x && wp.q.y != nr.y && wp.q.z != nr.z) {
        pxSetQuatExt(wp.q, getNode()->getWorldRotation());
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
    getNode()->setWorldPosition(wp.p.x, wp.p.y, wp.p.z);
    getNode()->setWorldRotation(wp.q.x, wp.q.y, wp.q.z, wp.q.w);
    getNode()->setChangedFlags(getNode()->getChangedFlags() | static_cast<uint32_t>(TransformBit::POSITION) | static_cast<uint32_t>(TransformBit::ROTATION));
}

void PhysXSharedBody::addShape(const PhysXShape &shape) {
    auto beg  = _mWrappedShapes.begin();
    auto end  = _mWrappedShapes.end();
    auto iter = find(beg, end, &shape);
    if (iter == end) {
        shape.getShape().setSimulationFilterData(_mFilterData);
        shape.getShape().setQueryFilterData(_mFilterData);
        getImpl().rigidActor->attachShape(shape.getShape());
        _mWrappedShapes.push_back(&const_cast<PhysXShape &>(shape));
        if (!shape.isTrigger()) {
            if (!const_cast<PhysXShape &>(shape).getCenter().isZero()) updateCenterOfMass();
            if (isDynamic()) PxRigidBodyExt::setMassAndUpdateInertia(*getImpl().rigidDynamic, _mMass);
        }
    }
}

void PhysXSharedBody::removeShape(const PhysXShape &shape) {
    auto beg  = _mWrappedShapes.begin();
    auto end  = _mWrappedShapes.end();
    auto iter = find(beg, end, &shape);
    if (iter != end) {
        _mWrappedShapes.erase(iter);
        getImpl().rigidActor->detachShape(shape.getShape(), true);
        if (!const_cast<PhysXShape &>(shape).isTrigger()) {
            if (!const_cast<PhysXShape &>(shape).getCenter().isZero()) updateCenterOfMass();
            if (isDynamic()) PxRigidBodyExt::setMassAndUpdateInertia(*getImpl().rigidDynamic, _mMass);
        }
    }
}

void PhysXSharedBody::addJoint(const PhysXJoint &joint, const PxJointActorIndex::Enum index) {
    if (index == PxJointActorIndex::eACTOR1) {
        auto beg  = _mWrappedJoints1.begin();
        auto end  = _mWrappedJoints1.end();
        auto iter = find(beg, end, &joint);
        if (iter == end) _mWrappedJoints1.push_back(&const_cast<PhysXJoint &>(joint));
    } else {
        auto beg  = _mWrappedJoints0.begin();
        auto end  = _mWrappedJoints0.end();
        auto iter = find(beg, end, &joint);
        if (iter == end) _mWrappedJoints0.push_back(&const_cast<PhysXJoint &>(joint));
    }
}

void PhysXSharedBody::removeJoint(const PhysXJoint &joint, const PxJointActorIndex::Enum index) {
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

void PhysXSharedBody::setCollisionFilter(const PxFilterData &data) {
    if (isDynamic()) _mDynamicActor->wakeUp();
    for (auto const &ws : _mWrappedShapes) {
        ws->getShape().setQueryFilterData(data);
        ws->getShape().setSimulationFilterData(data);
    }
}

void PhysXSharedBody::clearForces() {
    if (!isInWorld()) return;
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
