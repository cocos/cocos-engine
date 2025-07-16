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

#include "physics/physx/joints/PhysXSpherical.h"
#include "math/Quaternion.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"

namespace cc {
namespace physics {

void PhysXSpherical::onComponentSet() {
    _mJoint = PxSphericalJointCreate(PxGetPhysics(), &getTempRigidActor(), physx::PxTransform{physx::PxIdentity}, nullptr, physx::PxTransform{physx::PxIdentity});
    setEnableDebugVisualization(true);
}

void PhysXSpherical::setPivotA(float x, float y, float z) {
    _mPivotA = physx::PxVec3{x, y, z};
    updatePose();
}

void PhysXSpherical::setPivotB(float x, float y, float z) {
    _mPivotB = physx::PxVec3{x, y, z};
    updatePose();
}

void PhysXSpherical::updateScale0() {
    updatePose();
}

void PhysXSpherical::updateScale1() {
    updatePose();
}

void PhysXSpherical::updatePose() {
    physx::PxTransform pose0{physx::PxIdentity};
    physx::PxTransform pose1{physx::PxIdentity};
    auto *node0 = _mSharedBody->getNode();
    node0->updateWorldTransform();
    pose0.p = _mPivotA * node0->getWorldScale();
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR0, pose0);
    if (_mConnectedBody) {
        auto *node1 = _mConnectedBody->getNode();
        node1->updateWorldTransform();
        pose1.p = _mPivotB * node1->getWorldScale();
    } else {
        const auto &wr = node0->getWorldRotation();
        auto pos = Vec3(_mPivotA.x, _mPivotA.y, _mPivotA.z);
        pos.multiply(node0->getWorldScale());
        pos.transformQuat(node0->getWorldRotation());
        pos.add(node0->getWorldPosition());
        pose1.p = physx::PxVec3(pos.x, pos.y, pos.z);
        pose1.q = physx::PxQuat{wr.x, wr.y, wr.z, wr.w} * pose0.q;
    }
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR1, pose1);
}

} // namespace physics
} // namespace cc
