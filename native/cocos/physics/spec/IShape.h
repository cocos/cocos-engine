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
#include "core/geometry/AABB.h"
#include "core/geometry/Sphere.h"
#include "core/scene-graph/Node.h"
#include "physics/spec/ILifecycle.h"

namespace cc {
namespace physics {

enum class EAxisDirection : uint8_t {
    X_AXIS,
    Y_AXIS,
    Z_AXIS,
};

enum class EShapeFilterFlag : uint8_t {
    NONE = 0,
    IS_TRIGGER = 1 << 0,
    NEED_EVENT = 1 << 1,
    NEED_CONTACT_DATA = 1 << 2,
    DETECT_CONTACT_CCD = 1 << 3,
};

class IBaseShape : virtual public ILifecycle {
public:
    ~IBaseShape() override = default;
    ;
    virtual void initialize(Node *node) = 0;
    virtual void setMaterial(uint16_t id, float f, float df, float r,
                             uint8_t m0, uint8_t m1) = 0;
    virtual void setAsTrigger(bool v) = 0;
    virtual void setCenter(float x, float y, float z) = 0;
    virtual geometry::AABB &getAABB() = 0;
    virtual geometry::Sphere &getBoundingSphere() = 0;
    virtual void updateEventListener(EShapeFilterFlag flag) = 0;
    virtual uint32_t getGroup() = 0;
    virtual void setGroup(uint32_t g) = 0;
    virtual uint32_t getMask() = 0;
    virtual void setMask(uint32_t m) = 0;
    virtual uint32_t getObjectID() const = 0;
};

class ISphereShape : virtual public IBaseShape {
public:
    ~ISphereShape() override = default;
    ;
    virtual void setRadius(float v) = 0;
};

class IBoxShape : virtual public IBaseShape {
public:
    ~IBoxShape() override = default;
    ;
    virtual void setSize(float x, float y, float z) = 0;
};

class ICapsuleShape : virtual public IBaseShape {
public:
    ~ICapsuleShape() override = default;
    ;
    virtual void setRadius(float v) = 0;
    virtual void setCylinderHeight(float v) = 0;
    virtual void setDirection(EAxisDirection v) = 0;
};

class ICylinderShape : virtual public IBaseShape {
public:
    ~ICylinderShape() override = default;
    ;
    virtual void setConvex(uint32_t ObjectID) = 0;
    virtual void setCylinder(float r, float h, EAxisDirection d) = 0;
};

class IConeShape : virtual public IBaseShape {
public:
    ~IConeShape() override = default;
    ;
    virtual void setConvex(uint32_t ObjectID) = 0;
    virtual void setCone(float r, float h, EAxisDirection d) = 0;
};

class IPlaneShape : virtual public IBaseShape {
public:
    ~IPlaneShape() override = default;
    ;
    virtual void setConstant(float v) = 0;
    virtual void setNormal(float x, float y, float z) = 0;
};

class ITrimeshShape : virtual public IBaseShape {
public:
    ~ITrimeshShape() override = default;
    ;
    virtual void setMesh(uint32_t ObjectID) = 0;
    virtual void useConvex(bool v) = 0;
};

class ITerrainShape : virtual public IBaseShape {
public:
    virtual void setTerrain(uint32_t ObjectID, float rs, float cs, float hs) = 0;
};

} // namespace physics
} // namespace cc
