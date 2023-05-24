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

#include "base/Macros.h"
#include "core/scene-graph/Node.h"
#include "physics/physx/PhysXInc.h"
#include "physics/spec/IShape.h"

namespace cc {
namespace physics {
class PhysXSharedBody;

template <typename T>
inline T &getPxGeometry() {
    static T geo;
    return geo;
}

class PhysXShape : virtual public IBaseShape {
    PX_NOCOPY(PhysXShape)
    PhysXShape();

public:
    ~PhysXShape() override = default;
    void initialize(Node *node) override;
    void onEnable() override;
    void onDisable() override;
    void onDestroy() override;
    void setMaterial(uint16_t id, float f, float df, float r,
                     uint8_t m0, uint8_t m1) override;
    void setAsTrigger(bool v) override;
    void setCenter(float x, float y, float z) override;
    geometry::AABB &getAABB() override;
    geometry::Sphere &getBoundingSphere() override;
    void updateEventListener(EShapeFilterFlag flag) override;
    uint32_t getGroup() override;
    void setGroup(uint32_t g) override;
    uint32_t getMask() override;
    void setMask(uint32_t m) override;
    virtual void updateScale() = 0;
    inline physx::PxVec3 &getCenter() { return _mCenter; }
    inline physx::PxShape &getShape() const { return *_mShape; }
    inline PhysXSharedBody &getSharedBody() const { return *_mSharedBody; }
    inline bool isTrigger() const {
        return getShape().getFlags().isSet(physx::PxShapeFlag::eTRIGGER_SHAPE);
    }
    void updateFilterData(const physx::PxFilterData &data);
    uint32_t getObjectID() const override { return _mObjectID; };

protected:
    PhysXSharedBody *_mSharedBody{nullptr};
    physx::PxShape *_mShape{nullptr};
    physx::PxVec3 _mCenter;
    physx::PxQuat _mRotation;
    uint8_t _mFlag{0};
    bool _mEnabled{false};
    uint32_t _mObjectID{0};

    virtual void updateCenter();
    virtual void onComponentSet() = 0;
    virtual void insertToShapeMap();
    virtual void eraseFromShapeMap();
};

} // namespace physics
} // namespace cc
