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
#include "core/scene-graph/Node.h"
#include "physics/spec/ILifecycle.h"

namespace cc {
namespace physics {

class IBaseJoint : virtual public ILifecycle {
public:
    ~IBaseJoint() override = default;
    virtual void initialize(Node *node) = 0;
    virtual void setEnableCollision(bool v) = 0;
    virtual void setConnectedBody(uint32_t rigidBodyID) = 0;
    virtual uint32_t getObjectID() const = 0;
};

class IDistanceJoint : virtual public IBaseJoint {
public:
    ~IDistanceJoint() override = default;
    virtual void setPivotA(float x, float y, float z) = 0;
    virtual void setPivotB(float x, float y, float z) = 0;
};

class IRevoluteJoint : virtual public IBaseJoint {
public:
    ~IRevoluteJoint() override = default;
    virtual void setPivotA(float x, float y, float z) = 0;
    virtual void setPivotB(float x, float y, float z) = 0;
    virtual void setAxis(float x, float y, float z) = 0;
};

class IFixedJoint : virtual public IBaseJoint {
public:
    ~IFixedJoint() override = default;
    virtual void setBreakForce(float force) = 0;
    virtual void setBreakTorque(float torque) = 0;
};

} // namespace physics
} // namespace cc
