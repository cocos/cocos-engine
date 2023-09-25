/****************************************************************************
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#include "physics/physx/joints/PhysXJoint.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"

namespace cc {
namespace physics {

physx::PxRigidActor *PhysXJoint::tempRigidActor = nullptr;

PhysXJoint::PhysXJoint() {
    _mObjectID = PhysXWorld::getInstance().addWrapperObject(reinterpret_cast<uintptr_t>(this));
};

void PhysXJoint::initialize(Node *node) {
    auto &ins = PhysXWorld::getInstance();
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
    PhysXWorld::getInstance().removeWrapperObject(_mObjectID);
}

void PhysXJoint::setConnectedBody(uint32_t rigidBodyID) {
    PhysXRigidBody *pxRigidBody = reinterpret_cast<PhysXRigidBody *>(PhysXWorld::getInstance().getWrapperPtrWithObjectID(rigidBodyID));
    if (pxRigidBody == nullptr)
        return;


    auto *oldConnectedBody = _mConnectedBody;
    if (oldConnectedBody) {
        oldConnectedBody->removeJoint(*this, physx::PxJointActorIndex::eACTOR1);
    }

    uintptr_t nodePtr = reinterpret_cast<uintptr_t>(pxRigidBody->getSharedBody().getNode());
    if (nodePtr) {
        auto &ins = PhysXWorld::getInstance();
        _mConnectedBody = ins.getSharedBody(reinterpret_cast<Node *>(nodePtr));
        _mConnectedBody->addJoint(*this, physx::PxJointActorIndex::eACTOR1);
    } else {
        _mConnectedBody = nullptr;
    }
    if (_mJoint) {
        _mJoint->setActors(_mSharedBody->getImpl().rigidActor, _mConnectedBody ? _mConnectedBody->getImpl().rigidActor : nullptr);
    }

    if (oldConnectedBody) {
        if (oldConnectedBody->isDynamic()) {
            oldConnectedBody->getImpl().rigidDynamic->wakeUp();
        }
    }

    updateScale0();
    updateScale1();
}

void PhysXJoint::setEnableCollision(const bool v) {
    _mEnableCollision = v;
    if (_mJoint) {
        _mJoint->setConstraintFlag(physx::PxConstraintFlag::eCOLLISION_ENABLED, _mEnableCollision);
    }
}

void PhysXJoint::setEnableDebugVisualization(const bool v) {
    _mEnableDebugVisualization = v;
    if (_mJoint) {
        _mJoint->setConstraintFlag(physx::PxConstraintFlag::eVISUALIZATION, _mEnableDebugVisualization);
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
