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

#include <cstdint>
#include <memory>
#include "base/Macros.h"
#include "core/scene-graph/Node.h"
#include "physics/spec/IJoint.h"

#define CC_PHYSICS_JOINT_CLASS(CLASS)                         \
    class CC_DLL CLASS final : virtual public I##CLASS {      \
    protected:                                                \
        std::unique_ptr<I##CLASS> _impl;                      \
                                                              \
    public:                                                   \
        CLASS();                                              \
        ~CLASS() override;                                    \
        void initialize(Node *node) override;                 \
        void onEnable() override;                             \
        void onDisable() override;                            \
        void onDestroy() override;                            \
        void setEnableCollision(bool v) override;             \
        void setConnectedBody(uint32_t rigidBodyID) override; \
        uint32_t getObjectID() const override;
namespace cc {
namespace physics {

CC_PHYSICS_JOINT_CLASS(RevoluteJoint)
void setPivotA(float x, float y, float z) override;
void setPivotB(float x, float y, float z) override;
void setAxis(float x, float y, float z) override;
}; // RevoluteJoint

CC_PHYSICS_JOINT_CLASS(DistanceJoint)
void setPivotA(float x, float y, float z) override;
void setPivotB(float x, float y, float z) override;
}; // DistanceJoint

CC_PHYSICS_JOINT_CLASS(FixedJoint)
void setBreakForce(float force) override;
void setBreakTorque(float torque) override;
}
; // FixedJoint

} // namespace physics
} // namespace cc
