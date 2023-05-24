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
#include "core/geometry/AABB.h"
#include "core/geometry/Sphere.h"
#include "physics/spec/IShape.h"

#define CC_PHYSICS_SHAPE_CLASS(CLASS)                             \
    class CC_DLL CLASS final : public I##CLASS {                  \
    protected:                                                    \
        std::unique_ptr<I##CLASS> _impl;                          \
                                                                  \
    public:                                                       \
        CLASS();                                                  \
        ~CLASS() override;                                        \
        void initialize(Node *node) override;                     \
        void onEnable() override;                                 \
        void onDisable() override;                                \
        void onDestroy() override;                                \
        void setMaterial(uint16_t ID, float f, float df, float r, \
                         uint8_t m0, uint8_t m1) override;        \
        void setAsTrigger(bool v) override;                       \
        void setCenter(float x, float y, float z) override;       \
        void updateEventListener(EShapeFilterFlag v) override;    \
        geometry::AABB &getAABB() override;                       \
        geometry::Sphere &getBoundingSphere() override;           \
        uint32_t getGroup() override;                             \
        void setGroup(uint32_t g) override;                       \
        uint32_t getMask() override;                              \
        void setMask(uint32_t m) override;                        \
        uint32_t getObjectID() const override;

namespace cc {
namespace physics {

CC_PHYSICS_SHAPE_CLASS(SphereShape)
void setRadius(float v) override;
}; // namespace physics

CC_PHYSICS_SHAPE_CLASS(BoxShape)
void setSize(float x, float y, float z) override;
}; // namespace cc

CC_PHYSICS_SHAPE_CLASS(CapsuleShape)
void setRadius(float v) override;
void setCylinderHeight(float v) override;
void setDirection(EAxisDirection v) override;
}
;

CC_PHYSICS_SHAPE_CLASS(PlaneShape)
void setConstant(float v) override;
void setNormal(float x, float y, float z) override;
}
;

CC_PHYSICS_SHAPE_CLASS(TrimeshShape)
void setMesh(uint32_t objectID) override;
void useConvex(bool v) override;
}
;

CC_PHYSICS_SHAPE_CLASS(CylinderShape)
void setConvex(uint32_t objectID) override;
void setCylinder(float r, float h, EAxisDirection d) override;
}
;

CC_PHYSICS_SHAPE_CLASS(ConeShape)
void setConvex(uint32_t objectID) override;
void setCone(float r, float h, EAxisDirection d) override;
}
;

CC_PHYSICS_SHAPE_CLASS(TerrainShape)
void setTerrain(uint32_t objectID, float rs, float cs, float hs) override;
}
;

} // namespace physics
} // namespace cc
