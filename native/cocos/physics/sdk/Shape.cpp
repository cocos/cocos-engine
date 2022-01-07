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

#include "physics/sdk/Shape.h"
#include "physics/PhysicsSelector.h"

#define CC_PHYSICS_SHAPE_DEFINITION(CLASS, WRAPPED)                  \
                                                                     \
    CLASS::CLASS() {                                                 \
        _impl.reset(new WRAPPED());                                  \
    }                                                                \
                                                                     \
    CLASS::~CLASS() {                                                \
        _impl.reset(nullptr);                                        \
    }                                                                \
                                                                     \
    uintptr_t CLASS::getImpl() {                                     \
        return _impl->getImpl();                                     \
    }                                                                \
                                                                     \
    void CLASS::initialize(Node *node) {                             \
        _impl->initialize(node);                                     \
    }                                                                \
                                                                     \
    void CLASS::onEnable() {                                         \
        _impl->onEnable();                                           \
    }                                                                \
                                                                     \
    void CLASS::onDisable() {                                        \
        _impl->onDisable();                                          \
    }                                                                \
                                                                     \
    void CLASS::onDestroy() {                                        \
        _impl->onDestroy();                                          \
    }                                                                \
                                                                     \
    void CLASS::setMaterial(uint16_t ID, float f, float df, float r, \
                            uint8_t m0, uint8_t m1) {                \
        _impl->setMaterial(ID, f, df, r, m0, m1);                    \
    }                                                                \
                                                                     \
    void CLASS::setAsTrigger(bool v) {                               \
        _impl->setAsTrigger(v);                                      \
    }                                                                \
                                                                     \
    void CLASS::setCenter(float x, float y, float z) {               \
        _impl->setCenter(x, y, z);                                   \
    }                                                                \
                                                                     \
    void CLASS::setGroup(uint32_t g) {                               \
        _impl->setGroup(g);                                          \
    }                                                                \
                                                                     \
    uint32_t CLASS::getGroup() {                                     \
        return _impl->getGroup();                                    \
    }                                                                \
                                                                     \
    void CLASS::setMask(uint32_t m) {                                \
        _impl->setMask(m);                                           \
    }                                                                \
                                                                     \
    uint32_t CLASS::getMask() {                                      \
        return _impl->getMask();                                     \
    }                                                                \
                                                                     \
    void CLASS::updateEventListener(EShapeFilterFlag v) {            \
        _impl->updateEventListener(v);                               \
    }                                                                \
                                                                     \
    geometry::AABB &CLASS::getAABB() {                               \
        return _impl->getAABB();                                     \
    }                                                                \
                                                                     \
    geometry::Sphere &CLASS::getBoundingSphere() {                   \
        return _impl->getBoundingSphere();                           \
    }

namespace cc {
namespace physics {

/// COMMON ///

CC_PHYSICS_SHAPE_DEFINITION(SphereShape, WrappedSphereShape)
CC_PHYSICS_SHAPE_DEFINITION(BoxShape, WrappedBoxShape)
CC_PHYSICS_SHAPE_DEFINITION(PlaneShape, WrappedPlaneShape)
CC_PHYSICS_SHAPE_DEFINITION(CapsuleShape, WrappedCapsuleShape)
CC_PHYSICS_SHAPE_DEFINITION(CylinderShape, WrappedCylinderShape)
CC_PHYSICS_SHAPE_DEFINITION(ConeShape, WrappedConeShape)
CC_PHYSICS_SHAPE_DEFINITION(TrimeshShape, WrappedTrimeshShape)
CC_PHYSICS_SHAPE_DEFINITION(TerrainShape, WrappedTerrainShape)

/// EXTRAS ///

void SphereShape::setRadius(float v) {
    _impl->setRadius(v);
}

void BoxShape::setSize(float x, float y, float z) {
    _impl->setSize(x, y, z);
}

void CapsuleShape::setRadius(float v) {
    _impl->setRadius(v);
}

void CapsuleShape::setCylinderHeight(float v) {
    _impl->setCylinderHeight(v);
}

void CapsuleShape::setDirection(EAxisDirection v) {
    _impl->setDirection(v);
}

void PlaneShape::setConstant(float v) {
    _impl->setConstant(v);
}

void PlaneShape::setNormal(float x, float y, float z) {
    _impl->setNormal(x, y, z);
}

void TrimeshShape::setMesh(uintptr_t v) {
    _impl->setMesh(v);
}

void TrimeshShape::useConvex(bool v) {
    _impl->useConvex(v);
}

void TerrainShape::setTerrain(uintptr_t v, float rs, float cs, float hs) {
    _impl->setTerrain(v, rs, cs, hs);
}

void CylinderShape::setConvex(uintptr_t v) {
    _impl->setConvex(v);
}

void CylinderShape::setCylinder(float r, float h, EAxisDirection d) {
    _impl->setCylinder(r, h, d);
}

void ConeShape::setConvex(uintptr_t v) {
    _impl->setConvex(v);
}

void ConeShape::setCone(float r, float h, EAxisDirection d) {
    _impl->setCone(r, h, d);
}

} // namespace physics
} // namespace cc
