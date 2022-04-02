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

#include "physics/physx/joints/PhysXJoint.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"

namespace cc {
namespace physics {

physx::PxRigidActor *PhysXJoint::tempRigidActor = nullptr;

void PhysXJoint::initialize(Node *node) {
    auto &ins    = PhysXWorld::getInstance();
    _mSharedBody = ins.getSharedBody(node);
    _mSharedBody->reference(true);
    onComponentSet();
}

void PhysXJoint::onEnable() {
    _mSharedBody->addJoint(*this, physx::PxJointActorIndex::eACTOR0);
    if (_mConnectedBody) {
        _mConnectedBody->addJoint(*this, physx::PxJointActorIndex::eACTOR1);
        _mJoint->setActors(_mSharedBody->getImpl().rigidActor, _mConnectedBody->getImpl().rigidActor);
    } else {
        _mJoint->setActors(_mSharedBody->getImpl().rigidActor, nullptr);
    }
}

void PhysXJoint::onDisable() {
    _mJoint->setActors(&getTempRigidActor(), nullptr);
    _mSharedBody->removeJoint(*this, physx::PxJointActorIndex::eACTOR0);
    if (_mConnectedBody) _mConnectedBody->removeJoint(*this, physx::PxJointActorIndex::eACTOR1);
}

void PhysXJoint::onDestroy() {
    _mSharedBody->reference(false);
}

void PhysXJoint::setConnectedBody(uintptr_t v) {
    if (v) {
        auto &ins       = PhysXWorld::getInstance();
        _mConnectedBody = ins.getSharedBody(reinterpret_cast<Node *>(v));
    } else {
        _mConnectedBody = nullptr;
    }
    if (_mJoint) {
        _mJoint->setActors(_mSharedBody->getImpl().rigidActor, _mConnectedBody ? _mConnectedBody->getImpl().rigidActor : nullptr);
    }
}

void PhysXJoint::setEnableCollision(const bool v) {
    _mEnableCollision = v;
    if (_mJoint) {
        _mJoint->setConstraintFlag(physx::PxConstraintFlag::eCOLLISION_ENABLED, _mEnableCollision);
    }
}

physx::PxRigidActor &PhysXJoint::getTempRigidActor() {
    if (!PhysXJoint::tempRigidActor) {
        PhysXJoint::tempRigidActor = PxGetPhysics().createRigidDynamic(physx::PxTransform{physx::PxIdentity});
    }
    return *PhysXJoint::tempRigidActor;
};

void PhysXJoint::releaseTempRigidActor() {
    if (PhysXJoint::tempRigidActor) {
        PhysXJoint::tempRigidActor->release();
        PhysXJoint::tempRigidActor = nullptr;
    }
}

} // namespace physics
} // namespace cc
