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

#include "core/scene-graph/Node.h"
#include "math/Vec3.h"
#include "physics/spec/ILifecycle.h"

namespace cc {
namespace physics {

enum class ERigidBodyType : uint8_t {
    DYNAMIC = 1,
    STATIC = 2,
    KINEMATIC = 4,
};

class IRigidBody : public ILifecycle {
public:
    ~IRigidBody() override = default;
    virtual void initialize(Node *node, ERigidBodyType t, uint32_t g) = 0;
    virtual bool isAwake() = 0;
    virtual bool isSleepy() = 0;
    virtual bool isSleeping() = 0;
    virtual void setType(ERigidBodyType v) = 0;
    virtual void setMass(float v) = 0;
    virtual void setLinearDamping(float v) = 0;
    virtual void setAngularDamping(float v) = 0;
    virtual void useGravity(bool v) = 0;
    virtual void useCCD(bool v) = 0;
    virtual void setLinearFactor(float x, float y, float z) = 0;
    virtual void setAngularFactor(float x, float y, float z) = 0;
    virtual void setAllowSleep(bool v) = 0;
    virtual void wakeUp() = 0;
    virtual void sleep() = 0;
    virtual void clearState() = 0;
    virtual void clearForces() = 0;
    virtual void clearVelocity() = 0;
    virtual void setSleepThreshold(float v) = 0;
    virtual float getSleepThreshold() = 0;
    virtual cc::Vec3 getLinearVelocity() = 0;
    virtual void setLinearVelocity(float x, float y, float z) = 0;
    virtual cc::Vec3 getAngularVelocity() = 0;
    virtual void setAngularVelocity(float x, float y, float z) = 0;
    virtual void applyForce(float x, float y, float z, float rx, float ry, float rz) = 0;
    virtual void applyLocalForce(float x, float y, float z, float rx, float ry, float rz) = 0;
    virtual void applyImpulse(float x, float y, float z, float rx, float ry, float rz) = 0;
    virtual void applyLocalImpulse(float x, float y, float z, float rx, float ry, float rz) = 0;
    virtual void applyTorque(float x, float y, float z) = 0;
    virtual void applyLocalTorque(float x, float y, float z) = 0;
    virtual uint32_t getGroup() = 0;
    virtual void setGroup(uint32_t g) = 0;
    virtual uint32_t getMask() = 0;
    virtual void setMask(uint32_t m) = 0;
    virtual uint32_t getObjectID() const = 0;
};

} // namespace physics
} // namespace cc
