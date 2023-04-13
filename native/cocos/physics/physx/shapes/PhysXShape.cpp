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

#include "physics/physx/shapes/PhysXShape.h"
#include "base/std/container/unordered_map.h"
#include "physics/physx/PhysXSharedBody.h"
#include "physics/physx/PhysXUtils.h"
#include "physics/physx/PhysXWorld.h"

namespace cc {
namespace physics {

PhysXShape::PhysXShape() : _mCenter(physx::PxIdentity), _mRotation(physx::PxIdentity) {
    _mObjectID = PhysXWorld::getInstance().addWrapperObject(reinterpret_cast<uintptr_t>(this));
};

void PhysXShape::initialize(Node *node) {
    PhysXWorld &ins = PhysXWorld::getInstance();
    _mSharedBody = ins.getSharedBody(node);
    getSharedBody().reference(true);
    onComponentSet();
    insertToShapeMap();
}

void PhysXShape::onEnable() {
    _mEnabled = true;
    if (_mShape) getSharedBody().addShape(*this);
    getSharedBody().enabled(true);
}

void PhysXShape::onDisable() {
    _mEnabled = false;
    if (_mShape) getSharedBody().removeShape(*this);
    getSharedBody().enabled(false);
}

void PhysXShape::onDestroy() {
    getSharedBody().reference(false);
    eraseFromShapeMap();
    PhysXWorld::getInstance().removeWrapperObject(_mObjectID);
}

void PhysXShape::setMaterial(uint16_t id, float f, float df, float r,
                             uint8_t m0, uint8_t m1) {
    if (!_mShape) return;
    PhysXWorld::getInstance().createMaterial(id, f, df, r, m0, m1);
    auto *mat = reinterpret_cast<physx::PxMaterial *>(PhysXWorld::getInstance().getPXMaterialPtrWithMaterialID(id));
    getShape().setMaterials(&mat, 1);
}

void PhysXShape::setAsTrigger(bool v) {
    if (v) {
        getShape().setFlag(physx::PxShapeFlag::eSIMULATION_SHAPE, !v);
        getShape().setFlag(physx::PxShapeFlag::eTRIGGER_SHAPE, v);
    } else {
        getShape().setFlag(physx::PxShapeFlag::eTRIGGER_SHAPE, v);
        getShape().setFlag(physx::PxShapeFlag::eSIMULATION_SHAPE, !v);
    }
    if (_mEnabled) {
        getSharedBody().removeShape(*this);
        getSharedBody().addShape(*this);
    }
}

void PhysXShape::setCenter(float x, float y, float z) {
    _mCenter = physx::PxVec3{x, y, z};
    updateCenter();
}

uint32_t PhysXShape::getGroup() {
    return getSharedBody().getGroup();
}

void PhysXShape::setGroup(uint32_t g) {
    getSharedBody().setGroup(g);
}

uint32_t PhysXShape::getMask() {
    return getSharedBody().getMask();
}

void PhysXShape::setMask(uint32_t m) {
    getSharedBody().setMask(m);
}

void PhysXShape::updateEventListener(EShapeFilterFlag flag) {
}

geometry::AABB &PhysXShape::getAABB() {
    static IntrusivePtr<geometry::AABB> aabb; // this variable is shared with JS with refcounter
    if (!aabb) {
        aabb = new geometry::AABB;
    }
    if (_mShape) {
        auto bounds = physx::PxShapeExt::getWorldBounds(getShape(), *getSharedBody().getImpl().rigidActor);
        pxSetVec3Ext(aabb->center, (bounds.maximum + bounds.minimum) / 2);
        pxSetVec3Ext(aabb->halfExtents, (bounds.maximum - bounds.minimum) / 2);
    }
    return *aabb;
}

geometry::Sphere &PhysXShape::getBoundingSphere() {
    static IntrusivePtr<geometry::Sphere> sphere; // this variable is shared with JS with refcounter
    if (!sphere) {
        sphere = new geometry::Sphere;
    }
    if (_mShape) sphere->define(getAABB());
    return *sphere;
}

void PhysXShape::updateFilterData(const physx::PxFilterData &data) {
}

void PhysXShape::updateCenter() {
    if (!_mShape) return;
    auto &sb = getSharedBody();
    auto *node = sb.getNode();
    node->updateWorldTransform();
    physx::PxTransform local{_mCenter * node->getWorldScale(), _mRotation};
    getShape().setLocalPose(local);
}

void PhysXShape::insertToShapeMap() {
    if (_mShape) {
        getPxShapeMap().insert(std::pair<uintptr_t, uint32_t>(reinterpret_cast<uintptr_t>(&getShape()), getObjectID()));
    }
}

void PhysXShape::eraseFromShapeMap() {
    if (_mShape) {
        getPxShapeMap().erase(reinterpret_cast<uintptr_t>(&getShape()));
    }
}

} // namespace physics
} // namespace cc
