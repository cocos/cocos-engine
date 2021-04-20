/****************************************************************************
 Copyright (c) 2020-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#pragma once

#include "physics/physx/PhysXInc.h"
#include "physics/spec/IShape.h"
#include "base/Macros.h"

namespace cc {
namespace physics {
class PhysXSharedBody;

template <typename T>
CC_INLINE T &getPxGeometry() {
    static T geo;
    return geo;
}

class PhysXShape : virtual public IBaseShape {
    PX_NOCOPY(PhysXShape)
    PhysXShape() : _mCenter(physx::PxIdentity),
                   _mRotation(physx::PxIdentity){};

public:
    ~PhysXShape() override = default;
    CC_INLINE uintptr_t   getImpl() override { return reinterpret_cast<uintptr_t>(this); }
    void                  initialize(uint handle) override;
    void                  onEnable() override;
    void                  onDisable() override;
    void                  onDestroy() override;
    void                  setMaterial(uint16_t id, float f, float df, float r,
                                      uint8_t m0, uint8_t m1) override;
    void                  setAsTrigger(bool v) override;
    void                  setCenter(float x, float y, float z) override;
    cc::pipeline::AABB &  getAABB() override;
    cc::pipeline::Sphere &getBoundingSphere() override;
    void                  updateEventListener(EShapeFilterFlag flag) override;
    uint32_t              getGroup() override;
    void                  setGroup(uint32_t g) override;
    uint32_t              getMask() override;
    void                  setMask(uint32_t m) override;
    virtual void          updateScale() = 0;
    CC_INLINE physx::PxVec3 &getCenter() { return _mCenter; }
    CC_INLINE physx::PxShape &getShape() const { return *_mShape; }
    CC_INLINE PhysXSharedBody &getSharedBody() const { return *_mSharedBody; }
    CC_INLINE bool             isTrigger() const {
        return getShape().getFlags().isSet(physx::PxShapeFlag::eTRIGGER_SHAPE);
    }
    void updateFilterData(physx::PxFilterData &data);

protected:
    PhysXSharedBody *_mSharedBody{nullptr};
    physx::PxShape * _mShape{nullptr};
    physx::PxVec3    _mCenter;
    physx::PxQuat    _mRotation;
    int8_t           _mIndex{-1};
    uint8_t          _mFlag{0};
    bool             _mEnabled{false};
    virtual void     updateCenter();
    virtual void     onComponentSet() = 0;
};

} // namespace physics
} // namespace cc
