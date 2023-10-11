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

#include "physics/physx/joints/PhysXFixedJoint.h"
#include "math/Quaternion.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"

namespace cc {
namespace physics {

void PhysXFixedJoint::onComponentSet() {
    _transA = physx::PxTransform(physx::PxIdentity);
    _transB = physx::PxTransform(physx::PxIdentity);

    physx::PxRigidActor *actor0 = _mSharedBody->getImpl().rigidActor;
    physx::PxRigidActor *actor1 = nullptr;

    if (_mConnectedBody) {
        actor1 = _mConnectedBody->getImpl().rigidActor;
    }

    _mJoint = PxFixedJointCreate(PxGetPhysics(), actor0, _transA, actor1, _transB);

    updatePose();
    setEnableDebugVisualization(true);
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
    _transA = physx::PxTransform(physx::PxIdentity);
    _transB = physx::PxTransform(physx::PxIdentity);

    pxSetVec3Ext(_transA.p, _mSharedBody->getNode()->getWorldPosition());
    pxSetQuatExt(_transA.q, _mSharedBody->getNode()->getWorldRotation());
    if (_mConnectedBody) {
        pxSetVec3Ext(_transB.p, _mConnectedBody->getNode()->getWorldPosition());
        pxSetQuatExt(_transB.q, _mConnectedBody->getNode()->getWorldRotation());
    }
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR0, _transA.getInverse());
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR1, _transB.getInverse());
}

} // namespace physics
} // namespace cc
