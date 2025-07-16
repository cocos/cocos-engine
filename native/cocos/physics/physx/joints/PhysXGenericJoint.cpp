/****************************************************************************
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

#include "physics/physx/joints/PhysXGenericJoint.h"
#include <physics/sdk/Joint.h>
#include "math/Mat4.h"
#include "math/Quaternion.h"
#include "math/Utils.h"
#include "math/Vec3.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"

namespace cc {
namespace physics {

void PhysXGenericJoint::onComponentSet() {
    _mJoint = PxD6JointCreate(PxGetPhysics(), &getTempRigidActor(), physx::PxTransform{physx::PxIdentity}, nullptr, physx::PxTransform{physx::PxIdentity});
    setEnableDebugVisualization(true);
}

inline auto mapAxis(uint32_t index) -> physx::PxD6Axis::Enum {
    switch (index) {
        case 0:
            return physx::PxD6Axis::Enum::eX;
        case 1:
            return physx::PxD6Axis::Enum::eY;
        case 2:
            return physx::PxD6Axis::Enum::eZ;
        case 3:
            return physx::PxD6Axis::Enum::eTWIST;
        case 4:
            return physx::PxD6Axis::Enum::eSWING1;
        case 5:
            return physx::PxD6Axis::Enum::eSWING2;
        default:
            assert(false && "unsupported axis");
            return physx::PxD6Axis::Enum::eX;
    }
}

void PhysXGenericJoint::setConstraintMode(uint32_t index, uint32_t mode) {
    physx::PxD6Axis::Enum axis{mapAxis(index)};
    physx::PxD6Motion::Enum motion{};
    switch (mode) {
        case 0:
            motion = physx::PxD6Motion::Enum::eFREE;
            break;
        case 1:
            motion = physx::PxD6Motion::Enum::eLIMITED;
            break;
        case 2:
            motion = physx::PxD6Motion::Enum::eLOCKED;
            break;
        default:
            motion = physx::PxD6Motion::Enum::eFREE;
            break;
    }
    switch (index) {
        case 0:
            _linearLimit.x = motion;
            break;
        case 1:
            _linearLimit.y = motion;
            break;
        case 2:
            _linearLimit.z = motion;
            break;
        case 3:
            _angularLimit.eTwist = motion;
            break;
        case 4:
        case 5:
            _angularLimit.eSwing = motion;
            break;
        default:
            break;
    }
    auto* _joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    _joint->setMotion(axis, motion);
}

void PhysXGenericJoint::setLinearLimit(uint32_t index, float lower, float upper) {
    assert(index < 3); // linear index should be 1, 2, or 3
    _linearLimit.lower[index] = lower;
    _linearLimit.upper[index] = upper;
    updateLinearLimit();
}

void PhysXGenericJoint::setAngularExtent(float twist, float swing1, float swing2) {
    _angularLimit.twistExtent = mathutils::toRadian(std::fmax(twist, 1e-9));
    _angularLimit.swing1Extent = mathutils::toRadian(std::fmax(swing1, 1e-9));
    _angularLimit.swing2Extent = mathutils::toRadian(std::fmax(swing2, 1e-9));
    
    updateTwistLimit();
    updateSwingLimit();
}

void PhysXGenericJoint::setLinearSoftConstraint(bool enable) {
    _linearLimit.soft = enable;
    updateLinearLimit();
}

void PhysXGenericJoint::setLinearStiffness(float stiffness) {
    _linearLimit.stiffness = stiffness;
    updateLinearLimit();
}

void PhysXGenericJoint::setLinearDamping(float damping) {
    _linearLimit.damping = damping;
    updateLinearLimit();
}

void PhysXGenericJoint::setLinearRestitution(float restitution) {
    _linearLimit.restitution = restitution;
    updateLinearLimit();
}

void PhysXGenericJoint::setSwingSoftConstraint(bool enable) {
    _angularLimit.swingSoft = enable;
    updateSwingLimit();
}

void PhysXGenericJoint::setSwingStiffness(float stiffness) {
    _angularLimit.swingStiffness = stiffness;
    updateSwingLimit();
}

void PhysXGenericJoint::setSwingDamping(float damping) {
    _angularLimit.swingDamping = damping;
    updateSwingLimit();
}

void PhysXGenericJoint::setSwingRestitution(float restitution) {
    _angularLimit.swingRestitution = restitution;
    updateSwingLimit();
}

void PhysXGenericJoint::setTwistSoftConstraint(bool enable) {
    _angularLimit.twistSoft = enable;
    updateTwistLimit();
}

void PhysXGenericJoint::setTwistStiffness(float stiffness) {
    _angularLimit.twistStiffness = stiffness;
    updateTwistLimit();
}

void PhysXGenericJoint::setTwistDamping(float damping) {
    _angularLimit.twistDamping = damping;
    updateTwistLimit();
}

void PhysXGenericJoint::setTwistRestitution(float restitution) {
    _angularLimit.twistRestitution = restitution;
    updateTwistLimit();
}

void PhysXGenericJoint::setDriverMode(uint32_t index, uint32_t mode) {
    switch (index) {
        case 0:
            _linearMotor.xDrive = mode;
            break;
        case 1:
            _linearMotor.yDrive = mode;
            break;
        case 2:
            _linearMotor.zDrive = mode;
            break;
        case 3:
            _angularMotor.twistDrive = mode;
            break;
        case 4:
            _angularMotor.swingDrive1 = mode;
            break;
        case 5:
            _angularMotor.swingDrive2 = mode;
            break;
        default:
            break;
    }
    this->updateDrive(index);
}

void PhysXGenericJoint::setLinearMotorTarget(float x, float y, float z) {
    auto& p = _linearMotor.target;
    p.x = x;
    p.y = y;
    p.z = z;
    this->updateDrivePosition();
}

void PhysXGenericJoint::setLinearMotorVelocity(float x, float y, float z) {
    auto& v = _linearMotor.velocity;
    v.x = x;
    v.y = y;
    v.z = z;
    this->updateDriveVelocity();
}

void PhysXGenericJoint::setLinearMotorForceLimit(float limit) {
    _linearMotor.forceLimit = limit;
    updateDrive(0);
    updateDrive(1);
    updateDrive(2);
}

void PhysXGenericJoint::setAngularMotorTarget(float x, float y, float z) {
    auto& p = _angularMotor.target;
    p.x = x;
    p.y = y;
    p.z = z;
    this->updateDrivePosition();
}

void PhysXGenericJoint::setAngularMotorVelocity(float x, float y, float z) {
    auto& v = _angularMotor.velocity;
    v.x = -mathutils::toRadian(x);
    v.y = -mathutils::toRadian(y);
    v.z = -mathutils::toRadian(z);
    this->updateDriveVelocity();
}

void PhysXGenericJoint::setAngularMotorForceLimit(float limit) {
    _angularMotor.forceLimit = limit;
    this->updateDrive(3);
    this->updateDrive(4);
    this->updateDrive(5);
}

void PhysXGenericJoint::setPivotA(float x, float y, float z) {
    _mPivotA.x = x;
    _mPivotA.y = y;
    _mPivotA.z = z;
    updatePose();
}
void PhysXGenericJoint::setPivotB(float x, float y, float z) {
    _mPivotB.x = x;
    _mPivotB.y = y;
    _mPivotB.z = z;
    updatePose();
}
void PhysXGenericJoint::setAutoPivotB(bool autoPivot) {
    _mAutoPivotB = autoPivot;
    updatePose();
}
void PhysXGenericJoint::setAxis(float x, float y, float z) {
    _mAxis.x = x;
    _mAxis.y = y;
    _mAxis.z = z;
    updatePose();
}
void PhysXGenericJoint::setSecondaryAxis(float x, float y, float z) {
    _mSecondary.x = x;
    _mSecondary.y = y;
    _mSecondary.z = z;
    updatePose();
}

void PhysXGenericJoint::setBreakForce(float force) {
    _breakForce = force;
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    joint->getBreakForce(_breakForce, _breakTorque);
}
void PhysXGenericJoint::setBreakTorque(float torque) {
    _breakTorque = torque;
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    joint->getBreakForce(_breakForce, _breakTorque);
}
void PhysXGenericJoint::updateScale0() {
    this->updatePose();
}
void PhysXGenericJoint::updateScale1() {
    this->updatePose();
}

void PhysXGenericJoint::updateLinearLimit() {
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    const auto lower = _linearLimit.lower;
    const auto upper = _linearLimit.upper;
    auto limitx = joint->getLinearLimit(physx::PxD6Axis::Enum::eX);
    auto limity = joint->getLinearLimit(physx::PxD6Axis::Enum::eY);
    auto limitz = joint->getLinearLimit(physx::PxD6Axis::Enum::eZ);
    if (_linearLimit.soft) {
        limitx.stiffness = _linearLimit.stiffness;
        limitx.damping = _linearLimit.damping;
    } else {
        limitx.stiffness = 0.0;
        limitx.damping = 0.0;
    }
    limitx.contactDistance = 0.1;
    limitx.bounceThreshold = 0.1;
    limitx.restitution = _linearLimit.restitution;

    limity = limitx;
    limitz = limitx;
    if (_linearLimit.x == physx::PxD6Motion::Enum::eLIMITED) {
        limitx.upper = upper[0];
        limitx.lower = lower[0];
        joint->setLinearLimit(physx::PxD6Axis::Enum::eX, limitx);
    }
    if (_linearLimit.y == physx::PxD6Motion::Enum::eLIMITED) {
        limity.upper = upper[1];
        limity.lower = lower[1];
        joint->setLinearLimit(physx::PxD6Axis::Enum::eY, limity);
    }
    if (_linearLimit.z == physx::PxD6Motion::Enum::eLIMITED) {
        limitz.upper = upper[2];
        limitz.lower = lower[2];
        joint->setLinearLimit(physx::PxD6Axis::Enum::eZ, limitz);
    }
}

void PhysXGenericJoint::updateSwingLimit() {
    if (_angularLimit.eSwing != physx::PxD6Motion::Enum::eLIMITED) {
        return;
    }

    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    auto coneLimit = joint->getSwingLimit();
    if (_angularLimit.swingSoft) {
        coneLimit.stiffness = _angularLimit.swingStiffness;
        coneLimit.damping = _angularLimit.swingDamping;
    } else {
        coneLimit.stiffness = 0;
        coneLimit.damping = 0;
    }
    coneLimit.bounceThreshold = 0.1;
    coneLimit.contactDistance = 0.1;
    coneLimit.restitution = _angularLimit.swingRestitution;
    coneLimit.yAngle = math::PI;
    coneLimit.zAngle = math::PI;
    if (_angularLimit.eSwing == 1) {
        coneLimit.yAngle = _angularLimit.swing1Extent * 0.5;
        coneLimit.zAngle = _angularLimit.swing2Extent * 0.5;
        joint->setSwingLimit(coneLimit);
    }
}

void PhysXGenericJoint::updateTwistLimit() {
    if (_angularLimit.eTwist != physx::PxD6Motion::Enum::eLIMITED) {
        return;
    }
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    auto twistLimit = joint->getTwistLimit();
    twistLimit.bounceThreshold = 0.1;
    twistLimit.contactDistance = 0.1;
    twistLimit.restitution = _angularLimit.twistRestitution;
    if (_angularLimit.twistSoft) {
        twistLimit.stiffness = _angularLimit.twistStiffness;
        twistLimit.damping = _angularLimit.twistDamping;
    } else {
        twistLimit.damping = 0;
        twistLimit.stiffness = _angularLimit.twistStiffness;
    }
    if (_angularLimit.eTwist == 1) {
        twistLimit.lower = _angularLimit.twistExtent * -0.5;
        twistLimit.upper = _angularLimit.twistExtent * 0.5;
        joint->setTwistLimit(twistLimit);
    }
}

void PhysXGenericJoint::updateDrive(uint32_t axis) {
    assert(axis < 6 && "axis should be in [0, 5]");
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    auto drive = joint->getDrive(static_cast<physx::PxD6Drive::Enum>(axis));

    uint32_t mode = 0;
    physx::PxD6Drive::Enum driveAxis = physx::PxD6Drive::Enum::eX;
    switch (axis) {
        case 0:
            mode = _linearMotor.xDrive;
            driveAxis = physx::PxD6Drive::Enum::eX;
            break;
        case 1:
            mode = _linearMotor.yDrive;
            driveAxis = physx::PxD6Drive::Enum::eY;
            break;
        case 2:
            mode = _linearMotor.zDrive;
            driveAxis = physx::PxD6Drive::Enum::eZ;
            break;
        case 3:
            mode = _angularMotor.twistDrive;
            driveAxis = physx::PxD6Drive::Enum::eTWIST;
            break;
        case 4:
        case 5:
            if (_angularMotor.swingDrive1 == 2 || _angularMotor.swingDrive2 == 2) {
                mode = 2;
            } else if (_angularMotor.swingDrive1 == 1 || _angularMotor.swingDrive2 == 1) {
                mode = 1;
            } else {
                mode = 0;
            }
            driveAxis = physx::PxD6Drive::Enum::eSWING;
            break;
        default:
            break;
    };

    if (axis < 3) {
        drive.forceLimit = _linearMotor.forceLimit;
    } else if (axis == 3) {
        drive.forceLimit = _angularMotor.forceLimit;
    } else if (axis < 6) {
        drive.forceLimit = _angularMotor.forceLimit;
    }

    if (mode == 0) { // disabled
        drive.forceLimit = 0;
    } else if (mode == 1) { // servo
        drive.damping = 0.0;
        drive.stiffness = 1000.0;
    } else if (mode == 2) { // induction
        drive.damping = 1000.0;
        drive.stiffness = 0.0;
    }
    joint->setDrive(driveAxis, drive);
}

void PhysXGenericJoint::updateDrivePosition() {
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    physx::PxTransform trans{};

    const auto& ld = _linearMotor.target;
    const auto& ad = _angularMotor.target;

    Quaternion quat;
    Quaternion::fromEuler(ad.x, ad.y, ad.z, &quat);
    pxSetVec3Ext(trans.p, Vec3(ld.x, ld.y, ld.z));
    pxSetQuatExt(trans.q, quat);

    joint->setDrivePosition(trans, true);
}

void PhysXGenericJoint::updateDriveVelocity() {
    physx::PxD6Joint* joint{static_cast<physx::PxD6Joint*>(_mJoint)};
    joint->setDriveVelocity(_linearMotor.velocity, _angularMotor.velocity, true);
}

void PhysXGenericJoint::updatePose() {
    physx::PxTransform pose0{physx::PxIdentity};
    physx::PxTransform pose1{physx::PxIdentity};
    auto* node0 = _mSharedBody->getNode();
    node0->updateWorldTransform();
    _mTertiary = _mAxis.cross(_mSecondary);

    Mat4 transform(
        _mAxis.x, _mAxis.y, _mAxis.z, 0.F,
        _mSecondary.x, _mSecondary.y, _mSecondary.z, 0.F,
        _mTertiary.x, _mTertiary.y, _mTertiary.z, 0.F,
        0.F, 0.F, 0.F, 1.F);

    Quaternion quat{transform};
    pose0.q = physx::PxQuat{quat.x, quat.y, quat.z, quat.w};
    Vec3 pos = Vec3(_mPivotA.x, _mPivotA.y, _mPivotA.z) * node0->getWorldScale();
    pose0.p = physx::PxVec3{pos.x, pos.y, pos.z};
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR0, pose0);

    if (_mConnectedBody) {
        auto* node1 = _mConnectedBody->getNode();
        node1->updateWorldTransform();
        const auto& rot_1_i = node1->getWorldRotation().getInversed();
        if (_mAutoPivotB) {
            pos.transformQuat(node0->getWorldRotation());
            pos += node0->getWorldPosition();
            pos -= node1->getWorldPosition();
            pos.transformQuat(rot_1_i);
            pxSetVec3Ext(pose1.p, pos);
        } else {
            pose1.p = _mPivotB * node1->getWorldScale();
        }
        Quaternion::multiply(node0->getWorldRotation(), quat, &quat);
        Quaternion::multiply(rot_1_i, quat, &quat);
        pxSetQuatExt(pose1.q, quat);
    } else {
        pos.transformQuat(node0->getWorldRotation());
        pos += node0->getWorldPosition();
        Quaternion::multiply(node0->getWorldRotation(), quat, &quat);
        pose1.p = physx::PxVec3{pos.x, pos.y, pos.z};
        pose1.q = physx::PxQuat{quat.x, quat.y, quat.z, quat.w};
    }
    _mJoint->setLocalPose(physx::PxJointActorIndex::eACTOR1, pose1);
}

} // namespace physics
} // namespace cc
