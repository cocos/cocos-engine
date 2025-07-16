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

#include "physics/sdk/Joint.h"
#include "base/memory/Memory.h"
#include "physics/PhysicsSelector.h"

#define CC_PHYSICS_JOINT_DEFINITION(CLASS, WRAPPED)      \
                                                         \
    CLASS::CLASS() {                                     \
        _impl.reset(ccnew WRAPPED());                    \
    }                                                    \
                                                         \
    CLASS::~CLASS() {                                    \
        _impl.reset(nullptr);                            \
    }                                                    \
                                                         \
    void CLASS::initialize(Node *node) {                 \
        _impl->initialize(node);                         \
    }                                                    \
                                                         \
    void CLASS::onEnable() {                             \
        _impl->onEnable();                               \
    }                                                    \
                                                         \
    void CLASS::onDisable() {                            \
        _impl->onDisable();                              \
    }                                                    \
                                                         \
    void CLASS::onDestroy() {                            \
        _impl->onDestroy();                              \
    }                                                    \
                                                         \
    void CLASS::setConnectedBody(uint32_t rigidBodyID) { \
        _impl->setConnectedBody(rigidBodyID);            \
    }                                                    \
                                                         \
    void CLASS::setEnableCollision(bool v) {             \
        _impl->setEnableCollision(v);                    \
    }                                                    \
    uint32_t CLASS::getObjectID() const {                \
        return _impl->getObjectID();                     \
    }

namespace cc {
namespace physics {

/// COMMON ///

CC_PHYSICS_JOINT_DEFINITION(SphericalJoint, WrappedSphericalJoint)
CC_PHYSICS_JOINT_DEFINITION(RevoluteJoint, WrappedRevoluteJoint)
CC_PHYSICS_JOINT_DEFINITION(FixedJoint, WrappedFixedJoint)
CC_PHYSICS_JOINT_DEFINITION(GenericJoint, WrappedGenericJoint)

/// EXTRAS ///

void SphericalJoint::setPivotA(float x, float y, float z) {
    _impl->setPivotA(x, y, z);
}

void SphericalJoint::setPivotB(float x, float y, float z) {
    _impl->setPivotB(x, y, z);
}

void RevoluteJoint::setPivotA(float x, float y, float z) {
    _impl->setPivotA(x, y, z);
}

void RevoluteJoint::setPivotB(float x, float y, float z) {
    _impl->setPivotB(x, y, z);
}

void RevoluteJoint::setAxis(float x, float y, float z) {
    _impl->setAxis(x, y, z);
}

void RevoluteJoint::setLimitEnabled(bool v) {
    _impl->setLimitEnabled(v);
}

void RevoluteJoint::setLowerLimit(float v) {
    _impl->setLowerLimit(v);
}

void RevoluteJoint::setUpperLimit(float v) {
    _impl->setUpperLimit(v);
}

void RevoluteJoint::setMotorEnabled(bool v) {
    _impl->setMotorEnabled(v);
}

void RevoluteJoint::setMotorVelocity(float v) {
    _impl->setMotorVelocity(v);
}

void RevoluteJoint::setMotorForceLimit(float v) {
    _impl->setMotorForceLimit(v);
}

void FixedJoint::setBreakForce(float force) {
    _impl->setBreakForce(force);
}

void FixedJoint::setBreakTorque(float torque) {
    _impl->setBreakTorque(torque);
}

void GenericJoint::setConstraintMode(uint32_t index, uint32_t mode) {
    _impl->setConstraintMode(index, mode);
}
void GenericJoint::setLinearLimit(uint32_t index, float lower, float upper) {
    _impl->setLinearLimit(index, lower, upper);
}

void GenericJoint::setAngularExtent(float twist, float swing1, float swing2) {
    _impl->setAngularExtent(twist, swing1, swing2);
}
void GenericJoint::setLinearSoftConstraint(bool enable) {
    _impl->setLinearSoftConstraint(enable);
}
void GenericJoint::setLinearStiffness(float stiffness) {
    _impl->setLinearStiffness(stiffness);
}
void GenericJoint::setLinearDamping(float damping) {
    _impl->setLinearDamping(damping);
}
void GenericJoint::setLinearRestitution(float restitution) {
    _impl->setLinearRestitution(restitution);
}

void GenericJoint::setSwingSoftConstraint(bool enable) {
    _impl->setSwingSoftConstraint(enable);
}
void GenericJoint::setTwistSoftConstraint(bool enable) {
    _impl->setTwistSoftConstraint(enable);
}
void GenericJoint::setSwingStiffness(float stiffness) {
    _impl->setSwingStiffness(stiffness);
}
void GenericJoint::setSwingDamping(float damping) {
    _impl->setSwingDamping(damping);
}
void GenericJoint::setSwingRestitution(float restitution) {
    _impl->setSwingRestitution(restitution);
}
void GenericJoint::setTwistStiffness(float stiffness) {
    _impl->setTwistStiffness(stiffness);
}
void GenericJoint::setTwistDamping(float damping) {
    _impl->setTwistDamping(damping);
}
void GenericJoint::setTwistRestitution(float restitution) {
    _impl->setTwistRestitution(restitution);
}

void GenericJoint::setDriverMode(uint32_t index, uint32_t mode) {
    _impl->setDriverMode(index, mode);
}
void GenericJoint::setLinearMotorTarget(float x, float y, float z) {
    _impl->setLinearMotorTarget(x, y, z);
}
void GenericJoint::setLinearMotorVelocity(float x, float y, float z) {
    _impl->setLinearMotorVelocity(x, y, z);
}
void GenericJoint::setLinearMotorForceLimit(float limit) {
    _impl->setLinearMotorForceLimit(limit);
}
void GenericJoint::setAngularMotorTarget(float x, float y, float z) {
    _impl->setAngularMotorTarget(x, y, z);
}
void GenericJoint::setAngularMotorVelocity(float x, float y, float z) {
    _impl->setAngularMotorVelocity(x, y, z);
}
void GenericJoint::setAngularMotorForceLimit(float limit) {
    _impl->setAngularMotorForceLimit(limit);
}
void GenericJoint::setPivotA(float x, float y, float z) {
    _impl->setPivotA(x, y, z);
}
void GenericJoint::setPivotB(float x, float y, float z) {
    _impl->setPivotB(x, y, z);
}
void GenericJoint::setAutoPivotB(bool enable) {
    _impl->setAutoPivotB(enable);
}
void GenericJoint::setAxis(float x, float y, float z) {
    _impl->setAxis(x, y, z);
}
void GenericJoint::setSecondaryAxis(float x, float y, float z) {
    _impl->setSecondaryAxis(x, y, z);
}

void GenericJoint::setBreakForce(float force) {
    _impl->setBreakForce(force);
}
void GenericJoint::setBreakTorque(float torque) {
    _impl->setBreakTorque(torque);
}

} // namespace physics
} // namespace cc
