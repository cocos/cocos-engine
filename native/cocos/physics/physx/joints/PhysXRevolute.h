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

#pragma once

#include "physics/physx/joints/PhysXJoint.h"

namespace cc {
namespace physics {

class PhysXRevolute final : public PhysXJoint, public IRevoluteJoint {
public:
    PhysXRevolute() : _mPivotA(physx::PxZero),
                      _mPivotB(physx::PxZero),
                      _mAxis(physx::PxZero) {}
    ~PhysXRevolute() override = default;
    void setPivotA(float x, float y, float z) override;
    void setPivotB(float x, float y, float z) override;
    void setAxis(float x, float y, float z) override;
    void setLimitEnabled(bool v) override;
    void setLowerLimit(float v) override;
    void setUpperLimit(float v) override;
    void setMotorEnabled(bool v) override;
    void setMotorVelocity(float v) override;
    void setMotorForceLimit(float v) override;
    void updateScale0() override;
    void updateScale1() override;

private:
    void onComponentSet() override;
    void updatePose();
    physx::PxVec3 _mPivotA;
    physx::PxVec3 _mPivotB;
    physx::PxVec3 _mAxis;
    physx::PxJointAngularLimitPair _mlimit{0, 0};

    bool _limitEnabled{false};
    float _lowerLimit{0.0F};
    float _upperLimit{0.0F};
    bool _motorEnabled{false};
    float _motorVelocity{0.0F};
    float _motorForceLimit{0.0F};
};

} // namespace physics
} // namespace cc
