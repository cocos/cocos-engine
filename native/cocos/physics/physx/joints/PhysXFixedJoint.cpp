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

#include "physics/physx/joints/PhysXFixedJoint.h"
#include "math/Quaternion.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"

namespace cc {
namespace physics {

void PhysXFixedJoint::onComponentSet() {
    _transA = physx::PxTransform{physx::PxIdentity};
    _transB = physx::PxTransform{physx::PxIdentity};

    physx::PxRigidActor *actor0 = _mSharedBody->getImpl().rigidActor;
    physx::PxRigidActor *actor1 = nullptr;

    if (_mConnectedBody) {
        auto *actor1 = _mConnectedBody->getImpl().rigidActor;
    }

    _mJoint = PxFixedJointCreate(PxGetPhysics(), actor0, _transA, actor1, _transB);

    updatePose();
}

void PhysXFixedJoint::setBreakForce(float force) {
    _breakForce = force;
    _mJoint->setBreakForce(_breakForce, _breakTorque);
}

void PhysXFixedJoint::setBreakTorque(float torque) {
    _breakTorque = torque;
    _mJoint->setBreakForce(_breakForce, _breakTorque);
}

void PhysXFixedJoint::updateScale0() {
    updatePose();
}

void PhysXFixedJoint::updateScale1() {
    updatePose();
}

void PhysXFixedJoint::updatePose() {
    _transA = physx::PxTransform{};
    _transB = physx::PxTransform{};

    Vec3 pos; Quaternion rot;
    pos = _mSharedBody->getNode()->getWorldPosition();
    rot = _mSharedBody->getNode()->getWorldRotation();
    pxSetVec3Ext(_transA.p, pos);
    pxSetQuatExt(_transA.q, rot);

    physx::PxRigidActor *actor0 = _mSharedBody->getImpl().rigidActor;
    physx::PxRigidActor *actor1 = nullptr;

    if (_mConnectedBody) {
        auto *actor1 = _mConnectedBody->getImpl().rigidActor;
        pos = _mConnectedBody->getNode()->getWorldPosition();
        rot = _mConnectedBody->getNode()->getWorldRotation();
        pxSetVec3Ext(_transB.p, pos);
        pxSetQuatExt(_transB.q, rot);
    }
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR0, _transA.getInverse());
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR1, _transB.getInverse());
}

} // namespace physics
} // namespace cc
