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

#pragma once

#include "physics/physx/joints/PhysXJoint.h"

namespace cc {
namespace physics {

class PhysXGenericJoint final : public PhysXJoint, public IGenericJoint {
public:
    PhysXGenericJoint() = default;
    ~PhysXGenericJoint() = default;

    void setConstraintMode(uint32_t index, uint32_t mode) override;
    void setLinearLimit(uint32_t index, float lower, float upper) override; // linear only, angular use extent is better
    void setAngularExtent(float twist, float swing1, float swing2) override;
    void setLinearSoftConstraint(bool enable) override;
    void setLinearStiffness(float stiffness) override;
    void setLinearDamping(float damping) override;
    void setLinearRestitution(float restitution) override;

    // TODO (yiwenxue): add new function to set angular limit
    void setSwingSoftConstraint(bool enable) override;
    void setTwistSoftConstraint(bool enable) override;
    void setSwingStiffness(float stiffness) override;
    void setSwingDamping(float damping) override;
    void setSwingRestitution(float restitution) override;
    void setTwistStiffness(float stiffness) override;
    void setTwistDamping(float damping) override;
    void setTwistRestitution(float restitution) override;

    void setDriverMode(uint32_t index, uint32_t mode) override;
    void setLinearMotorTarget(float x, float y, float z) override;
    void setLinearMotorVelocity(float x, float y, float z) override;
    void setLinearMotorForceLimit(float limit) override;

    void setAngularMotorTarget(float x, float y, float z) override;
    void setAngularMotorVelocity(float x, float y, float z) override;
    void setAngularMotorForceLimit(float limit) override;

    void setPivotA(float x, float y, float z) override;
    void setPivotB(float x, float y, float z) override;
    void setAutoPivotB(bool autoPivot) override;
    void setAxis(float x, float y, float z) override;
    void setSecondaryAxis(float x, float y, float z) override;

    void setBreakForce(float force) override;
    void setBreakTorque(float torque) override;

    void updateScale0() override;
    void updateScale1() override;

private:
    void onComponentSet() override;
    void updatePose();
    void updateLinearLimit();

    void updateSwingLimit();
    void updateTwistLimit();

    void updateDrive(uint32_t axis);
    void updateDrivePosition();
    void updateDriveVelocity();

    physx::PxVec3 _mPivotA{physx::PxZero};
    physx::PxVec3 _mPivotB{physx::PxZero};
    bool _mAutoPivotB{false};
    physx::PxVec3 _mAxis{physx::PxZero};
    physx::PxVec3 _mSecondary{physx::PxZero};
    physx::PxVec3 _mTertiary{physx::PxZero};

    float _breakForce{0.F};
    float _breakTorque{0.F};

    struct {
        physx::PxD6Motion::Enum x, y, z;
        float lower[3];
        float upper[3];

        bool soft;
        float stiffness;
        float damping;
        float restitution;
        float forceLimit;
    } _linearLimit;

    struct {
        physx::PxD6Motion::Enum eTwist, eSwing, eSlerp;
        float swing1Extent, swing2Extent, twistExtent;

        bool swingSoft, twistSoft;
        float swingStiffness;
        float swingDamping;
        float swingRestitution;
        float twistStiffness;
        float twistDamping;
        float twistRestitution;
    } _angularLimit;

    struct {
        uint32_t xDrive;
        uint32_t yDrive;
        uint32_t zDrive;
        float forceLimit;
        physx::PxVec3 target;
        physx::PxVec3 velocity;
    } _linearMotor;

    struct {
        uint32_t twistDrive;
        uint32_t swingDrive1;
        uint32_t swingDrive2;
        float forceLimit;
        physx::PxVec3 target;
        physx::PxVec3 velocity;
    } _angularMotor;
};

} // namespace physics
} // namespace cc
