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

CC_PHYSICS_JOINT_DEFINITION(DistanceJoint, WrappedDistanceJoint)
CC_PHYSICS_JOINT_DEFINITION(RevoluteJoint, WrappedRevoluteJoint)
CC_PHYSICS_JOINT_DEFINITION(FixedJoint, WrappedFixedJoint)

/// EXTRAS ///

void DistanceJoint::setPivotA(float x, float y, float z) {
    _impl->setPivotA(x, y, z);
}

void DistanceJoint::setPivotB(float x, float y, float z) {
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

void FixedJoint::setBreakForce(float force) {
    _impl->setBreakForce(force);
}

void FixedJoint::setBreakTorque(float torque) {
    _impl->setBreakTorque(torque);
}

} // namespace physics
} // namespace cc
