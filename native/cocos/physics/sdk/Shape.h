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

#include <cstdint>
#include <memory>
#include "base/Macros.h"
#include "physics/spec/IShape.h"
#include "scene/AABB.h"
#include "scene/Sphere.h"

#define CC_PHYSICS_SHAPE_CLASS(CLASS)                                       \
    class CC_DLL CLASS final : public I##CLASS {                            \
    protected:                                                              \
        std::unique_ptr<I##CLASS> _impl;                                    \
                                                                            \
    public:                                                                 \
        CLASS();                                                            \
        ~CLASS() override;                                                  \
        uintptr_t      getImpl() override;                                  \
        void           initialize(scene::Node* node) override;              \
        void           onEnable() override;                                 \
        void           onDisable() override;                                \
        void           onDestroy() override;                                \
        void           setMaterial(uint16_t ID, float f, float df, float r, \
                                   uint8_t m0, uint8_t m1) override;        \
        void           setAsTrigger(bool v) override;                       \
        void           setCenter(float x, float y, float z) override;       \
        void           updateEventListener(EShapeFilterFlag v) override;    \
        scene::AABB&   getAABB() override;                                  \
        scene::Sphere& getBoundingSphere() override;                        \
        uint32_t       getGroup() override;                                 \
        void           setGroup(uint32_t g) override;                       \
        uint32_t       getMask() override;                                  \
        void           setMask(uint32_t m) override;

namespace cc {
namespace physics {

CC_PHYSICS_SHAPE_CLASS(SphereShape)
void setRadius(float v) override;
};

CC_PHYSICS_SHAPE_CLASS(BoxShape)
void setSize(float x, float y, float z) override;
};

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
void setMesh(uintptr_t v) override;
void useConvex(bool v) override;
}
;

CC_PHYSICS_SHAPE_CLASS(CylinderShape)
void setConvex(uintptr_t v) override;
void setCylinder(float r, float h, EAxisDirection d) override;
}
;

CC_PHYSICS_SHAPE_CLASS(ConeShape)
void setConvex(uintptr_t v) override;
void setCone(float r, float h, EAxisDirection d) override;
}
;

CC_PHYSICS_SHAPE_CLASS(TerrainShape)
void setTerrain(uintptr_t v, float rs, float cs, float hs) override;
}
;

} // namespace physics
} // namespace cc
