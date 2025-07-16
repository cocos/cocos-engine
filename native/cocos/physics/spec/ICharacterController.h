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

#include "core/scene-graph/Node.h"
#include "math/Vec3.h"
#include "physics/spec/ILifecycle.h"
#include "physics/spec/IShape.h"

namespace cc {
namespace physics {

class IBaseCharacterController : virtual public ILifecycle {
public:
    ~IBaseCharacterController() override = default;
    virtual bool initialize(Node *node) = 0;

    virtual void setStepOffset(float v) = 0;
    virtual float getStepOffset() = 0;
    virtual void setSlopeLimit(float v) = 0;
    virtual float getSlopeLimit() = 0;
    virtual void setContactOffset(float v) = 0;
    virtual float getContactOffset() = 0;
    virtual void setDetectCollisions(bool v) = 0;
    virtual void setOverlapRecovery(bool v) = 0;
    virtual void setCenter(float x, float y, float z) = 0;

    virtual cc::Vec3 getPosition() = 0;
    virtual void setPosition(float x, float y, float z) = 0;
    virtual bool onGround() = 0;
    virtual void move(float x, float y, float z, float minDist, float elapsedTime) = 0;
    virtual void syncPhysicsToScene() = 0;

    virtual uint32_t getGroup() = 0;
    virtual void setGroup(uint32_t g) = 0;
    virtual uint32_t getMask() = 0;
    virtual void setMask(uint32_t m) = 0;
    virtual void updateEventListener(EShapeFilterFlag flag) = 0;

    virtual uint32_t getObjectID() const = 0;
};

class ICapsuleCharacterController : virtual public IBaseCharacterController {
public:
    ~ICapsuleCharacterController() override = default;
    virtual void setRadius(float v) = 0;
    virtual void setHeight(float v) = 0;
};

class IBoxCharacterController : virtual public IBaseCharacterController {
public:
    ~IBoxCharacterController() override = default;
    virtual void setHalfHeight(float v) = 0;
    virtual void setHalfSideExtent(float v) = 0;
    virtual void setHalfForwardExtent(float v) = 0;
};

} // namespace physics
} // namespace cc
